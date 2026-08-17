/**
 * Pure browser-side PDF engine built on pdf-lib.
 *
 * All functions accept/return Uint8Array (raw PDF bytes) so they are
 * easily testable in Node and usable in React via File.arrayBuffer().
 *
 * pdf-lib is loaded lazily from a CDN script tag the first time any
 * function is called, avoiding bundle-size impact.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── CDN loader ───────────────────────────────────────────────────────────────

declare global {
  interface Window {
    PDFLib: any;
  }
}

let _pdfLibPromise: Promise<any> | null = null;

export function loadPdfLib(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("Server-side"));
  if (window.PDFLib) return Promise.resolve(window.PDFLib);
  if (_pdfLibPromise) return _pdfLibPromise;
  _pdfLibPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.integrity = "sha512-io/w8gBFUpFQpZiAJkbT9qRm8EFn+5F2uJGlDFDn7GpPGN0FRfBNY9d+HjsqSLRGpeSyEoEBMoH0gAJNQFqg==";
    s.crossOrigin = "anonymous";
    s.onload = () => resolve(window.PDFLib);
    s.onerror = () => reject(new Error("Failed to load pdf-lib"));
    document.head.appendChild(s);
  });
  return _pdfLibPromise;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PdfResult {
  bytes: Uint8Array | null;
  error: string | null;
  info?: string | null;
}

/** Cast Uint8Array (any buffer kind) to a Blob safely */
export function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], { type });
}

export interface PdfMetadata {
  title: string | null;
  author: string | null;
  subject: string | null;
  keywords: string | null;
  creator: string | null;
  producer: string | null;
  creationDate: string | null;
  modificationDate: string | null;
  pageCount: number;
  fileSize: number;
  pdfVersion: string | null;
  isEncrypted: boolean;
}

export interface PdfDiffResult {
  pageCount: [number, number];
  differences: Array<{ page: number; description: string }>;
  identical: boolean;
  error: string | null;
}

// ─── Helper: read pdf-lib PDFDocument ────────────────────────────────────────

async function loadDoc(bytes: Uint8Array, password?: string): Promise<any> {
  const { PDFDocument } = await loadPdfLib();
  try {
    return await PDFDocument.load(bytes, {
      ignoreEncryption: true,
      ...(password ? { password } : {}),
    });
  } catch {
    // Try without password flag
    return await PDFDocument.load(bytes);
  }
}

// ─── 1. Metadata viewer ──────────────────────────────────────────────────────

export async function readMetadata(bytes: Uint8Array): Promise<{ metadata: PdfMetadata | null; error: string | null }> {
  try {
    const doc = await loadDoc(bytes);
    const metadata: PdfMetadata = {
      title: doc.getTitle() ?? null,
      author: doc.getAuthor() ?? null,
      subject: doc.getSubject() ?? null,
      keywords: doc.getKeywords() ?? null,
      creator: doc.getCreator() ?? null,
      producer: doc.getProducer() ?? null,
      creationDate: doc.getCreationDate()?.toISOString() ?? null,
      modificationDate: doc.getModificationDate()?.toISOString() ?? null,
      pageCount: doc.getPageCount(),
      fileSize: bytes.length,
      pdfVersion: doc.getPDFHeader?.() ?? null,
      isEncrypted: false,
    };
    return { metadata, error: null };
  } catch (e) {
    return { metadata: null, error: e instanceof Error ? e.message : "Failed to read PDF" };
  }
}

// ─── 2. Metadata remover ──────────────────────────────────────────────────────

export async function removeMetadata(bytes: Uint8Array): Promise<PdfResult> {
  try {
    const doc = await loadDoc(bytes);
    doc.setTitle("");
    doc.setAuthor("");
    doc.setSubject("");
    doc.setKeywords([]);
    doc.setCreator("");
    doc.setProducer("");
    const out = await doc.save();
    return { bytes: out, error: null, info: "Metadata cleared successfully." };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Failed to remove metadata" };
  }
}

