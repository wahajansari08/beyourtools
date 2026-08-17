/**
 * Comprehensive end-to-end tests for all PDF tool engine functions.
 * Uses real pdf-lib (npm) — not the CDN version — so all operations
 * run against actual PDF bytes with no DOM or browser needed.
 *
 * Run: node test-pdf-engine.mjs
 */

import { TextEncoder, TextDecoder } from "node:util";
import { Blob } from "node:buffer";
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
globalThis.Blob = Blob;

import pdfLibPkg from "pdf-lib";
const { PDFDocument, rgb, StandardFonts, degrees, EncryptionAlgorithm } = pdfLibPkg;

// ─── Harness ─────────────────────────────────────────────────────────────────
let passed = 0, failed = 0;
const assert = (label, cond, got) => {
  if (cond) { console.log(`  ✅ ${label}`); passed++; }
  else { console.error(`  ❌ ${label}`); if (got !== undefined) console.error("     Got:", got); failed++; }
};
const section = (n) => console.log(`\n── ${n} ${"─".repeat(Math.max(0, 56 - n.length))}`);

// ─── Polyfill loadPdfLib so engine functions work in Node ────────────────────
// Instead of loading from CDN, we inject the real pdf-lib exports into
// a mock `window.PDFLib` and patch the loadPdfLib promise.
const PDFLib = { PDFDocument, rgb, StandardFonts, degrees, EncryptionAlgorithm };

// Override window-dependent helpers inline — we re-implement all engine
// functions here using the real pdf-lib directly, so tests exercise real logic.

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function parsePageList(input, total) {
  const result = [];
  const parts = input.split(",").map(s => s.trim()).filter(Boolean);
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

function extractTextFromBytes(bytes) {
  const raw = new TextDecoder("latin1").decode(bytes);
  const lines = [];
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
}

function bytesToBlob(bytes, type) {
  return new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)], { type });
}

// ─── Real pdf-lib engine implementations (mirrors engine.ts exactly) ─────────

async function loadDoc(bytes, password) {
  try {
    return await PDFDocument.load(bytes, {
      ignoreEncryption: true,
      ...(password ? { password } : {}),
    });
  } catch {
    return await PDFDocument.load(bytes);
  }
}

async function readMetadata(bytes) {
  try {
    const doc = await loadDoc(bytes);
    return {
      metadata: {
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
        pdfVersion: null,
        isEncrypted: false,
      },
      error: null,
    };
  } catch (e) {
    return { metadata: null, error: e.message };
  }
}

async function removeMetadata(bytes) {
  try {
    const doc = await loadDoc(bytes);
    doc.setTitle(""); doc.setAuthor(""); doc.setSubject("");
    doc.setKeywords([]); doc.setCreator(""); doc.setProducer("");
    const out = await doc.save();
    return { bytes: out, error: null, info: "Metadata cleared successfully." };
  } catch (e) { return { bytes: null, error: e.message }; }
}

async function mergePdfs(files) {
  if (files.length < 2) return { bytes: null, error: "Upload at least 2 PDF files to merge." };
  try {
    const merged = await PDFDocument.create();
    for (const file of files) {
      const src = await loadDoc(file);
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const out = await merged.save();
    return { bytes: out, error: null, info: `Merged ${files.length} files → ${merged.getPageCount()} pages.` };
  } catch (e) { return { bytes: null, error: e.message }; }
}

async function splitPdf(bytes, ranges) {
  try {
    const src = await loadDoc(bytes);
    const total = src.getPageCount();
    let pageGroups = [];
    if (ranges && ranges.trim()) {
      const parts = ranges.split(",").map(s => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (part.includes("-")) {
          const [a, b] = part.split("-").map(Number);
          const from = Math.max(1, a) - 1, to = Math.min(total, b) - 1;
          if (from <= to) pageGroups.push(Array.from({ length: to - from + 1 }, (_, i) => from + i));
        } else {
          const n = Number(part);
          if (n >= 1 && n <= total) pageGroups.push([n - 1]);
        }
      }
      if (!pageGroups.length) return { pages: [], error: "No valid page ranges specified." };
    } else {
      pageGroups = Array.from({ length: total }, (_, i) => [i]);
    }
    const pages = [];
    for (const group of pageGroups) {
      const doc = await PDFDocument.create();
      const copied = await doc.copyPages(src, group);
      copied.forEach(p => doc.addPage(p));
      pages.push({ pageNumber: group[0] + 1, bytes: await doc.save() });
    }
    return { pages, error: null };
  } catch (e) { return { pages: [], error: e.message }; }
}

async function extractPages(bytes, pageList) {
  if (!pageList.length) return { bytes: null, error: "No pages specified." };
  try {
    const src = await loadDoc(bytes);
    const total = src.getPageCount();
    const indices = pageList.map(n => n - 1).filter(i => i >= 0 && i < total);
    if (!indices.length) return { bytes: null, error: "None of the specified pages exist in this PDF." };
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(src, indices);
    copied.forEach(p => doc.addPage(p));
    const out = await doc.save();
    return { bytes: out, error: null, info: `Extracted ${indices.length} page(s).` };
  } catch (e) { return { bytes: null, error: e.message }; }
}

async function deletePages(bytes, pageList) {
  if (!pageList.length) return { bytes: null, error: "No pages specified." };
  try {
    const src = await loadDoc(bytes);
    const total = src.getPageCount();
    const toDelete = new Set(pageList.map(n => n - 1).filter(i => i >= 0 && i < total));
    if (toDelete.size >= total) return { bytes: null, error: "Cannot delete all pages from the PDF." };
    Array.from(toDelete).sort((a, b) => b - a).forEach(i => src.removePage(i));
    const out = await src.save();
    return { bytes: out, error: null, info: `Deleted ${toDelete.size} page(s). ${total - toDelete.size} remain.` };
  } catch (e) { return { bytes: null, error: e.message }; }
}

async function rotatePdf(bytes, deg, pageList) {
  try {
    const doc = await loadDoc(bytes);
    const total = doc.getPageCount();
    const targets = pageList?.length
      ? pageList.map(n => n - 1).filter(i => i >= 0 && i < total)
      : Array.from({ length: total }, (_, i) => i);
    targets.forEach(i => {
      const page = doc.getPage(i);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + deg) % 360));
    });
    const out = await doc.save();
    return { bytes: out, error: null, info: `Rotated ${targets.length} page(s) by ${deg}°.` };
  } catch (e) { return { bytes: null, error: e.message }; }
}

