"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Btn from "@/components/Btn";

const SAMPLE =
  "Welcome to BeYourTools text to speech. Paste any text here and press play to hear it read aloud. " +
  "You can pick a different voice, and adjust the speed and pitch until it sounds right. " +
  "This is handy for proofreading your writing, because hearing your words often reveals mistakes your eyes skip over.";
const MAX_CHARS = 5000;
const CHUNK_TARGET = 220; // browsers cut very long utterances; speak in sentence chunks
const DICT_KEY = "byt:tts:pronunciations";

function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

interface Pronunciation {
  find: string;
  replace: string;
}

/** Split text into chunks at sentence boundaries so long passages are not cut off. */
function chunkText(text: string): { text: string; offset: number }[] {
  const sentences = text.match(/[^.!?…]+[.!?…]+["'”)]?\s*|[^.!?…]+$/g) ?? [text];
  const chunks: { text: string; offset: number }[] = [];
  let current = "";
  let currentOffset = 0;
  let offset = 0;
  for (const s of sentences) {
    if (current && current.length + s.length > CHUNK_TARGET) {
      chunks.push({ text: current, offset: currentOffset });
      offset = currentOffset + current.length;
      current = "";
      currentOffset = offset;
    }
    if (!current) currentOffset = offset;
    current += s;
    offset += s.length;
  }
  if (current.trim()) chunks.push({ text: current, offset: currentOffset });
  return chunks.length > 0 ? chunks : [{ text, offset: 0 }];
}

/** Apply user pronunciation fixes as whole-word replacements. */
function applyDictionary(text: string, dict: Pronunciation[]): string {
  let out = text;
  for (const { find, replace } of dict) {
    if (!find.trim() || !replace) continue;
    const escaped = find.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "gi"), replace);
  }
  return out;
}

function loadDictionary(): Pronunciation[] {
  try {
    const raw = window.localStorage.getItem(DICT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((p) => p && typeof p.find === "string" && typeof p.replace === "string")
        .slice(0, 50);
    }
  } catch {
    // ignore
  }
  return [];
}

