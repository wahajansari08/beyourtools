"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { compressPdf, bytesToBlob } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; originalSize: number; compressedSize: number; info: string | null; error: string | null; filename: string;
}

export default function PdfCompressor() {
  const [state, setState] = useState<State>({ status: "idle", url: "", originalSize: 0, compressedSize: 0, info: null, error: null, filename: "" });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", originalSize: 0, compressedSize: 0, info: null, error: null, filename: "" });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await compressPdf(bytes);
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Failed.", originalSize: result.originalSize })); return; }
    const blob = bytesToBlob(result.bytes!, "application/pdf");
    const url = URL.createObjectURL(blob);
    setState((s) => ({ ...s, status: "done", url, originalSize: result.originalSize, compressedSize: result.compressedSize, info: result.info ?? null }));
  }, []);

  const base = state.filename.replace(/\.pdf$/i, "");
  const saved = state.originalSize - state.compressedSize;
  const pct = state.originalSize > 0 ? Math.round((saved / state.originalSize) * 100) : 0;

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Compressing PDF…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Compress another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-compressed.pdf`} label={`Download (${formatBytes(state.compressedSize)})`} /> : null}
      result={
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Original size",   value: formatBytes(state.originalSize),   color: "text-mist-200" },
            { label: "Compressed size", value: formatBytes(state.compressedSize), color: "text-teal-400"  },
            { label: "Saved",           value: saved > 0 ? `${formatBytes(saved)} (${pct}%)` : "0 B", color: saved > 0 ? "text-amber-400" : "text-mist-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border border-ink-700 bg-ink-900 p-4 text-center">
              <div className={`text-lg font-semibold ${color}`}>{value}</div>
              <div className="mt-0.5 text-xs text-mist-400">{label}</div>
            </div>
          ))}
        </div>
      }
    />
  );
}
