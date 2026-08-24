"use client";

import { useRef, useState, useCallback } from "react";
import { formatBytes } from "@/lib/audio/ffmpeg";

export interface AudioFile {
  file: File;
  objectUrl: string;
  duration: number | null;
}

interface AudioUploaderProps {
  accept?: string;
  acceptLabel?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFiles: (files: AudioFile[]) => void;
  disabled?: boolean;
}

const DEFAULT_ACCEPT = "audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.opus,.wma,.mp4,.webm";

async function getDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(audio.duration); };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    audio.src = url;
  });
}

function formatDuration(sec: number | null): string {
  if (sec === null || !isFinite(sec)) return "";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioUploader({
  accept = DEFAULT_ACCEPT,
  acceptLabel = "MP3, WAV, M4A, FLAC, OGG, MP4",
  multiple = false,
  maxSizeMB,
  onFiles,
  disabled = false,
}: AudioUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList);

    if (maxSizeMB) {
      const oversized = files.find((f) => f.size > maxSizeMB * 1024 * 1024);
      if (oversized) {
        setError(`"${oversized.name}" exceeds the ${maxSizeMB} MB limit.`);
        return;
      }
    }

    const audioFiles: AudioFile[] = await Promise.all(
      files.map(async (f) => ({
        file: f,
        objectUrl: URL.createObjectURL(f),
        duration: await getDuration(f),
      }))
    );
    onFiles(audioFiles);
  }, [maxSizeMB, onFiles]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) processFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className="focus-ring flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          borderColor: dragging ? "var(--accent)" : "var(--border-strong)",
          backgroundColor: dragging ? "color-mix(in srgb,var(--accent) 6%,transparent)" : "var(--bg-surface)",
        }}
        aria-label="Upload audio file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={1.5} className="h-10 w-10"
          style={{ color: dragging ? "var(--accent)" : "var(--text-subtle)" }} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
        <div>
          <p className="text-sm font-medium" style={{ color: dragging ? "var(--accent)" : "var(--text-secondary)" }}>
            {dragging ? "Drop it here" : "Drop audio file here"}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
            or click to browse — {acceptLabel}
          </p>
        </div>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple}
          className="sr-only" tabIndex={-1} aria-hidden="true"
          onChange={(e) => { processFiles(e.target.files); e.target.value = ""; }} />
      </button>

      {error && (
        <p className="rounded-md border px-3 py-2 text-xs" role="alert"
          style={{ borderColor: "rgba(239,125,111,0.3)", backgroundColor: "rgba(239,125,111,0.08)", color: "var(--coral)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export { formatDuration, formatBytes };
