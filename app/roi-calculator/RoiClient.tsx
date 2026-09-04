"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function RoiClient() {
  const [invested, setInvested] = useState("");
  const [returned, setReturned] = useState("");
  const [years,    setYears]    = useState("");
  const [result, setResult] = useState<{
    roi: number; netGain: number; annualizedRoi: number | null;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const cost   = parseFloat(invested);
    const value  = parseFloat(returned);
    const yrs    = parseFloat(years);
    if (!cost || cost <= 0)  { setError("Enter a valid investment cost greater than 0."); return; }
    if (isNaN(value))        { setError("Enter a valid return value."); return; }
    const netGain = value - cost;
    const roi     = (netGain / cost) * 100;
    let annualizedRoi: number | null = null;
    if (!isNaN(yrs) && yrs > 0) {
      annualizedRoi = (Math.pow(value / cost, 1 / yrs) - 1) * 100;
    }
    setResult({ roi, netGain, annualizedRoi });
  }

  function reset() { setInvested(""); setReturned(""); setYears(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="roi-cost" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Cost of Investment ($)
          </label>
          <input id="roi-cost" type="number" min="0" step="any" value={invested}
            onChange={(e) => setInvested(e.target.value)} placeholder="e.g. 10000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="roi-ret" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Value of Return ($)
          </label>
          <input id="roi-ret" type="number" step="any" value={returned}
            onChange={(e) => setReturned(e.target.value)} placeholder="e.g. 13500"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="roi-yrs" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Holding Period (years - optional, for annualised ROI)
          </label>
          <input id="roi-yrs" type="number" min="0" step="any" value={years}
            onChange={(e) => setYears(e.target.value)} placeholder="e.g. 3"
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
          Calculate ROI
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>ROI Results</h3>
          <div className={`grid gap-3 ${result.annualizedRoi !== null ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {[
              { label: "ROI",            value: `${fmt(result.roi)}%`,     primary: true,  color: result.roi >= 0 ? "var(--teal)" : "var(--coral)" },
              { label: "Net Gain / Loss",value: `${result.netGain >= 0 ? "+" : ""}$${fmt(result.netGain)}`, primary: false, color: result.netGain >= 0 ? "var(--text-primary)" : "var(--coral)" },
              ...(result.annualizedRoi !== null ? [{ label: "Annualised ROI", value: `${fmt(result.annualizedRoi)}%/yr`, primary: false, color: "var(--text-primary)" }] : []),
            ].map(({ label, value, primary, color }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-2xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
