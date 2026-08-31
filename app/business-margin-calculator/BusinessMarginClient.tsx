"use client";
import { useState } from "react";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function MarginBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(Math.max(value, 0), max);
  return (
    <div className="mt-1.5 h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-strong)" }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct > 20 ? "var(--teal)" : "var(--coral)" }} />
    </div>
  );
}

export default function BusinessMarginClient() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [opex, setOpex] = useState("");
  const [interest, setInterest] = useState("");
  const [taxes, setTaxes] = useState("");
  const [result, setResult] = useState<{
    grossProfit: number; grossMargin: number;
    operatingIncome: number; operatingMargin: number;
    netProfit: number; netMargin: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const r = parseFloat(revenue);
    if (!r || r <= 0) { setError("Enter valid revenue greater than 0."); return; }
    const c = parseFloat(cogs) || 0;
    const o = parseFloat(opex) || 0;
    const i = parseFloat(interest) || 0;
    const t = parseFloat(taxes) || 0;
    const grossProfit = r - c;
    const operatingIncome = grossProfit - o;
    const netProfit = operatingIncome - i - t;
    setResult({
      grossProfit, grossMargin: (grossProfit / r) * 100,
      operatingIncome, operatingMargin: (operatingIncome / r) * 100,
      netProfit, netMargin: (netProfit / r) * 100,
    });
  }

  function reset() { setRevenue(""); setCogs(""); setOpex(""); setInterest(""); setTaxes(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        {[
          { id: "bm-rev", label: "Total Revenue ($)", val: revenue, set: setRevenue, ph: "e.g. 1000000" },
          { id: "bm-cogs", label: "Cost of Goods Sold — COGS ($)", val: cogs, set: setCogs, ph: "e.g. 400000" },
          { id: "bm-opex", label: "Operating Expenses ($)", val: opex, set: setOpex, ph: "e.g. 250000" },
          { id: "bm-int", label: "Interest & Other Expenses ($)", val: interest, set: setInterest, ph: "e.g. 20000" },
          { id: "bm-tax", label: "Income Taxes ($)", val: taxes, set: setTaxes, ph: "e.g. 55000" },
        ].map(({ id, label, val, set, ph }) => (
          <div key={id}>
            <label htmlFor={id} className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</label>
            <input id={id} type="number" min="0" step="any" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        ))}
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={calculate} className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>Calculate</button>
        <button type="button" onClick={reset} className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>Reset</button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Profitability Summary</h3>
          {[
            { label: "Gross Profit", amount: result.grossProfit, margin: result.grossMargin, desc: "After COGS" },
            { label: "Operating Income (EBIT)", amount: result.operatingIncome, margin: result.operatingMargin, desc: "After COGS + OpEx" },
            { label: "Net Profit", amount: result.netProfit, margin: result.netMargin, desc: "After all deductions" },
          ].map(({ label, amount, margin, desc }) => (
            <div key={label} className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold" style={{ color: amount >= 0 ? "var(--teal)" : "var(--coral)" }}>{fmt(margin)}%</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>${fmt(amount)}</p>
                </div>
              </div>
              <MarginBar value={margin} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
