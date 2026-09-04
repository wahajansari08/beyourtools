"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function TaxInclusiveClient() {
  const [netPrice, setNetPrice] = useState("");
  const [taxRate, setTaxRate]   = useState("");
  const [result, setResult] = useState<{ grossPrice: number; taxAmount: number } | null>(null);
  const [error, setError]   = useState("");

  function calculate() {
    setError("");
    const p = parseFloat(netPrice);
    const r = parseFloat(taxRate);
    if (!p || p <= 0)         { setError("Enter a valid net price greater than 0."); return; }
    if (isNaN(r) || r < 0)   { setError("Enter a valid tax rate."); return; }
    const grossPrice = p * (1 + r / 100);
    const taxAmount  = grossPrice - p;
    setResult({ grossPrice, taxAmount });
  }

  function reset() { setNetPrice(""); setTaxRate(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="ti-net" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Net Price (before tax) ($)
          </label>
          <input id="ti-net" type="number" min="0" step="any" value={netPrice}
            onChange={(e) => setNetPrice(e.target.value)} placeholder="e.g. 100"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="ti-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Tax Rate (%)
          </label>
          <input id="ti-rate" type="number" min="0" step="any" value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)} placeholder="e.g. 20"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[["5", "5% GST"], ["10", "10% GST/AU"], ["20", "20% VAT/UK"], ["19", "19% VAT/DE"], ["21", "21% VAT/NL"]].map(([r, l]) => (
              <button key={r} type="button" onClick={() => { setTaxRate(r); setResult(null); }}
                className="focus-ring rounded border px-2 py-0.5 text-[10px] font-medium transition hover:opacity-80"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}>
                {l}
              </button>
            ))}
          </div>
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
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Tax-Inclusive Price</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Net Price",         value: `$${fmt(parseFloat(netPrice))}` },
              { label: `Tax (${taxRate}%)`, value: `+$${fmt(result.taxAmount)}` },
              { label: "Gross (incl. tax)", value: `$${fmt(result.grossPrice)}`, primary: true },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
