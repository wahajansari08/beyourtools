"use client";

import CopyButton from "@/components/CopyButton";
import Btn from "@/components/Btn";

interface BarcodeResultBoxProps {
  value: string;
  format?: string;
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

export default function BarcodeResultBox({ value, format, onReset, onScanAgain }: BarcodeResultBoxProps) {
  const url = isUrl(value);

  return (
    <div
      className="rounded-xl border p-5 space-y-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--teal)" }} aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          Decoded result
        </span>
        {format && (
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--accent)" }}
          >
            {format}
          </span>
        )}
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
            Open URL
          </a>
        )}
        {onScanAgain && (
          <Btn variant="secondary" size="sm" onClick={onScanAgain}>
          Scan again
        </Btn>
        )}
        <Btn variant="secondary" size="sm" onClick={onReset}>
          Reset
        </Btn>
      </div>
    </div>
  );
}
