"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import { formatBytes } from "@/components/PdfToolShell";
import { loadPdfJs } from "@/lib/pdf/image-convert";

interface PageThumb { page: number; url: string; width: number; height: number; }
interface State {
  status: "idle" | "loading" | "ready" | "error";
  pages: PageThumb[];
  error: string | null;
  filename: string;
  pageCount: number;
  fileSize: number;
}

export default function PdfEditor() {
  const [state, setState] = useState<State>({ status: "idle", pages: [], error: null, filename: "", pageCount: 0, fileSize: 0 });
  const [selected, setSelected] = useState<number | null>(null);

  const reset = useCallback(() => {
    state.pages.forEach((p) => URL.revokeObjectURL(p.url));
    setState({ status: "idle", pages: [], error: null, filename: "", pageCount: 0, fileSize: 0 });
    setSelected(null);
  }, [state.pages]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState((s) => ({ ...s, status: "loading", filename: file.name, fileSize: file.size }));
    try {
      const pdfjsLib = await loadPdfJs();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const thumbs: PageThumb[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width); canvas.height = Math.floor(vp.height);
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp }).promise;
        const url = await new Promise<string>((res) => canvas.toBlob((b) => res(URL.createObjectURL(b!)), "image/jpeg", 0.8));
        thumbs.push({ page: i, url, width: canvas.width, height: canvas.height });
      }
      setState((s) => ({ ...s, status: "ready", pages: thumbs, pageCount: pdf.numPages }));
    } catch (e) {
      setState((s) => ({ ...s, status: "error", error: e instanceof Error ? e.message : "Failed to load PDF." }));
    }
  }, []);

  const sel = selected !== null ? state.pages[selected] : null;

  return (
    <div className="space-y-4">
      {state.status === "idle" && (
        <PdfDropzone onFiles={handleFiles} label="Drop a PDF to inspect" sublabel="View all pages as thumbnails" />
      )}

      {state.status === "loading" && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-ink-600 bg-ink-900 p-14 text-center">
          <svg className="h-8 w-8 animate-spin text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-mist-300">Rendering pages…</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-3">
          <div className="rounded-md border border-coral-400/30 bg-coral-400/10 px-3 py-2 text-[13px] font-mono text-coral-400">✕ {state.error}</div>
          <button onClick={reset} className="focus-ring rounded-md border border-ink-600 px-4 py-2 text-sm text-mist-200 hover:text-mist-50">Try another PDF</button>
        </div>
      )}

      {state.status === "ready" && (
        <div className="space-y-4">
          {/* Info bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-sm">
            <div className="flex gap-4 text-mist-300">
              <span className="truncate font-medium text-mist-100">{state.filename}</span>
              <span>{state.pageCount} pages</span>
              <span>{formatBytes(state.fileSize)}</span>
            </div>
            <button onClick={reset} className="focus-ring rounded-md border border-ink-600 px-3 py-1 text-xs text-mist-400 hover:text-mist-100">Close</button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
            {/* Thumbnail strip */}
            <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto lg:max-h-[600px]">
              {state.pages.map((p, i) => (
                <button key={i} type="button" onClick={() => setSelected(i)}
                  className={`shrink-0 overflow-hidden rounded border-2 transition ${selected === i ? "border-amber-400" : "border-ink-700 hover:border-ink-500"}`}
                  aria-label={`Page ${p.page}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Page ${p.page}`} className="w-36 lg:w-full object-contain" />
                  <div className="bg-ink-900 py-0.5 text-center text-[10px] text-mist-500">{p.page}</div>
                </button>
              ))}
            </div>

            {/* Selected page preview */}
            <div className="overflow-hidden rounded-lg border border-ink-700 bg-[#080b10] flex items-center justify-center min-h-[400px]">
              {sel ? (
                <div className="p-4 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sel.url} alt={`Page ${sel.page}`} className="max-h-[560px] max-w-full object-contain shadow-xl" />
                  <p className="mt-2 text-xs text-mist-500">Page {sel.page} — {sel.width}×{sel.height}px</p>
                </div>
              ) : (
                <p className="text-sm text-mist-500">Click a thumbnail to preview the page</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
