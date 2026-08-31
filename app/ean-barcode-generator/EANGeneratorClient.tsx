"use client";

import { useState, useCallback } from "react";
import BarcodeDisplay from "@/components/barcode/BarcodeDisplay";
import StatusBanner from "@/components/StatusBanner";
import CopyButton from "@/components/CopyButton";

type EANType = "EAN13" | "EAN8";

interface Result { svgString: string; pngDataUrl: string; fullCode: string; type: EANType }

const inputClass = "w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-amber-400/50 transition";
const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" };

export default function EANGeneratorClient() {
  const [eanType, setEanType] = useState<EANType>("EAN13");
  const [raw, setRaw] = useState("");
  const [autoCheck, setAutoCheck] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const expectedInput = eanType === "EAN13" ? (autoCheck ? 12 : 13) : (autoCheck ? 7 : 8);

  const generate = useCallback(async () => {
    const v = raw.trim().replace(/\D/g, "");
    setError(null);
    setResult(null);

    let full = "";
    if (eanType === "EAN13") {
      if (autoCheck) {
        if (v.length !== 12) { setError("Please enter exactly 12 digits. The 13th check digit is calculated automatically."); return; }
        const { calcEAN13CheckDigit } = await import("@/lib/barcode-generate");
        full = v + calcEAN13CheckDigit(v);
      } else {
        if (v.length !== 13) { setError("Please enter exactly 13 digits for a complete EAN-13 code."); return; }
        const { validateEAN13 } = await import("@/lib/barcode-generate");
        if (!validateEAN13(v)) {
          const { calcEAN13CheckDigit } = await import("@/lib/barcode-generate");
          setError(`Check digit is incorrect. The correct check digit for ${v.slice(0,12)} is ${calcEAN13CheckDigit(v.slice(0,12))}.`);
          return;
        }
        full = v;
      }
    } else {
      if (autoCheck) {
        if (v.length !== 7) { setError("Please enter exactly 7 digits. The 8th check digit is calculated automatically."); return; }
        const { calcEAN8CheckDigit } = await import("@/lib/barcode-generate");
        full = v + calcEAN8CheckDigit(v);
      } else {
        if (v.length !== 8) { setError("Please enter exactly 8 digits for a complete EAN-8 code."); return; }
        const { validateEAN8 } = await import("@/lib/barcode-generate");
        if (!validateEAN8(v)) {
          const { calcEAN8CheckDigit } = await import("@/lib/barcode-generate");
          setError(`Check digit is incorrect. The correct check digit for ${v.slice(0,7)} is ${calcEAN8CheckDigit(v.slice(0,7))}.`);
          return;
        }
        full = v;
      }
    }

    setLoading(true);
    try {
      const { generateBarcode } = await import("@/lib/barcode-generate");
      const res = await generateBarcode(full, { format: eanType, width: 2, height: 100, displayValue: true, margin: 10 });
      setResult({ ...res, fullCode: full, type: eanType });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate EAN barcode.");
    } finally {
      setLoading(false);
    }
  }, [raw, eanType, autoCheck]);

  const reset = () => { setResult(null); setError(null); setRaw(""); };

  const maxLength = expectedInput;

  return (
    <div className="space-y-6">
      {/* EAN type toggle */}
      <div className="flex gap-2">
        {(["EAN13", "EAN8"] as EANType[]).map((t) => (
          <button key={t} type="button"
            onClick={() => { setEanType(t); setRaw(""); setError(null); setResult(null); }}
            className="focus-ring rounded-md border px-4 py-2 text-sm font-medium transition"
            style={{
              borderColor: eanType === t ? "var(--accent)" : "var(--border-strong)",
              backgroundColor: eanType === t ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--bg-elevated)",
              color: eanType === t ? "var(--accent)" : "var(--text-muted)",
            }}>
            {t === "EAN13" ? "EAN-13" : "EAN-8"}
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="ean-input" className="block mb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {eanType === "EAN13"
              ? autoCheck ? "EAN-13 digits (12 digits)" : "Complete EAN-13 (13 digits)"
              : autoCheck ? "EAN-8 digits (7 digits)" : "Complete EAN-8 (8 digits)"}
          </label>
          <input id="ean-input" type="text" inputMode="numeric" value={raw} maxLength={maxLength}
            placeholder={eanType === "EAN13" ? (autoCheck ? "590123412345" : "5901234123457") : (autoCheck ? "9638507" : "96385074")}
            onChange={(e) => setRaw(e.target.value.replace(/\D/g, "").slice(0, maxLength))}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            className={inputClass} style={inputStyle} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            {autoCheck
              ? `Enter ${eanType === "EAN13" ? 12 : 7} digits - check digit calculated automatically.`
              : `Enter all ${eanType === "EAN13" ? 13 : 8} digits including the check digit.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input id="ean-auto" type="checkbox" checked={autoCheck}
            onChange={(e) => { setAutoCheck(e.target.checked); setError(null); setResult(null); }}
            className="h-4 w-4 cursor-pointer rounded accent-amber-400" />
          <label htmlFor="ean-auto" className="cursor-pointer text-sm" style={{ color: "var(--text-secondary)" }}>
            Auto-calculate check digit
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={generate} disabled={loading}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          {loading ? "Generating…" : `Generate ${eanType === "EAN13" ? "EAN-13" : "EAN-8"} Barcode`}
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

      {result && (
        <div className="space-y-4">
          <BarcodeDisplay svgString={result.svgString} pngDataUrl={result.pngDataUrl} value={result.fullCode} />
          <div className="rounded-lg border p-4 flex items-center justify-between gap-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div>
              <p className="text-[11px] uppercase tracking-wide font-semibold mb-1" style={{ color: "var(--text-subtle)" }}>
                Generated {result.type === "EAN13" ? "EAN-13" : "EAN-8"}
              </p>
              <p className="font-mono text-lg font-bold" style={{ color: "var(--text-primary)" }}>{result.fullCode}</p>
            </div>
            <CopyButton text={result.fullCode} />
          </div>
        </div>
      )}

      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 All processing happens locally in your browser. No data is uploaded.
      </p>
    </div>
  );
}
