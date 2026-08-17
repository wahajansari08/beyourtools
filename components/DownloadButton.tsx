"use client";

import clsx from "clsx";

export default function DownloadButton({
  text,
  filename,
  mime = "text/plain",
  className,
}: {
  text: string;
  filename: string;
  mime?: string;
  className?: string;
}) {
  function handleDownload() {
    if (!text) return;
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!text}
      className={clsx(
        "focus-ring inline-flex items-center gap-1.5 rounded-md border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-xs font-medium text-mist-200 transition hover:border-ink-500 hover:text-mist-50 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      <DownloadIcon /> Download
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}