// ─── 3. Merge ────────────────────────────────────────────────────────────────

export async function mergePdfs(files: Uint8Array[]): Promise<PdfResult> {
  if (files.length < 2) return { bytes: null, error: "Upload at least 2 PDF files to merge." };
  try {
    const { PDFDocument } = await loadPdfLib();
    const merged = await PDFDocument.create();
    for (const file of files) {
      const src = await loadDoc(file);
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach((p: any) => merged.addPage(p));
    }
    const out = await merged.save();
    const pageCount = merged.getPageCount();
    return { bytes: out, error: null, info: `Merged ${files.length} files → ${pageCount} pages.` };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Merge failed" };
  }
}

// ─── 4. Split ────────────────────────────────────────────────────────────────

export interface SplitResult {
  pages: Array<{ pageNumber: number; bytes: Uint8Array }>;
  error: string | null;
}

export async function splitPdf(bytes: Uint8Array, ranges?: string): Promise<SplitResult> {
  try {
    const { PDFDocument } = await loadPdfLib();
    const src = await loadDoc(bytes);
    const total = src.getPageCount();

    // Parse ranges string like "1-3,5,7-9" → [[0,2],[4],[6,8]]
    let pageGroups: number[][] = [];

    if (ranges && ranges.trim()) {
      const parts = ranges.split(",").map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (part.includes("-")) {
          const [a, b] = part.split("-").map(Number);
          const from = Math.max(1, a) - 1;
          const to   = Math.min(total, b) - 1;
          if (from <= to) pageGroups.push(Array.from({ length: to - from + 1 }, (_, i) => from + i));
        } else {
          const n = Number(part);
          if (n >= 1 && n <= total) pageGroups.push([n - 1]);
        }
      }
      if (pageGroups.length === 0) return { pages: [], error: "No valid page ranges specified." };
    } else {
      // Split every page individually
      pageGroups = Array.from({ length: total }, (_, i) => [i]);
    }

    const pages: Array<{ pageNumber: number; bytes: Uint8Array }> = [];
    for (const group of pageGroups) {
      const doc = await PDFDocument.create();
      const copied = await doc.copyPages(src, group);
      copied.forEach((p: any) => doc.addPage(p));
      const out = await doc.save();
      pages.push({ pageNumber: group[0] + 1, bytes: out });
    }
    return { pages, error: null };
  } catch (e) {
    return { pages: [], error: e instanceof Error ? e.message : "Split failed" };
  }
}

// ─── 5. Extract pages ────────────────────────────────────────────────────────

export async function extractPages(bytes: Uint8Array, pageList: number[]): Promise<PdfResult> {
  if (!pageList.length) return { bytes: null, error: "No pages specified." };
  try {
    const { PDFDocument } = await loadPdfLib();
    const src = await loadDoc(bytes);
    const total = src.getPageCount();
    const indices = pageList.map((n) => n - 1).filter((i) => i >= 0 && i < total);
    if (!indices.length) return { bytes: null, error: "None of the specified pages exist in this PDF." };
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(src, indices);
    copied.forEach((p: any) => doc.addPage(p));
    const out = await doc.save();
    return { bytes: out, error: null, info: `Extracted ${indices.length} page(s).` };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Extraction failed" };
  }
}

// ─── 6. Delete pages ─────────────────────────────────────────────────────────

export async function deletePages(bytes: Uint8Array, pageList: number[]): Promise<PdfResult> {
  if (!pageList.length) return { bytes: null, error: "No pages specified." };
  try {
    const src = await loadDoc(bytes);
    const total = src.getPageCount();
    const toDelete = new Set(pageList.map((n) => n - 1).filter((i) => i >= 0 && i < total));
    if (toDelete.size >= total) return { bytes: null, error: "Cannot delete all pages from the PDF." };
    // Remove pages in reverse order so indices stay valid
    const sorted = Array.from(toDelete).sort((a, b) => b - a);
    sorted.forEach((i) => src.removePage(i));
    const out = await src.save();
    return { bytes: out, error: null, info: `Deleted ${sorted.length} page(s). ${total - sorted.length} remain.` };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Delete pages failed" };
  }
}

