"use client";

// Central dispatcher — renders the correct tool UI based on slug.
// Each tool is a separate component to keep bundle chunks small.

import dynamic from "next/dynamic";

const tools: Record<string, React.ComponentType> = {
  "pdf-to-jpg":           dynamic(() => import("./tools/PdfToJpg")),
  "pdf-to-png":           dynamic(() => import("./tools/PdfToPng")),
  "jpg-to-pdf":           dynamic(() => import("./tools/ImagesToPdf")),
  "png-to-pdf":           dynamic(() => import("./tools/ImagesToPdf")),
  "pdf-to-text":          dynamic(() => import("./tools/PdfToText")),
  "pdf-to-json":          dynamic(() => import("./tools/PdfToJson")),
  "pdf-to-csv":           dynamic(() => import("./tools/PdfToCsv")),
  "pdf-to-html":          dynamic(() => import("./tools/PdfToHtml")),
  "html-to-pdf":          dynamic(() => import("./tools/HtmlToPdf")),
  "merge-pdf":            dynamic(() => import("./tools/MergePdf")),
  "split-pdf":            dynamic(() => import("./tools/SplitPdf")),
  "extract-pdf-pages":    dynamic(() => import("./tools/ExtractPages")),
  "delete-pdf-pages":     dynamic(() => import("./tools/DeletePages")),
  "rotate-pdf":           dynamic(() => import("./tools/RotatePdf")),
  "pdf-watermark":        dynamic(() => import("./tools/PdfWatermark")),
  "pdf-compressor":       dynamic(() => import("./tools/PdfCompressor")),
  "protect-pdf":          dynamic(() => import("./tools/ProtectPdf")),
  "unlock-pdf":           dynamic(() => import("./tools/UnlockPdf")),
  "pdf-metadata-viewer":  dynamic(() => import("./tools/PdfMetadataViewer")),
  "pdf-metadata-remover": dynamic(() => import("./tools/PdfMetadataRemover")),
  "pdf-repair":           dynamic(() => import("./tools/PdfRepair")),
  "pdf-compare":          dynamic(() => import("./tools/PdfCompare")),
  "pdf-editor":           dynamic(() => import("./tools/PdfEditor")),
  // Limited-capability tools
  "pdf-to-word":          dynamic(() => import("./tools/LimitedTool")),
  "word-to-pdf":          dynamic(() => import("./tools/LimitedTool")),
  "pdf-to-excel":         dynamic(() => import("./tools/LimitedTool")),
  "excel-to-pdf":         dynamic(() => import("./tools/LimitedTool")),
  "pdf-to-powerpoint":    dynamic(() => import("./tools/LimitedTool")),
  "powerpoint-to-pdf":    dynamic(() => import("./tools/LimitedTool")),
  "pdf-ocr":              dynamic(() => import("./tools/LimitedTool")),
};

export default function PdfToolClient({ slug }: { slug: string }) {
  const Tool = tools[slug];
  if (!Tool) return (
    <div
      className="rounded-lg border p-8 text-center text-sm"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
    >
      Tool not found.
    </div>
  );
  return <Tool />;
}
