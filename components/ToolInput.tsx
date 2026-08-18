"use client";

import { ReactNode } from "react";

export default function ToolInput({
  label,
  value,
  onChange,
  placeholder,
  actions,
  error,
  rows = 18,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  actions?: ReactNode;
  error?: string | null;
  rows?: number;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--text-subtle)" }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        rows={rows}
        className="code-surface focus-ring w-full flex-1 resize-none border-0 px-3.5 py-3 font-mono text-[13px] leading-[1.6em] placeholder:opacity-40"
        style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-surface)" }}
      />
      <div
        className="flex items-center justify-between border-t px-3 py-1.5 text-[11px]"
        style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
      >
        <span>{value.length.toLocaleString()} characters</span>
        {error ? <span style={{ color: "var(--coral)" }}>Invalid</span> : null}
      </div>
    </div>
  );
}
