"use client";

import { useCallback, useRef, useState } from "react";
import { getVideoMetadata, type VideoMetadata } from "@/lib/video/browser";
import { formatBytes } from "@/lib/video/ffmpeg";

export interface VideoUpload {
  file: File;
  objectUrl: string;
  metadata: VideoMetadata;
}

interface VideoUploaderProps {
  accept?: string;
  acceptLabel?: string;
  multiple?: boolean;
  onFiles: (files: VideoUpload[]) => void;
  label?: string;
  disabled?: boolean;
}

const DEFAULT_ACCEPT = "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v";

export default function VideoUploader({
  accept = DEFAULT_ACCEPT,
  acceptLabel = "MP4, MOV, MKV, WebM, AVI, M4V",
  multiple = false,
  onFiles,
  label = "Drop video file here",
  disabled = false,
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const processFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError("");

    const files = Array.from(fileList);
    const empty = files.find((file) => file.size === 0);
    if (empty) {
      setError("Please choose a non-empty media file.");
      return;
    }

    const large = files.find((file) => file.size > 500 * 1024 * 1024);
    if (large) {
      setError(`Large videos such as "${large.name}" may require significant browser memory and processing time.`);
    }

    const uploads = await Promise.all(
      files.map(async (file) => ({
        file,
        objectUrl: URL.createObjectURL(file),
        metadata: await getVideoMetadata(file),
      }))
    );
    onFiles(uploads);
  }, [onFiles]);

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) processFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        className="focus-ring flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition disabled:cursor-not-allowed disabled:opacity-50 sm:p-10"
        style={{
          borderColor: dragging ? "var(--accent)" : "var(--border-strong)",
          backgroundColor: dragging ? "color-mix(in srgb,var(--accent) 6%,transparent)" : "var(--bg-surface)",
        }}
        aria-label={multiple ? "Upload video files" : "Upload video file"}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-xs" style={{ borderColor: "var(--border-strong)", color: dragging ? "var(--accent)" : "var(--text-subtle)" }} aria-hidden="true">
          VID
        </span>
        <div>
          <p className="text-sm font-medium" style={{ color: dragging ? "var(--accent)" : "var(--text-secondary)" }}>
            {dragging ? "Drop it here" : label}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
            or click to browse - {acceptLabel}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Large videos may require significant browser memory and processing time.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            processFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </button>
      {error && (
        <p className="rounded-md border px-3 py-2 text-xs" role="alert" style={{ borderColor: "rgba(239,125,111,0.3)", backgroundColor: "rgba(239,125,111,0.08)", color: "var(--coral)" }}>
          {error}
        </p>
      )}
      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        Selected files stay on this device. File sizes shown before processing use browser metadata only, such as {formatBytes(1024 * 1024)} units.
      </p>
    </div>
  );
}

