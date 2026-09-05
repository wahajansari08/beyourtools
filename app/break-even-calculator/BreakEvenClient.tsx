"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function BreakEvenClient() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [price, setPrice] = useState("");
  const [varCost, setVarCost] = useState("");
  const [targetProfit, setTargetProfit] = useState("");
  const [result, setResult] = useState<{
    breakEvenUnits: number;
    breakEvenRevenue: number;
    contributionMargin: number;
    contributionMarginRatio: number;
    targetUnits: number | null;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const fc = parseFloat(fixedCosts);
    const sp = parseFloat(price);
    const vc = parseFloat(varCost);
    if (isNaN(fc) || fc < 0) { setError("Enter valid fixed costs (≥ 0)."); return; }
    if (!sp || sp <= 0) { setError("Enter a valid selling price greater than 0."); return; }
    if (isNaN(vc) || vc < 0) { setError("Enter valid variable cost per unit (≥ 0)."); return; }
    if (vc >= sp) { setError("Variable cost must be less than selling price for a break-even point to exist."); return; }
    const cm = sp - vc;
    const cmr = (cm / sp) * 100;
    const beu = fc / cm;
    const ber = beu * sp;
    const tp = parseFloat(targetProfit);
    const tu = !isNaN(tp) && tp > 0 ? (fc + tp) / cm : null;
    setResult({ breakEvenUnits: beu, breakEvenRevenue: ber, contributionMargin: cm, contributionMarginRatio: cmr, targetUnits: tu });
  }

  function reset() { setFixedCosts(""); setPrice(""); setVarCost(""); setTargetProfit(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="be-fixed" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Total Fixed Costs ($)</label>
          <input id="be-fixed" type="number" min="0" step="any" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} placeholder="e.g. 10000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Rent, salaries, insurance - costs that don't change with output.</p>
        </div>
        <div>
          <label htmlFor="be-price" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Selling Price per Unit ($)</label>
          <input id="be-price" type="number" min="0" step="any" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 25"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="be-var" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Variable Cost per Unit ($)</label>
          <input id="be-var" type="number" min="0" step="any" value={varCost} onChange={(e) => setVarCost(e.target.value)} placeholder="e.g. 10"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Materials, packaging, direct labour - costs per unit sold.</p>
        </div>
        <div>
          <label htmlFor="be-target" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Target Profit ($ - optional)</label>
          <input id="be-target" type="number" min="0" step="any" value={targetProfit} onChange={(e) => setTargetProfit(e.target.value)} placeholder="e.g. 5000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>How many units to sell to hit a specific profit target.</p>
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
            {[
              { label: "Break-Even Units", value: fmt(result.breakEvenUnits, 0) + " units" },
              { label: "Break-Even Revenue", value: "$" + fmt(result.breakEvenRevenue) },
              { label: "Contribution Margin / Unit", value: "$" + fmt(result.contributionMargin) },
              { label: "Contribution Margin Ratio", value: fmt(result.contributionMarginRatio) + "%" },
              ...(result.targetUnits !== null ? [{ label: "Units for Target Profit", value: fmt(result.targetUnits, 0) + " units" }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold" style={{ color: "var(--teal)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
