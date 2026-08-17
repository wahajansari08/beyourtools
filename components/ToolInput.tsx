"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export default function ToolInput({
  label,
  value,
  onChange,
  placeholder,
  actions,
  error,
  rows = 18,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  actions?: ReactNode;
  error?: string | null;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col overflow-hidden rounded-lg border border-ink-700 bg-ink-900", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-ink-700 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-mist-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-mist-300">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        rows={rows}
        className="code-surface focus-ring w-full flex-1 resize-none border-0 px-3.5 py-3 font-mono text-[13px] leading-[1.6em] text-mist-100 placeholder:text-mist-400/60"
      />
      <div className="flex items-center justify-between border-t border-ink-700 px-3 py-1.5 text-[11px] text-mist-400">
        <span>{value.length.toLocaleString()} characters</span>
        {error ? <span className="text-coral-400">Invalid</span> : null}
      </div>
    </div>
  );
}
