"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import { loadImageFromFile, drawImageFit, downloadBlob, formatBytes } from "@/components/design/imageUtils";

const PNG_SIZES = [16, 32, 48, 180, 192, 512];
const ICO_SIZES = [16, 32, 48];

interface Generated {
  size: number;
  url: string;
  blob: Blob;
}

/** Build a multi-size favicon.ico (PNG-compressed entries) manually. */
function buildIco(entries: { size: number; png: ArrayBuffer }[]): Blob {
  const headerSize = 6 + 16 * entries.length;
  const total = headerSize + entries.reduce((s, e) => s + e.png.byteLength, 0);
  const buf = new ArrayBuffer(total);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);

  // ICONDIR
  view.setUint16(0, 0, true);              // reserved
  view.setUint16(2, 1, true);              // type: icon
  view.setUint16(4, entries.length, true); // count

  let offset = headerSize;
  entries.forEach((e, i) => {
    const base = 6 + i * 16;
    bytes[base] = e.size >= 256 ? 0 : e.size; // width
    bytes[base + 1] = e.size >= 256 ? 0 : e.size; // height
    bytes[base + 2] = 0; // color count
    bytes[base + 3] = 0; // reserved
    view.setUint16(base + 4, 1, true); // planes
    view.setUint16(base + 6, 32, true); // bit count
    view.setUint32(base + 8, e.png.byteLength, true); // bytes in resource
    view.setUint32(base + 12, offset, true); // image offset
    bytes.set(new Uint8Array(e.png), offset);
    offset += e.png.byteLength;
  });

  return new Blob([buf], { type: "image/x-icon" });
}

export default function FaviconGeneratorClient() {
  const [generated, setGenerated] = useState<Generated[]>([]);
  const [icoSize, setIcoSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [zipping, setZipping] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const urlsRef = useRef<string[]>([]);
  const icoBlobRef = useRef<Blob | null>(null);

  const revokeAll = useCallback(() => {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = [];
  }, []);

  useEffect(() => revokeAll, [revokeAll]);

  const onFile = useCallback(async ({ file, previewUrl: pu }: { file: File; previewUrl: string }) => {
    setError("");
    setWorking(true);
    try {
      const image = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");

      revokeAll();
      const made: Generated[] = [];
      const icoParts: { size: number; png: ArrayBuffer }[] = [];

      for (const size of PNG_SIZES) {
        drawImageFit(image, canvas, size, size);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/png");
        });
        const url = URL.createObjectURL(blob);
        urlsRef.current.push(url);
        made.push({ size, url, blob });
        if (ICO_SIZES.includes(size)) {
          icoParts.push({ size, png: await blob.arrayBuffer() });
        }
      }

      // Sort ICO entries ascending by size (convention)
      icoParts.sort((a, b) => a.size - b.size);
      const icoBlob = buildIco(icoParts);
      const icoObjectUrl = URL.createObjectURL(icoBlob);
      urlsRef.current.push(icoObjectUrl);

      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return pu;
      });
      setGenerated(made);
      icoBlobRef.current = icoBlob;
      setIcoSize(icoBlob.size);
      setFileName(file.name.replace(/\.[^.]+$/, "") || "favicon");
    } catch {
      URL.revokeObjectURL(pu);
      setError("Could not read that image. Please try a PNG, JPEG, WebP or GIF file.");
    } finally {
      setWorking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revokeAll]);

  const downloadPng = (g: Generated) => {
    downloadBlob(g.blob, `${fileName}-${g.size}x${g.size}.png`);
  };

  const downloadIco = () => {
    if (!icoBlobRef.current) return;
    downloadBlob(icoBlobRef.current, "favicon.ico");
  };

  const downloadZip = async () => {
    if (generated.length === 0 || !icoBlobRef.current) return;
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const g of generated) {
        zip.file(`${fileName}-${g.size}x${g.size}.png`, g.blob);
      }
      zip.file("favicon.ico", icoBlobRef.current);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${fileName}-favicons.zip`);
    } catch {
      setError("Failed to build the ZIP file. Try downloading the icons individually.");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImageDropzone accept="image/*" onFile={onFile} label="Drop your logo or icon (square works best)" />

      {error && (
        <p className="rounded-lg border px-3 py-2 text-xs font-medium" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "var(--bg-surface)" }}>
          {error}
        </p>
      )}

      {working && (
        <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>Generating favicons…</p>
      )}

      {generated.length > 0 && (
        <div className="space-y-4 rounded-xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          {/* Live previews */}
          <div>
            <p className="mb-2 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Live preview</p>
            <div className="flex flex-wrap items-end gap-4 rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              {generated.map((g) => (
                <div key={g.size} className="flex flex-col items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.url}
                    alt={`${g.size} px favicon`}
                    width={Math.min(g.size, 64)}
                    height={Math.min(g.size, 64)}
                    className="rounded"
                    style={{ imageRendering: g.size <= 48 ? "auto" : undefined }}
                  />
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-subtle)" }}>{g.size}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual downloads */}
          <div>
            <p className="mb-2 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Download individually</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {generated.map((g) => (
                <button
                  key={g.size}
                  type="button"
                  onClick={() => downloadPng(g)}
                  className="focus-ring flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  <span>PNG · {g.size}×{g.size}</span>
                  <span style={{ color: "var(--text-subtle)" }}>{formatBytes(g.blob.size)}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={downloadIco}
                className="focus-ring flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                style={{ borderColor: "var(--accent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent-text)" }}
              >
                <span>ICO · 16/32/48</span>
                <span style={{ color: "var(--text-subtle)" }}>{formatBytes(icoSize)}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadZip}
            disabled={zipping}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {zipping ? "Building ZIP…" : "Download All as ZIP (6 PNGs + ICO)"}
          </button>

          {previewUrl && (
            <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
              Tip: square logos with bold, simple shapes stay recognizable at 16 px. Upload a square image for the cleanest result.
            </p>
          )}
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
