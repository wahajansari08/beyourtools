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
        <div className="rounded-lg border border-ink-700 bg-ink-900 p-6 text-center">
          <p className="text-sm font-medium text-mist-200">{state.info}</p>
          <p className="text-xs text-mist-400">{formatBytes(state.size)}</p>
        </div>
      }
      dropzone={
        <div className="space-y-3">
          <PdfDropzone accept=".pdf,application/pdf" multiple onFiles={addFiles} label="Drop PDF files here" sublabel="Add multiple PDFs — reorder below then click Merge" />
          {state.files.length > 0 && (
            <div className="rounded-lg border border-ink-700 bg-ink-900 divide-y divide-ink-800">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-mist-400">
                {state.files.length} file{state.files.length !== 1 ? "s" : ""} — drag rows to reorder
              </div>
              {state.files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 text-sm text-mist-300">
                  <span className="w-5 shrink-0 text-center text-[11px] text-mist-500">{i + 1}</span>
                  <span className="flex-1 truncate font-mono text-[12px]">{f.name}</span>
                  <span className="shrink-0 text-[11px] text-mist-500">{formatBytes(f.size)}</span>
                  <div className="flex shrink-0 gap-1">
                    {i > 0 && <button onClick={() => moveFile(i, i - 1)} className="focus-ring rounded px-1 text-mist-500 hover:text-mist-200" aria-label="Move up">↑</button>}
                    {i < state.files.length - 1 && <button onClick={() => moveFile(i, i + 1)} className="focus-ring rounded px-1 text-mist-500 hover:text-mist-200" aria-label="Move down">↓</button>}
                    <button onClick={() => removeFile(i)} className="focus-ring rounded px-1 text-coral-400 hover:text-coral-300" aria-label="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {state.files.length >= 2 && (
            <button
              type="button"
              onClick={handleMerge}
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-amber-500"
            >
              Merge {state.files.length} PDFs
            </button>
          )}
          {state.files.length === 1 && (
            <p className="text-xs text-mist-400">Add at least one more PDF to enable merging.</p>
          )}
        </div>
      }
    />
  );
}
