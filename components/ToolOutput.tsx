"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export default function ToolOutput({
  label,
  value,
  actions,
  placeholder = "Output will appear here.",
  rows = 18,
  className,
  children,
}: {
  label: string;
  value?: string;
  actions?: ReactNode;
  placeholder?: string;
  rows?: number;
  className?: string;
  /** If provided, renders custom content instead of the plain text output (e.g. a tree view). */
  children?: ReactNode;
}) {
  return (
    <div className={clsx("flex flex-col overflow-hidden rounded-lg border border-ink-700 bg-ink-900", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-ink-700 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-mist-300">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>
      <div className="code-surface flex-1 overflow-auto" style={{ minHeight: `${rows * 1.6}em` }}>
        {children ? (
          children
        ) : value ? (
          <pre className="whitespace-pre-wrap break-words px-3.5 py-3 font-mono text-[13px] leading-[1.6em] text-mist-100">{value}</pre>
        ) : (
          <div className="px-3.5 py-3 font-mono text-[13px] leading-[1.6em] text-mist-400/60">{placeholder}</div>
        )}
      </div>
    </div>
  );
}
