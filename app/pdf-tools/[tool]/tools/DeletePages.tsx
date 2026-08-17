"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { deletePages, parsePageList, bytesToBlob } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; size: number; info: string | null; error: string | null; filename: string; pages: string;
}

export default function DeletePages() {
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, filename: "", pages: "" });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, filename: "", pages: "" });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!state.pages.trim()) { setState((s) => ({ ...s, filename: file.name, status: "error", error: "Enter page numbers to delete first." })); return; }
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pageList = parsePageList(state.pages, 9999);
    const result = await deletePages(bytes, pageList);
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Failed." })); return; }
    const blob = bytesToBlob(result.bytes!, "application/pdf");
    const url = URL.createObjectURL(blob);
    setState((s) => ({ ...s, status: "done", url, size: blob.size, info: result.info ?? null }));
  }, [state.pages]);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Deleting pages…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Delete from another PDF"
      toolbar={
        <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 w-full">
          <label htmlFor="del-pages" className="shrink-0 text-xs text-mist-400">Pages to delete</label>
          <input
            id="del-pages"
            type="text"
            value={state.pages}
            onChange={(e) => setState((s) => ({ ...s, pages: e.target.value }))}
            placeholder="e.g. 2, 4-6"
            className="code-surface focus-ring flex-1 rounded border-0 px-2 py-1 font-mono text-[13px] text-mist-100 placeholder:text-mist-500"
          />
        </div>
      }
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" sublabel="Enter pages to delete above, then drop the PDF" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-edited.pdf`} label={`Download (${formatBytes(state.size)})`} /> : null}
      result={<div className="rounded-lg border border-ink-700 bg-ink-900 p-5 text-center text-sm text-mist-200">{state.info}</div>}
    />
  );
}
