"use client";

import { usePathname } from "next/navigation";
import { getPdfTool } from "@/lib/pdf-tools-config";

const ALTERNATIVES: Record<string, { name: string; url: string }[]> = {
  "pdf-to-word":       [{ name: "Adobe Acrobat Online (free)", url: "https://www.adobe.com/acrobat/online/pdf-to-word.html" }, { name: "Smallpdf", url: "https://smallpdf.com/pdf-to-word" }],
  "word-to-pdf":       [{ name: "LibreOffice (desktop, free)", url: "https://www.libreoffice.org" }, { name: "Microsoft Word (File → Export)", url: "https://microsoft.com/office" }],
  "pdf-to-excel":      [{ name: "Adobe Acrobat Online", url: "https://www.adobe.com/acrobat/online/pdf-to-excel.html" }, { name: "ILovePDF", url: "https://www.ilovepdf.com/pdf_to_excel" }],
  "excel-to-pdf":      [{ name: "LibreOffice Calc (File → Export as PDF)", url: "https://www.libreoffice.org" }, { name: "Microsoft Excel (File → Export)", url: "https://microsoft.com/office" }],
  "pdf-to-powerpoint": [{ name: "Adobe Acrobat Online", url: "https://www.adobe.com/acrobat/online/pdf-to-ppt.html" }, { name: "ILovePDF", url: "https://www.ilovepdf.com/pdf_to_powerpoint" }],
  "powerpoint-to-pdf": [{ name: "LibreOffice Impress (File → Export as PDF)", url: "https://www.libreoffice.org" }, { name: "Microsoft PowerPoint (File → Export)", url: "https://microsoft.com/office" }],
  "pdf-ocr":           [{ name: "Adobe Acrobat Online OCR", url: "https://www.adobe.com/acrobat/online/ocr-pdf.html" }, { name: "Tesseract OCR (open-source)", url: "https://github.com/tesseract-ocr/tesseract" }],
};

const REASONS: Record<string, string> = {
  "pdf-to-word":       "Converting PDF to Word requires parsing complex layout, fonts, and formatting - this needs server-side processing that browsers cannot perform reliably.",
  "word-to-pdf":       "Word documents use OS-level rendering (Microsoft Office or LibreOffice). Browsers cannot accurately replicate this without a server.",
  "pdf-to-excel":      "Extracting tabular data from PDFs requires layout analysis and cell-boundary detection, which needs a full server-side pipeline.",
  "excel-to-pdf":      "Excel renders using OS-level spreadsheet engines. Accurate PDF output requires server-side processing.",
  "pdf-to-powerpoint": "Slide reconstruction from PDF requires AI-assisted layout parsing that cannot run in a browser.",
  "powerpoint-to-pdf": "PowerPoint rendering depends on OS-level font and animation support, requiring a server.",
  "pdf-ocr":           "OCR (Optical Character Recognition) on scanned PDFs requires a machine-learning model (e.g. Tesseract) that is too large to run reliably in-browser.",
};

export default function LimitedTool() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() ?? "";
  const def = getPdfTool(slug);
  const name = def?.name ?? "This tool";
  const reason = REASONS[slug] ?? "This conversion requires server-side processing.";
  const alts = ALTERNATIVES[slug] ?? [];

  return (
    <div className="space-y-4">
      {/* Explanation card */}
      <div
        className="rounded-lg border p-5"
        style={{ borderColor: "rgba(242,184,75,0.30)", backgroundColor: "rgba(242,184,75,0.07)" }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">⚠️</span>
          <h2 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Browser limitation</h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{reason}</p>
      </div>

      {/* Alternatives */}
      {alts.length > 0 && (
        <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Free alternatives for {name}
          </h3>
          <ul className="space-y-2">
            {alts.map((alt) => (
              <li key={alt.url}>
                <a
                  href={alt.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring group inline-flex items-center gap-2 rounded text-sm"
                  style={{ color: "var(--teal)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.829.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.829.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                  </svg>
                  {alt.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What we CAN do */}
      <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          What you can do here instead
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Try <strong style={{ color: "var(--text-secondary)" }}>PDF to Text</strong> or{" "}
          <strong style={{ color: "var(--text-secondary)" }}>PDF to JSON</strong> to extract
          plain text content from your PDF entirely in the browser - no upload needed.
        </p>
      </div>
    </div>
  );
}
