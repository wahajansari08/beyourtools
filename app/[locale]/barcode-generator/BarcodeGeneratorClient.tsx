"use client";

import { useState, useCallback } from "react";
import BarcodeDisplay from "@/components/barcode/BarcodeDisplay";
import StatusBanner from "@/components/StatusBanner";
import Btn from "@/components/Btn";

const FORMATS = [
  { value: "CODE128",  label: "Code 128" },
  { value: "CODE39",   label: "Code 39" },
  { value: "EAN13",    label: "EAN-13" },
  { value: "EAN8",     label: "EAN-8" },
  { value: "UPC",      label: "UPC-A" },
  { value: "ITF14",    label: "ITF-14" },
  { value: "MSI",      label: "MSI" },
  { value: "codabar",  label: "Codabar" },
];

interface Options {
  format: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  margin: number;
  lineColor: string;
  background: string;
}

const DEFAULTS: Options = {
  format: "CODE128",
  width: 2,
  height: 100,
  displayValue: true,
  fontSize: 14,
  margin: 10,
  lineColor: "#000000",
  background: "#ffffff",
};

interface Result { svgString: string; pngDataUrl: string; value: string }

const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/50 transition";
const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" };
const labelStyle = { color: "var(--text-muted)" };

const FORMAT_HINTS: Record<string, string> = {
  EAN13:  "Enter all 13 digits including the check digit. Use the EAN Generator for auto check-digit.",
  EAN8:   "Enter all 8 digits including the check digit. Use the EAN Generator for auto check-digit.",
  UPC:    "Enter all 12 digits including the check digit. Use the UPC Generator for auto check-digit.",
  ITF14:  "Enter all 14 digits including the check digit.",
  CODE39: "Supports A-Z, 0-9, space and - . $ / + %",
  codabar:"Starts and ends with A, B, C or D. Digits and - $ : / . + allowed.",
  MSI:    "Digits only.",
  CODE128:"Full ASCII printable characters supported.",
};

export default function BarcodeGeneratorClient() {
  const [value, setValue] = useState("");
  const [opts, setOpts] = useState<Options>(DEFAULTS);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    const v = value.trim();
    if (!v) { setError("Please enter a value for the barcode."); return; }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const { generateBarcode } = await import("@/lib/barcode-generate");
      const res = await generateBarcode(v, {
        format: opts.format,
        width: opts.width,
        height: opts.height,
        displayValue: opts.displayValue,
        fontSize: opts.fontSize,
        margin: opts.margin,
        lineColor: opts.lineColor,
        background: opts.background,
      });
      setResult({ ...res, value: v });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate barcode.");
    } finally {
      setLoading(false);
    }
  }, [value, opts]);

  const reset = () => { setResult(null); setError(null); setValue(""); };

  const hint = FORMAT_HINTS[opts.format] ?? "";

  return (
    <div className="space-y-6">
      {/* Format + value */}
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bc-format" className="block mb-1 text-xs font-medium" style={labelStyle}>Barcode type</label>
            <select id="bc-format" value={opts.format}
              onChange={(e) => { setOpts((o) => ({ ...o, format: e.target.value })); setError(null); setResult(null); }}
              className={inputClass} style={inputStyle}>
              {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="bc-value" className="block mb-1 text-xs font-medium" style={labelStyle}>Value</label>
            <input id="bc-value" type="text" value={value} placeholder="Enter barcode value…"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              className={inputClass} style={inputStyle} />
            {hint && <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>{hint}</p>}
          </div>
        </div>
      </div>

      {/* Options */}
      <details className="group">
        <summary className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide select-none" style={{ color: "var(--text-subtle)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            className="h-3.5 w-3.5 transition-transform group-open:rotate-90" aria-hidden="true">
            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
          Customize barcode
        </summary>
        <div className="mt-3 grid gap-4 rounded-xl border p-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div>
            <label htmlFor="bc-width" className="block mb-1 text-xs font-medium" style={labelStyle}>Bar width: {opts.width}px</label>
            <input id="bc-width" type="range" min={1} max={4} step={0.5} value={opts.width}
              onChange={(e) => setOpts((o) => ({ ...o, width: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div>
            <label htmlFor="bc-height" className="block mb-1 text-xs font-medium" style={labelStyle}>Height: {opts.height}px</label>
            <input id="bc-height" type="range" min={40} max={200} step={10} value={opts.height}
              onChange={(e) => setOpts((o) => ({ ...o, height: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div>
            <label htmlFor="bc-margin" className="block mb-1 text-xs font-medium" style={labelStyle}>Margin: {opts.margin}px</label>
            <input id="bc-margin" type="range" min={0} max={40} step={5} value={opts.margin}
              onChange={(e) => setOpts((o) => ({ ...o, margin: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div>
            <label htmlFor="bc-fontsize" className="block mb-1 text-xs font-medium" style={labelStyle}>Font size: {opts.fontSize}px</label>
            <input id="bc-fontsize" type="range" min={8} max={24} step={1} value={opts.fontSize}
              onChange={(e) => setOpts((o) => ({ ...o, fontSize: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" disabled={!opts.displayValue} />
          </div>
          <div>
            <label htmlFor="bc-fg" className="block mb-1 text-xs font-medium" style={labelStyle}>Bar color</label>
            <div className="flex items-center gap-2">
              <input id="bc-fg" type="color" value={opts.lineColor}
                onChange={(e) => setOpts((o) => ({ ...o, lineColor: e.target.value }))}
                className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
              <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{opts.lineColor}</span>
            </div>
          </div>
          <div>
            <label htmlFor="bc-bg" className="block mb-1 text-xs font-medium" style={labelStyle}>Background</label>
            <div className="flex items-center gap-2">
              <input id="bc-bg" type="color" value={opts.background}
                onChange={(e) => setOpts((o) => ({ ...o, background: e.target.value }))}
                className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
              <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{opts.background}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input id="bc-displayval" type="checkbox" checked={opts.displayValue}
              onChange={(e) => setOpts((o) => ({ ...o, displayValue: e.target.checked }))}
              className="h-4 w-4 cursor-pointer rounded accent-amber-400" />
            <label htmlFor="bc-displayval" className="cursor-pointer text-sm" style={{ color: "var(--text-secondary)" }}>
              Show value text
            </label>
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Btn variant="primary" size="lg" onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "Generate Barcode"}
        </Btn>
        {result && (
          <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
        )}
      </div>

      {error && <StatusBanner type="error" message={error} />}

      {result && <BarcodeDisplay svgString={result.svgString} pngDataUrl={result.pngDataUrl} value={result.value} />}

      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 All barcode generation happens locally in your browser. Nothing is uploaded to a server.
      </p>
    </div>
  );
}
