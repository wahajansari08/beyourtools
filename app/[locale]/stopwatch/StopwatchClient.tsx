"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Btn from "@/components/Btn";

type Mode = "stopwatch" | "timer";

function pad(n: number, len = 2): string {
  return Math.floor(n).toString().padStart(len, "0");
}

/** Format ms as HH:MM:SS.mmm (hours hidden when zero) */
function formatMs(ms: number): string {
  const total = Math.max(0, Math.floor(ms));
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const milli = total % 1000;
  const tail = `${pad(m)}:${pad(s)}.${pad(milli, 3)}`;
  return h > 0 ? `${pad(h)}:${tail}` : tail;
}

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [0, 0.22, 0.44].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = i === 2 ? 1046.5 : 880;
      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.5, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.22);
    });
    setTimeout(() => ctx.close(), 900);
  } catch {
    /* audio unavailable - the visual banner still shows */
  }
}

const cardStyle = {
  borderColor: "var(--border)",
  backgroundColor: "var(--bg-surface)",
};

export default function StopwatchClient() {
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms since start (stopwatch) or since countdown start
  const [laps, setLaps] = useState<number[]>([]);
  const [lapsCopied, setLapsCopied] = useState(false);
  const [timesUp, setTimesUp] = useState(false);
  const [tHours, setTHours] = useState("0");
  const [tMinutes, setTMinutes] = useState("5");
  const [tSeconds, setTSeconds] = useState("0");

  const baseRef = useRef(0); // elapsed ms banked before the current run
  const startRef = useRef(0); // Date.now() when the current run started
  const intervalRef = useRef<number | null>(null);
  const durationRef = useRef(0); // countdown length in ms

  const stopTicker = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Clear the interval on unmount
  useEffect(() => stopTicker, [stopTicker]);

  const nowElapsed = useCallback(() => baseRef.current + (Date.now() - startRef.current), []);

  const start = useCallback(() => {
    // Restarting after "Time's up" must start a fresh countdown, not
    // instantly finish again from the banked full duration.
    if (timesUp) {
      baseRef.current = 0;
    }
    if (mode === "timer") {
      const total =
        (parseInt(tHours, 10) || 0) * 3600000 +
        (parseInt(tMinutes, 10) || 0) * 60000 +
        (parseInt(tSeconds, 10) || 0) * 1000;
      if (total <= 0) return;
      if (baseRef.current === 0 && elapsed === 0) {
        durationRef.current = total;
      } else if (durationRef.current === 0) {
        durationRef.current = total;
      }
    }
    setTimesUp(false);
    startRef.current = Date.now();
    setRunning(true);
    stopTicker();
    intervalRef.current = window.setInterval(() => {
      const e = nowElapsed();
      if (mode === "timer") {
        const remaining = durationRef.current - e;
        if (remaining <= 0) {
          stopTicker();
          setRunning(false);
          setElapsed(durationRef.current);
          baseRef.current = durationRef.current;
          setTimesUp(true);
          beep();
          return;
        }
      }
      setElapsed(e);
    }, 31);
  }, [mode, tHours, tMinutes, tSeconds, elapsed, timesUp, nowElapsed, stopTicker]);

  const pause = useCallback(() => {
    baseRef.current = nowElapsed();
    setElapsed(baseRef.current);
    stopTicker();
    setRunning(false);
  }, [nowElapsed, stopTicker]);

  const reset = useCallback(() => {
    stopTicker();
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    setTimesUp(false);
    baseRef.current = 0;
    durationRef.current = 0;
  }, [stopTicker]);

  const switchMode = (m: Mode) => {
    reset();
    setMode(m);
  };

  const addLap = () => {
    if (!running && elapsed === 0) return;
    const current = running ? nowElapsed() : elapsed;
    setLaps((prev) => [...prev, current]);
  };

  // Copy laps as tab-separated text, ready to paste into a spreadsheet.
  const copyLaps = async () => {
    const lines = [
      "Lap\tLap time\tTotal",
      ...lapRows.map((r) => `${r.n}\t${formatMs(r.lapTime)}\t${formatMs(r.total)}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(lines);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = lines;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setLapsCopied(true);
    window.setTimeout(() => setLapsCopied(false), 2000);
  };

  // Download laps as a CSV file (lap number, lap time, total time).
  const downloadLaps = () => {
    const lines = [
      "Lap,Lap time,Total",
      ...lapRows.map((r) => `${r.n},${formatMs(r.lapTime)},${formatMs(r.total)}`),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stopwatch-laps.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fullscreen the timer card (F toggles, Esc exits natively).
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      cardRef.current?.requestFullscreen().catch(() => {});
    }
  }, []);
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === cardRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Quick countdown presets (minutes) — Pomodoro included.
  const applyPreset = (minutes: number) => {
    setTHours("0");
    setTMinutes(String(minutes));
    setTSeconds("0");
  };

  // Space toggles start/pause, L records a lap - ignored while typing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (running) pause();
        else start();
      } else if (e.key.toLowerCase() === "l" && mode === "stopwatch") {
        addLap();
      } else if (e.key.toLowerCase() === "r") {
        reset();
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const lapRows = laps.map((total, i) => {
    const prev = i === 0 ? 0 : laps[i - 1];
    const lapTime = total - prev;
    const prevLap = i === 0 ? null : laps[i - 1] - (i === 1 ? 0 : laps[i - 2]);
    const delta = prevLap === null ? null : lapTime - prevLap;
    return { n: i + 1, lapTime, total, delta };
  });

  // Fastest / slowest / average lap, only meaningful with 2+ laps.
  const lapTimes = lapRows.map((r) => r.lapTime);
  const fastestLap = lapTimes.length >= 2 ? Math.min(...lapTimes) : null;
  const slowestLap = lapTimes.length >= 2 ? Math.max(...lapTimes) : null;
  const averageLap =
    lapTimes.length > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length : null;

  const timerRemaining = mode === "timer" ? Math.max(0, durationRef.current - elapsed) : 0;
  const displayMs = mode === "timer" ? (durationRef.current > 0 || running ? timerRemaining : (parseInt(tHours, 10) || 0) * 3600000 + (parseInt(tMinutes, 10) || 0) * 60000 + (parseInt(tSeconds, 10) || 0) * 1000) : elapsed;

  // Show the live time in the browser tab while running, so the clock is
  // visible when the tab is in the background.
  useEffect(() => {
    const original = document.title;
    if (running) {
      document.title = `${formatMs(displayMs)} — Stopwatch | BeYourTools`;
    }
    return () => {
      document.title = original;
    };
  }, [running, displayMs]);

  const timerInputCls = "focus-ring w-full rounded-lg border px-3 py-2.5 text-center text-sm";
  const timerInputStyle = {
    borderColor: "var(--border-strong)",
    backgroundColor: "var(--bg-elevated)",
    color: "var(--text-primary)",
  };

  return (
    <div>
      {/* Mode tabs */}
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Timer mode">
        <Btn variant="toggle" selected={mode === "stopwatch"} onClick={() => switchMode("stopwatch")} role="tab" aria-selected={mode === "stopwatch"}>
          Stopwatch
        </Btn>
        <Btn variant="toggle" selected={mode === "timer"} onClick={() => switchMode("timer")} role="tab" aria-selected={mode === "timer"}>
          Countdown
        </Btn>
      </div>

      <div ref={cardRef} className="rounded-xl border p-4 sm:p-8" style={cardStyle}>
        {/* Countdown inputs */}
        {mode === "timer" && !running && elapsed === 0 && (
          <div className="mx-auto mb-6 grid max-w-md grid-cols-3 gap-2">
            {[
              { label: "Hours", value: tHours, set: setTHours, max: 99 },
              { label: "Minutes", value: tMinutes, set: setTMinutes, max: 59 },
              { label: "Seconds", value: tSeconds, set: setTSeconds, max: 59 },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1.5 block text-center text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {f.label}
                </label>
                <input
                  type="number"
                  min={0}
                  max={f.max}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                  className={timerInputCls}
                  style={timerInputStyle}
                  aria-label={f.label}
                />
              </div>
            ))}
          </div>
        )}

        {/* Countdown presets */}
        {mode === "timer" && !running && elapsed === 0 && (
          <div className="mx-auto mb-6 flex max-w-md flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Quick set:
            </span>
            {[
              { label: "1 min", minutes: 1 },
              { label: "5 min", minutes: 5 },
              { label: "10 min", minutes: 10 },
              { label: "25 min Pomodoro", minutes: 25 },
            ].map((p) => (
              <Btn key={p.label} variant="ghost" size="sm" onClick={() => applyPreset(p.minutes)}>
                {p.label}
              </Btn>
            ))}
          </div>
        )}

        {/* Display */}
        <div className="text-center" role="timer" aria-live="off" aria-label={mode === "timer" ? "Time remaining" : "Elapsed time"}>
          <p
            className="font-mono text-5xl font-bold tabular-nums sm:text-7xl"
            style={{ color: timesUp ? "var(--coral)" : "var(--text-primary)" }}
          >
            {formatMs(displayMs)}
          </p>
          {timesUp && (
            <p className="mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: "var(--coral)", color: "#fff" }} role="alert">
              Time&apos;s up!
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {!running ? (
            <Btn variant="primary" size="lg" onClick={start}>
              {elapsed > 0 && !timesUp ? "Resume" : "Start"}
            </Btn>
          ) : (
            <Btn variant="primary" size="lg" onClick={pause}>
              Pause
            </Btn>
          )}
          {mode === "stopwatch" && (
            <Btn variant="secondary" size="lg" onClick={addLap} disabled={elapsed === 0 && !running}>
              Lap
            </Btn>
          )}
          <Btn variant="secondary" size="lg" onClick={reset} disabled={elapsed === 0 && laps.length === 0 && !timesUp}>
            Reset
          </Btn>
          <Btn variant="secondary" size="lg" onClick={toggleFullscreen}>
            {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          </Btn>
        </div>
        <p className="mt-3 text-center text-xs" style={{ color: "var(--text-subtle)" }}>
          Tip: press Space to start/pause{mode === "stopwatch" ? ", L for a lap" : ""}, R to reset, F for fullscreen.
        </p>
        <p className="mt-1 text-center text-xs" style={{ color: "var(--text-subtle)" }}>
          Keeps accurate time even if you switch tabs: the clock is recomputed from a start timestamp, not counted ticks.
        </p>
      </div>

      {/* Laps */}
      {mode === "stopwatch" && lapRows.length > 0 && (
        <div className="mt-4 rounded-xl border p-4 sm:p-6" style={cardStyle}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Laps ({lapRows.length})
            </h2>
            <div className="flex items-center gap-2">
              <Btn variant="ghost" size="sm" onClick={copyLaps}>
                {lapsCopied ? "Laps copied!" : "Copy laps"}
              </Btn>
              <Btn variant="ghost" size="sm" onClick={downloadLaps}>
                Download laps CSV
              </Btn>
              <Btn variant="ghost" size="sm" onClick={() => setLaps([])}>
                Clear laps
              </Btn>
            </div>
          </div>
          {averageLap !== null && (
            <p className="mb-3 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              Average lap: <strong style={{ color: "var(--text-primary)" }}>{formatMs(averageLap)}</strong>
              {fastestLap !== null && (
                <>
                  {" · "}Fastest lap:{" "}
                  <strong style={{ color: "var(--teal)" }}>{formatMs(fastestLap)}</strong>
                </>
              )}
              {slowestLap !== null && (
                <>
                  {" · "}Slowest lap:{" "}
                  <strong style={{ color: "var(--coral)" }}>{formatMs(slowestLap)}</strong>
                </>
              )}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: "var(--text-muted)" }}>
                  <th scope="col" className="py-1.5 pr-4 font-medium">Lap</th>
                  <th scope="col" className="py-1.5 pr-4 font-medium">Lap time</th>
                  <th scope="col" className="py-1.5 pr-4 font-medium">Total</th>
                  <th scope="col" className="py-1.5 font-medium">vs previous</th>
                </tr>
              </thead>
              <tbody>
                {[...lapRows].reverse().map((r) => (
                  <tr key={r.n} className="border-t tabular-nums" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                      #{r.n}
                      {fastestLap !== null && r.lapTime === fastestLap && (
                        <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: "var(--teal)", color: "#fff" }}>
                          Fastest
                        </span>
                      )}
                      {slowestLap !== null && r.lapTime === slowestLap && fastestLap !== slowestLap && (
                        <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: "var(--coral)", color: "#fff" }}>
                          Slowest
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4" style={{ color: "var(--text-secondary)" }}>{formatMs(r.lapTime)}</td>
                    <td className="py-2 pr-4" style={{ color: "var(--text-secondary)" }}>{formatMs(r.total)}</td>
                    <td
                      className="py-2 font-medium"
                      style={{
                        color: r.delta === null ? "var(--text-subtle)" : r.delta < 0 ? "var(--teal)" : r.delta > 0 ? "var(--coral)" : "var(--text-subtle)",
                      }}
                    >
                      {r.delta === null ? "-" : `${r.delta < 0 ? "−" : "+"}${formatMs(Math.abs(r.delta))}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
