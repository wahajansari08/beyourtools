"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import { loadImageFromFile, downloadBlob, themeAccent } from "@/components/design/imageUtils";

const ASPECTS: { label: string; ratio: number }[] = [
  { label: "Free", ratio: 0 },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "16:9", ratio: 16 / 9 },
];

const MAX_DISPLAY = 560;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const labelCls = "mb-1 block text-xs font-semibold";

export default function ImageCropperClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [disp, setDisp] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<Rect | null>(null);
  const [aspect, setAspect] = useState(0);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outRef = useRef<HTMLCanvasElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const scale = useRef(1);

  const onFile = useCallback(async ({ file, previewUrl }: { file: File; previewUrl: string }) => {
    URL.revokeObjectURL(previewUrl);
    setError("");
    try {
      const image = await loadImageFromFile(file);
      const s = Math.min(MAX_DISPLAY / image.naturalWidth, MAX_DISPLAY / image.naturalHeight, 1);
      scale.current = s;
      imgRef.current = image;
      setImg(image);
      setFileName(file.name);
      setDisp({ w: Math.round(image.naturalWidth * s), h: Math.round(image.naturalHeight * s) });
      setCrop(null);
      setResultUrl(null);
    } catch {
      setError("Could not read that image. Please try a PNG, JPEG, WebP or GIF file.");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  // ── Draw base image + crop overlay ─────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imgRef.current;
    if (!canvas || !image) return;
    canvas.width = disp.w;
    canvas.height = disp.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, disp.w, disp.h);
    ctx.drawImage(image, 0, 0, disp.w, disp.h);

    if (crop) {
      // Darken outside the selection
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, disp.w, crop.y);
      ctx.fillRect(0, crop.y + crop.h, disp.w, disp.h - crop.y - crop.h);
      ctx.fillRect(0, crop.y, crop.x, crop.h);
      ctx.fillRect(crop.x + crop.w, crop.y, disp.w - crop.x - crop.w, crop.h);
      // Selection border + handles
      ctx.strokeStyle = themeAccent();
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
      ctx.setLineDash([]);
      ctx.fillStyle = themeAccent();
      const corners: [number, number][] = [
        [crop.x, crop.y],
        [crop.x + crop.w, crop.y],
        [crop.x, crop.y + crop.h],
        [crop.x + crop.w, crop.y + crop.h],
      ];
      for (const [cx, cy] of corners) {
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [disp, crop]);

  useEffect(() => {
    draw();
  }, [draw]);

  // ── Pointer interaction ────────────────────────────────────────────────────
  const posInCanvas = (e: React.PointerEvent): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(disp.w, e.clientX - rect.left)),
      y: Math.max(0, Math.min(disp.h, e.clientY - rect.top)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const p = posInCanvas(e);
    dragStart.current = p;
    setCrop({ x: p.x, y: p.y, w: 0, h: 0 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const p = posInCanvas(e);
    const start = dragStart.current;
    let x = Math.min(start.x, p.x);
    let y = Math.min(start.y, p.y);
    let w = Math.abs(p.x - start.x);
    let h = Math.abs(p.y - start.y);

    if (aspect > 0 && w > 0 && h > 0) {
      // Constrain to the aspect ratio based on the dominant dimension
      if (w / h > aspect) {
        w = h * aspect;
      } else {
        h = w / aspect;
      }
      // Anchor at the start corner
      x = p.x < start.x ? start.x - w : start.x;
      y = p.y < start.y ? start.y - h : start.y;
    }
    setCrop({ x, y, w, h });
  };

  const onPointerUp = () => {
    dragStart.current = null;
    setCrop((c) => {
      if (!c || c.w < 4 || c.h < 4) return null;
      return c;
    });
  };

  const changeAspect = (ratio: number) => {
    setAspect(ratio);
    setCrop(null);
  };

  // Natural-pixel readout
  const natural = crop
    ? {
        w: Math.round(crop.w / scale.current),
        h: Math.round(crop.h / scale.current),
      }
    : null;

  const handleApply = () => {
    const image = imgRef.current;
    const canvas = outRef.current;
    if (!image || !canvas || !crop || !natural) return;
    const sx = Math.round(crop.x / scale.current);
    const sy = Math.round(crop.y / scale.current);
    canvas.width = natural.w;
    canvas.height = natural.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(image, sx, sy, natural.w, natural.h, 0, 0, natural.w, natural.h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultSize({ w: natural.w, h: natural.h });
    }, format, 0.92);
    // Make the cropped result the new working image for re-cropping
    const dataUrl = canvas.toDataURL(format, 0.92);
    const next = new Image();
    next.onload = () => {
      const s = Math.min(MAX_DISPLAY / next.naturalWidth, MAX_DISPLAY / next.naturalHeight, 1);
      scale.current = s;
      imgRef.current = next;
      setImg(next);
      setDisp({ w: Math.round(next.naturalWidth * s), h: Math.round(next.naturalHeight * s) });
      setCrop(null);
    };
    next.src = dataUrl;
  };

  const handleDownload = () => {
    const canvas = outRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const base = fileName.replace(/\.[^.]+$/, "") || "cropped";
      downloadBlob(blob, `${base}-cropped.${format === "image/png" ? "png" : "jpg"}`);
    }, format, 0.92);
  };

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/*" onFile={onFile} label="Drop an image to crop" />

      {error && (
        <p className="rounded-lg border px-3 py-2 text-xs font-medium" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "var(--bg-surface)" }}>
          {error}
        </p>
      )}

      {img && (
        <div className="space-y-4 rounded-xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div>
            <span className={labelCls} style={{ color: "var(--text-secondary)" }}>Aspect ratio</span>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => changeAspect(a.ratio)}
                  className="focus-ring rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
                  style={{
                    borderColor: aspect === a.ratio ? "var(--accent)" : "var(--border)",
                    backgroundColor: aspect === a.ratio ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--bg-elevated)",
                    color: aspect === a.ratio ? "var(--accent-text)" : "var(--text-muted)",
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center overflow-x-auto">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="max-w-full cursor-crosshair rounded-lg border"
              style={{ borderColor: "var(--border-strong)", touchAction: "none" }}
              aria-label="Image crop area - drag to select"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {natural ? (
                <>Selection: <strong style={{ color: "var(--accent-text)" }}>{natural.w} × {natural.h} px</strong></>
              ) : (
                "Drag across the image to draw a crop box."
              )}
            </p>
            <div className="flex gap-2">
              {(["image/png", "image/jpeg"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormat(m)}
                  className="focus-ring rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
                  style={{
                    borderColor: format === m ? "var(--accent)" : "var(--border)",
                    backgroundColor: format === m ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--bg-elevated)",
                    color: format === m ? "var(--accent-text)" : "var(--text-muted)",
                  }}
                >
                  {m === "image/png" ? "PNG" : "JPEG"}
                </button>
              ))}
              <button
                type="button"
                onClick={handleApply}
                disabled={!crop}
                className="focus-ring rounded-lg px-4 py-1.5 text-xs font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                Apply Crop
              </button>
            </div>
          </div>

          {resultUrl && (
            <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <div className="flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Cropped result" className="max-h-48 max-w-full rounded object-contain" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Cropped: <strong style={{ color: "var(--text-secondary)" }}>{resultSize.w} × {resultSize.h} px</strong>
                </p>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="focus-ring flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Cropped Image
                </button>
              </div>
            </div>
          )}

          <canvas ref={outRef} className="hidden" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
