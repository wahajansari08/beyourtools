"use client";

import { useRef } from "react";
import CopyButton from "@/components/CopyButton";
import Btn from "@/components/Btn";

interface QRDisplayProps {
  dataUrl: string;   // PNG data URL from qrcode library
  svgString: string; // SVG string from qrcode library
  value: string;     // The encoded value
}

export default function QRDisplay({ dataUrl, svgString, value }: QRDisplayProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  function downloadPng() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }

  function downloadSvg() {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      {/* Preview */}
      <div
        className="rounded-lg p-3"
        style={{ backgroundColor: "#fff" }}
        aria-label="QR code preview"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={dataUrl}
          alt="Generated QR code"
          className="block"
          style={{ imageRendering: "pixelated", maxWidth: "240px", width: "100%" }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Btn variant="primary" size="md" onClick={downloadPng}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V8.44L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
            <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
          </svg>
          Download PNG
        </Btn>

        {svgString && (
          <Btn variant="secondary" size="md" onClick={downloadSvg}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V8.44L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
              <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
            </svg>
            Download SVG
          </Btn>
        )}

        <CopyButton text={value} />
      </div>

      {/* Encoded value */}
      {value && (
        <p className="max-w-xs break-all text-center text-[11px]" style={{ color: "var(--text-subtle)" }}>
          {value.length > 80 ? value.slice(0, 80) + "…" : value}
        </p>
      )}
    </div>
  );
}
