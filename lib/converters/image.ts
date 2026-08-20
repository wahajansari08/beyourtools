/**
 * Browser-side image conversion engine.
 *
 * Supported paths (no server, no WASM):
 *   - Any canvas-readable format → JPG / PNG / WebP / AVIF  (Canvas.toBlob)
 *   - Any canvas-readable format → SVG  (wraps raster in <image> data-URI)
 *   - Any canvas-readable format → ICO  (minimal 1-image ICO container)
 *   - Any canvas-readable format → PDF  (jsPDF, loaded lazily)
 *   - Any canvas-readable format → GIF  (re-encoded as PNG, flagged)
 *   - Any canvas-readable format → BMP  (raw BMP built from ImageData)
 *
 * Canvas-readable in modern browsers: JPG, PNG, WebP, AVIF, GIF, BMP, SVG
 *
 * Formats that require WASM / server (HEIC, JXL, PSD, TGA, TIFF in some
 * browsers, ICO input) are detected and return a clear error with guidance.
 */

export interface ConvertImageResult {
  blob: Blob | null;
  /** Suggested download filename extension */
  ext: string;
  /** MIME type for the blob */
  mime: string;
  error: string | null;
  /** Non-fatal warning (e.g. GIF → PNG fallback) */
  warning: string | null;
}

// ─── MIME helpers ─────────────────────────────────────────────────────────────

const OUTPUT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  pdf: "application/pdf",
  tiff: "image/tiff",
  heic: "image/heic",
  jxl: "image/jxl",
  psd: "image/vnd.adobe.photoshop",
  tga: "image/x-tga",
};

/** Formats that the canvas cannot decode in any browser */
const WASM_ONLY_DECODE = new Set(["tiff", "heic", "heif", "jxl", "psd", "tga", "ico"]);

/** Formats we can't encode to in-browser (excluding our custom handlers) */
const WASM_ONLY_ENCODE = new Set(["tiff", "heic", "heif", "jxl", "psd", "tga"]);

// ─── Load image into a canvas ────────────────────────────────────────────────

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not decode image. The format may not be supported by your browser.")); };
    img.src = url;
  });
}

