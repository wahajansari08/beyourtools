"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Btn from "@/components/Btn";

type Mode = "focus" | "short" | "long";

interface Durations {
  focus: number;
  short: number;
  long: number;
  cycles: number;
}

interface Task {
  id: number;
  text: string;
  done: boolean;
}

const DEFAULTS: Durations = { focus: 25, short: 5, long: 15, cycles: 4 };
const TASKS_KEY = "pomodoro-tasks-v1";
const DURATIONS_KEY = "pomodoro-durations-v1";

const MODE_LABEL: Record<Mode, string> = { focus: "Focus", short: "Short Break", long: "Long Break" };
const MODE_ORDER: Mode[] = ["focus", "short", "long"];

function fmt(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function playBeep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.start(t);
    osc.stop(t + 0.65);
    window.setTimeout(() => ctx.close(), 800);
  } catch {
    /* audio not available */
  }
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadDurations(): Durations {
  try {
    const raw = localStorage.getItem(DURATIONS_KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw) as Partial<Durations>;
    return {
      focus: Math.min(180, Math.max(1, p.focus ?? DEFAULTS.focus)),
      short: Math.min(120, Math.max(1, p.short ?? DEFAULTS.short)),
      long: Math.min(180, Math.max(1, p.long ?? DEFAULTS.long)),
      cycles: Math.min(12, Math.max(1, p.cycles ?? DEFAULTS.cycles)),
    };
  } catch {
    return DEFAULTS;
  }
}

