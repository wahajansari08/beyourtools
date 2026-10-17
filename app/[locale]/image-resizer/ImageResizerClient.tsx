"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import {
  loadImageFromFile,
  downloadBlob,
  formatBytes,
  extForMime,
} from "@/components/design/imageUtils";

const PRESETS: { label: string; w: number; h: number }[] = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
  { label: "X Header", w: 1500, h: 500 },
  { label: "Facebook Post", w: 1200, h: 630 },
];

type Format = "image/png" | "image/jpeg" | "image/webp";

const FORMATS: { mime: Format; label: string }[] = [
  { mime: "image/png", label: "PNG" },
  { mime: "image/jpeg", label: "JPEG" },
  { mime: "image/webp", label: "WebP" },
];

const inputCls =
  "focus-ring w-full rounded-lg border px-3 py-2 text-sm outline-none transition";
const labelCls = "mb-1 block text-xs font-semibold";

export default function ImageResizerClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [mode, setMode] = useState<"pixels" | "percent">("pixels");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percent, setPercent] = useState("100");
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<Format>("image/png");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    url: string;
    blob: Blob;
    w: number;
    h: number;
    size: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const onFile = useCallback(async ({ file, previewUrl }: { file: File; previewUrl: string }) => {
    URL.revokeObjectURL(previewUrl);
    setError("");
    try {
      const image = await loadImageFromFile(file);
      setImg(image);
      setFileName(file.name);
      setOrigW(image.naturalWidth);
      setOrigH(image.naturalHeight);
      setWidth(String(image.naturalWidth));
      setHeight(String(image.naturalHeight));
      setPercent("100");
      setResult(null);
    } catch {
      setError("Could not read that image. Please try a PNG, JPEG, WebP or GIF file.");
    }
  }, []);

  // Revoke result URL on unmount / replacement
  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleWidth = (v: string) => {
    setWidth(v);
    const w = parseInt(v, 10);
    if (lock && w > 0 && origW > 0) {
      setHeight(String(Math.max(1, Math.round((w * origH) / origW))));
    }
  };

  const handleHeight = (v: string) => {
    setHeight(v);
    const h = parseInt(v, 10);
    if (lock && h > 0 && origH > 0) {
      setWidth(String(Math.max(1, Math.round((h * origW) / origH))));
    }
  };

  const applyPreset = (p: { w: number; h: number }) => {
    setMode("pixels");
    setWidth(String(p.w));
    setHeight(String(p.h));
  };

  const targetDims = (): { w: number; h: number } | null => {
    if (!img) return null;
    if (mode === "percent") {
      const p = parseFloat(percent);
      if (!p || p <= 0) return null;
      return {
        w: Math.max(1, Math.round((origW * p) / 100)),
        h: Math.max(1, Math.round((origH * p) / 100)),
      };
    }
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!w || !h || w <= 0 || h <= 0) return null;
    return { w, h };
  };

  const handleResize = () => {
    if (!img || !canvasRef.current) return;
    const dims = targetDims();
    if (!dims) {
      setError("Enter valid dimensions first.");
      return;
    }
    setError("");
    const canvas = canvasRef.current;
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, dims.w, dims.h);
    ctx.drawImage(img, 0, 0, dims.w, dims.h);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Failed to encode the resized image.");
          return;
        }
        if (result) URL.revokeObjectURL(result.url);
        setResult({ url: URL.createObjectURL(blob), blob, w: dims.w, h: dims.h, size: blob.size });
        // Scroll preview into view on small screens
        previewImgRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      },
      format,
      0.92
    );
  };

  const handleDownload = () => {
    if (!result) return;
    const base = fileName.replace(/\.[^.]+$/, "") || "resized";
    downloadBlob(result.blob, `${base}-${result.w}x${result.h}.${extForMime(format)}`);
  };

  const dims = targetDims();

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/*" onFile={onFile} label="Drop an image to resize" />

      {error && (
        <p className="rounded-lg border px-3 py-2 text-xs font-medium" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "var(--bg-surface)" }}>
          {error}
        </p>
      )}

      {img && (
        <>
          <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            {/* Options */}
            <div className="space-y-4">
              <div>
                <span className={labelCls} style={{ color: "var(--text-secondary)" }}>Mode</span>
                <div className="flex gap-2">
                  {(["pixels", "percent"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className="focus-ring flex-1 rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition"
                      style={{
                        borderColor: mode === m ? "var(--accent)" : "var(--border)",
                        backgroundColor: mode === m ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--bg-elevated)",
                        color: mode === m ? "var(--accent-text)" : "var(--text-muted)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "pixels" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} style={{ color: "var(--text-secondary)" }} htmlFor="rz-w">Width (px)</label>
                    <input id="rz-w" type="number" min={1} value={width} onChange={(e) => handleWidth(e.target.value)} className={inputCls}
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: "var(--text-secondary)" }} htmlFor="rz-h">Height (px)</label>
                    <input id="rz-h" type="number" min={1} value={height} onChange={(e) => handleHeight(e.target.value)} className={inputCls}
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
                  </div>
                </div>
              ) : (
                <div>
                  <label className={labelCls} style={{ color: "var(--text-secondary)" }} htmlFor="rz-p">Scale (%)</label>
                  <input id="rz-p" type="number" min={1} max={1000} value={percent} onChange={(e) => setPercent(e.target.value)} className={inputCls}
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
                </div>
              )}

              {mode === "pixels" && (
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={lock}
                    onChange={(e) => setLock(e.target.checked)}
                    className="focus-ring h-4 w-4 rounded" style={{ accentColor: "var(--accent)" }}
                  />
                  Lock aspect ratio
                </label>
              )}

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
              </div>

              <div>
                <span className={labelCls} style={{ color: "var(--text-secondary)" }}>Social presets</span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="focus-ring rounded-full border px-3 py-1.5 text-[11px] font-medium transition hover:-translate-y-0.5"
                      style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                    >
                      {p.label} <span style={{ color: "var(--text-subtle)" }}>{p.w}×{p.h}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                <span>Original: <strong style={{ color: "var(--text-secondary)" }}>{origW} × {origH}</strong></span>
                {dims && (
                  <span>New: <strong style={{ color: "var(--accent-text)" }}>{dims.w} × {dims.h}</strong></span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResize}
                disabled={!dims}
                className="focus-ring w-full rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                Resize Image
              </button>
            </div>

            {/* Preview */}
            <div className="flex flex-col gap-3">
              <div className="flex min-h-[220px] flex-1 items-center justify-center overflow-hidden rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={previewImgRef}
                  src={result ? result.url : undefined}
                  alt={result ? "Resized preview" : ""}
                  className={result ? "max-h-64 max-w-full rounded object-contain" : "hidden"}
                />
                {!result && (
                  <p className="text-center text-xs" style={{ color: "var(--text-subtle)" }}>
                    Your resized image will appear here.
                  </p>
                )}
              </div>
              {result && (
                <div className="space-y-2">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Result: <strong style={{ color: "var(--text-secondary)" }}>{result.w} × {result.h}px</strong>
                    {" · "}{formatBytes(result.size)}
                  </p>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Resized Image
                  </button>
                </div>
              )}
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
