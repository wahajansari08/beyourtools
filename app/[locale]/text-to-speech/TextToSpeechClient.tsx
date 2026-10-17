"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Btn from "@/components/Btn";

const SAMPLE =
  "Welcome to BeYourTools text to speech. Paste any text here and press play to hear it read aloud. " +
  "You can pick a different voice, and adjust the speed and pitch until it sounds right. " +
  "This is handy for proofreading your writing, because hearing your words often reveals mistakes your eyes skip over.";
const MAX_CHARS = 5000;

function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export default function TextToSpeechClient() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [status, setStatus] = useState<"idle" | "speaking" | "paused">("idle");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

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
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // Cancel any speech when the component unmounts
  useEffect(() => {
    return () => {
      if (supported()) window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!supported()) return;
    window.speechSynthesis.cancel();
    utterRef.current = null;
    setStatus("idle");
  }, []);

  const speak = useCallback(() => {
    if (!supported()) return;
    const synth = window.speechSynthesis;
    const trimmed = text.trim().slice(0, MAX_CHARS);
    if (!trimmed) return;

    if (status === "paused") {
      synth.resume();
      setStatus("speaking");
      return;
    }

    synth.cancel();
    const utter = new SpeechSynthesisUtterance(trimmed);
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onend = () => {
      setStatus("idle");
      utterRef.current = null;
    };
    utter.onerror = () => {
      setStatus("idle");
      utterRef.current = null;
    };
    utterRef.current = utter;
    synth.speak(utter);
    setStatus("speaking");
  }, [text, voices, voiceURI, rate, pitch, status]);

  const pause = useCallback(() => {
    if (!supported()) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

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
        <div className="mb-2 flex items-baseline justify-between">
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
          <Btn variant="ghost" size="sm" onClick={() => { stop(); setText(""); }}>
            Clear
          </Btn>
        </div>
      </div>

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
            <Btn variant="primary" onClick={speak} disabled={text.trim().length === 0}>
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
    </div>
  );
}
