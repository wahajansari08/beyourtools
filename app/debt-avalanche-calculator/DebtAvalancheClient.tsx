"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

interface Debt { name: string; balance: string; rate: string; minPayment: string; }
interface SimDebt { name: string; balance: number; r: number; rAnnual: number; min: number; totalInterest: number; paidOffMonth: number; }

function simulate(debts: SimDebt[], extra: number, sortFn: (a: SimDebt, b: SimDebt) => number) {
  const active: SimDebt[] = debts.map((d) => ({ ...d }));
  let month = 0;
  while (active.some((d) => d.balance > 0.005) && month < 600) {
    month++;
    active.forEach((d) => {
      if (d.balance > 0.005) {
        const int = d.balance * d.r;
        d.totalInterest += int;
        d.balance += int;
      }
    });
    let freed = extra;
    active.forEach((d) => {
      if (d.balance > 0.005) {
        const pay = Math.min(d.min, d.balance);
        d.balance -= pay;
        if (d.balance <= 0.005) { d.balance = 0; if (!d.paidOffMonth) d.paidOffMonth = month; }
      } else {
        freed += d.min;
      }
    });
    const remaining = active.filter((d) => d.balance > 0.005).sort(sortFn);
    const target = remaining[0];
    if (target && freed > 0) {
      target.balance = Math.max(0, target.balance - freed);
      if (target.balance <= 0.005) { target.balance = 0; if (!target.paidOffMonth) target.paidOffMonth = month; }
    }
  }
  return { active, totalMonths: month };
}

export default function DebtAvalancheClient() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: "Credit Card A", balance: "", rate: "", minPayment: "" },
    { name: "Credit Card B", balance: "", rate: "", minPayment: "" },
  ]);
  const [extra, setExtra] = useState("100");
  const [results, setResults] = useState<{ name: string; paidOffMonth: number; totalInterest: number; rAnnual: number }[] | null>(null);
  const [totals, setTotals] = useState<{ months: number; totalInterest: number; totalPaid: number } | null>(null);
  const [error, setError]   = useState("");

  function addDebt() { setDebts((d) => [...d, { name: `Debt ${d.length + 1}`, balance: "", rate: "", minPayment: "" }]); }
  function removeDebt(i: number) { setDebts((d) => d.filter((_, idx) => idx !== i)); setResults(null); }
  function updateDebt(i: number, f: keyof Debt, v: string) {
    setDebts((d) => d.map((debt, idx) => idx === i ? { ...debt, [f]: v } : debt));
    setResults(null);
  }

  function calculate() {
    setError("");
    const parsed: SimDebt[] = [];
    for (let i = 0; i < debts.length; i++) {
      const bal = parseFloat(debts[i].balance);
      const r   = parseFloat(debts[i].rate);
      const min = parseFloat(debts[i].minPayment);
      if (!bal || bal <= 0) { setError(`${debts[i].name || `Debt ${i + 1}`}: enter a valid balance.`); return; }
      if (r < 0)            { setError(`${debts[i].name || `Debt ${i + 1}`}: rate cannot be negative.`); return; }
      if (!min || min <= 0) { setError(`${debts[i].name || `Debt ${i + 1}`}: enter a valid minimum payment.`); return; }
      parsed.push({ name: debts[i].name || `Debt ${i + 1}`, balance: bal, r: r / 100 / 12, rAnnual: r, min, totalInterest: 0, paidOffMonth: 0 });
    }
    const extraAmt = parseFloat(extra) || 0;
    // Avalanche: sort by highest rate first
    const { active, totalMonths } = simulate(parsed, extraAmt, (a, b) => b.rAnnual - a.rAnnual);
    const totalInterest = active.reduce((s, d) => s + d.totalInterest, 0);
    const totalOriginal = parsed.reduce((s, d) => s + d.balance, 0);
    setResults(active.map((d) => ({ name: d.name, paidOffMonth: d.paidOffMonth, totalInterest: d.totalInterest, rAnnual: d.rAnnual })));
    setTotals({ months: totalMonths, totalInterest, totalPaid: totalOriginal + totalInterest });
  }

  function reset() {
    setDebts([
      { name: "Credit Card A", balance: "", rate: "", minPayment: "" },
      { name: "Credit Card B", balance: "", rate: "", minPayment: "" },
    ]);
    setExtra("100"); setResults(null); setTotals(null); setError("");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border px-4 py-3 text-xs leading-relaxed"
        style={{ borderColor: "color-mix(in srgb,var(--accent) 30%,transparent)", backgroundColor: "color-mix(in srgb,var(--accent) 6%,transparent)", color: "var(--text-muted)" }}>
        <strong style={{ color: "var(--accent-text)" }}>Avalanche method:</strong> Pay minimums on all debts, then direct extra money at the <strong>highest interest rate first</strong>. Minimises total interest paid.
      </div>

      <div className="space-y-3">
        {debts.map((debt, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex items-center justify-between">
              <input type="text" value={debt.name} onChange={(e) => updateDebt(i, "name", e.target.value)}
                className="focus-ring rounded border px-2 py-1 text-xs font-medium"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                placeholder="Debt name" aria-label="Debt name" />
              {debts.length > 1 && (
                <button type="button" onClick={() => removeDebt(i)}
                  className="focus-ring rounded text-xs" style={{ color: "var(--coral)" }}>Remove</button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { field: "balance" as const,     label: "Balance ($)",         ph: "e.g. 4000" },
                { field: "rate" as const,        label: "Rate (%)",            ph: "e.g. 24.99" },
                { field: "minPayment" as const,  label: "Min. Payment ($/mo)", ph: "e.g. 80" },
              ].map(({ field, label, ph }) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</label>
                  <input type="number" min="0" step="any" value={debt[field]}
                    onChange={(e) => updateDebt(i, field, e.target.value)} placeholder={ph}
                    className="focus-ring w-full rounded-lg border px-3 py-1.5 text-sm"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addDebt}
        className="focus-ring rounded-lg border px-4 py-2 text-xs font-medium transition"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
        + Add Another Debt
      </button>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <label htmlFor="av-extra" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Extra Monthly Payment ($) - directed at highest-rate debt
        </label>
        <input id="av-extra" type="number" min="0" step="any" value={extra}
          onChange={(e) => setExtra(e.target.value)} placeholder="e.g. 100"
          className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
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

      {results && totals && (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Avalanche Payoff Plan</h3>
          <div className="space-y-2">
            {results.sort((a, b) => a.paidOffMonth - b.paidOffMonth).map((r, idx) => (
              <div key={r.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>{idx + 1}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{r.name}</span>
                  <span className="rounded-full border px-1.5 py-0.5 text-[10px]"
                    style={{ borderColor: "var(--border-strong)", color: "var(--text-subtle)" }}>
                    {fmt(r.rAnnual, 2)}% APR
                  </span>
                </div>
                <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>Month {r.paidOffMonth}</span>
                  <span style={{ color: "var(--coral)" }}>+${fmt(r.totalInterest)} interest</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Debt-Free In",   value: `${Math.floor(totals.months / 12)}y ${totals.months % 12}m`, primary: true },
              { label: "Total Interest", value: `$${fmt(totals.totalInterest)}` },
              { label: "Total Paid",     value: `$${fmt(totals.totalPaid)}` },
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
