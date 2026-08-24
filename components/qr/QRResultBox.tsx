"use client";

import CopyButton from "@/components/CopyButton";

interface QRResultBoxProps {
  value: string;
  onReset: () => void;
  onScanAgain?: () => void;
}

function isUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function QRResultBox({ value, onReset, onScanAgain }: QRResultBoxProps) {
  const url = isUrl(value);

  return (
    <div
      className="rounded-xl border p-5 space-y-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--teal)" }} aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          Decoded result
        </span>
      </div>

      <p
        className="break-all rounded-md border px-3 py-2 font-mono text-sm"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
        aria-live="polite"
      >
        {value}
      </p>

      <div className="flex flex-wrap gap-2">
        <CopyButton text={value} />
        {url && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--teal)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3" aria-hidden="true">
              <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
              <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
            </svg>
            Open URL
          </a>
        )}
        {onScanAgain && (
          <button
            type="button"
            onClick={onScanAgain}
            className="focus-ring inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
          >
            Scan again
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="focus-ring inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
