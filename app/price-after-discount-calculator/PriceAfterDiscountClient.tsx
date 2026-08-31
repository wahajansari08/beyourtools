"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function PriceAfterDiscountClient() {
  const [original, setOriginal]     = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [taxRate, setTaxRate]       = useState("0");
  const [result, setResult] = useState<{
    discountAmount: number; salePrice: number; taxAmount: number; finalPrice: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const orig = parseFloat(original);
    const disc = parseFloat(discountPct);
    const tax  = parseFloat(taxRate) || 0;
    if (!orig || orig <= 0)         { setError("Enter a valid original price."); return; }
    if (isNaN(disc) || disc < 0 || disc > 100) { setError("Discount must be 0–100%."); return; }
    if (tax < 0 || tax > 50)        { setError("Tax rate must be 0–50%."); return; }
    const discountAmount = orig * (disc / 100);
    const salePrice      = orig - discountAmount;
    const taxAmount      = salePrice * (tax / 100);
    const finalPrice     = salePrice + taxAmount;
    setResult({ discountAmount, salePrice, taxAmount, finalPrice });
  }

  function reset() { setOriginal(""); setDiscountPct(""); setTaxRate("0"); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="pad-orig" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Original Price ($)
          </label>
          <input id="pad-orig" type="number" min="0" step="any" value={original}
            onChange={(e) => setOriginal(e.target.value)} placeholder="e.g. 120"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="pad-disc" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Discount (%)
          </label>
          <input id="pad-disc" type="number" min="0" max="100" step="any" value={discountPct}
            onChange={(e) => setDiscountPct(e.target.value)} placeholder="e.g. 25"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          {/* Quick discount presets */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["5", "10", "15", "20", "25", "30", "40", "50", "60", "70", "75"].map((d) => (
              <button key={d} type="button" onClick={() => { setDiscountPct(d); setResult(null); }}
                className="focus-ring rounded border px-2 py-0.5 text-[10px] font-medium transition hover:opacity-80"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}>
                {d}% off
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="pad-tax" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Sales Tax Rate (% — optional, applied after discount)
          </label>
          <input id="pad-tax" type="number" min="0" max="50" step="any" value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)} placeholder="e.g. 8.5"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border px-4 py-2 text-sm"
          style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={calculate}
          className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          Calculate
        </button>
        <button type="button" onClick={reset}
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Discount Amount", value: `−$${fmt(result.discountAmount)}` },
              { label: "Sale Price",      value: `$${fmt(result.salePrice)}` },
              ...(parseFloat(taxRate) > 0 ? [{ label: `Tax (${taxRate}%)`, value: `+$${fmt(result.taxAmount)}` }] : []),
              { label: "Final Price",     value: `$${fmt(result.finalPrice)}`, primary: true },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            You save ${fmt(result.discountAmount)} ({discountPct}% off ${fmt(parseFloat(original))}).
          </p>
        </div>
      )}
    </div>
  );
}
