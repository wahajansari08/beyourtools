"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  label?: string;
  autoPlay?: boolean;
}

function fmtTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function AudioPlayer({ src, label, autoPlay = false }: AudioPlayerProps) {
  const audioRef  = useRef<HTMLAudioElement>(null);
  const [playing,  setPlaying]  = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume,   setVolume]   = useState(1);
  const [muted,    setMuted]    = useState(false);
  const [speed,    setSpeed]    = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = src;
    audio.load();
    if (autoPlay) audio.play().catch(() => {});
    const onMeta  = () => setDuration(audio.duration || 0);
    const onTime  = () => setCurrent(audio.currentTime);
    const onEnd   = () => setPlaying(false);
    const onPlay  = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [src, autoPlay]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause(); else a.play().catch(() => {});
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (a) { a.currentTime = Number(e.target.value); setCurrent(Number(e.target.value)); }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) { audioRef.current.volume = v; audioRef.current.muted = false; setMuted(false); }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !muted;
    setMuted(!muted);
  };

  const changeSpeed = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = Number(e.target.value);
    setSpeed(v);
    if (audioRef.current) audioRef.current.playbackRate = v;
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="rounded-xl border p-4 space-y-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload="metadata" aria-label={label ?? "Audio player"} />

      {label && <p className="truncate text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>}

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="w-10 text-right font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>{fmtTime(current)}</span>
        <input type="range" min={0} max={duration || 0} step={0.01} value={current}
          onChange={seek} aria-label="Seek"
          className="h-1.5 w-full cursor-pointer accent-amber-400" />
        <span className="w-10 font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>{fmtTime(duration)}</span>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Play/Pause */}
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full transition hover:opacity-80"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-0.5" aria-hidden="true">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Volume */}
        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}
          className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded transition"
          style={{ color: "var(--text-muted)" }}>
          {muted || volume === 0 ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06Zm5.084 1.046a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
            </svg>
          )}
        </button>
        <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
          onChange={changeVolume} aria-label="Volume"
          className="h-1.5 w-20 cursor-pointer accent-amber-400" />

        {/* Speed */}
        <select value={speed} onChange={changeSpeed} aria-label="Playback speed"
          className="rounded border px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-amber-400/50"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
            <option key={s} value={s}>{s}×</option>
          ))}
        </select>

        {/* Progress % */}
        <span className="ml-auto text-[11px] tabular-nums" style={{ color: "var(--text-subtle)" }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
