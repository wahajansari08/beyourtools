"use client";

import { useEffect, useRef } from "react";
import { formatBytes } from "@/lib/audio/ffmpeg";

interface AudioDownloadProps {
  blob: Blob;
  filename: string;
  label?: string;
  showSize?: boolean;
  onReset: () => void;
}

export default function AudioDownload({
  blob,
  filename,
  label = "Download",
  showSize = true,
  onReset,
}: AudioDownloadProps) {
  const urlRef = useRef<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href     = urlRef.current;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleDownload}
        className="focus-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
        style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
          className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V8.44L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
          <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
        </svg>
        {label}
        {showSize && <span className="opacity-75 text-xs">({formatBytes(blob.size)})</span>}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="focus-ring inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:opacity-80"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
      >
        Process another file
      </button>
    </div>
  );
}
