"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import { loadImageFromFile, rgbToHex, rgbToHsl, themeAccent } from "@/components/design/imageUtils";

const MAX_DISPLAY = 640;
const MAG_SIZE = 132;
const MAG_ZOOM = 9; // shows a 15x15 px region

interface Pick {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
}

function makePick(r: number, g: number, b: number): Pick {
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);
  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    r, g, b,
  };
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

export default function ColorPickerClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [disp, setDisp] = useState({ w: 0, h: 0 });
  const [picked, setPicked] = useState<Pick | null>(null);
  const [history, setHistory] = useState<Pick[]>([]);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [hovering, setHovering] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magRef = useRef<HTMLCanvasElement>(null);
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
      setDisp({ w: Math.round(image.naturalWidth * s), h: Math.round(image.naturalHeight * s) });
      setPicked(null);
    } catch {
      setError("Could not read that image. Please try a PNG, JPEG, WebP or GIF file.");
    }
  }, []);

  // Draw base image whenever it changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imgRef.current;
    if (!canvas || !image) return;
    canvas.width = disp.w;
    canvas.height = disp.h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) ctx.drawImage(image, 0, 0, disp.w, disp.h);
  }, [disp, img]);

  const naturalAt = (dx: number, dy: number) => ({
    x: Math.max(0, Math.min((imgRef.current?.naturalWidth ?? 1) - 1, Math.round(dx / scale.current))),
    y: Math.max(0, Math.min((imgRef.current?.naturalHeight ?? 1) - 1, Math.round(dy / scale.current))),
  });

  const sample = (nx: number, ny: number): Pick | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return null;
    // drawImage scaled the natural image to display size; sample at display coords
    const dx = Math.round(nx * scale.current);
    const dy = Math.round(ny * scale.current);
    try {
      const data = ctx.getImageData(dx, dy, 1, 1).data;
      return makePick(data[0], data[1], data[2]);
    } catch {
      return null;
    }
  };

  const updateMagnifier = (dx: number, dy: number) => {
    const mag = magRef.current;
    const canvas = canvasRef.current;
    if (!mag || !canvas) return;
    mag.width = MAG_SIZE;
    mag.height = MAG_SIZE;
    const ctx = mag.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const region = Math.ceil(MAG_SIZE / MAG_ZOOM);
    ctx.clearRect(0, 0, MAG_SIZE, MAG_SIZE);
    ctx.drawImage(
      canvas,
      dx - region / 2, dy - region / 2, region, region,
      0, 0, MAG_SIZE, MAG_SIZE
    );
    // Crosshair on the center pixel
    ctx.strokeStyle = themeAccent();
    ctx.lineWidth = 2;
    const cell = MAG_SIZE / region;
    ctx.strokeRect(cell * Math.floor(region / 2), cell * Math.floor(region / 2), cell, cell);
  };

  const posInCanvas = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: Math.max(0, Math.min(disp.w, clientX - rect.left)),
      y: Math.max(0, Math.min(disp.h, clientY - rect.top)),
    };
  };

  const handleMove = (e: React.MouseEvent) => {
    const p = posInCanvas(e);
    updateMagnifier(p.x, p.y);
  };

  const handlePick = (e: React.MouseEvent | React.TouchEvent) => {
    const p = posInCanvas(e);
    const { x, y } = naturalAt(p.x, p.y);
    const pick = sample(x, y);
    if (pick) {
      setPicked(pick);
      setHistory((prev) => [pick, ...prev.filter((h) => h.hex !== pick.hex)].slice(0, 12));
      updateMagnifier(p.x, p.y);
    }
  };

  const handleCopy = async (text: string) => {
    const ok = await copyText(text);
    setCopied(ok ? text : "");
    if (ok) setTimeout(() => setCopied(""), 1500);
  };

  const valueRow = (label: string, value: string) => (
    <div className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
        <p className="truncate font-mono text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
      <button
        type="button"
        onClick={() => handleCopy(value)}
        className="focus-ring shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)", color: copied === value ? "var(--accent-text)" : "var(--text-secondary)" }}
      >
        {copied === value ? "Copied!" : "Copy"}
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/*" onFile={onFile} label="Drop an image to pick colors from" />

      {error && (
        <p className="rounded-lg border px-3 py-2 text-xs font-medium" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "var(--bg-surface)" }}>
          {error}
        </p>
      )}

      {img && (
        <div className="grid gap-4 rounded-xl border p-4 sm:p-5 lg:grid-cols-[1fr_260px]" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="flex justify-center overflow-x-auto">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMove}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onClick={handlePick}
              onTouchEnd={handlePick}
              className="max-w-full cursor-crosshair rounded-lg border"
              style={{ borderColor: "var(--border-strong)" }}
              aria-label="Image - click to pick a color"
            />
          </div>

          <div className="space-y-3">
            {/* Magnifier */}
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Magnifier</p>
              <div className="flex justify-center">
                <canvas
                  ref={magRef}
                  width={MAG_SIZE}
                  height={MAG_SIZE}
                  className="rounded-lg border"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)", opacity: hovering || picked ? 1 : 0.4 }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Picked color */}
            <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Picked color</p>
              {picked ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-12 w-12 shrink-0 rounded-lg border" style={{ backgroundColor: picked.hex, borderColor: "var(--border-strong)" }} />
                    <p className="font-mono text-lg font-bold" style={{ color: "var(--text-primary)" }}>{picked.hex}</p>
                  </div>
                  {valueRow("HEX", picked.hex)}
                  {valueRow("RGB", picked.rgb)}
                  {valueRow("HSL", picked.hsl)}
                </div>
              ) : (
                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>Click anywhere on the image to sample a color.</p>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Recent picks</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((h) => (
                    <button
                      key={h.hex}
                      type="button"
                      title={h.hex}
                      onClick={() => setPicked(h)}
                      className="focus-ring h-9 w-9 rounded-lg border transition hover:scale-110"
                      style={{ backgroundColor: h.hex, borderColor: picked?.hex === h.hex ? "var(--accent)" : "var(--border-strong)" }}
                      aria-label={`Pick ${h.hex}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
