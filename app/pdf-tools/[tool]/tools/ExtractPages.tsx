"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { extractPages, parsePageList, bytesToBlob } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; size: number; info: string | null; error: string | null; filename: string; pages: string; totalPages: number;
}

export default function ExtractPages() {
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, filename: "", pages: "", totalPages: 0 });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, filename: "", pages: "", totalPages: 0 });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    // Read page count quickly
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { loadPdfLib } = await import("@/lib/pdf/engine");
    try {
      const { PDFDocument } = await loadPdfLib();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setState((s) => ({ ...s, filename: file.name, totalPages: doc.getPageCount() }));
    } catch {
      setState((s) => ({ ...s, filename: file.name }));
    }

    if (!state.pages.trim()) return;
    setState((s) => ({ ...s, status: "processing" }));
    const pageList = parsePageList(state.pages, 9999);
    const result = await extractPages(bytes, pageList);
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Failed." })); return; }
    const blob = bytesToBlob(result.bytes!, "application/pdf");
    const url = URL.createObjectURL(blob);
    setState((s) => ({ ...s, status: "done", url, size: blob.size, info: result.info ?? null }));
  }, [state.pages]);

  const handleExtract = useCallback(async () => {
    if (!state.filename || !state.pages) return;
    // Re-read file not stored — ask user to re-drop
    setState((s) => ({ ...s, status: "idle" }));
  }, [state.filename, state.pages]);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Extracting pages…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Extract from another PDF"
      toolbar={
        <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 w-full">
          <label htmlFor="extract-pages" className="shrink-0 text-xs text-mist-400">Pages to extract</label>
          <input
            id="extract-pages"
            type="text"
            value={state.pages}
            onChange={(e) => setState((s) => ({ ...s, pages: e.target.value }))}
            placeholder="e.g. 1-3, 5, 8"
            className="code-surface focus-ring flex-1 rounded border-0 px-2 py-1 font-mono text-[13px] text-mist-100 placeholder:text-mist-500"
          />
          {state.totalPages > 0 && <span className="shrink-0 text-[11px] text-mist-500">{state.totalPages} pages total</span>}
        </div>
      }
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" sublabel="Enter page numbers above, then drop the PDF" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-extracted.pdf`} label={`Download (${formatBytes(state.size)})`} /> : null}
      result={<div className="rounded-lg border border-ink-700 bg-ink-900 p-5 text-center text-sm text-mist-200">{state.info}</div>}
    />
  );
}
