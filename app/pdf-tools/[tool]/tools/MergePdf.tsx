"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { mergePdfs, bytesToBlob } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string;
  size: number;
  info: string | null;
  error: string | null;
  files: File[];
}

export default function MergePdf() {
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, files: [] });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, files: [] });
  }, [state.url]);

  const addFiles = useCallback((incoming: File[]) => {
    setState((s) => ({ ...s, files: [...s.files, ...incoming] }));
  }, []);

  const removeFile = useCallback((idx: number) => {
    setState((s) => ({ ...s, files: s.files.filter((_, i) => i !== idx) }));
  }, []);

  const moveFile = useCallback((from: number, to: number) => {
    setState((s) => {
      const arr = [...s.files];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...s, files: arr };
    });
  }, []);

  const handleMerge = useCallback(async () => {
    if (state.files.length < 2) return;
    setState((s) => ({ ...s, status: "processing" }));
    const arrays = await Promise.all(state.files.map(async (f) => new Uint8Array(await f.arrayBuffer())));
    const result = await mergePdfs(arrays);
    if (result.error || !result.bytes) {
      setState((s) => ({ ...s, status: "error", error: result.error ?? "Merge failed." }));
      return;
    }
    const blob = bytesToBlob(result.bytes!, "application/pdf");
    const url = URL.createObjectURL(blob);
    setState((s) => ({ ...s, status: "done", url, size: blob.size, info: result.info ?? null }));
  }, [state.files]);

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Merging PDFs…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Merge more PDFs"
      actions={state.url ? <DownloadBtn href={state.url} filename="merged.pdf" label={`Download merged.pdf (${formatBytes(state.size)})`} /> : null}
      result={
        <div
          className="rounded-lg border p-6 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{state.info}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatBytes(state.size)}</p>
        </div>
      }
      dropzone={
        <div className="space-y-3">
          <PdfDropzone accept=".pdf,application/pdf" multiple onFiles={addFiles} label="Drop PDF files here" sublabel="Add multiple PDFs - reorder below then click Merge" />
          {state.files.length > 0 && (
            <div
              className="rounded-lg border divide-y"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                {state.files.length} file{state.files.length !== 1 ? "s" : ""} - drag rows to reorder
              </div>
              {state.files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 border-b px-3 py-2 text-sm last:border-0" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <span className="w-5 shrink-0 text-center text-[11px]" style={{ color: "var(--text-subtle)" }}>{i + 1}</span>
                  <span className="flex-1 truncate font-mono text-[12px]" style={{ color: "var(--text-secondary)" }}>{f.name}</span>
                  <span className="shrink-0 text-[11px]" style={{ color: "var(--text-subtle)" }}>{formatBytes(f.size)}</span>
                  <div className="flex shrink-0 gap-1">
                    {i > 0 && <button onClick={() => moveFile(i, i - 1)} className="focus-ring rounded px-1 transition" style={{ color: "var(--text-subtle)" }} aria-label="Move up">↑</button>}
                    {i < state.files.length - 1 && <button onClick={() => moveFile(i, i + 1)} className="focus-ring rounded px-1 transition" style={{ color: "var(--text-subtle)" }} aria-label="Move down">↓</button>}
                    <button onClick={() => removeFile(i)} className="focus-ring rounded px-1 transition" style={{ color: "var(--coral)" }} aria-label="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {state.files.length >= 2 && (
            <button
              type="button"
              onClick={handleMerge}
              className="focus-ring inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Merge {state.files.length} PDFs
            </button>
          )}
          {state.files.length === 1 && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Add at least one more PDF to enable merging.</p>
          )}
        </div>
      }
    />
  );
}
