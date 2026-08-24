"use client";

import CopyButton from "@/components/CopyButton";

interface BarcodeDisplayProps {
  svgString: string;
  pngDataUrl: string;
  value: string;
}

export default function BarcodeDisplay({ svgString, pngDataUrl, value }: BarcodeDisplayProps) {
  function downloadSvg() {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "barcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPng() {
    if (!pngDataUrl) return;
    const a = document.createElement("a");
    a.href = pngDataUrl;
    a.download = "barcode.png";
    a.click();
  }

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      {/* SVG preview */}
      <div
        className="w-full overflow-x-auto rounded-lg p-4"
        style={{ backgroundColor: "#fff" }}
        aria-label="Barcode preview"
      >
        <div
          style={{ maxWidth: "100%", overflowX: "auto" }}
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={downloadPng}
          disabled={!pngDataUrl}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V8.44L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
            <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
          </svg>
          Download PNG
        </button>

        <button
          type="button"
          onClick={downloadSvg}
          disabled={!svgString}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition hover:opacity-80 disabled:opacity-40"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V8.44L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
            <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
          </svg>
          Download SVG
        </button>

        <CopyButton text={value} />
      </div>
    </div>
  );
}