export default function PomodoroTimerClient() {
  const [durations, setDurations] = useState<Durations>(DEFAULTS);
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DEFAULTS.focus * 60);
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [completedFocus, setCompletedFocus] = useState(0);
  const [beepOn, setBeepOn] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const endAtRef = useRef<number | null>(null);
  const durationsRef = useRef(durations);
  durationsRef.current = durations;

  // Load persisted state once
  useEffect(() => {
    const d = loadDurations();
    setDurations(d);
    setSecondsLeft(d.focus * 60);
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch {
      /* ignore */
    }
  }, [tasks]);

  // Tick: anchored to a target end time so background tabs stay accurate
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const endAt = endAtRef.current;
      if (endAt === null) return;
      const left = Math.round((endAt - Date.now()) / 1000);
      if (left <= 0) {
        setSecondsLeft(0);
        finishSession();
      } else {
        setSecondsLeft(left);
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode]);

  // Tab title countdown
  useEffect(() => {
    document.title = running
      ? `${fmt(secondsLeft)} · ${MODE_LABEL[mode]} | BeYourTools`
      : "Pomodoro Timer - Free Focus Timer With Task List | BeYourTools";
    return () => {
      document.title = "Pomodoro Timer - Free Focus Timer With Task List | BeYourTools";
    };
  }, [running, secondsLeft, mode]);

  const finishSession = useCallback(() => {
    setRunning(false);
    endAtRef.current = null;
    if (beepOn) playBeep();
    setMode((prev) => {
      const d = durationsRef.current;
      if (prev === "focus") {
        const nextCycle = cycle + 1;
        setCycle(nextCycle);
        setCompletedFocus((c) => c + 1);
        const longBreakDue = nextCycle % d.cycles === 0;
        const next: Mode = longBreakDue ? "long" : "short";
        setSecondsLeft(d[next] * 60);
        return next;
      }
      const next: Mode = "focus";
      setSecondsLeft(d[next] * 60);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beepOn, cycle]);

  function start() {
    if (running) return;
    endAtRef.current = Date.now() + secondsLeft * 1000;
    setRunning(true);
  }

  function pause() {
    if (!running) return;
    const endAt = endAtRef.current;
    if (endAt !== null) setSecondsLeft(Math.max(0, Math.round((endAt - Date.now()) / 1000)));
    endAtRef.current = null;
    setRunning(false);
  }

  function resetTimer() {
    pause();
    setSecondsLeft(durations[mode] * 60);
  }

  function switchMode(m: Mode) {
    pause();
    setMode(m);
    setSecondsLeft(durations[m] * 60);
  }

  function updateDuration(key: keyof Durations, value: number) {
    if (!Number.isFinite(value) || value < 1) return;
    const caps: Record<keyof Durations, number> = { focus: 180, short: 120, long: 180, cycles: 12 };
    const v = Math.min(caps[key], Math.floor(value));
    setDurations((d) => {
      const next = { ...d, [key]: v };
      try {
        localStorage.setItem(DURATIONS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    if (!running && (key === mode || key === "cycles")) {
      setSecondsLeft((s) => (key === mode ? v * 60 : s));
    }
  }

  function addTask() {
    const text = taskInput.trim();
    if (!text) return;
    setTasks((t) => [...t, { id: Date.now(), text, done: false }]);
    setTaskInput("");
  }

  function toggleTask(id: number) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }

  function deleteTask(id: number) {
    setTasks((t) => t.filter((x) => x.id !== id));
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = (durations[mode] * 60 - secondsLeft) / (durations[mode] * 60);

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Session type">
        {MODE_ORDER.map((m) => (
          <Btn key={m} variant="toggle" size="sm" selected={mode === m} onClick={() => switchMode(m)}>
            {MODE_LABEL[m]}
          </Btn>
        ))}
      </div>

      {/* Timer card */}
      <div className="rounded-xl border p-6 text-center sm:p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="relative mx-auto h-44 w-44 sm:h-52 sm:w-52" role="timer" aria-live="off" aria-label={`${MODE_LABEL[mode]}: ${fmt(secondsLeft)} remaining`}>
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - Math.min(1, Math.max(0, progress)))}`}
              style={{ transition: "stroke-dashoffset 0.3s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums sm:text-5xl" style={{ color: "var(--text-primary)" }}>
              {fmt(secondsLeft)}
            </span>
            <span className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {MODE_LABEL[mode]}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {running ? (
            <Btn variant="primary" onClick={pause}>Pause</Btn>
          ) : (
            <Btn variant="primary" onClick={start}>Start</Btn>
          )}
          <Btn variant="secondary" onClick={resetTimer}>Reset</Btn>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <span>
            Cycle <strong style={{ color: "var(--text-primary)" }}>{cycle}</strong>
          </span>
          <span>
            Focus done <strong style={{ color: "var(--text-primary)" }}>{completedFocus}</strong>
          </span>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={beepOn} onChange={(e) => setBeepOn(e.target.checked)} className="accent-[var(--accent)]" />
            Beep
          </label>
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Session lengths (minutes)</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["focus", "Focus"],
              ["short", "Short break"],
              ["long", "Long break"],
              ["cycles", "Sessions per cycle"],
            ] as [keyof Durations, string][]
          ).map(([key, label]) => (
            <div key={key}>
              <label htmlFor={`pom-${key}`} className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {label}
              </label>
              <input
                id={`pom-${key}`}
                type="number"
                min={1}
                max={key === "short" ? 120 : key === "cycles" ? 12 : 180}
                value={durations[key]}
                onChange={(e) => updateDuration(key, parseInt(e.target.value, 10))}
                className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Tasks {tasks.length > 0 && <span style={{ color: "var(--text-muted)" }}>({doneCount}/{tasks.length} done)</span>}
          </h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="What are you working on?"
            aria-label="New task"
            className="focus-ring flex-1 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
          <Btn variant="secondary" size="sm" onClick={addTask}>Add</Btn>
        </div>
        {tasks.length === 0 ? (
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            No tasks yet. Add one above to keep your session focused.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-lg border px-3 py-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  aria-label={`Mark "${t.text}" as ${t.done ? "not done" : "done"}`}
                  className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                />
                <span
                  className="flex-1 text-sm"
                  style={{ color: t.done ? "var(--text-subtle)" : "var(--text-primary)", textDecoration: t.done ? "line-through" : "none" }}
                >
                  {t.text}
                </span>
                <Btn variant="ghost" size="sm" onClick={() => deleteTask(t.id)} aria-label={`Delete task "${t.text}"`}>
                  ✕
                </Btn>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