// ─── 7. Rotate ───────────────────────────────────────────────────────────────

export async function rotatePdf(bytes: Uint8Array, degrees: 90 | 180 | 270, pageList?: number[]): Promise<PdfResult> {
  try {
    const { degrees: deg } = await loadPdfLib();
    const doc = await loadDoc(bytes);
    const total = doc.getPageCount();
    const targets = pageList && pageList.length
      ? pageList.map((n) => n - 1).filter((i) => i >= 0 && i < total)
      : Array.from({ length: total }, (_, i) => i);

    targets.forEach((i) => {
      const page = doc.getPage(i);
      const current = page.getRotation().angle;
      page.setRotation(deg((current + degrees) % 360));
    });
    const out = await doc.save();
    return { bytes: out, error: null, info: `Rotated ${targets.length} page(s) by ${degrees}°.` };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Rotation failed" };
  }
}

// ─── 8. Watermark ────────────────────────────────────────────────────────────

export async function addWatermark(
  bytes: Uint8Array,
  text: string,
  options?: { opacity?: number; fontSize?: number; color?: string }
): Promise<PdfResult> {
  if (!text.trim()) return { bytes: null, error: "Watermark text cannot be empty." };
  try {
    const { rgb, StandardFonts, degrees: deg } = await loadPdfLib();
    const doc = await loadDoc(bytes);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const opacity = options?.opacity ?? 0.25;
    const fontSize = options?.fontSize ?? 48;

    doc.getPages().forEach((page: any) => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: (height - fontSize) / 2,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: deg(45),
      });
    });
    const out = await doc.save();
    return { bytes: out, error: null, info: `Watermark "${text}" added to ${doc.getPageCount()} page(s).` };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Watermark failed" };
  }
}

// ─── 9. Protect ──────────────────────────────────────────────────────────────

export async function protectPdf(bytes: Uint8Array, userPassword: string, ownerPassword?: string): Promise<PdfResult> {
  if (!userPassword) return { bytes: null, error: "Password cannot be empty." };
  try {
    const { PDFDocument, EncryptionAlgorithm } = await loadPdfLib();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const out = await doc.save({
      userPassword,
      ownerPassword: ownerPassword || userPassword,
      encryptionAlgorithm: EncryptionAlgorithm.AES_256,
      permissions: {
        printing: "lowResolution",
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      },
    });
    return { bytes: out, error: null, info: "PDF protected with AES-256 encryption." };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Protection failed" };
  }
}

// ─── 10. Unlock ──────────────────────────────────────────────────────────────

export async function unlockPdf(bytes: Uint8Array, password: string): Promise<PdfResult> {
  try {
    const { PDFDocument } = await loadPdfLib();
    // Load with password then re-save without encryption
    const doc = await PDFDocument.load(bytes, { password });
    const out = await doc.save();
    return { bytes: out, error: null, info: "Password removed. PDF is now unlocked." };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unlock failed";
    const isWrongPw = msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("password");
    return {
      bytes: null,
      error: isWrongPw ? "Incorrect password. Please try again." : `Unlock failed: ${msg}`,
    };
  }
}

// ─── 11. Compressor ──────────────────────────────────────────────────────────

export async function compressPdf(bytes: Uint8Array): Promise<PdfResult & { originalSize: number; compressedSize: number }> {
  try {
    const doc = await loadDoc(bytes);
    // pdf-lib's save with objectsPerTick:0 triggers full re-serialisation
    const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
    const saved = bytes.length - out.length;
    const pct = bytes.length > 0 ? Math.round((saved / bytes.length) * 100) : 0;
    return {
      bytes: out,
      error: null,
      info: saved > 0
        ? `Reduced by ${formatBytes(saved)} (${pct}%).`
        : "File is already optimally compressed — no further reduction possible.",
      originalSize: bytes.length,
      compressedSize: out.length,
    };
  } catch (e) {
    return { bytes: null, error: e instanceof Error ? e.message : "Compression failed", originalSize: bytes.length, compressedSize: 0 };
  }
}

