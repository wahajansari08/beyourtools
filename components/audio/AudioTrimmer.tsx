"use client";

import { useEffect, useRef, useState } from "react";

interface AudioTrimmerProps {
  src: string;
  duration: number;
  startSec: number;
  endSec: number;
  onStartChange: (s: number) => void;
  onEndChange: (s: number) => void;
}

function fmtTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function fmtTimeMs(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00.0";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ds = Math.floor((s % 1) * 10);
  return `${m}:${String(sec).padStart(2, "0")}.${ds}`;
}

export default function AudioTrimmer({
  src,
  duration,
  startSec,
  endSec,
  onStartChange,
  onEndChange,
}: AudioTrimmerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);

  // BUG 9 FIX: store endSec in a ref so the timeupdate handler always reads the
  // latest value without needing endSec in the effect dependency array.
  // Previously the effect was NOT in the dep array at all, meaning the handler
  // used a stale closure value - it would only stop at whatever endSec was when
  // the effect first ran (i.e. the initial full duration).
  const endSecRef = useRef(endSec);
  useEffect(() => { endSecRef.current = endSec; }, [endSec]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = src;
    a.load();

    const onTime = () => {
      setCurrent(a.currentTime);
      // Use ref so we always compare against the latest endSec
      if (a.currentTime >= endSecRef.current) {
        a.pause();
        setPlaying(false);
      }
    };
    const onPlay  = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play",  onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play",  onPlay);
      a.removeEventListener("pause", onPause);
    };
    // Only re-run when src changes - endSec is handled via ref above
  }, [src]);

  const previewSelection = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = startSec;
    a.play().catch(() => {});
  };

  const stop = () => {
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = startSec; setPlaying(false); }
  };

  const barProgress = duration > 0 ? (current  / duration) * 100 : 0;
  const startPct    = duration > 0 ? (startSec / duration) * 100 : 0;
  const endPct      = duration > 0 ? (endSec   / duration) * 100 : 100;

  return (
    <div className="rounded-xl border p-4 space-y-4"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload="metadata" />

      <p className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-subtle)" }}>Selection</p>

      {/* Visual timeline bar */}
      <div className="relative h-8 w-full overflow-hidden rounded"
        style={{ backgroundColor: "var(--bg-elevated)" }}
        aria-label={`Selected region: ${fmtTime(startSec)} to ${fmtTime(endSec)}`}
        role="img">
        {/* Selected region highlight */}
        <div className="absolute top-0 h-full"
          style={{ left: `${startPct}%`, width: `${endPct - startPct}%`, backgroundColor: "color-mix(in srgb,var(--accent) 30%,transparent)" }} />
        {/* Playhead */}
        <div className="absolute top-0 h-full w-0.5"
          style={{ left: `${barProgress}%`, backgroundColor: "var(--teal)" }} />
        {/* Start marker */}
        <div className="absolute top-0 h-full w-0.5"
          style={{ left: `${startPct}%`, backgroundColor: "var(--accent)" }} />
        {/* End marker */}
        <div className="absolute top-0 h-full w-0.5"
          style={{ left: `${endPct}%`, backgroundColor: "var(--accent)" }} />
      </div>

      {/* Range sliders */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="trim-start" className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>
            Start - {fmtTimeMs(startSec)}
          </label>
          <input id="trim-start" type="range" min={0} max={duration} step={0.1}
            value={startSec}
            onChange={(e) => { const v = Math.min(Number(e.target.value), endSec - 0.1); onStartChange(v); }}
            className="h-1.5 w-full cursor-pointer accent-amber-400"
            aria-label="Start time" />
        </div>
        <div>
          <label htmlFor="trim-end" className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>
            End - {fmtTimeMs(endSec)}
          </label>
          <input id="trim-end" type="range" min={0} max={duration} step={0.1}
            value={endSec}
            onChange={(e) => { const v = Math.max(Number(e.target.value), startSec + 0.1); onEndChange(v); }}
            className="h-1.5 w-full cursor-pointer accent-amber-400"
            aria-label="End time" />
        </div>
      </div>

      {/* Precise numeric inputs */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="trim-start-num" className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>Start (seconds)</label>
          <input id="trim-start-num" type="number" step={0.1} min={0} max={endSec - 0.1}
            value={startSec.toFixed(1)}
            onChange={(e) => { const v = Number(e.target.value); if (v >= 0 && v < endSec) onStartChange(v); }}
            className="w-full rounded-lg border px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-amber-400/50"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="trim-end-num" className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>End (seconds)</label>
          <input id="trim-end-num" type="number" step={0.1} min={startSec + 0.1} max={duration}
            value={endSec.toFixed(1)}
            onChange={(e) => { const v = Number(e.target.value); if (v > startSec && v <= duration) onEndChange(v); }}
            className="w-full rounded-lg border px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-amber-400/50"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
      </div>

      {/* Duration summary */}
      <div className="flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
        <span>Original: <strong style={{ color: "var(--text-secondary)" }}>{fmtTime(duration)}</strong></span>
        <span>Selected: <strong style={{ color: "var(--teal)" }}>{fmtTime(endSec - startSec)}</strong></span>
      </div>

      {/* Preview controls */}
      <div className="flex gap-2">
        <button type="button" onClick={previewSelection}
          className="focus-ring inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--teal)" }}>
          ▶ Preview selection
        </button>
        {playing && (
          <button type="button" onClick={stop}
            className="focus-ring inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
            ■ Stop
          </button>
        )}
      </div>
    </div>
  );
}
