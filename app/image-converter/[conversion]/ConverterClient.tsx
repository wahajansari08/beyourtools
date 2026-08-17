"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";
import ImageDropzone, { type DroppedFile } from "@/components/ImageDropzone";
import StatusBanner from "@/components/StatusBanner";
import { convertImage, suggestFilename } from "@/lib/converters/image";
import type { ImageFormat } from "@/lib/image-tools-config";

interface ConversionState {
  status: "idle" | "converting" | "done" | "error";
  inputName: string;
  inputPreview: string;
  outputUrl: string;
  outputFilename: string;
  outputMime: string;
  outputExt: string;
  outputSize: number;
  error: string | null;
  warning: string | null;
}

const INITIAL: ConversionState = {
  status: "idle",
  inputName: "",
  inputPreview: "",
  outputUrl: "",
  outputFilename: "",
  outputMime: "",
  outputExt: "",
  outputSize: 0,
  error: null,
  warning: null,
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ConverterClient({
  fromFormat,
  toFormat,
  fromLabel,
  toLabel,
  acceptMimes,
  acceptExts,
}: {
  fromFormat: ImageFormat;
  toFormat: ImageFormat;
  fromLabel: string;
  toLabel: string;
  acceptMimes: string;
  acceptExts: string;
}) {
  const [state, setState] = useState<ConversionState>(INITIAL);
  const [quality, setQuality] = useState(92);

  const reset = useCallback(() => {
    if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
    if (state.inputPreview) URL.revokeObjectURL(state.inputPreview);
    setState(INITIAL);
  }, [state]);

  const handleFile = useCallback(
    async ({ file, previewUrl }: DroppedFile) => {
      // Clean up previous output
      if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);

      setState((s) => ({
        ...s,
        status: "converting",
        inputName: file.name,
        inputPreview: previewUrl,
        outputUrl: "",
        error: null,
        warning: null,
      }));

      const result = await convertImage(file, toFormat, quality / 100);

      if (result.error || !result.blob) {
        setState((s) => ({
          ...s,
          status: "error",
          error: result.error ?? "Conversion failed.",
          warning: null,
        }));
        return;
      }

      const outputUrl = URL.createObjectURL(result.blob);
      const outputFilename = suggestFilename(file.name, result.ext);

      setState((s) => ({
        ...s,
        status: "done",
        outputUrl,
        outputFilename,
        outputMime: result.mime,
        outputExt: result.ext,
        outputSize: result.blob!.size,
        error: null,
        warning: result.warning,
      }));
    },
    [toFormat, quality, state.outputUrl]
  );

  const accept = `${acceptMimes},${acceptExts}`;
  const isRasterOutput = !["svg", "pdf"].includes(toFormat);
  const showQuality = isRasterOutput && ["jpg", "webp", "avif"].includes(toFormat);

  return (
    <div className="space-y-4">
      {/* Quality slider — only for lossy formats */}
      {showQuality && (
        <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3">
          <label htmlFor="quality-slider" className="text-xs text-mist-400 shrink-0">
            Quality
          </label>
          <input
            id="quality-slider"
            type="range"
            min={10}
            max={100}
            step={1}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-amber-400"
          />
          <span className="w-8 shrink-0 text-right text-xs font-mono text-amber-400">{quality}%</span>
        </div>
      )}

      {state.status === "idle" && (
        <ImageDropzone
          accept={accept}
          onFile={handleFile}
          label={`Drop a ${fromLabel} file here`}
        />
      )}

      {state.status === "converting" && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-ink-600 bg-ink-900 p-14 text-center">
          <svg
            className="h-8 w-8 animate-spin text-amber-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-mist-300">Converting to {toLabel}…</p>
        </div>
      )}

      {(state.status === "done" || state.status === "error") && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Input preview */}
          <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
            <div className="flex items-center justify-between border-b border-ink-700 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mist-400" />
                <span className="text-xs font-semibold uppercase tracking-wide text-mist-300">
                  Input ({fromLabel})
                </span>
              </div>
              <span className="truncate text-right text-[11px] text-mist-500 max-w-[140px]" title={state.inputName}>
                {state.inputName}
              </span>
            </div>
            <div className="flex items-center justify-center bg-[#080b10] p-3" style={{ minHeight: "200px" }}>
              {state.inputPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={state.inputPreview}
                  alt="Input preview"
                  className="max-h-64 max-w-full rounded object-contain"
                />
              ) : (
                <span className="text-xs text-mist-500">No preview</span>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
            <div className="flex items-center justify-between border-b border-ink-700 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={clsx("h-1.5 w-1.5 rounded-full", state.status === "done" ? "bg-teal-400" : "bg-coral-400")} />
                <span className="text-xs font-semibold uppercase tracking-wide text-mist-300">
                  Output ({toLabel})
                </span>
              </div>
              {state.status === "done" && (
                <span className="text-[11px] text-mist-500">{formatBytes(state.outputSize)}</span>
              )}
            </div>

            <div className="flex items-center justify-center bg-[#080b10] p-3" style={{ minHeight: "200px" }}>
              {state.status === "done" && state.outputUrl && isRasterOutput ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={state.outputUrl}
                  alt="Converted output"
                  className="max-h-64 max-w-full rounded object-contain"
                />
              ) : state.status === "done" ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-teal-400" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-mist-300">Ready to download</p>
                </div>
              ) : (
                <span className="text-xs text-mist-500">Conversion failed</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Banners */}
      {state.warning && <StatusBanner type="info" message={state.warning} />}
      {state.error   && <StatusBanner type="error" message={state.error} />}

      {/* Action buttons */}
      {(state.status === "done" || state.status === "error") && (
        <div className="flex flex-wrap gap-3">
          {state.status === "done" && state.outputUrl && (
            <a
              href={state.outputUrl}
              download={state.outputFilename}
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-amber-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              Download {state.outputFilename}
            </a>
          )}
          <button
            type="button"
            onClick={reset}
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink-600 px-5 py-2.5 text-sm font-medium text-mist-200 transition hover:border-ink-500 hover:text-mist-50"
          >
            Convert another file
          </button>
        </div>
      )}

      {/* Info cards */}
      <div className="grid gap-3 pt-2 sm:grid-cols-3">
        {[
          { icon: "🔒", title: "Private", body: "Files never leave your device. Conversion happens entirely in your browser." },
          { icon: "⚡", title: "Instant",  body: "No upload wait. Conversion starts the moment you drop or select a file." },
          { icon: "🆓", title: "Free",     body: "No account, no limits, no watermarks. Always free." },
        ].map(({ icon, title, body }) => (
          <div key={title} className="rounded-lg border border-ink-700 bg-ink-900 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <span aria-hidden="true">{icon}</span>
              <span className="text-xs font-semibold text-mist-200">{title}</span>
            </div>
            <p className="text-xs leading-relaxed text-mist-400">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
