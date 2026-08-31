"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

type Mode = "add" | "remove";

export default function SalesTaxClient() {
  const [price, setPrice]   = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [mode, setMode]     = useState<Mode>("add");
  const [result, setResult] = useState<{
    preTax: number; taxAmount: number; postTax: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const p = parseFloat(price);
    const r = parseFloat(taxRate);
    if (!p || p <= 0)          { setError("Enter a valid price greater than 0."); return; }
    if (isNaN(r) || r < 0)    { setError("Enter a valid tax rate (0 or above)."); return; }
    if (mode === "add") {
      const taxAmount = p * (r / 100);
      setResult({ preTax: p, taxAmount, postTax: p + taxAmount });
    } else {
      const preTax    = p / (1 + r / 100);
      const taxAmount = p - preTax;
      setResult({ preTax, taxAmount, postTax: p });
    }
  }

  function reset() { setPrice(""); setTaxRate(""); setResult(null); setError(""); }

  // Common US state tax rates for quick-select
  const PRESETS = [
    { label: "No tax (0%)", rate: "0" },
    { label: "5%",  rate: "5" },
    { label: "6%",  rate: "6" },
    { label: "7%",  rate: "7" },
    { label: "8%",  rate: "8" },
    { label: "8.875% (NYC)", rate: "8.875" },
    { label: "10%", rate: "10" },
    { label: "20% (VAT UK)", rate: "20" },
  ];

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div className="flex gap-2" role="group" aria-label="Calculation direction">
        {([["add", "Add tax to price"], ["remove", "Remove tax from price"]] as const).map(([val, label]) => (
          <button key={val} type="button" onClick={() => { setMode(val); setResult(null); setError(""); }}
            className="focus-ring rounded border px-4 py-1.5 text-xs font-medium transition"
            style={{
              borderColor: mode === val ? "var(--accent)" : "var(--border-strong)",
              backgroundColor: mode === val ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
              color: mode === val ? "var(--accent)" : "var(--text-muted)",
            }} aria-pressed={mode === val}>{label}</button>
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="st-price" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {mode === "add" ? "Pre-Tax Price ($)" : "Total Price Including Tax ($)"}
          </label>
          <input id="st-price" type="number" min="0" step="any" value={price}
            onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 49.99"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="st-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Tax Rate (%)
          </label>
          <input id="st-rate" type="number" min="0" step="any" value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)} placeholder="e.g. 8.5"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          {/* Preset chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.rate} type="button" onClick={() => { setTaxRate(p.rate); setResult(null); }}
                className="focus-ring rounded border px-2 py-0.5 text-[10px] font-medium transition hover:opacity-80"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}>
                {p.label}
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
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Pre-Tax Price",    value: `$${fmt(result.preTax)}`,   primary: false },
              { label: "Tax Amount",       value: `$${fmt(result.taxAmount)}`, primary: false },
              { label: "Total with Tax",   value: `$${fmt(result.postTax)}`,  primary: true },
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
