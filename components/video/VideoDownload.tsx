"use client";

import { useEffect, useRef } from "react";
import { formatBytes } from "@/lib/video/ffmpeg";

interface VideoDownloadProps {
  blob: Blob;
  filename: string;
  label?: string;
  onReset: () => void;
}

export default function VideoDownload({ blob, filename, label = "Download", onReset }: VideoDownloadProps) {
  const urlRef = useRef("");

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  const download = () => {
    const a = document.createElement("a");
    a.href = urlRef.current;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={download}
        className="focus-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
        style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
      >
        <span aria-hidden="true">↓</span>
        {label}
        <span className="text-xs opacity-75">({formatBytes(blob.size)})</span>
      </button>
      <button
        type="button"
        onClick={onReset}
        className="focus-ring rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:opacity-80"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
      >
        Process another file
      </button>
    </div>
  );
}

