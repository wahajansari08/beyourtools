"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

interface DebtItem { name: string; payment: string; }

export default function DebtToIncomeClient() {
  const [grossIncome, setGrossIncome] = useState("");
  const [debts, setDebts] = useState<DebtItem[]>([
    { name: "Mortgage / Rent", payment: "" },
    { name: "Car Loan", payment: "" },
    { name: "Credit Cards", payment: "" },
  ]);
  const [result, setResult] = useState<{
    dti: number; totalDebt: number; frontEnd: number;
  } | null>(null);
  const [error, setError] = useState("");

  function addDebt() { setDebts((d) => [...d, { name: `Payment ${d.length + 1}`, payment: "" }]); }
  function removeDebt(i: number) { setDebts((d) => d.filter((_, idx) => idx !== i)); setResults(null); }
  function setResults(v: null) { setResult(v); }
  function updateDebt(i: number, f: keyof DebtItem, v: string) {
    setDebts((d) => d.map((debt, idx) => idx === i ? { ...debt, [f]: v } : debt));
    setResult(null);
  }

  function calculate() {
    setError("");
    const income = parseFloat(grossIncome);
    if (!income || income <= 0) { setError("Enter a valid gross monthly income."); return; }
    const totalDebt = debts.reduce((sum, d) => sum + (parseFloat(d.payment) || 0), 0);
    const housing = parseFloat(debts[0]?.payment) || 0;
    const dti = (totalDebt / income) * 100;
    const frontEnd = (housing / income) * 100;
    setResult({ dti, totalDebt, frontEnd });
  }

  function reset() {
    setGrossIncome("");
    setDebts([
      { name: "Mortgage / Rent", payment: "" },
      { name: "Car Loan", payment: "" },
      { name: "Credit Cards", payment: "" },
    ]);
    setResult(null);
    setError("");
  }

  function dtiColor(dti: number) {
    if (dti <= 20) return "var(--teal)";
    if (dti <= 36) return "var(--accent-text)";
    if (dti <= 43) return "var(--accent)";
    return "var(--coral)";
  }

  function dtiLabel(dti: number) {
    if (dti <= 20) return "Excellent - very comfortable";
    if (dti <= 28) return "Good - well within lender limits";
    if (dti <= 36) return "Acceptable - most lenders will approve";
    if (dti <= 43) return "Borderline - some lenders may decline";
    return "High - most lenders will not approve";
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="dti-inc" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Gross Monthly Income ($)
          </label>
          <input id="dti-inc" type="number" min="0" step="any" value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)} placeholder="e.g. 6000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Before taxes. Include all income sources.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Monthly Debt Payments</p>
          {debts.map((debt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={debt.name} onChange={(e) => updateDebt(i, "name", e.target.value)}
                className="focus-ring min-w-0 flex-1 rounded-lg border px-3 py-2 text-xs"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                aria-label="Debt label" />
              <input type="number" min="0" step="any" value={debt.payment}
                onChange={(e) => updateDebt(i, "payment", e.target.value)} placeholder="$/mo"
                className="focus-ring w-28 rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                aria-label={`${debt.name} monthly payment`} />
              {debts.length > 1 && (
                <button type="button" onClick={() => removeDebt(i)}
                  className="focus-ring rounded text-xs shrink-0" style={{ color: "var(--coral)" }}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDebt}
            className="focus-ring rounded-lg border px-3 py-1.5 text-xs font-medium transition"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
            + Add Payment
          </button>
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
          Calculate DTI
        </button>
        <button type="button" onClick={reset}
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>DTI Results</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Back-End DTI", value: `${fmt(result.dti)}%`, primary: true, color: dtiColor(result.dti) },
              { label: "Front-End DTI (housing)", value: `${fmt(result.frontEnd)}%`, primary: false, color: "var(--text-primary)" },
              { label: "Total Monthly Debt", value: `$${fmt(result.totalDebt)}`, primary: false, color: "var(--text-primary)" },
            ].map(({ label, value, primary, color }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-2xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-3 text-sm"
            style={{ borderColor: `color-mix(in srgb,${dtiColor(result.dti)} 30%,transparent)`,
              backgroundColor: `color-mix(in srgb,${dtiColor(result.dti)} 8%,transparent)`,
              color: "var(--text-muted)" }}>
            <strong style={{ color: dtiColor(result.dti) }}>{dtiLabel(result.dti)}</strong>
          </div>
          <div className="text-xs space-y-1" style={{ color: "var(--text-subtle)" }}>
            <p>DTI benchmarks: ≤20% excellent · 21–36% good · 37–43% borderline · 43%+ high</p>
            <p>Front-end (housing) target: ≤28% of gross income for mortgage qualification.</p>
          </div>
        </div>
      )}
    </div>
  );
}
