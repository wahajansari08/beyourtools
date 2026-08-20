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
      <div className="rounded-lg border p-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio src={src} controls className="w-full" aria-label={label} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <video
        ref={ref}
        src={src}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full bg-black"
        aria-label={label}
      />
      {/* BUG 8 FIX: only show speed note when a non-1x rate is set, not
          an always-wrong "Unknown" duration from formatDuration(null). */}
      {playbackRate !== 1 && (
        <div className="flex items-center justify-between gap-2 border-t px-3 py-2 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>
          <span className="min-w-0 truncate">{label}</span>
          <span>{playbackRate}× preview</span>
        </div>
      )}
    </div>
  );
}
