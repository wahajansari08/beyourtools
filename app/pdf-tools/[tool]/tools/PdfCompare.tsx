"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import StatusBanner from "@/components/StatusBanner";
import { comparePdfs, type PdfDiffResult } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  result: PdfDiffResult | null;
  error: string | null;
  fileA: File | null;
  fileB: File | null;
}

export default function PdfCompare() {
  const [state, setState] = useState<State>({ status: "idle", result: null, error: null, fileA: null, fileB: null });

  const reset = useCallback(() => setState({ status: "idle", result: null, error: null, fileA: null, fileB: null }), []);

  const setA = useCallback((files: File[]) => setState((s) => ({ ...s, fileA: files[0] ?? null })), []);
  const setB = useCallback((files: File[]) => setState((s) => ({ ...s, fileB: files[0] ?? null })), []);

  const handleCompare = useCallback(async () => {
    if (!state.fileA || !state.fileB) return;
    setState((s) => ({ ...s, status: "processing" }));
    const [bytesA, bytesB] = await Promise.all([
      state.fileA.arrayBuffer().then((b) => new Uint8Array(b)),
      state.fileB.arrayBuffer().then((b) => new Uint8Array(b)),
    ]);
    const result = await comparePdfs(bytesA, bytesB);
    if (result.error) { setState((s) => ({ ...s, status: "error", error: result.error })); return; }
    setState((s) => ({ ...s, status: "done", result }));
  }, [state.fileA, state.fileB]);

  const r = state.result;

  return (
    <div className="space-y-4">
      {(state.status === "idle" || (state.status !== "processing" && state.status !== "done")) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Document A</p>
            <PdfDropzone onFiles={setA} label="Drop PDF A here" />
            {state.fileA && <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>{state.fileA.name}</p>}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Document B</p>
            <PdfDropzone onFiles={setB} label="Drop PDF B here" />
            {state.fileB && <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>{state.fileB.name}</p>}
          </div>
        </div>
      )}

      {state.status === "idle" && state.fileA && state.fileB && (
        <button type="button" onClick={handleCompare}
          className="focus-ring inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          Compare PDFs
        </button>
      )}

      {state.status === "processing" && (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-14 text-center"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}
        >
          <svg className="h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Comparing…</p>
        </div>
      )}

      {state.error && <StatusBanner type="error" message={state.error} />}

      {state.status === "done" && r && (
        <div className="space-y-3">
          {r.identical
            ? <StatusBanner type="success" message="The two PDFs are identical." />
            : <StatusBanner type="info" message={`${r.differences.length} difference${r.differences.length !== 1 ? "s" : ""} found.`} />
          }
          <div className="flex gap-6 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div><span style={{ color: "var(--text-muted)" }}>Doc A: </span><span className="font-semibold" style={{ color: "var(--text-primary)" }}>{r.pageCount[0]} page{r.pageCount[0] !== 1 ? "s" : ""}</span></div>
            <div><span style={{ color: "var(--text-muted)" }}>Doc B: </span><span className="font-semibold" style={{ color: "var(--text-primary)" }}>{r.pageCount[1]} page{r.pageCount[1] !== 1 ? "s" : ""}</span></div>
          </div>
          {r.differences.length > 0 && (
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>Differences</div>
              {r.differences.map((d, i) => (
                <div key={i} className="flex items-baseline gap-3 border-b px-3.5 py-2 text-[13px] last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span className="shrink-0 font-mono" style={{ color: "var(--accent)" }}>{d.page === 0 ? "Doc" : `P${d.page}`}</span>
                  <span style={{ color: "var(--text-muted)" }}>{d.description}</span>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={reset}
            className="focus-ring inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)", backgroundColor: "var(--bg-elevated)" }}>
            Compare other PDFs
          </button>
        </div>
      )}
    </div>
  );
}