function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width  = img.naturalWidth  || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Encoding to ${mime} failed. Your browser may not support this output format.`));
      },
      mime,
      quality
    );
  });
}

// ─── BMP encoder ─────────────────────────────────────────────────────────────
// Builds a 24-bit uncompressed BMP from ImageData.

function buildBmp(imageData: ImageData): Blob {
  const { width, height, data } = imageData;
  const rowSize = Math.ceil((width * 3) / 4) * 4; // padded to 4 bytes
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;
  const buf = new ArrayBuffer(fileSize);
  const view = new DataView(buf);

  // BMP file header
  view.setUint8(0, 0x42); view.setUint8(1, 0x4d); // "BM"
  view.setUint32(2, fileSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, 54, true); // pixel data offset

  // BITMAPINFOHEADER
  view.setUint32(14, 40, true);  // header size
  view.setInt32 (18, width,  true);
  view.setInt32 (22, -height, true); // negative = top-down
  view.setUint16(26, 1, true);   // color planes
  view.setUint16(28, 24, true);  // bits per pixel
  view.setUint32(30, 0, true);   // compression (none)
  view.setUint32(34, pixelDataSize, true);
  view.setInt32 (38, 2835, true); // X px/meter (~72dpi)
  view.setInt32 (42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  // Pixel data (BGR order, bottom-up by convention but we used -height)
  const bytes = new Uint8Array(buf);
  for (let y = 0; y < height; y++) {
    const rowOffset = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      const dst = rowOffset + x * 3;
      bytes[dst]     = data[src + 2]; // B
      bytes[dst + 1] = data[src + 1]; // G
      bytes[dst + 2] = data[src];     // R
    }
  }

  return new Blob([buf], { type: "image/bmp" });
}

// ─── ICO encoder ─────────────────────────────────────────────────────────────
// Builds a minimal single-image ICO containing a 256×256 (or smaller) PNG.

async function buildIco(canvas: HTMLCanvasElement): Promise<Blob> {
  // Resize to 256×256 max (ICO standard sizes: 16, 32, 48, 64, 128, 256)
  const size = Math.min(256, canvas.width, canvas.height);
  const c2 = document.createElement("canvas");
  c2.width = c2.height = size;
  c2.getContext("2d")!.drawImage(canvas, 0, 0, size, size);

  const pngBlob = await canvasToBlob(c2, "image/png");
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());

  // ICO header: ICONDIR
  const buf = new ArrayBuffer(6 + 16 + pngBytes.length);
  const view = new DataView(buf);

  // ICONDIR
  view.setUint16(0, 0, true);    // reserved
  view.setUint16(2, 1, true);    // type: ICO
  view.setUint16(4, 1, true);    // image count

  // ICONDIRENTRY
  view.setUint8(6, size === 256 ? 0 : size); // width (0 = 256)
  view.setUint8(7, size === 256 ? 0 : size); // height
  view.setUint8(8, 0);           // color count (0 = no palette)
  view.setUint8(9, 0);           // reserved
  view.setUint16(10, 1, true);   // color planes
  view.setUint16(12, 32, true);  // bits per pixel
  view.setUint32(14, pngBytes.length, true); // image size
  view.setUint32(18, 22, true);  // offset (6 + 16)

  new Uint8Array(buf).set(pngBytes, 22);
  return new Blob([buf], { type: "image/x-icon" });
}

// ─── SVG wrapper ─────────────────────────────────────────────────────────────
// Produces an SVG that embeds the raster image as a data-URI.

async function buildSvg(canvas: HTMLCanvasElement): Promise<Blob> {
  const pngBlob = await canvasToBlob(canvas, "image/png");
  const dataUrl = await blobToDataUrl(pngBlob);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image xlink:href="${dataUrl}" x="0" y="0" width="${canvas.width}" height="${canvas.height}"/>
</svg>`;
  return new Blob([svg], { type: "image/svg+xml" });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
}

// ─── PDF export ──────────────────────────────────────────────────────────────
// Uses jsPDF loaded from a CDN script tag (injected once lazily).

declare global {
  interface Window {
    jspdf: any;
  }
}

let jsPdfLoading: Promise<void> | null = null;

function loadJsPdf(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Server side"));
  if (window.jspdf) return Promise.resolve();
  if (jsPdfLoading) return jsPdfLoading;
  jsPdfLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.integrity = "sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNTlrdUmTzrDgektczlKNRRhy5X5AAOnx5S09ydFYWWNSfYThS+L58wA==";
    script.crossOrigin = "anonymous";
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.head.appendChild(script);
  });
  return jsPdfLoading;
}

async function buildPdf(canvas: HTMLCanvasElement): Promise<Blob> {
  await loadJsPdf();
  const { jsPDF } = window.jspdf as any;
  const w = canvas.width;
  const h = canvas.height;

  // Page orientation and size in mm (at 96dpi: 1px ≈ 0.2646mm)
  const mmW = w * 0.2646;
  const mmH = h * 0.2646;

  const doc = new jsPDF({
    orientation: mmW >= mmH ? "landscape" : "portrait",
    unit: "mm",
    format: [mmW, mmH],
  });

  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  doc.addImage(dataUrl, "JPEG", 0, 0, mmW, mmH);
  const pdfBytes = doc.output("arraybuffer") as ArrayBuffer;
  return new Blob([pdfBytes], { type: "application/pdf" });
}

// ─── Main conversion entry point ─────────────────────────────────────────────

