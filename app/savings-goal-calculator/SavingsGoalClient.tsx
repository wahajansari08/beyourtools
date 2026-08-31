"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function SavingsGoalClient() {
  const [goalAmount,    setGoalAmount]    = useState("");
  const [currentSavings, setCurrentSavings] = useState("0");
  const [rate,          setRate]          = useState("");
  const [months,        setMonths]        = useState("");
  const [result, setResult] = useState<{
    monthlyRequired: number; totalContributions: number; interestEarned: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const G  = parseFloat(goalAmount);
    const P  = parseFloat(currentSavings) || 0;
    const r  = parseFloat(rate) / 100 / 12;
    const n  = parseFloat(months);

    if (!G || G <= 0)   { setError("Enter a valid savings goal amount."); return; }
    if (!n || n <= 0)   { setError("Enter a valid number of months to reach the goal."); return; }
    if (parseFloat(rate) < 0) { setError("Interest rate cannot be negative."); return; }

    // Future value of existing savings
    const fvExisting = r === 0 ? P : P * Math.pow(1 + r, n);
    const remaining  = G - fvExisting;

    if (remaining <= 0) {
      setResult({ monthlyRequired: 0, totalContributions: 0, interestEarned: G - P });
      return;
    }

    // PMT formula: PMT = remaining * r / ((1+r)^n - 1)
    let monthlyRequired: number;
    if (r === 0) {
      monthlyRequired = remaining / n;
    } else {
      monthlyRequired = (remaining * r) / (Math.pow(1 + r, n) - 1);
    }

    const totalContributions = monthlyRequired * n;
    const interestEarned     = G - P - totalContributions;

    setResult({ monthlyRequired, totalContributions, interestEarned });
  }

  function reset() {
    setGoalAmount(""); setCurrentSavings("0"); setRate(""); setMonths(""); setResult(null); setError("");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="sg-goal" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Savings Goal ($)
          </label>
          <input id="sg-goal" type="number" min="0" step="any" value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)} placeholder="e.g. 20000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Emergency fund, down payment, holiday, retirement — any target amount.
          </p>
        </div>
        <div>
          <label htmlFor="sg-cur" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Current Savings ($)
          </label>
          <input id="sg-cur" type="number" min="0" step="any" value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)} placeholder="e.g. 2000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sg-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Interest Rate (%)
            </label>
            <input id="sg-rate" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 4.5"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="sg-mo" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Months to Reach Goal
            </label>
            <input id="sg-mo" type="number" min="1" step="1" value={months}
              onChange={(e) => setMonths(e.target.value)} placeholder="e.g. 24"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
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
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          {result.monthlyRequired === 0 ? (
            <p className="text-sm" style={{ color: "var(--teal)" }}>
              Your current savings will already reach your goal with compound interest — no additional contributions needed!
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Required Monthly Savings", value: `$${fmt(result.monthlyRequired)}`, primary: true },
                { label: "Total You Contribute",     value: `$${fmt(result.totalContributions)}` },
                { label: "Interest Earned",          value: `$${fmt(Math.max(0, result.interestEarned))}` },
              ].map(({ label, value, primary }) => (
                <div key={label} className="rounded-lg border p-4 text-center"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                  <p className="mt-1 font-display text-xl font-bold"
                    style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
