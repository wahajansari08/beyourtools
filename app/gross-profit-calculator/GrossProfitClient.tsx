"use client";
import { useState } from "react";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function GrossProfitClient() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [result, setResult] = useState<{ grossProfit: number; grossMargin: number } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const r = parseFloat(revenue);
    const c = parseFloat(cogs);
    if (!r || r <= 0) { setError("Enter a valid revenue greater than 0."); return; }
    if (isNaN(c) || c < 0) { setError("Enter a valid COGS (≥ 0)."); return; }
    const grossProfit = r - c;
    const grossMargin = (grossProfit / r) * 100;
    setResult({ grossProfit, grossMargin });
  }

  function reset() { setRevenue(""); setCogs(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="gp-rev" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Total Revenue ($)</label>
          <input id="gp-rev" type="number" min="0" step="any" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="e.g. 200000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="gp-cogs" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Cost of Goods Sold - COGS ($)</label>
          <input id="gp-cogs" type="number" min="0" step="any" value={cogs} onChange={(e) => setCogs(e.target.value)} placeholder="e.g. 120000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={calculate} className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>Calculate</button>
        <button type="button" onClick={reset} className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>Reset</button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Gross Profit</p>
              <p className="mt-1 font-display text-xl font-bold" style={{ color: result.grossProfit >= 0 ? "var(--teal)" : "var(--coral)" }}>${fmt(result.grossProfit)}</p>
            </div>
            <div className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Gross Margin</p>
              <p className="mt-1 font-display text-xl font-bold" style={{ color: result.grossMargin >= 0 ? "var(--teal)" : "var(--coral)" }}>{fmt(result.grossMargin)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
