"use client";

import { type ReactNode } from "react";
import StatusBanner from "@/components/StatusBanner";

export type PdfStatus = "idle" | "processing" | "done" | "error";

interface Props {
  status: PdfStatus;
  processingLabel?: string;
  error?: string | null;
  warning?: string | null;
  info?: string | null;
  dropzone: ReactNode;
  result?: ReactNode;
  toolbar?: ReactNode;
  actions?: ReactNode;
  onReset: () => void;
  resetLabel?: string;
}

export default function PdfToolShell({
  status,
  processingLabel = "Processing…",
  error, warning, info,
  dropzone, result, toolbar, actions,
  onReset,
  resetLabel = "Start over",
}: Props) {
  return (
    <div className="space-y-4">
      {toolbar && status === "idle" && (
        <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
      )}

      {status === "idle" && dropzone}

      {status === "processing" && (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-14 text-center"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}
        >
          <svg className="h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{processingLabel}</p>
        </div>
      )}

      {(status === "done" || status === "error") && result}

      {error   && <StatusBanner type="error"   message={error} />}
      {warning && <StatusBanner type="info"    message={warning} />}
      {info    && status === "done" && <StatusBanner type="success" message={info} />}

      {(status === "done" || status === "error") && (
        <div className="flex flex-wrap gap-3">
          {actions}
          <button
            type="button"
            onClick={onReset}
            className="focus-ring inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)", backgroundColor: "var(--bg-elevated)" }}
          >
            {resetLabel}
          </button>
        </div>
      )}

      {status === "idle" && (
        <div className="grid gap-3 pt-1 sm:grid-cols-3">
          {[
            { icon: "🔒", title: "Private",  body: "Files stay in your browser — nothing is uploaded." },
            { icon: "⚡", title: "Instant",  body: "Processing starts immediately, no waiting."        },
            { icon: "🆓", title: "Free",     body: "No account, no limits, always free."               },
          ].map(({ icon, title, body }) => (
            <div key={title} className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="mb-1.5 flex items-center gap-2">
                <span aria-hidden="true">{icon}</span>
                <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{title}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DownloadBtn({ href, filename, label }: { href: string; filename: string; label?: string }) {
  return (
    <a
      href={href}
      download={filename}
      className="focus-ring inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
      style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
      </svg>
      {label ?? `Download ${filename}`}
    </a>
  );
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfResultPanel({ label, children, status }: { label: string; children: ReactNode; status?: "ok" | "error" }) {
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: "var(--border)" }}>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: status === "error" ? "var(--coral)" : "var(--teal)" }}
        />
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