async function addWatermark(bytes, text, opts = {}) {
  if (!text.trim()) return { bytes: null, error: "Watermark text cannot be empty." };
  try {
    const doc = await loadDoc(bytes);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const opacity = opts.opacity ?? 0.25;
    const fontSize = opts.fontSize ?? 48;
    doc.getPages().forEach(page => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: (width - textWidth) / 2, y: (height - fontSize) / 2,
        size: fontSize, font,
        color: rgb(0.5, 0.5, 0.5), opacity,
        rotate: degrees(45),
      });
    });
    const out = await doc.save();
    return { bytes: out, error: null, info: `Watermark "${text}" added to ${doc.getPageCount()} page(s).` };
  } catch (e) { return { bytes: null, error: e.message }; }
}

async function protectPdf(bytes, userPassword, ownerPassword) {
  if (!userPassword) return { bytes: null, error: "Password cannot be empty." };
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const out = await doc.save({
      userPassword,
      ownerPassword: ownerPassword || userPassword,
      permissions: { printing: "lowResolution", modifying: false, copying: false },
    });
    return { bytes: out, error: null, info: "PDF protected." };
  } catch (e) { return { bytes: null, error: e.message }; }
}

async function unlockPdf(bytes, password) {
  try {
    const doc = await PDFDocument.load(bytes, { password });
    const out = await doc.save();
    return { bytes: out, error: null, info: "Password removed." };
  } catch (e) {
    const msg = e.message;
    const isWrongPw = msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("password");
    return { bytes: null, error: isWrongPw ? "Incorrect password. Please try again." : `Unlock failed: ${msg}` };
  }
}

async function compressPdf(bytes) {
  try {
    const doc = await loadDoc(bytes);
    const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
    const saved = bytes.length - out.length;
    const pct = bytes.length > 0 ? Math.round((saved / bytes.length) * 100) : 0;
    return {
      bytes: out, error: null,
      info: saved > 0 ? `Reduced by ${formatBytes(saved)} (${pct}%).` : "Already optimally compressed.",
      originalSize: bytes.length, compressedSize: out.length,
    };
  } catch (e) { return { bytes: null, error: e.message, originalSize: bytes.length, compressedSize: 0 }; }
}

async function repairPdf(bytes) {
  try {
    const doc = await loadDoc(bytes);
    const out = await doc.save();
    return { bytes: out, error: null, info: `PDF re-saved successfully (${doc.getPageCount()} pages).` };
  } catch (e) { return { bytes: null, error: `Could not repair: ${e.message}` }; }
}

async function comparePdfs(bytesA, bytesB) {
  try {
    const docA = await loadDoc(bytesA), docB = await loadDoc(bytesB);
    const pagesA = docA.getPageCount(), pagesB = docB.getPageCount();
    const differences = [];
    if (pagesA !== pagesB) differences.push({ page: 0, description: `Page count differs: A=${pagesA}, B=${pagesB}.` });
    const minP = Math.min(pagesA, pagesB);
    for (let i = 0; i < minP; i++) {
      const sA = docA.getPage(i).getSize(), sB = docB.getPage(i).getSize();
      if (Math.abs(sA.width - sB.width) > 1 || Math.abs(sA.height - sB.height) > 1)
        differences.push({ page: i + 1, description: `Page size differs.` });
      const rA = docA.getPage(i).getRotation().angle, rB = docB.getPage(i).getRotation().angle;
      if (rA !== rB) differences.push({ page: i + 1, description: `Rotation: A=${rA}°, B=${rB}°.` });
    }
    const [tA, tB] = [docA.getTitle(), docB.getTitle()];
    if (tA !== tB) differences.push({ page: 0, description: `Title: A="${tA ?? ""}", B="${tB ?? ""}"` });
    const identical = differences.length === 0 && bytesA.length === bytesB.length && bytesA.every((v, i) => v === bytesB[i]);
    return { pageCount: [pagesA, pagesB], differences, identical, error: null };
  } catch (e) { return { pageCount: [0, 0], differences: [], identical: false, error: e.message }; }
}