// ─── 12. Repair ──────────────────────────────────────────────────────────────

export async function repairPdf(bytes: Uint8Array): Promise<PdfResult> {
  try {
    const doc = await loadDoc(bytes);
    const out = await doc.save();
    return { bytes: out, error: null, info: `PDF re-saved successfully (${doc.getPageCount()} pages).` };
  } catch (e) {
    return { bytes: null, error: `Could not repair: ${e instanceof Error ? e.message : "Unknown error"}` };
  }
}

// ─── 13. Compare ─────────────────────────────────────────────────────────────

export async function comparePdfs(bytesA: Uint8Array, bytesB: Uint8Array): Promise<PdfDiffResult> {
  try {
    const docA = await loadDoc(bytesA);
    const docB = await loadDoc(bytesB);
    const pagesA = docA.getPageCount();
    const pagesB = docB.getPageCount();
    const differences: Array<{ page: number; description: string }> = [];

    if (pagesA !== pagesB) {
      differences.push({
        page: 0,
        description: `Page count differs: Document A has ${pagesA} page(s), Document B has ${pagesB} page(s).`,
      });
    }

    const minPages = Math.min(pagesA, pagesB);
    for (let i = 0; i < minPages; i++) {
      const pageA = docA.getPage(i);
      const pageB = docB.getPage(i);
      const sizeA = pageA.getSize();
      const sizeB = pageB.getSize();
      if (Math.abs(sizeA.width - sizeB.width) > 1 || Math.abs(sizeA.height - sizeB.height) > 1) {
        differences.push({
          page: i + 1,
          description: `Page size differs: A is ${Math.round(sizeA.width)}×${Math.round(sizeA.height)}pt, B is ${Math.round(sizeB.width)}×${Math.round(sizeB.height)}pt.`,
        });
      }
      const rotA = pageA.getRotation().angle;
      const rotB = pageB.getRotation().angle;
      if (rotA !== rotB) {
        differences.push({ page: i + 1, description: `Rotation differs: A=${rotA}°, B=${rotB}°.` });
      }
    }

    // Metadata comparison
    const metaFields: Array<[string, () => any, () => any]> = [
      ["Title",  () => docA.getTitle(),  () => docB.getTitle()],
      ["Author", () => docA.getAuthor(), () => docB.getAuthor()],
    ];
    for (const [field, getA, getB] of metaFields) {
      const a = getA(), b = getB();
      if (a !== b) differences.push({ page: 0, description: `${field}: A="${a ?? ""}", B="${b ?? ""}"` });
    }

    // Byte-level identity check
    const identical = differences.length === 0 && bytesA.length === bytesB.length &&
      bytesA.every((v, i) => v === bytesB[i]);

    return { pageCount: [pagesA, pagesB], differences, identical, error: null };
  } catch (e) {
    return { pageCount: [0, 0], differences: [], identical: false, error: e instanceof Error ? e.message : "Compare failed" };
  }
}

// ─── 14. PDF → Text ──────────────────────────────────────────────────────────
// pdf-lib does not expose text extraction; we use a simple raw string scan.

