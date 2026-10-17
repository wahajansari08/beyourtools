"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import {
  loadImageFromFile,
  downloadBlob,
  formatBytes,
  extForMime,
} from "@/components/design/imageUtils";

type Format = "image/jpeg" | "image/webp" | "image/png";

const FORMATS: { mime: Format; label: string }[] = [
  { mime: "image/jpeg", label: "JPEG" },
  { mime: "image/webp", label: "WebP" },
  { mime: "image/png", label: "PNG" },
];

const MAX_DIMS = [
  { label: "Original size", value: 0 },
  { label: "512 px", value: 512 },
  { label: "1024 px", value: 1024 },
  { label: "2048 px", value: 2048 },
  { label: "4096 px", value: 4096 },
];

const labelCls = "mb-1 block text-xs font-semibold";

export default function ImageCompressorClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [maxDim, setMaxDim] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    url: string;
    blob: Blob;
    w: number;
    h: number;
    size: number;
  } | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = useCallback(async ({ file, previewUrl }: { file: File; previewUrl: string }) => {
    URL.revokeObjectURL(previewUrl);
    setError("");
    try {
      const image = await loadImageFromFile(file);
      imgRef.current = image;
      setImg(image);
      setFileName(file.name);
      setFileSize(file.size);
    } catch {
      setError("Could not read that image. Please try a PNG, JPEG or WebP file.");
    }
  }, []);

  // Re-encode whenever inputs change (debounced for the slider)
  useEffect(() => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    const t = setTimeout(() => {
      const scale = maxDim > 0 ? Math.min(1, maxDim / Math.max(image.naturalWidth, image.naturalHeight)) : 1;
      const w = Math.max(1, Math.round(image.naturalWidth * scale));
      const h = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setResult((prev) => {
            if (prev) URL.revokeObjectURL(prev.url);
            return { url: URL.createObjectURL(blob), blob, w, h, size: blob.size };
          });
        },
        format,
        format === "image/png" ? undefined : quality / 100
      );
    }, 150);
    return () => clearTimeout(t);
  }, [img, quality, format, maxDim]);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (!result) return;
    const base = fileName.replace(/\.[^.]+$/, "") || "compressed";
    downloadBlob(result.blob, `${base}-compressed.${extForMime(format)}`);
  };

  const savings = result && fileSize > 0 ? Math.round(((fileSize - result.size) / fileSize) * 100) : 0;

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/*" onFile={onFile} label="Drop an image to compress" />

      {error && (
        <p className="rounded-lg border px-3 py-2 text-xs font-medium" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "var(--bg-surface)" }}>
          {error}
        </p>
      )}

      {img && (
        <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          {/* Options */}
          <div className="space-y-4">
            <div>
              <span className={labelCls} style={{ color: "var(--text-secondary)" }}>Output format</span>
              <div className="flex gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.mime}
                    type="button"
                    onClick={() => setFormat(f.mime)}
                    className="focus-ring flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition"
                    style={{
                      borderColor: format === f.mime ? "var(--accent)" : "var(--border)",
                      backgroundColor: format === f.mime ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--bg-elevated)",
                      color: format === f.mime ? "var(--accent-text)" : "var(--text-muted)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {format === "image/png" && (
                <p className="mt-1.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  PNG is lossless, so the quality slider doesn&apos;t apply - use max dimension or switch to WebP for smaller files.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls} style={{ color: "var(--text-secondary)" }} htmlFor="cmp-q">Quality</label>
                <span className="text-xs font-bold" style={{ color: "var(--accent-text)" }}>{quality}</span>
              </div>
              <input
                id="cmp-q"
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="focus-ring w-full" style={{ accentColor: "var(--accent)" }}
                aria-label="Compression quality"
              />
              <div className="flex justify-between text-[10px]" style={{ color: "var(--text-subtle)" }}>
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-secondary)" }} htmlFor="cmp-max">Max dimension</label>
              <select
                id="cmp-max"
                value={maxDim}
                onChange={(e) => setMaxDim(parseInt(e.target.value, 10))}
                className="focus-ring w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              >
                {MAX_DIMS.map((d) => (
                  <option key={d.label} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border p-2.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Original</p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>{formatBytes(fileSize)}</p>
              </div>
              <div className="rounded-lg border p-2.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Compressed</p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>{result ? formatBytes(result.size) : "—"}</p>
              </div>
              <div className="rounded-lg border p-2.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Saved</p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: savings > 0 ? "var(--accent-text)" : "var(--text-primary)" }}>
                  {result ? `${savings > 0 ? "−" : ""}${Math.abs(savings)}%` : "—"}
                </p>
              </div>
            </div>

            {result && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Dimensions: <strong style={{ color: "var(--text-secondary)" }}>{result.w} × {result.h} px</strong>
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex min-h-[220px] flex-1 items-center justify-center overflow-hidden rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              {result ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Compressed preview" className="max-h-64 max-w-full rounded object-contain" />
              ) : (
                <p className="text-center text-xs" style={{ color: "var(--text-subtle)" }}>Compressing…</p>
              )}
            </div>
            {result && (
              <button
                type="button"
                onClick={handleDownload}
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Compressed Image
              </button>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
