"use client";

import { useEffect, useRef } from "react";
import { formatDuration } from "@/lib/video/browser";

interface VideoPlayerProps {
  src: string;
  label: string;
  playbackRate?: number;
  audio?: boolean;
}

export default function VideoPlayer({ src, label, playbackRate = 1, audio = false }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = playbackRate;
  }, [playbackRate, src]);

  if (audio) {
    return (
      <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
        <audio src={src} controls className="w-full" aria-label={label} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <video
        ref={ref}
        src={src}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full bg-black"
        aria-label={label}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>
        <span className="min-w-0 truncate">{label}</span>
        <span>{playbackRate !== 1 ? `${playbackRate}x preview` : formatDuration(null)}</span>
      </div>
    </div>
  );
}

