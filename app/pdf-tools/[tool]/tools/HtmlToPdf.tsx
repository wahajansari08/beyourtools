"use client";

import { useCallback, useState } from "react";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { htmlToPdf } from "@/lib/pdf/image-convert";
import Btn from "@/components/Btn";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string;
  size: number;
  error: string | null;
}

export default function HtmlToPdf() {
  const [html, setHtml] = useState(
    "<h1>Hello World</h1>\n<p>This is a paragraph of content that will be converted to PDF.</p>"
  );
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, error: null });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, error: null });
  }, [state.url]);

  const handleConvert = useCallback(async () => {
    if (!html.trim()) return;
    setState({ status: "processing", url: "", size: 0, error: null });
    const { blob, error } = await htmlToPdf(html);
    if (error || !blob) {
      setState((s) => ({ ...s, status: "error", error: error ?? "Conversion failed." }));
      return;
    }
    const url = URL.createObjectURL(blob);
    setState({ status: "done", url, size: blob.size, error: null });
  }, [html]);

  return (
    <div className="space-y-4">
      {/* Idle: HTML editor + convert button */}
      {state.status === "idle" && (
        <div className="space-y-3">
          {/* HTML textarea */}
          <div
            className="flex flex-col overflow-hidden rounded-lg border"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <div
              className="flex items-center gap-2 border-b px-3 py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--text-subtle)" }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                HTML Input
              </span>
              <span className="ml-auto text-[11px]" style={{ color: "var(--text-subtle)" }}>
                {html.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={14}
              spellCheck={false}
              className="code-surface focus-ring w-full flex-1 resize-none border-0 px-3.5 py-3 font-mono text-[13px] leading-[1.6em] placeholder:opacity-40"
              style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-surface)" }}
              placeholder="<h1>Title</h1><p>Content…</p>"
            />
          </div>

          <Btn variant="primary" onClick={handleConvert} disabled={!html.trim()}>
          Convert to PDF
        </Btn>
        </div>
      )}

      {/* Processing */}
      {state.status === "processing" && (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-14 text-center"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}
        >
          <svg
            className="h-8 w-8 animate-spin"
            style={{ color: "var(--accent)" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Generating PDF…</p>
        </div>
      )}

      {/* Done or error */}
      {(state.status === "done" || state.status === "error") && (
        <div className="space-y-3">
          {state.status === "done" && (
            <div
              className="rounded-lg border p-6 text-center"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mx-auto h-12 w-12"
                style={{ color: "var(--teal)" }}
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                PDF ready - {formatBytes(state.size)}
              </p>
            </div>
          )}

          {state.error && (
            <div
              className="rounded-md border px-3 py-2 text-[13px] font-mono"
              style={{
                borderColor: "rgba(239,125,111,0.30)",
                backgroundColor: "rgba(239,125,111,0.10)",
                color: "var(--coral)",
              }}
            >
              ✕ {state.error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {state.url && <DownloadBtn href={state.url} filename="document.pdf" label="Download PDF" />}
            <Btn variant="secondary" onClick={reset}>
          Start over
        </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
