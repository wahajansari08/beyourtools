"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

interface Debt {
  name: string;
  balance: string;
  rate: string;
  minPayment: string;
}

interface DebtResult {
  name: string;
  months: number;
  totalInterest: number;
  totalPaid: number;
}

export default function DebtPayoffClient() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: "Credit Card 1", balance: "", rate: "", minPayment: "" },
  ]);
  const [extraPayment, setExtraPayment] = useState("0");
  const [results, setResults] = useState<DebtResult[] | null>(null);
  const [totals, setTotals]   = useState<{ months: number; totalInterest: number; totalPaid: number } | null>(null);
  const [error, setError]     = useState("");

  function addDebt() {
    setDebts((d) => [...d, { name: `Debt ${d.length + 1}`, balance: "", rate: "", minPayment: "" }]);
    setResults(null);
  }

  function removeDebt(i: number) {
    setDebts((d) => d.filter((_, idx) => idx !== i));
    setResults(null);
    setTotals(null);
  }

  function updateDebt(i: number, field: keyof Debt, val: string) {
    setDebts((d) => d.map((debt, idx) => idx === i ? { ...debt, [field]: val } : debt));
    setResults(null);
    setTotals(null);
  }

  function calculate() {
    setError("");
    const parsed = debts.map((d, i) => {
      const bal  = parseFloat(d.balance);
      const rate = parseFloat(d.rate);
      const min  = parseFloat(d.minPayment);
      if (!bal || bal <= 0)   return { error: `Debt ${i + 1}: enter a valid balance.` };
      if (rate < 0)           return { error: `Debt ${i + 1}: rate cannot be negative.` };
      if (!min || min <= 0)   return { error: `Debt ${i + 1}: enter a valid minimum payment.` };
      return { name: d.name || `Debt ${i + 1}`, bal, r: rate / 100 / 12, min };
    });
    const err = parsed.find((p) => "error" in p);
    if (err && "error" in err) { setError(err.error ?? "Validation error"); return; }

    const valid = parsed as { name: string; bal: number; r: number; min: number }[];
    const extra = parseFloat(extraPayment) || 0;

    // Simulate each debt independently (no cascade for simplicity)
    const debtResults: DebtResult[] = valid.map(({ name, bal, r, min }) => {
      const payment = min + extra / valid.length;
      let balance   = bal;
      let months    = 0;
      let totalInt  = 0;
      while (balance > 0.005 && months < 600) {
        const int = balance * r;
        totalInt += int;
        balance  = Math.max(0, balance + int - payment);
        months++;
      }
      return { name, months, totalInterest: totalInt, totalPaid: bal + totalInt };
    });

    const maxMonths      = Math.max(...debtResults.map((d) => d.months));
    const totalInterest  = debtResults.reduce((s, d) => s + d.totalInterest, 0);
    const totalPaid      = debtResults.reduce((s, d) => s + d.totalPaid, 0);

    setResults(debtResults);
    setTotals({ months: maxMonths, totalInterest, totalPaid });
  }

  function reset() {
    setDebts([{ name: "Credit Card 1", balance: "", rate: "", minPayment: "" }]);
    setExtraPayment("0");
    setResults(null);
    setTotals(null);
    setError("");
  }

  return (
    <div className="space-y-5">
      {/* Debt rows */}
      <div className="space-y-3">
        {debts.map((debt, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={debt.name}
                onChange={(e) => updateDebt(i, "name", e.target.value)}
                className="focus-ring rounded border px-2 py-1 text-xs font-medium"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                aria-label="Debt name"
                placeholder="Debt name"
              />
              {debts.length > 1 && (
                <button type="button" onClick={() => removeDebt(i)}
                  className="focus-ring rounded text-xs hover:opacity-70"
                  style={{ color: "var(--coral)" }}
                  aria-label={`Remove ${debt.name}`}>
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Balance ($)</label>
                <input type="number" min="0" step="any" value={debt.balance}
                  onChange={(e) => updateDebt(i, "balance", e.target.value)} placeholder="e.g. 5000"
                  className="focus-ring w-full rounded-lg border px-3 py-1.5 text-sm"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Interest Rate (%)</label>
                <input type="number" min="0" step="any" value={debt.rate}
                  onChange={(e) => updateDebt(i, "rate", e.target.value)} placeholder="e.g. 19.99"
                  className="focus-ring w-full rounded-lg border px-3 py-1.5 text-sm"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Min. Payment ($/mo)</label>
                <input type="number" min="0" step="any" value={debt.minPayment}
                  onChange={(e) => updateDebt(i, "minPayment", e.target.value)} placeholder="e.g. 100"
                  className="focus-ring w-full rounded-lg border px-3 py-1.5 text-sm"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addDebt}
        className="focus-ring rounded-lg border px-4 py-2 text-xs font-medium transition"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
        + Add Another Debt
      </button>

      <div className="rounded-xl border p-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <label htmlFor="dp-extra" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Extra Monthly Payment ($) - split across all debts
        </label>
        <input id="dp-extra" type="number" min="0" step="any" value={extraPayment}
          onChange={(e) => setExtraPayment(e.target.value)} placeholder="e.g. 200"
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
          Calculate Payoff
        </button>
        <button type="button" onClick={reset}
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {results && totals && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Debt Payoff Results</h3>
          {/* Per-debt rows */}
          <div className="space-y-2">
            {results.map((r) => (
              <div key={r.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{r.name}</span>
                <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>{Math.floor(r.months / 12)}y {r.months % 12}m</span>
                  <span style={{ color: "var(--coral)" }}>+${fmt(r.totalInterest)} interest</span>
                  <span>Total: ${fmt(r.totalPaid)}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Overall totals */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Debt-Free In",    value: `${Math.floor(totals.months / 12)}y ${totals.months % 12}m`, primary: true },
              { label: "Total Interest",  value: `$${fmt(totals.totalInterest)}` },
              { label: "Total Paid",      value: `$${fmt(totals.totalPaid)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