export async function convertImage(
  file: File,
  targetFormat: string,
  quality = 0.92
): Promise<ConvertImageResult> {

  const ext = targetFormat.toLowerCase();
  const mime = OUTPUT_MIME[ext] ?? "application/octet-stream";

  // ── Detect source format ──
  const srcExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const srcMime = file.type.toLowerCase();

  const isWasmOnlySource =
    WASM_ONLY_DECODE.has(srcExt) ||
    (srcMime.includes("tiff") && srcExt !== "svg") ||
    srcMime.includes("heic") ||
    srcMime.includes("heif") ||
    srcMime.includes("jxl") ||
    srcMime.includes("x-tga") ||
    srcMime.includes("adobe.photoshop");

  // ── Detect target format ──
  const isWasmOnlyTarget = WASM_ONLY_ENCODE.has(ext);

  if (isWasmOnlySource) {
    return {
      blob: null, ext, mime, warning: null,
      error: `Decoding ${srcExt.toUpperCase()} files is not yet supported natively in browsers. ` +
             `Upload a JPG, PNG, WebP, AVIF, GIF, BMP, or SVG file instead.`,
    };
  }

  if (isWasmOnlyTarget) {
    return {
      blob: null, ext, mime, warning: null,
      error: `Encoding to ${ext.toUpperCase()} is not supported in the browser. ` +
             `Try exporting to JPG, PNG, or WebP instead.`,
    };
  }

  // ── Load image ──
  let img: HTMLImageElement;
  try {
    img = await loadImageFromBlob(file);
  } catch (e) {
    return {
      blob: null, ext, mime, warning: null,
      error: e instanceof Error ? e.message : "Failed to load image.",
    };
  }

  const canvas = imageToCanvas(img);
  let warning: string | null = null;

  try {
    // ── Route by target format ──
    if (ext === "pdf") {
      const blob = await buildPdf(canvas);
      return { blob, ext: "pdf", mime: "application/pdf", warning, error: null };
    }

    if (ext === "svg") {
      const blob = await buildSvg(canvas);
      return { blob, ext: "svg", mime: "image/svg+xml", warning, error: null };
    }

    if (ext === "ico") {
      const blob = await buildIco(canvas);
      return { blob, ext: "ico", mime: "image/x-icon", warning, error: null };
    }

    if (ext === "bmp") {
      const ctx = canvas.getContext("2d")!;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const blob = buildBmp(imageData);
      return { blob, ext: "bmp", mime: "image/bmp", warning, error: null };
    }

    if (ext === "gif") {
      // Browsers cannot encode GIF via Canvas - we produce a PNG and warn.
      warning = "Browsers cannot encode GIF directly. The file has been saved as PNG instead. Rename it to .png if needed.";
      const blob = await canvasToBlob(canvas, "image/png", 1);
      return { blob, ext: "png", mime: "image/png", warning, error: null };
    }

    if (ext === "avif") {
      // Try AVIF; fall back to WebP if the browser doesn't support it.
      try {
        const blob = await canvasToBlob(canvas, "image/avif", quality);
        return { blob, ext: "avif", mime: "image/avif", warning, error: null };
      } catch {
        warning = "Your browser doesn't support AVIF encoding. The file has been saved as WebP instead.";
        const blob = await canvasToBlob(canvas, "image/webp", quality);
        return { blob, ext: "webp", mime: "image/webp", warning, error: null };
      }
    }

    // JPG / PNG / WebP
    const targetMime =
      ext === "jpg" || ext === "jpeg" ? "image/jpeg"
      : ext === "png" ? "image/png"
      : ext === "webp" ? "image/webp"
      : mime;

    const blob = await canvasToBlob(canvas, targetMime, quality);
    return { blob, ext: ext === "jpeg" ? "jpg" : ext, mime: targetMime, warning, error: null };

  } catch (e) {
    return {
      blob: null, ext, mime, warning: null,
      error: e instanceof Error ? e.message : "Conversion failed.",
    };
  }
}

/** Returns a suggested output filename given an input filename and target ext */
export function suggestFilename(inputName: string, targetExt: string): string {
  const base = inputName.replace(/\.[^/.]+$/, "");
  return `${base}.${targetExt}`;
}