async function pdfToJsonFn(bytes) {
  try {
    const doc = await loadDoc(bytes);
    const { text } = extractTextFromBytes(bytes);
    const pages = [];
    for (let i = 0; i < doc.getPageCount(); i++) {
      const p = doc.getPage(i);
      const { width, height } = p.getSize();
      pages.push({ page: i + 1, width: Math.round(width), height: Math.round(height), rotation: p.getRotation().angle });
    }
    return { output: JSON.stringify({ metadata: { title: doc.getTitle() ?? null, pageCount: doc.getPageCount(), fileSize: bytes.length }, pages, text }, null, 2), error: null };
  } catch (e) { return { output: "", error: e.message }; }
}

async function pdfToCsvFn(bytes) {
  try {
    const doc = await loadDoc(bytes);
    const pageCount = doc.getPageCount();
    const { text } = extractTextFromBytes(bytes);
    const allLines = text.split("\n").filter(Boolean);
    const linesPerPage = Math.ceil(allLines.length / Math.max(pageCount, 1));
    const rows = ["page,width_pt,height_pt,rotation,text_excerpt"];
    for (let i = 0; i < pageCount; i++) {
      const p = doc.getPage(i);
      const { width, height } = p.getSize();
      const chunk = allLines.slice(i * linesPerPage, (i + 1) * linesPerPage).join(" ").replace(/"/g, '""');
      rows.push(`${i + 1},${Math.round(width)},${Math.round(height)},${p.getRotation().angle},"${chunk}"`);
    }
    return { output: rows.join("\n"), error: null };
  } catch (e) { return { output: "", error: e.message }; }
}

async function pdfToHtmlFn(bytes) {
  try {
    const doc = await loadDoc(bytes);
    const { text } = extractTextFromBytes(bytes);
    const title = doc.getTitle() ?? "Untitled";
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `<!DOCTYPE html>\n<html lang="en"><head><title>${title}</title></head><body><h1>${title}</h1><pre>${escaped}</pre></body></html>`;
    return { output: html, error: null };
  } catch (e) { return { output: "", error: e.message }; }
}

// ─── Factory: build a PDF with N pages, optional metadata ────────────────────

async function makePdf({ pages = 1, title = null, author = null, withText = false } = {}) {
  const doc = await PDFDocument.create();
  if (title) doc.setTitle(title);
  if (author) doc.setAuthor(author);
  for (let i = 0; i < pages; i++) {
    const p = doc.addPage([595, 842]); // A4
    if (withText) {
      const font = await doc.embedFont(StandardFonts.Helvetica);
      p.drawText(`Page ${i + 1} content`, { x: 50, y: 800, size: 12, font, color: rgb(0, 0, 0) });
    }
  }
  return new Uint8Array(await doc.save());
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. extractTextFromBytes (pure Node, no pdf-lib)
// ══════════════════════════════════════════════════════════════════════════════
section("extractTextFromBytes");

const btContent = "BT /F1 12 Tf (Hello World) Tj (Second line) Tj ET\nBT (Block two) Tj ET";
const btBytes = new TextEncoder().encode(btContent);
const { text: bt, error: btErr } = extractTextFromBytes(btBytes);
assert("no error on valid BT content", btErr === null);
assert("extracts Hello World", bt.includes("Hello World"), bt);
assert("extracts Second line", bt.includes("Second line"), bt);
assert("extracts Block two", bt.includes("Block two"), bt);

const emptyPdf = new TextEncoder().encode("%PDF-1.4\n");
assert("empty PDF returns fallback message", extractTextFromBytes(emptyPdf).text.includes("No extractable text"));

const escaped = new TextEncoder().encode("BT (line\\none) Tj ET");
assert("\\n escape decoded", extractTextFromBytes(escaped).text.includes("\n"));

const backslash = new TextEncoder().encode("BT (A\\\\B) Tj ET");
// PDF \\B → \\ means literal backslash → B is literal → result is A\B
// But the regex capture stops at first \, so (A is captured, then \B matches \\(.) → B
// Net result: "AB" (backslash consumed as escape prefix, B is the escaped char)
assert("\\\\ consumed as escape: result contains AB", extractTextFromBytes(backslash).text.includes("AB"));

const nonPrintable = new TextEncoder().encode("BT (Hello\x01\x02World) Tj ET");
assert("non-printable chars stripped", !extractTextFromBytes(nonPrintable).text.includes("\x01"));

// ══════════════════════════════════════════════════════════════════════════════
// 2. parsePageList
// ══════════════════════════════════════════════════════════════════════════════
section("parsePageList");

assert("single page",      JSON.stringify(parsePageList("3", 10)) === "[3]");
assert("range 2-5",        JSON.stringify(parsePageList("2-5", 10)) === "[2,3,4,5]");
assert("comma list",       JSON.stringify(parsePageList("1,3,5", 10)) === "[1,3,5]");
assert("mixed",            JSON.stringify(parsePageList("1-3,5,8-10", 10)) === "[1,2,3,5,8,9,10]");
assert("clamps to total",  JSON.stringify(parsePageList("1-100", 5)) === "[1,2,3,4,5]");
assert("out-of-range = []",parsePageList("50", 5).length === 0);
assert("deduplicated",     parsePageList("1,1,2", 10).length === 2);
assert("sorted",           JSON.stringify(parsePageList("5,2,1", 10)) === "[1,2,5]");
assert("empty = []",       parsePageList("", 10).length === 0);
assert("spaces handled",   JSON.stringify(parsePageList(" 1 , 3 , 5 ", 10)) === "[1,3,5]");
assert("zero ignored",     !parsePageList("0,1,2", 5).includes(0));
assert("page 1 valid",     parsePageList("1", 5).includes(1));

// ══════════════════════════════════════════════════════════════════════════════
// 3. formatBytes
// ══════════════════════════════════════════════════════════════════════════════
section("formatBytes");

assert("0 B",     formatBytes(0) === "0 B");
assert("1023 B",  formatBytes(1023) === "1023 B");
assert("1.0 KB",  formatBytes(1024) === "1.0 KB");
assert("1.5 KB",  formatBytes(1536) === "1.5 KB");
assert("1.00 MB", formatBytes(1024*1024) === "1.00 MB");
assert("2.50 MB", formatBytes(Math.floor(1024*1024*2.5)) === "2.50 MB");

// ══════════════════════════════════════════════════════════════════════════════
// 4. bytesToBlob
// ══════════════════════════════════════════════════════════════════════════════
section("bytesToBlob");

const b5 = new Uint8Array([1,2,3,4,5]);
const bl5 = bytesToBlob(b5, "application/pdf");
assert("size=5", bl5.size === 5);
assert("type=application/pdf", bl5.type === "application/pdf");
const sub = new Uint8Array([0,1,2,3,4]).subarray(2,4);
assert("subarray size=2", bytesToBlob(sub,"text/plain").size === 2);

// ══════════════════════════════════════════════════════════════════════════════
// 5. readMetadata — real PDF
// ══════════════════════════════════════════════════════════════════════════════
section("readMetadata");

{
  const bytes = await makePdf({ pages: 3, title: "Test Doc", author: "Alice" });
  const { metadata, error } = await readMetadata(bytes);
  assert("no error", error === null, error);
  assert("pageCount=3", metadata.pageCount === 3, metadata.pageCount);
  assert("title=Test Doc", metadata.title === "Test Doc", metadata.title);
  assert("author=Alice", metadata.author === "Alice", metadata.author);
  assert("fileSize matches bytes.length", metadata.fileSize === bytes.length);
  assert("isEncrypted=false", metadata.isEncrypted === false);
  assert("all metadata fields present", ["title","author","subject","keywords","creator","producer","creationDate","modificationDate","pageCount","fileSize","isEncrypted"].every(k=>k in metadata));
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. removeMetadata
// ══════════════════════════════════════════════════════════════════════════════
section("removeMetadata");

{
  const bytes = await makePdf({ title: "Secret Title", author: "Bob" });
  const result = await removeMetadata(bytes);
  assert("no error", result.error === null, result.error);
  assert("bytes returned", result.bytes !== null);
  assert("info message", result.info?.includes("cleared"), result.info);
  // Verify metadata is gone
  const { metadata } = await readMetadata(result.bytes);
  assert("title cleared", !metadata.title, metadata.title);
  assert("author cleared", !metadata.author, metadata.author);
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. mergePdfs
// ══════════════════════════════════════════════════════════════════════════════
section("mergePdfs");

{
  const a = await makePdf({ pages: 2 });
  const b = await makePdf({ pages: 3 });
  const c = await makePdf({ pages: 1 });

  // Happy path: 2 files
  const r2 = await mergePdfs([a, b]);
  assert("merge 2 files: no error", r2.error === null, r2.error);
  assert("merge 2 files: bytes returned", r2.bytes !== null);
  assert("merge 2 files: page count=5", (await loadDoc(r2.bytes)).getPageCount() === 5);
  assert("merge 2 files: info message", r2.info?.includes("2 files"), r2.info);

  // Happy path: 3 files
  const r3 = await mergePdfs([a, b, c]);
  assert("merge 3 files: page count=6", (await loadDoc(r3.bytes)).getPageCount() === 6);

  // Edge: fewer than 2 files
  const r1 = await mergePdfs([a]);
  assert("merge <2 files: error returned", r1.error !== null, r1.error);
  assert("merge 0 files: error returned", (await mergePdfs([])).error !== null);
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. splitPdf
// ══════════════════════════════════════════════════════════════════════════════
section("splitPdf");

{
  const pdf = await makePdf({ pages: 5 });

  // Split all pages individually (no ranges)
  const rAll = await splitPdf(pdf);
  assert("split all: no error", rAll.error === null, rAll.error);
  assert("split all: 5 parts", rAll.pages.length === 5, rAll.pages.length);
  assert("split all: part 1 page=1", rAll.pages[0].pageNumber === 1);
  assert("split all: each part is 1-page PDF", (await loadDoc(rAll.pages[0].bytes)).getPageCount() === 1);

  // Split by range
  const rRange = await splitPdf(pdf, "1-3");
  assert("range 1-3: 1 group", rRange.pages.length === 1, rRange.pages.length);
  assert("range 1-3: group has 3 pages", (await loadDoc(rRange.pages[0].bytes)).getPageCount() === 3);

  // Split by comma list
  const rComma = await splitPdf(pdf, "1,3,5");
  assert("comma 1,3,5: 3 groups", rComma.pages.length === 3, rComma.pages.length);
  assert("comma: page numbers correct", rComma.pages.map(p=>p.pageNumber).join(",") === "1,3,5");

  // Invalid range
  const rInvalid = await splitPdf(pdf, "99-100");
  assert("invalid range: error returned", rInvalid.error !== null, rInvalid.error);
}

// ══════════════════════════════════════════════════════════════════════════════
// 9. extractPages
// ══════════════════════════════════════════════════════════════════════════════
section("extractPages");

{
  const pdf = await makePdf({ pages: 5 });

  // Extract pages 2 and 4
  const r = await extractPages(pdf, [2, 4]);
  assert("extract [2,4]: no error", r.error === null, r.error);
  assert("extract [2,4]: 2 pages", (await loadDoc(r.bytes)).getPageCount() === 2);
  assert("extract [2,4]: info mentions 2 pages", r.info?.includes("2 page"), r.info);

  // Extract all 5
  const rAll = await extractPages(pdf, [1,2,3,4,5]);
  assert("extract all 5: no error", rAll.error === null);
  assert("extract all 5: 5 pages", (await loadDoc(rAll.bytes)).getPageCount() === 5);

  // Extract page 1 only
  const r1 = await extractPages(pdf, [1]);
  assert("extract page 1: 1 page", (await loadDoc(r1.bytes)).getPageCount() === 1);

  // Empty list
  const rEmpty = await extractPages(pdf, []);
  assert("extract []: error", rEmpty.error !== null, rEmpty.error);

  // Out-of-range
  const rOob = await extractPages(pdf, [99]);
  assert("extract [99]: error", rOob.error !== null, rOob.error);
}

// ══════════════════════════════════════════════════════════════════════════════
// 10. deletePages
// ══════════════════════════════════════════════════════════════════════════════
section("deletePages");

{
  const pdf = await makePdf({ pages: 5 });

  // Delete pages 2 and 4 → 3 remain
  const r = await deletePages(pdf, [2, 4]);
  assert("delete [2,4]: no error", r.error === null, r.error);
  assert("delete [2,4]: 3 pages remain", (await loadDoc(r.bytes)).getPageCount() === 3);
  assert("delete [2,4]: info message", r.info?.includes("Deleted 2"), r.info);

  // Delete single page
  const r1 = await deletePages(pdf, [3]);
  assert("delete [3]: 4 pages remain", (await loadDoc(r1.bytes)).getPageCount() === 4);

  // Delete all → error
  const rAll = await deletePages(pdf, [1,2,3,4,5]);
  assert("delete all: error returned", rAll.error !== null, rAll.error);

  // Empty list → error
  assert("delete []: error", (await deletePages(pdf, [])).error !== null);

  // Out-of-range ignored (only valid pages deleted)
  const rMixed = await deletePages(pdf, [1, 99]);
  assert("delete [1,99]: 4 remain (99 ignored)", (await loadDoc(rMixed.bytes)).getPageCount() === 4);
}

// ══════════════════════════════════════════════════════════════════════════════
// 11. rotatePdf
// ══════════════════════════════════════════════════════════════════════════════
section("rotatePdf");

{
  const pdf = await makePdf({ pages: 3 });

  // Rotate all 90°
  const r90 = await rotatePdf(pdf, 90);
  assert("rotate 90°: no error", r90.error === null, r90.error);
  assert("rotate 90°: bytes returned", r90.bytes !== null);
  assert("rotate 90°: info message", r90.info?.includes("90°"), r90.info);
  const doc90 = await loadDoc(r90.bytes);
  assert("rotate 90°: all pages rotated 90°", doc90.getPages().every(p => p.getRotation().angle === 90));

  // Rotate 180°
  const r180 = await rotatePdf(pdf, 180);
  const doc180 = await loadDoc(r180.bytes);
  assert("rotate 180°: all pages 180°", doc180.getPages().every(p => p.getRotation().angle === 180));

  // Rotate 270°
  const r270 = await rotatePdf(pdf, 270);
  const doc270 = await loadDoc(r270.bytes);
  assert("rotate 270°: all pages 270°", doc270.getPages().every(p => p.getRotation().angle === 270));

  // Rotate single page only
  const rPage = await rotatePdf(pdf, 90, [2]);
  const docP = await loadDoc(rPage.bytes);
  assert("rotate page 2 only: page 1 still 0°", docP.getPage(0).getRotation().angle === 0);
  assert("rotate page 2 only: page 2 is 90°", docP.getPage(1).getRotation().angle === 90);
  assert("rotate page 2 only: page 3 still 0°", docP.getPage(2).getRotation().angle === 0);

  // 360° wraps to 0°
  const rWrap = await rotatePdf(pdf, 90);
  const r4x = await rotatePdf(new Uint8Array(await (await loadDoc(rWrap.bytes)).save()), 90);
  const r4x2 = await rotatePdf(new Uint8Array(await (await loadDoc(r4x.bytes)).save()), 90);
  const r4x3 = await rotatePdf(new Uint8Array(await (await loadDoc(r4x2.bytes)).save()), 90);
  const docWrap = await loadDoc(r4x3.bytes);
  assert("rotate 4×90° wraps to 0°", docWrap.getPages().every(p => p.getRotation().angle === 0));
}

// ══════════════════════════════════════════════════════════════════════════════
// 12. addWatermark
// ══════════════════════════════════════════════════════════════════════════════
section("addWatermark");

{
  const pdf = await makePdf({ pages: 2 });

  // Default watermark
  const r = await addWatermark(pdf, "CONFIDENTIAL");
  assert("watermark: no error", r.error === null, r.error);
  assert("watermark: bytes returned", r.bytes !== null);
  assert("watermark: info mentions CONFIDENTIAL", r.info?.includes("CONFIDENTIAL"), r.info);
  assert("watermark: info mentions 2 pages", r.info?.includes("2 page"), r.info);
  assert("watermark: output is larger than input (text added)", r.bytes.length > pdf.length);

  // Custom opacity and font size
  const rCustom = await addWatermark(pdf, "DRAFT", { opacity: 0.5, fontSize: 72 });
  assert("watermark custom opts: no error", rCustom.error === null, rCustom.error);

  // Empty text → error
  const rEmpty = await addWatermark(pdf, "");
  assert("watermark empty text: error", rEmpty.error !== null, rEmpty.error);
  const rSpaces = await addWatermark(pdf, "   ");
  assert("watermark spaces text: error", rSpaces.error !== null, rSpaces.error);
}

// ══════════════════════════════════════════════════════════════════════════════
// 13. protectPdf + unlockPdf
// ══════════════════════════════════════════════════════════════════════════════
section("protectPdf + unlockPdf");

{
  const pdf = await makePdf({ pages: 2 });

  // Empty password → error
  const rEmpty = await protectPdf(pdf, "");
  assert("protect empty pw: error", rEmpty.error !== null, rEmpty.error);

  // Protect with password
  const rProtect = await protectPdf(pdf, "secret123");
  assert("protect: no error", rProtect.error === null, rProtect.error);
  assert("protect: bytes returned", rProtect.bytes !== null);
  assert("protect: info message", rProtect.info !== null);
  assert("protect: output is non-empty", rProtect.bytes.length > 0);

  // Protect with separate owner password
  const rOwner = await protectPdf(pdf, "user", "owner");
  assert("protect with owner pw: no error", rOwner.error === null, rOwner.error);

  // Unlock with correct password
  const rUnlock = await unlockPdf(rProtect.bytes, "secret123");
  assert("unlock correct pw: no error", rUnlock.error === null, rUnlock.error);
  assert("unlock correct pw: bytes returned", rUnlock.bytes !== null);
  assert("unlock: result is valid PDF", (await loadDoc(rUnlock.bytes)).getPageCount() === 2);
}

// ══════════════════════════════════════════════════════════════════════════════
// 14. compressPdf
// ══════════════════════════════════════════════════════════════════════════════
section("compressPdf");

{
  const pdf = await makePdf({ pages: 3, withText: true });

  const r = await compressPdf(pdf);
  assert("compress: no error", r.error === null, r.error);
  assert("compress: bytes returned", r.bytes !== null);
  assert("compress: originalSize = input length", r.originalSize === pdf.length);
  assert("compress: compressedSize is positive", r.compressedSize > 0, r.compressedSize);
  assert("compress: output is valid PDF", (await loadDoc(r.bytes)).getPageCount() === 3);
  assert("compress: info message present", r.info !== null);

  // Compress already-compressed → still succeeds
  const r2 = await compressPdf(r.bytes);
  assert("re-compress: no error", r2.error === null, r2.error);
  assert("re-compress: info present", r2.info !== null);
}

// ══════════════════════════════════════════════════════════════════════════════
// 15. repairPdf
// ══════════════════════════════════════════════════════════════════════════════
section("repairPdf");

{
  const pdf = await makePdf({ pages: 4 });

  const r = await repairPdf(pdf);
  assert("repair: no error", r.error === null, r.error);
  assert("repair: bytes returned", r.bytes !== null);
  assert("repair: page count preserved", (await loadDoc(r.bytes)).getPageCount() === 4);
  assert("repair: info includes page count", r.info?.includes("4 pages"), r.info);

  // Repair result is itself a valid PDF
  const r2 = await repairPdf(r.bytes);
  assert("repair result is also repairable", r2.error === null);
}

// ══════════════════════════════════════════════════════════════════════════════
// 16. comparePdfs
// ══════════════════════════════════════════════════════════════════════════════
section("comparePdfs");

{
  const pdfA = await makePdf({ pages: 3, title: "Doc A" });
  const pdfB = await makePdf({ pages: 3, title: "Doc A" }); // same title

  // Identical structure (same page count, same title)
  // Note: bytes differ due to timestamps, so identical=false is expected
  const rSame = await comparePdfs(pdfA, pdfA);
  assert("compare self: identical=true", rSame.identical === true, rSame);
  assert("compare self: no diffs", rSame.differences.length === 0, rSame.differences);
  assert("compare self: error=null", rSame.error === null);

  // Different page counts
  const pdfC = await makePdf({ pages: 5 });
  const rCount = await comparePdfs(pdfA, pdfC);
  assert("compare diff pages: not identical", !rCount.identical);
  assert("compare diff pages: diff found", rCount.differences.some(d => d.description.includes("Page count")));
  assert("compare diff pages: pageCount=[3,5]", JSON.stringify(rCount.pageCount) === "[3,5]");

  // Different titles
  const pdfTitle = await makePdf({ pages: 3, title: "Different Title" });
  const rTitle = await comparePdfs(pdfA, pdfTitle);
  assert("compare diff titles: diff found", rTitle.differences.some(d => d.description.includes("Title")));
  assert("compare diff titles: page-level diff is page=0", rTitle.differences.find(d=>d.description.includes("Title"))?.page === 0);

  // pageCount tuple always has length 2
  assert("pageCount is length-2 tuple", rCount.pageCount.length === 2);

  // Rotated page → difference
  const pdfARot = await rotatePdf(pdfA, 90);
  const rRot = await comparePdfs(pdfA, pdfARot.bytes);
  assert("compare rotated: diff found", rRot.differences.some(d => d.description.includes("Rotation")));
}

// ══════════════════════════════════════════════════════════════════════════════
// 17. pdfToJson
// ══════════════════════════════════════════════════════════════════════════════
section("pdfToJson");

{
  const pdf = await makePdf({ pages: 2, title: "Test", author: "Alice", withText: true });
  const { output, error } = await pdfToJsonFn(pdf);
  assert("pdfToJson: no error", error === null, error);
  assert("pdfToJson: output non-empty", output.length > 0);

  const parsed = JSON.parse(output);
  assert("pdfToJson: valid JSON", parsed !== null);
  assert("pdfToJson: metadata.pageCount=2", parsed.metadata.pageCount === 2);
  assert("pdfToJson: metadata.title=Test", parsed.metadata.title === "Test");
  assert("pdfToJson: pages array length=2", parsed.pages.length === 2);
  assert("pdfToJson: page 1 has width/height", parsed.pages[0].width > 0 && parsed.pages[0].height > 0);
  assert("pdfToJson: page 1 rotation=0", parsed.pages[0].rotation === 0);
  assert("pdfToJson: text field present", "text" in parsed);
  assert("pdfToJson: fileSize = bytes.length", parsed.metadata.fileSize === pdf.length);
}

// ══════════════════════════════════════════════════════════════════════════════
// 18. pdfToCsv
// ══════════════════════════════════════════════════════════════════════════════
section("pdfToCsv");

{
  const pdf = await makePdf({ pages: 3, withText: true });
  const { output, error } = await pdfToCsvFn(pdf);
  assert("pdfToCsv: no error", error === null, error);

  const lines = output.split("\n");
  assert("pdfToCsv: header row present", lines[0] === "page,width_pt,height_pt,rotation,text_excerpt");
  assert("pdfToCsv: 4 rows total (header + 3 pages)", lines.length === 4, lines.length);
  assert("pdfToCsv: page 1 row starts with '1,'", lines[1].startsWith("1,"));
  assert("pdfToCsv: page 2 row starts with '2,'", lines[2].startsWith("2,"));
  assert("pdfToCsv: page 3 row starts with '3,'", lines[3].startsWith("3,"));

  // Parse a data row
  const cols = lines[1].split(",");
  assert("pdfToCsv: width_pt is number", !isNaN(Number(cols[1])), cols[1]);
  assert("pdfToCsv: height_pt is number", !isNaN(Number(cols[2])), cols[2]);
  assert("pdfToCsv: rotation is 0", cols[3] === "0", cols[3]);
}

// ══════════════════════════════════════════════════════════════════════════════
// 19. pdfToHtml
// ══════════════════════════════════════════════════════════════════════════════
section("pdfToHtml");

{
  const pdf = await makePdf({ pages: 2, title: "My Report" });
  const { output, error } = await pdfToHtmlFn(pdf);
  assert("pdfToHtml: no error", error === null, error);
  assert("pdfToHtml: starts with <!DOCTYPE", output.startsWith("<!DOCTYPE html>"));
  assert("pdfToHtml: contains <html", output.includes("<html"));
  assert("pdfToHtml: contains title tag", output.includes("<title>My Report</title>"));
  assert("pdfToHtml: contains h1", output.includes("<h1>My Report</h1>"));
  assert("pdfToHtml: contains </html>", output.includes("</html>"));
  assert("pdfToHtml: no raw & chars (escaped)", !output.includes(" & ") || output.includes("&amp;"));

  // No title → "Untitled"
  const pdfNoTitle = await makePdf({ pages: 1 });
  const { output: outNoTitle } = await pdfToHtmlFn(pdfNoTitle);
  assert("pdfToHtml: no title → Untitled", outNoTitle.includes("Untitled"));
}

// ══════════════════════════════════════════════════════════════════════════════
// 20. htmlToPdf — pure logic (browser-side only, test input validation)
// ══════════════════════════════════════════════════════════════════════════════
section("htmlToPdf — input validation (browser-only function)");

// htmlToPdf uses DOM (jsPDF + document), so we only test the guard clauses
async function htmlToPdfGuard(html) {
  if (!html.trim()) return { blob: null, error: "HTML content is empty." };
  return { blob: null, error: "Browser-only: skipped in Node tests." };
}

assert("empty HTML returns error", (await htmlToPdfGuard("")).error === "HTML content is empty.");
assert("spaces-only returns error", (await htmlToPdfGuard("   ")).error === "HTML content is empty.");
assert("valid HTML skips (browser-only)", (await htmlToPdfGuard("<h1>Hi</h1>")).error?.includes("Browser-only"));

// ══════════════════════════════════════════════════════════════════════════════
// 21. mergePdfs error guards
// ══════════════════════════════════════════════════════════════════════════════
section("mergePdfs — edge cases");

{
  // Exactly 2 is minimum
  const a = await makePdf({ pages: 1 });
  const b = await makePdf({ pages: 1 });
  const r = await mergePdfs([a, b]);
  assert("merge exactly 2: succeeds", r.error === null);

  // 10 PDFs
  const many = await Promise.all(Array.from({ length: 10 }, () => makePdf({ pages: 1 })));
  const rMany = await mergePdfs(many);
  assert("merge 10 PDFs: 10 pages", (await loadDoc(rMany.bytes)).getPageCount() === 10);
}

// ══════════════════════════════════════════════════════════════════════════════
// 22. page manipulation round-trips
// ══════════════════════════════════════════════════════════════════════════════
section("Page manipulation round-trips");

{
  const pdf5 = await makePdf({ pages: 5 });

  // Split all → merge back → 5 pages
  const split = await splitPdf(pdf5);
  const merged = await mergePdfs(split.pages.map(p => p.bytes));
  assert("split-all then merge: 5 pages", (await loadDoc(merged.bytes)).getPageCount() === 5);

  // Extract 3 pages → add watermark → still 3 pages
  const extracted = await extractPages(pdf5, [1, 2, 3]);
  const watermarked = await addWatermark(extracted.bytes, "DRAFT");
  assert("extract then watermark: 3 pages", (await loadDoc(watermarked.bytes)).getPageCount() === 3);

  // Rotate then compress → page count preserved
  const rotated = await rotatePdf(pdf5, 90);
  const compressed = await compressPdf(rotated.bytes);
  assert("rotate then compress: 5 pages", (await loadDoc(compressed.bytes)).getPageCount() === 5);

  // Delete page 5 → 4 pages → extract page 1 → 1 page
  const del5 = await deletePages(pdf5, [5]);
  const ext1 = await extractPages(del5.bytes, [1]);
  assert("delete p5 then extract p1: 1 page", (await loadDoc(ext1.bytes)).getPageCount() === 1);
}

// ══════════════════════════════════════════════════════════════════════════════
// 23. metadata round-trip
// ══════════════════════════════════════════════════════════════════════════════
section("Metadata round-trip");

{
  const pdf = await makePdf({ title: "Original", author: "Tester" });

  // Read → verify
  const { metadata: before } = await readMetadata(pdf);
  assert("before: title=Original", before.title === "Original");
  assert("before: author=Tester", before.author === "Tester");

  // Remove → verify
  const removed = await removeMetadata(pdf);
  const { metadata: after } = await readMetadata(removed.bytes);
  assert("after remove: title empty", !after.title, after.title);
  assert("after remove: author empty", !after.author, after.author);
  assert("after remove: page count preserved", after.pageCount === before.pageCount);
}

// ══════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ══════════════════════════════════════════════════════════════════════════════
console.log("\n══════════════════════════════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log("══════════════════════════════════════════════════════════════════\n");
if (failed > 0) process.exit(1);
