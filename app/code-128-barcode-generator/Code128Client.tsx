"use client";

import { useState, useCallback } from "react";
import BarcodeDisplay from "@/components/barcode/BarcodeDisplay";
import StatusBanner from "@/components/StatusBanner";

interface Options { width: number; height: number; displayValue: boolean; margin: number }
interface Result { svgString: string; pngDataUrl: string; value: string }

const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/50 transition";
const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" };
const labelStyle = { color: "var(--text-muted)" };

// Code 128 supports printable ASCII 32–126
function validateCode128(v: string): string | null {
  for (const ch of v) {
    const code = ch.charCodeAt(0);
    if (code < 32 || code > 126) {
      return `Character "${ch}" (code ${code}) is not supported in Code 128. Use printable ASCII characters only.`;
    }
  }
  return null;
}

export default function Code128Client() {
  const [value, setValue] = useState("");
  const [opts, setOpts] = useState<Options>({ width: 2, height: 100, displayValue: true, margin: 10 });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    const v = value;
    if (!v) { setError("Please enter a value to encode."); return; }
    const validErr = validateCode128(v);
    if (validErr) { setError(validErr); return; }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const { generateBarcode } = await import("@/lib/barcode-generate");
      const res = await generateBarcode(v, {
        format: "CODE128",
        width: opts.width,
        height: opts.height,
        displayValue: opts.displayValue,
        margin: opts.margin,
      });
      setResult({ ...res, value: v });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate Code 128 barcode.");
    } finally {
      setLoading(false);
    }
  }, [value, opts]);

  const reset = () => { setResult(null); setError(null); setValue(""); };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="c128-value" className="block mb-1 text-xs font-medium" style={labelStyle}>Value to encode</label>
          <input id="c128-value" type="text" value={value} placeholder="Hello World 12345"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            className={inputClass} style={inputStyle} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Supports all printable ASCII characters (space through ~). No limit on length.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="c128-width" className="block mb-1 text-xs font-medium" style={labelStyle}>Bar width: {opts.width}px</label>
            <input id="c128-width" type="range" min={1} max={4} step={0.5} value={opts.width}
              onChange={(e) => setOpts((o) => ({ ...o, width: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div>
            <label htmlFor="c128-height" className="block mb-1 text-xs font-medium" style={labelStyle}>Height: {opts.height}px</label>
            <input id="c128-height" type="range" min={40} max={200} step={10} value={opts.height}
              onChange={(e) => setOpts((o) => ({ ...o, height: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div>
            <label htmlFor="c128-margin" className="block mb-1 text-xs font-medium" style={labelStyle}>Margin: {opts.margin}px</label>
            <input id="c128-margin" type="range" min={0} max={40} step={5} value={opts.margin}
              onChange={(e) => setOpts((o) => ({ ...o, margin: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div className="flex items-center gap-3">
            <input id="c128-display" type="checkbox" checked={opts.displayValue}
              onChange={(e) => setOpts((o) => ({ ...o, displayValue: e.target.checked }))}
              className="h-4 w-4 cursor-pointer rounded accent-amber-400" />
            <label htmlFor="c128-display" className="cursor-pointer text-sm" style={{ color: "var(--text-secondary)" }}>
              Show value text below
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={generate} disabled={loading}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          {loading ? "Generating…" : "Generate Code 128 Barcode"}
        </button>
        {result && (
          <button type="button" onClick={reset}
            className="focus-ring inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium transition"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            Reset
          </button>
        )}
      </div>

      {error && <StatusBanner type="error" message={error} />}
      {result && <BarcodeDisplay svgString={result.svgString} pngDataUrl={result.pngDataUrl} value={result.value} />}

      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 All processing happens locally in your browser. No data is uploaded.
      </p>
    </div>
  );
}
