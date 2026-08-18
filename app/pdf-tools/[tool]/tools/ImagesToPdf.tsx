"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { imagesToPdf } from "@/lib/pdf/image-convert";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string;
  size: number;
  pageCount: number;
  error: string | null;
}

export default function ImagesToPdf() {
  const pathname = usePathname();
  const isJpg = pathname.includes("jpg");
  const ext = isJpg ? "jpg" : "png";
  const accept = isJpg ? ".jpg,.jpeg,image/jpeg" : ".png,image/png";
  const label = isJpg ? "Drop JPG image(s) here" : "Drop PNG image(s) here";

  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, pageCount: 0, error: null });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, pageCount: 0, error: null });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setState({ status: "processing", url: "", size: 0, pageCount: 0, error: null });
    const result = await imagesToPdf(files);
    if (result.error || !result.blob) {
      setState((s) => ({ ...s, status: "error", error: result.error ?? "Conversion failed." }));
      return;
    }
    const url = URL.createObjectURL(result.blob);
    setState({ status: "done", url, size: result.blob.size, pageCount: result.pageCount, error: null });
  }, []);

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Building PDF…"
      error={state.error}
      info={state.status === "done" ? `PDF created with ${state.pageCount} page(s) — ${formatBytes(state.size)}.` : null}
      onReset={reset}
      resetLabel="Convert more images"
      dropzone={
        <PdfDropzone
          accept={accept}
          multiple
          onFiles={handleFiles}
          label={label}
          sublabel="Select multiple images to combine into one PDF"
        />
      }
      actions={
        state.url ? <DownloadBtn href={state.url} filename={`images.pdf`} label="Download PDF" /> : null
      }
      result={
        <div className="rounded-lg border p-6 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-12 w-12" style={{ color: "var(--teal)" }} aria-hidden="true">
            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Z" clipRule="evenodd" />
          </svg>
          <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{state.pageCount} page PDF ready</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatBytes(state.size)}</p>
        </div>
      }
    />
  );
}
