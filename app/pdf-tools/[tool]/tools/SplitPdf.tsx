"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { splitPdf, bytesToBlob } from "@/lib/pdf/engine";

interface PageResult { pageNumber: number; url: string; size: number; }
interface State {
  status: "idle" | "processing" | "done" | "error";
  pages: PageResult[];
  error: string | null;
  filename: string;
  ranges: string;
}

export default function SplitPdf() {
  const [state, setState] = useState<State>({ status: "idle", pages: [], error: null, filename: "", ranges: "" });

  const reset = useCallback(() => {
    state.pages.forEach((p) => URL.revokeObjectURL(p.url));
    setState({ status: "idle", pages: [], error: null, filename: "", ranges: "" });
  }, [state.pages]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await splitPdf(bytes, state.ranges || undefined);
    if (result.error || !result.pages.length) {
      setState((s) => ({ ...s, status: "error", error: result.error ?? "Split failed." }));
      return;
    }
    const pages = result.pages.map((p) => ({
      pageNumber: p.pageNumber,
      size: p.bytes.length,
      url: URL.createObjectURL(bytesToBlob(p.bytes, "application/pdf")),
    }));
    setState((s) => ({ ...s, status: "done", pages }));
  }, [state.ranges]);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Splitting PDF…"
      error={state.error}
      info={state.status === "done" ? `Split into ${state.pages.length} file(s).` : null}
      onReset={reset}
      resetLabel="Split another PDF"
      toolbar={
        <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 w-full">
          <label htmlFor="ranges" className="shrink-0 text-xs text-mist-400">Page ranges</label>
          <input
            id="ranges"
            type="text"
            value={state.ranges}
            onChange={(e) => setState((s) => ({ ...s, ranges: e.target.value }))}
            placeholder="e.g. 1-3, 5, 7-9 (leave blank for every page)"
            className="code-surface focus-ring flex-1 rounded border-0 px-2 py-1 font-mono text-[13px] text-mist-100 placeholder:text-mist-500"
          />
        </div>
      }
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={
        <div className="flex flex-wrap gap-2">
          {state.pages.map((p) => (
            <DownloadBtn key={p.pageNumber} href={p.url} filename={`${base}-page-${p.pageNumber}.pdf`} label={`Page ${p.pageNumber} (${formatBytes(p.size)})`} />
          ))}
        </div>
      }
      result={
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {state.pages.map((p) => (
            <a key={p.pageNumber} href={p.url} download={`${base}-page-${p.pageNumber}.pdf`}
              className="focus-ring flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-xs transition hover:border-ink-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-teal-400" aria-hidden="true">
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-medium text-mist-200">Page {p.pageNumber}</div>
                <div className="text-mist-500">{formatBytes(p.size)}</div>
              </div>
            </a>
          ))}
        </div>
      }
    />
  );
}