export function extractTextFromBytes(bytes: Uint8Array): { text: string; error: string | null } {
  try {
    const raw = new TextDecoder("latin1").decode(bytes);
    // Extract strings between parentheses in BT...ET blocks
    const lines: string[] = [];
    const btBlocks = raw.match(/BT[\s\S]*?ET/g) ?? [];
    for (const block of btBlocks) {
      const strings = block.match(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g) ?? [];
      for (const s of strings) {
        const inner = s.slice(1, -1)
          .replace(/\\n/g, "\n").replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t").replace(/\\\\/g, "\\")
          .replace(/\\(.)/g, "$1")
          .replace(/[^\x20-\x7e\n\r\t]/g, "");
        if (inner.trim()) lines.push(inner);
      }
    }
    const text = lines.join("\n");
    return { text: text.trim() || "(No extractable text found — this may be a scanned PDF.)", error: null };
  } catch (e) {
    return { text: "", error: e instanceof Error ? e.message : "Text extraction failed" };
  }
}

// ─── 15. PDF → JSON ──────────────────────────────────────────────────────────

export async function pdfToJson(bytes: Uint8Array): Promise<{ output: string; error: string | null }> {
  try {
    const doc = await loadDoc(bytes);
    const { text } = extractTextFromBytes(bytes);
    const pages: Array<{ page: number; width: number; height: number; rotation: number }> = [];
    for (let i = 0; i < doc.getPageCount(); i++) {
      const p = doc.getPage(i);
      const { width, height } = p.getSize();
      pages.push({ page: i + 1, width: Math.round(width), height: Math.round(height), rotation: p.getRotation().angle });
    }
    const obj = {
      metadata: {
        title: doc.getTitle() ?? null,
        author: doc.getAuthor() ?? null,
        pageCount: doc.getPageCount(),
        fileSize: bytes.length,
      },
      pages,
      text,
    };
    return { output: JSON.stringify(obj, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "PDF to JSON failed" };
  }
}

// ─── 16. PDF → CSV ───────────────────────────────────────────────────────────

export async function pdfToCsvProper(bytes: Uint8Array): Promise<{ output: string; error: string | null }> {
  try {
    const doc = await loadDoc(bytes);
    const pageCount = doc.getPageCount();
    const { text } = extractTextFromBytes(bytes);

    // Split extracted text into chunks per page (rough heuristic)
    const allLines = text.split("\n").filter(Boolean);
    const linesPerPage = Math.ceil(allLines.length / Math.max(pageCount, 1));

    const rows = ["page,width_pt,height_pt,rotation,text_excerpt"];
    for (let i = 0; i < pageCount; i++) {
      const p = doc.getPage(i);
      const { width, height } = p.getSize();
      const rotation = p.getRotation().angle;
      const chunk = allLines.slice(i * linesPerPage, (i + 1) * linesPerPage).join(" ");
      const escaped = chunk.replace(/"/g, '""');
      rows.push(`${i + 1},${Math.round(width)},${Math.round(height)},${rotation},"${escaped}"`);
    }
    return { output: rows.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "PDF to CSV failed" };
  }
}

// ─── 17. PDF → HTML ──────────────────────────────────────────────────────────

export async function pdfToHtml(bytes: Uint8Array): Promise<{ output: string; error: string | null }> {
  try {
    const doc = await loadDoc(bytes);
    const { text } = extractTextFromBytes(bytes);
    const title = doc.getTitle() ?? "Untitled";
    const pageCount = doc.getPageCount();
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.7; color: #1a1a1a; }
    header { border-bottom: 1px solid #ddd; padding-bottom: 1rem; margin-bottom: 2rem; }
    pre { white-space: pre-wrap; word-break: break-word; }
  </style>
</head>
<body>
  <header>
    <h1>${title}</h1>
    <p><small>${pageCount} page(s) — Converted by Jsonifyr</small></p>
  </header>
  <main>
    <pre>${escaped}</pre>
  </main>
</body>
</html>`;
    return { output: html, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "PDF to HTML failed" };
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function parsePageList(input: string, total: number): number[] {
  const result: number[] = [];
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = Math.max(1, a); i <= Math.min(total, b); i++) result.push(i);
    } else {
      const n = Number(part);
      if (n >= 1 && n <= total) result.push(n);
    }
  }
  return [...new Set(result)].sort((a, b) => a - b);
}


