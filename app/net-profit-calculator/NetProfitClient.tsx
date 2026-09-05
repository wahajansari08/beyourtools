"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function NetProfitClient() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [opex, setOpex] = useState("");
  const [interest, setInterest] = useState("");
  const [taxes, setTaxes] = useState("");
  const [result, setResult] = useState<{
    grossProfit: number; operatingIncome: number; netProfit: number;
    grossMargin: number; operatingMargin: number; netMargin: number;
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
      grossProfit, operatingIncome, netProfit,
      grossMargin: (grossProfit / r) * 100,
      operatingMargin: (operatingIncome / r) * 100,
      netMargin: (netProfit / r) * 100,
    });
  }

  function reset() { setRevenue(""); setCogs(""); setOpex(""); setInterest(""); setTaxes(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        {[
          { id: "np-rev", label: "Total Revenue ($)", val: revenue, set: setRevenue, ph: "e.g. 500000" },
          { id: "np-cogs", label: "Cost of Goods Sold - COGS ($)", val: cogs, set: setCogs, ph: "e.g. 200000" },
          { id: "np-opex", label: "Operating Expenses ($)", val: opex, set: setOpex, ph: "e.g. 150000" },
          { id: "np-int", label: "Interest & Other Expenses ($)", val: interest, set: setInterest, ph: "e.g. 10000" },
          { id: "np-tax", label: "Income Taxes ($)", val: taxes, set: setTaxes, ph: "e.g. 28000" },
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Gross Profit", value: `$${fmt(result.grossProfit)}`, sub: `${fmt(result.grossMargin)}% margin` },
              { label: "Operating Income", value: `$${fmt(result.operatingIncome)}`, sub: `${fmt(result.operatingMargin)}% margin` },
              { label: "Net Profit", value: `$${fmt(result.netProfit)}`, sub: `${fmt(result.netMargin)}% margin` },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold" style={{ color: parseFloat(value.replace(/[^0-9.-]/g, "")) >= 0 ? "var(--teal)" : "var(--coral)" }}>{value}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-subtle)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
