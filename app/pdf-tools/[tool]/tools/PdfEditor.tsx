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
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-14 text-center"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}
        >
          <svg className="h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Rendering pages…</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-3">
          <div
            className="rounded-md border px-3 py-2 text-[13px] font-mono"
            style={{ borderColor: "rgba(239,125,111,0.30)", backgroundColor: "rgba(239,125,111,0.10)", color: "var(--coral)" }}
          >
            ✕ {state.error}
          </div>
          <button
            onClick={reset}
            className="focus-ring rounded-md border px-4 py-2 text-sm transition"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)", backgroundColor: "var(--bg-elevated)" }}
          >
            Try another PDF
          </button>
        </div>
      )}

      {state.status === "ready" && (
        <div className="space-y-4">
          {/* Info bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <div className="flex gap-4" style={{ color: "var(--text-muted)" }}>
              <span className="truncate font-medium" style={{ color: "var(--text-primary)" }}>{state.filename}</span>
              <span>{state.pageCount} pages</span>
              <span>{formatBytes(state.fileSize)}</span>
            </div>
            <button
              onClick={reset}
              className="focus-ring rounded-md border px-3 py-1 text-xs transition"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)", backgroundColor: "var(--bg-elevated)" }}
            >
              Close
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
            {/* Thumbnail strip */}
            <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto lg:max-h-[600px]">
              {state.pages.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  className="shrink-0 overflow-hidden rounded border-2 transition"
                  style={{ borderColor: selected === i ? "var(--accent)" : "var(--border)" }}
                  aria-label={`Page ${p.page}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Page ${p.page}`} className="w-36 object-contain lg:w-full" />
                  <div
                    className="py-0.5 text-center text-[10px]"
                    style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-subtle)" }}
                  >
                    {p.page}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected page preview */}
            <div
              className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-lg border"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-page)" }}
            >
              {sel ? (
                <div className="p-4 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sel.url} alt={`Page ${sel.page}`} className="max-h-[560px] max-w-full object-contain shadow-xl" />
                  <p className="mt-2 text-xs" style={{ color: "var(--text-subtle)" }}>
                    Page {sel.page} - {sel.width}×{sel.height}px
                  </p>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-subtle)" }}>Click a thumbnail to preview the page</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
