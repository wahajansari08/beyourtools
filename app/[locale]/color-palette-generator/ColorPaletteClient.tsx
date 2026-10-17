"use client";

import { useCallback, useRef, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import { loadImageFromFile, downloadBlob, rgbToHex } from "@/components/design/imageUtils";

const PALETTE_SIZE = 6;
const SAMPLE_MAX = 96; // downscale target for sampling

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Simple frequency-based quantization: bucket similar colors, rank by count. */
function extractPalette(img: HTMLImageElement): string[] {
  const canvas = document.createElement("canvas");
  const s = Math.min(1, SAMPLE_MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * s));
  const h = Math.max(1, Math.round(img.naturalHeight * s));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  // Bucket key: 4 bits per channel (4096 buckets)
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 16) {
    // sample every 4th pixel for speed
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue; // skip transparent
    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    const bkt = buckets.get(key);
    if (bkt) {
      bkt.count += 1;
      bkt.r += r;
      bkt.g += g;
      bkt.b += b;
    } else {
      buckets.set(key, { count: 1, r, g, b });
    }
  }

  const ranked = [...buckets.values()]
    .map((b) => ({
      count: b.count,
      r: Math.round(b.r / b.count),
      g: Math.round(b.g / b.count),
      b: Math.round(b.b / b.count),
    }))
    .sort((a, b) => b.count - a.count);

  // Pick colors spread apart in RGB space so near-duplicates don't dominate
  const picked: { r: number; g: number; b: number }[] = [];
  const MIN_DIST = 70;
  for (const c of ranked) {
    if (picked.length >= PALETTE_SIZE) break;
    const far = picked.every(
      (p) => Math.sqrt((p.r - c.r) ** 2 + (p.g - c.g) ** 2 + (p.b - c.b) ** 2) >= MIN_DIST
    );
    if (far) picked.push(c);
  }
  // Fill remaining slots with the next most frequent colors regardless of distance
  for (const c of ranked) {
    if (picked.length >= PALETTE_SIZE) break;
    if (!picked.includes(c)) picked.push(c);
  }

  return picked.map((p) => rgbToHex(p.r, p.g, p.b));
}

export default function ColorPaletteClient() {
  const [palette, setPalette] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onFile = useCallback(async ({ file, previewUrl: pu }: { file: File; previewUrl: string }) => {
    setError("");
    setWorking(true);
    try {
      const image = await loadImageFromFile(file);
      imgRef.current = image;
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return pu;
      });
      // Let the UI paint before the (fast) quantization runs
      setTimeout(() => {
        try {
          setPalette(extractPalette(image));
        } catch {
          setError("Could not analyze that image.");
        }
        setWorking(false);
      }, 30);
    } catch {
      URL.revokeObjectURL(pu);
      setError("Could not read that image. Please try a PNG, JPEG, WebP or GIF file.");
      setWorking(false);
    }
  }, []);

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopied(id);
      setTimeout(() => setCopied(""), 1500);
    }
  };

  const cssVars = `:root {\n${palette.map((hex, i) => `  --color-${i + 1}: ${hex};`).join("\n")}\n}`;

  const handleDownloadStrip = () => {
    if (palette.length === 0) return;
    const SW = 140;
    const SH = 140;
    const LABEL_H = 36;
    const canvas = document.createElement("canvas");
    canvas.width = SW * palette.length;
    canvas.height = SH + LABEL_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    palette.forEach((hex, i) => {
      ctx.fillStyle = hex;
      ctx.fillRect(i * SW, 0, SW, SH);
      ctx.fillStyle = "#1f2937";
      ctx.font = "600 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(hex, i * SW + SW / 2, SH + 24);
    });
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "color-palette.png");
    }, "image/png");
  };

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/*" onFile={onFile} label="Drop an image to extract its palette" />

      {error && (
        <p className="rounded-lg border px-3 py-2 text-xs font-medium" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "var(--bg-surface)" }}>
          {error}
        </p>
      )}

      {working && (
        <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>Analyzing colors…</p>
      )}

      {palette.length > 0 && (
        <div className="space-y-4 rounded-xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          {/* Swatch grid */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {palette.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => handleCopy(hex, hex)}
                className="focus-ring group overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5"
                style={{ borderColor: "var(--border-strong)" }}
                title={`Copy ${hex}`}
              >
                <span className="block h-20 w-full sm:h-24" style={{ backgroundColor: hex }} />
                <span className="block px-2 py-1.5 font-mono text-[11px] font-semibold" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  {copied === hex ? "Copied!" : hex}
                </span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCopy(cssVars, "css")}
              className="focus-ring rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            >
              {copied === "css" ? "CSS Variables Copied!" : "Copy All as CSS Variables"}
            </button>
            <button
              type="button"
              onClick={() => handleCopy(palette.join(", "), "list")}
              className="focus-ring rounded-lg border px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
            >
              {copied === "list" ? "Copied!" : "Copy HEX List"}
            </button>
            <button
              type="button"
              onClick={handleDownloadStrip}
              className="focus-ring rounded-lg border px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
            >
              Download Palette PNG
            </button>
          </div>

          {/* Preview + CSS output */}
          <div className="grid gap-3 sm:grid-cols-2">
            {previewUrl && (
              <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Source image" className="max-h-48 w-full object-cover" />
              </div>
            )}
            <pre className="overflow-x-auto rounded-lg border p-3 font-mono text-[11px] leading-relaxed" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
              {cssVars}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
