"use client";

import { ReactNode } from "react";

export default function ToolOutput({
  label,
  value,
  actions,
  placeholder = "Output will appear here.",
  rows = 18,
  children,
}: {
  label: string;
  value?: string;
  actions?: ReactNode;
  placeholder?: string;
  rows?: number;
  children?: ReactNode;
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
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>
      <div className="code-surface flex-1 overflow-auto" style={{ minHeight: `${rows * 1.6}em` }}>
        {children ? (
          children
        ) : value ? (
          <pre
            className="whitespace-pre-wrap break-words px-3.5 py-3 font-mono text-[13px] leading-[1.6em]"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </pre>
        ) : (
          <div
            className="px-3.5 py-3 font-mono text-[13px] leading-[1.6em] opacity-40"
            style={{ color: "var(--text-muted)" }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
