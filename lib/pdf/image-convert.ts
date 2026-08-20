/**
 * PDF ↔ image conversion helpers (browser-only).
 *
 * PDF → JPG / PNG  : Uses pdf.js (loaded from CDN) to render each page
 *                    to a canvas, then exports as image blobs.
 *
 * JPG / PNG → PDF  : Uses jsPDF (loaded from CDN) to embed images into
 *                    a new PDF document.
 *
 * HTML → PDF       : Uses jsPDF html() plugin.
 */

declare global {
  interface Window {
    pdfjsLib: any;
    jspdf: any;
  }
}

// ─── CDN loaders ──────────────────────────────────────────────────────────────

let _pdfjsPromise: Promise<any> | null = null;

export function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("Server-side"));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.crossOrigin = "anonymous";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error("Failed to load pdf.js"));
    document.head.appendChild(s);
  });
  return _pdfjsPromise;
}

let _jsPdfPromise: Promise<any> | null = null;

export function loadJsPdf(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("Server-side"));
  if (window.jspdf) return Promise.resolve(window.jspdf);
  if (_jsPdfPromise) return _jsPdfPromise;
  _jsPdfPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.crossOrigin = "anonymous";
    s.onload = () => resolve(window.jspdf);
    s.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.head.appendChild(s);
  });
  return _jsPdfPromise;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageImageResult {
  page: number;
  blob: Blob;
  width: number;
  height: number;
}

export interface PdfFromImagesResult {
  blob: Blob | null;
  error: string | null;
  pageCount: number;
}

// ─── PDF → Images (pdf.js) ────────────────────────────────────────────────────

export async function pdfToImages(
  bytes: Uint8Array,
  format: "jpeg" | "png" = "jpeg",
  scale = 2.0
): Promise<{ pages: PageImageResult[]; error: string | null }> {
  try {
    const pdfjsLib = await loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const pages: PageImageResult[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width  = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;

      const mime = format === "jpeg" ? "image/jpeg" : "image/png";
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))), mime, 0.92)
      );
      pages.push({ page: i, blob, width: canvas.width, height: canvas.height });
    }
    return { pages, error: null };
  } catch (e) {
    return { pages: [], error: e instanceof Error ? e.message : "PDF render failed" };
  }
}

// ─── Images → PDF (jsPDF) ────────────────────────────────────────────────────

export async function imagesToPdf(files: File[]): Promise<PdfFromImagesResult> {
  if (!files.length) return { blob: null, error: "No images selected.", pageCount: 0 };
  try {
    const { jsPDF } = await loadJsPdf();

    const readFile = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("FileReader error"));
        reader.readAsDataURL(file);
      });

    const getImageDimensions = (dataUrl: string): Promise<{ w: number; h: number }> =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.src = dataUrl;
      });

    let doc: any = null;

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const dataUrl = await readFile(file);
      const { w, h } = await getImageDimensions(dataUrl);

      // Convert px → mm (96dpi → 25.4mm/inch)
      const mmW = (w / 96) * 25.4;
      const mmH = (h / 96) * 25.4;
      const imgFormat = file.type.includes("png") ? "PNG" : "JPEG";

      if (!doc) {
        doc = new jsPDF({
          orientation: mmW >= mmH ? "landscape" : "portrait",
          unit: "mm",
          format: [mmW, mmH],
        });
      } else {
        doc.addPage([mmW, mmH], mmW >= mmH ? "landscape" : "portrait");
      }
      doc.addImage(dataUrl, imgFormat, 0, 0, mmW, mmH);
    }

    const pdfBytes = doc.output("arraybuffer") as ArrayBuffer;
    return {
      blob: new Blob([pdfBytes], { type: "application/pdf" }),
      error: null,
      pageCount: files.length,
    };
  } catch (e) {
    return { blob: null, error: e instanceof Error ? e.message : "Image to PDF failed", pageCount: 0 };
  }
}

// ─── HTML → PDF (jsPDF) ──────────────────────────────────────────────────────

export async function htmlToPdf(htmlContent: string): Promise<{ blob: Blob | null; error: string | null }> {
  if (!htmlContent.trim()) return { blob: null, error: "HTML content is empty." };
  try {
    const { jsPDF } = await loadJsPdf();
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    // Create a hidden iframe to render the HTML, then use jsPDF html()
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;background:#fff;color:#000;font-family:Georgia,serif;padding:32px;box-sizing:border-box;";
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    await new Promise<void>((resolve, reject) => {
      doc.html(container, {
        callback: (d: any) => { resolve(); },
        x: 10, y: 10, width: 190, windowWidth: 794,
      });
      // Fallback timeout
      setTimeout(resolve, 5000);
    });

    document.body.removeChild(container);
    const pdfBytes = doc.output("arraybuffer") as ArrayBuffer;
    return { blob: new Blob([pdfBytes], { type: "application/pdf" }), error: null };
  } catch (e) {
    return { blob: null, error: e instanceof Error ? e.message : "HTML to PDF failed" };
  }
}
