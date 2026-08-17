"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { repairPdf, bytesToBlob } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; size: number; info: string | null; error: string | null; filename: string;
}

export default function PdfRepair() {
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await repairPdf(bytes);
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Could not repair." })); return; }
    setState((s) => ({ ...s, status: "done", url: URL.createObjectURL(bytesToBlob(result.bytes!, "application/pdf")), size: result.bytes!.length, info: result.info ?? null }));
  }, []);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Attempting repair…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Repair another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a damaged PDF here" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-repaired.pdf`} label={`Download (${formatBytes(state.size)})`} /> : null}
      result={<div className="rounded-lg border border-ink-700 bg-ink-900 p-5 text-center text-sm text-mist-200">{state.info}</div>}
    />
  );
}
