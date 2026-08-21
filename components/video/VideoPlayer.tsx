"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  label: string;
  playbackRate?: number;
  audio?: boolean;
}

export default function VideoPlayer({ src, label, playbackRate = 1, audio = false }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const frameTimerRef = useRef<number | null>(null);
  const [previewIssue, setPreviewIssue] = useState("");

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = playbackRate;
  }, [playbackRate, src]);

  useEffect(() => {
    setPreviewIssue("");
    return () => {
      if (frameTimerRef.current) window.clearTimeout(frameTimerRef.current);
    };
  }, [src]);

  const watchDecodedFrame = () => {
    const video = ref.current as (HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: () => void) => number;
    }) | null;
    if (!video?.requestVideoFrameCallback) return;

    if (frameTimerRef.current) window.clearTimeout(frameTimerRef.current);
    frameTimerRef.current = window.setTimeout(() => {
      setPreviewIssue("The file is playing, but this browser is not rendering decoded video frames. Exporting to MP4 may still fix the preview.");
    }, 1800);

    video.requestVideoFrameCallback(() => {
      if (frameTimerRef.current) window.clearTimeout(frameTimerRef.current);
      frameTimerRef.current = null;
      setPreviewIssue("");
    });
  };

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
        className="aspect-video w-full bg-black object-contain"
        aria-label={label}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          if (!video.videoWidth || !video.videoHeight) {
            setPreviewIssue("The browser loaded the file duration, but it cannot find a displayable video track.");
          }
        }}
        onLoadedData={() => setPreviewIssue("")}
        onPlay={watchDecodedFrame}
        onError={() => setPreviewIssue("This browser cannot preview this video's codec. Try converting it to MP4/H.264.")}
      />
      {previewIssue && (
        <div className="border-t px-3 py-2 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-elevated)" }}>
          {previewIssue}
        </div>
      )}
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
