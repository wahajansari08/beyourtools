"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function OperatingMarginClient() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [opex, setOpex] = useState("");
  const [result, setResult] = useState<{ operatingIncome: number; operatingMargin: number } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const r = parseFloat(revenue);
    if (!r || r <= 0) { setError("Enter valid revenue greater than 0."); return; }
    const c = parseFloat(cogs) || 0;
    const o = parseFloat(opex) || 0;
    const operatingIncome = r - c - o;
    setResult({ operatingIncome, operatingMargin: (operatingIncome / r) * 100 });
  }

  function reset() { setRevenue(""); setCogs(""); setOpex(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="om-rev" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Total Revenue ($)</label>
          <input id="om-rev" type="number" min="0" step="any" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="e.g. 500000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="om-cogs" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Cost of Goods Sold - COGS ($)</label>
          <input id="om-cogs" type="number" min="0" step="any" value={cogs} onChange={(e) => setCogs(e.target.value)} placeholder="e.g. 200000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="om-opex" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Operating Expenses ($)</label>
          <input id="om-opex" type="number" min="0" step="any" value={opex} onChange={(e) => setOpex(e.target.value)} placeholder="e.g. 150000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Includes salaries, rent, marketing, depreciation - all operating costs except interest and taxes.</p>
        </div>
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <Btn variant="primary" size="lg" onClick={calculate}>
          Calculate
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Operating Income (EBIT)</p>
              <p className="mt-1 font-display text-xl font-bold" style={{ color: result.operatingIncome >= 0 ? "var(--teal)" : "var(--coral)" }}>${fmt(result.operatingIncome)}</p>
            </div>
            <div className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Operating Margin</p>
              <p className="mt-1 font-display text-xl font-bold" style={{ color: result.operatingMargin >= 0 ? "var(--teal)" : "var(--coral)" }}>{fmt(result.operatingMargin)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
