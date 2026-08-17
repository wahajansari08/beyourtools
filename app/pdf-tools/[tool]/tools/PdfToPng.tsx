"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { pdfToImages, type PageImageResult } from "@/lib/pdf/image-convert";

interface State {
  status: "idle" | "processing" | "done" | "error";
  pages: PageImageResult[];
  urls: string[];
  error: string | null;
  filename: string;
}

export default function PdfToPng() {
  const [state, setState] = useState<State>({ status: "idle", pages: [], urls: [], error: null, filename: "" });

  const reset = useCallback(() => {
    state.urls.forEach(URL.revokeObjectURL);
    setState({ status: "idle", pages: [], urls: [], error: null, filename: "" });
  }, [state.urls]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState({ status: "processing", pages: [], urls: [], error: null, filename: file.name });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await pdfToImages(bytes, "png", 2);
    if (result.error || !result.pages.length) {
      setState((s) => ({ ...s, status: "error", error: result.error ?? "No pages rendered." }));
      return;
    }
    const urls = result.pages.map((p) => URL.createObjectURL(p.blob));
    setState((s) => ({ ...s, status: "done", pages: result.pages, urls }));
  }, []);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Rendering pages to PNG…"
      error={state.error}
      info={state.status === "done" ? `${state.pages.length} page(s) converted.` : null}
      onReset={reset}
      resetLabel="Convert another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={
        state.pages.length > 0 ? (
          <>
            {state.pages.map((p, i) => (
              <DownloadBtn key={i} href={state.urls[i]} filename={`${base}-page-${p.page}.png`} label={`Page ${p.page} (${formatBytes(p.blob.size)})`} />
            ))}
          </>
        ) : null
      }
      result={
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {state.pages.map((p, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
              <div className="flex items-center justify-between border-b border-ink-700 px-3 py-1.5">
                <span className="text-[11px] font-medium text-mist-400">Page {p.page}</span>
                <span className="text-[11px] text-mist-500">{formatBytes(p.blob.size)}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={state.urls[i]} alt={`Page ${p.page}`} className="w-full object-contain" />
            </div>
          ))}
        </div>
      }
    />
  );
}