export default function TextToSpeechClient() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [status, setStatus] = useState<"idle" | "speaking" | "paused">("idle");
  const [spokenChar, setSpokenChar] = useState(-1); // absolute char offset in the source text
  const [dict, setDict] = useState<Pronunciation[]>([]);
  const [dictFind, setDictFind] = useState("");
  const [dictReplace, setDictReplace] = useState("");
  const [showDict, setShowDict] = useState(false);
  const queueRef = useRef<{ text: string; offset: number }[]>([]);
  const queueIndexRef = useRef(0);
  const stoppedRef = useRef(false);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Words of the trimmed text, for the reading highlight view.
  const words = useMemo(() => {
    const trimmed = text.trim().slice(0, MAX_CHARS);
    if (!trimmed) return [] as { word: string; start: number }[];
    const out: { word: string; start: number }[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(trimmed)) !== null) out.push({ word: m[0], start: m.index });
    return out;
  }, [text]);

  const activeWord = useMemo(() => {
    if (spokenChar < 0 || words.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < words.length; i++) {
      if (words[i].start <= spokenChar) idx = i;
      else break;
    }
    return idx;
  }, [spokenChar, words]);

  // Load voices, including late arrivals via voiceschanged
  useEffect(() => {
    if (!supported()) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length === 0) return;
      const sorted = [...list].sort((a, b) => {
        if (a.default && !b.default) return -1;
        if (b.default && !a.default) return 1;
        const lang = a.lang.localeCompare(b.lang);
        return lang !== 0 ? lang : a.name.localeCompare(b.name);
      });
      setVoices(sorted);
      setVoiceURI((prev) => prev || sorted.find((v) => v.default)?.voiceURI || sorted[0].voiceURI);
    };
    load();
    setDict(loadDictionary());
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // Cancel any speech when the component unmounts
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      if (supported()) window.speechSynthesis.cancel();
    };
  }, []);

  // Keep the highlighted word in view while reading.
  useEffect(() => {
    if (activeWord >= 0 && status === "speaking") {
      wordRefs.current[activeWord]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeWord, status]);

  const saveDict = (next: Pronunciation[]) => {
    setDict(next);
    try {
      window.localStorage.setItem(DICT_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const stop = useCallback(() => {
    if (!supported()) return;
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
    setSpokenChar(-1);
  }, []);

  const speakChunk = useCallback(
    (index: number) => {
      if (!supported()) return;
      const synth = window.speechSynthesis;
      const queue = queueRef.current;
      if (index >= queue.length || stoppedRef.current) {
        if (!stoppedRef.current) {
          setStatus("idle");
          setSpokenChar(-1);
        }
        return;
      }
      queueIndexRef.current = index;
      const chunk = queue[index];
      const utter = new SpeechSynthesisUtterance(chunk.text);
      const voice = voices.find((v) => v.voiceURI === voiceURI);
      if (voice) utter.voice = voice;
      utter.rate = rate;
      utter.pitch = pitch;
      utter.onboundary = (e) => {
        if (typeof e.charIndex === "number") setSpokenChar(chunk.offset + e.charIndex);
      };
      utter.onend = () => speakChunk(index + 1);
      utter.onerror = () => {
        // Skip a failed chunk and continue; finish when the queue is empty.
        if (!stoppedRef.current) speakChunk(index + 1);
      };
      synth.speak(utter);
    },
    [voices, voiceURI, rate, pitch]
  );

  const speak = useCallback(() => {
    if (!supported()) return;
    const synth = window.speechSynthesis;
    if (status === "paused") {
      stoppedRef.current = false;
      synth.resume();
      setStatus("speaking");
      return;
    }
    const trimmed = text.trim().slice(0, MAX_CHARS);
    if (!trimmed) return;
    stoppedRef.current = false;
    synth.cancel();
    const withDict = applyDictionary(trimmed, dict);
    queueRef.current = chunkText(withDict);
    queueIndexRef.current = 0;
    setSpokenChar(0);
    setStatus("speaking");
    speakChunk(0);
  }, [text, dict, status, speakChunk]);

  const pause = useCallback(() => {
    if (!supported()) return;
    stoppedRef.current = true;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const resumeFromPause = useCallback(() => {
    if (!supported()) return;
    // After pause we stopped the queue; resume native speech if it was mid-utterance,
    // otherwise restart the remaining chunks.
    const synth = window.speechSynthesis;
    stoppedRef.current = false;
    if (synth.paused) {
      synth.resume();
      setStatus("speaking");
    } else {
      setStatus("speaking");
      speakChunk(queueIndexRef.current);
    }
  }, [speakChunk]);

  const importFile = useCallback((file: File | null | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? "");
      setText((prev) => {
        const next = (prev ? prev + "\n\n" : "") + content;
        return next.slice(0, MAX_CHARS);
      });
    };
    reader.readAsText(file.slice(0, MAX_CHARS * 4));
  }, []);

  const addDictEntry = () => {
    const find = dictFind.trim();
    if (!find || !dictReplace.trim()) return;
    if (dict.some((d) => d.find.toLowerCase() === find.toLowerCase())) return;
    saveDict([...dict, { find, replace: dictReplace.trim() }]);
    setDictFind("");
    setDictReplace("");
  };

  if (!supported()) {
    return (
      <div
        className="rounded-xl border p-6 text-sm"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
      >
        Your browser does not support the Web Speech API, so text to speech is unavailable here.
        It works in recent versions of Chrome, Edge, Safari and Firefox on desktop and mobile.
      </div>
    );
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const clipped = text.length > MAX_CHARS;

  return (
    <div>
      <div
        className="rounded-xl border p-4 sm:p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="tts-text" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Text to read aloud
          </label>
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
            {wordCount.toLocaleString("en-US")} words · {text.length.toLocaleString("en-US")} / {MAX_CHARS.toLocaleString("en-US")} chars
          </span>
        </div>
        <textarea
          id="tts-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type the text you want to hear…"
          rows={9}
          className="focus-ring w-full resize-y rounded-lg border px-3 py-2.5 text-sm leading-relaxed"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
        />
        {clipped && (
          <p className="mt-1.5 text-xs" style={{ color: "var(--coral)" }}>
            Only the first {MAX_CHARS.toLocaleString("en-US")} characters will be read, since browsers cut off very long passages.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="secondary" size="sm" onClick={() => setText(SAMPLE)}>
            Load sample
          </Btn>
          <Btn variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            Import .txt file
          </Btn>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,text/plain"
            className="sr-only"
            aria-label="Import a text file"
            onChange={(e) => {
              importFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Btn variant="ghost" size="sm" onClick={() => { stop(); setText(""); }}>
            Clear
          </Btn>
        </div>
      </div>

      {/* Reading view with synced highlighting */}
      {status !== "idle" && words.length > 0 && (
        <div
          className="mt-4 max-h-56 overflow-y-auto rounded-xl border p-4 text-sm leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
          aria-live="off"
          aria-label="Reading view - the word being spoken is highlighted"
        >
          {words.map((w, i) => (
            <span key={i}>
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="rounded px-0.5 transition-colors"
                style={
                  i === activeWord
                    ? { backgroundColor: "var(--accent)", color: "var(--accent-fg)" }
                    : undefined
                }
              >
                {w.word}
              </span>{" "}
            </span>
          ))}
        </div>
      )}

      {/* Voice + controls */}
      <div
        className="mt-4 rounded-xl border p-4 sm:p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tts-voice" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Voice
            </label>
            <select
              id="tts-voice"
              value={voiceURI}
              onChange={(e) => setVoiceURI(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2.5 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {voices.length === 0 && <option value="">Loading voices…</option>}
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}){v.default ? " - default" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tts-rate" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Speed <span className="font-normal" style={{ color: "var(--text-muted)" }}>{rate.toFixed(2)}x</span>
              </label>
              <input
                id="tts-rate"
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent)]"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>
            <div>
              <label htmlFor="tts-pitch" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Pitch <span className="font-normal" style={{ color: "var(--text-muted)" }}>{pitch.toFixed(2)}</span>
              </label>
              <input
                id="tts-pitch"
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Playback controls">
          {status === "speaking" ? (
            <Btn variant="primary" onClick={pause}>Pause</Btn>
          ) : (
            <Btn variant="primary" onClick={status === "paused" ? resumeFromPause : speak} disabled={text.trim().length === 0}>
              {status === "paused" ? "Resume" : "Play"}
            </Btn>
          )}
          <Btn variant="secondary" onClick={stop} disabled={status === "idle"}>
            Stop
          </Btn>
          {status !== "idle" && (
            <span className="ml-1 inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }} role="status">
              <span
                className="inline-block h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
                aria-hidden="true"
              />
              {status === "speaking" ? "Speaking…" : "Paused"}
            </span>
          )}
        </div>
      </div>

      {/* Pronunciation dictionary */}
      <div className="mt-4 rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <button
          type="button"
          onClick={() => setShowDict((v) => !v)}
          aria-expanded={showDict}
          className="focus-ring flex w-full items-center justify-between rounded text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          <span>Pronunciation fixes {dict.length > 0 && <span style={{ color: "var(--accent-text)" }}>({dict.length})</span>}</span>
          <span aria-hidden="true" style={{ color: "var(--text-muted)" }}>{showDict ? "−" : "+"}</span>
        </button>
        {showDict && (
          <div className="mt-3">
            <p className="mb-3 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Teach the voice how to say names, acronyms and jargon. Each fix replaces the whole word before speaking,
              and is remembered in this browser.
            </p>
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label htmlFor="tts-dict-find" className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>Word as written</label>
                <input
                  id="tts-dict-find"
                  value={dictFind}
                  onChange={(e) => setDictFind(e.target.value)}
                  placeholder="e.g. GIF"
                  className="focus-ring w-36 rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                />
              </div>
              <div>
                <label htmlFor="tts-dict-say" className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>Say it as</label>
                <input
                  id="tts-dict-say"
                  value={dictReplace}
                  onChange={(e) => setDictReplace(e.target.value)}
                  placeholder="e.g. jif"
                  className="focus-ring w-36 rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                />
              </div>
              <Btn variant="secondary" size="sm" onClick={addDictEntry} disabled={!dictFind.trim() || !dictReplace.trim()}>
                Add fix
              </Btn>
            </div>
            {dict.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {dict.map((d, i) => (
                  <li
                    key={`${d.find}-${i}`}
                    className="flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      <strong>{d.find}</strong> <span style={{ color: "var(--text-subtle)" }}>→</span> {d.replace}
                    </span>
                    <Btn variant="ghost" size="sm" onClick={() => saveDict(dict.filter((_, j) => j !== i))} aria-label={`Remove pronunciation fix for ${d.find}`}>
                      Remove
                    </Btn>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
