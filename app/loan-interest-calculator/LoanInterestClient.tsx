"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function LoanInterestClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate]           = useState("");
  const [years, setYears]         = useState("");
  const [result, setResult] = useState<{
    monthly: number; totalInterest: number; totalPaid: number;
    interestRatio: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const yrs = parseFloat(years);
    if (!P || P <= 0)       { setError("Enter a valid loan amount."); return; }
    if (annualRate < 0)     { setError("Interest rate cannot be negative."); return; }
    if (!yrs || yrs <= 0)   { setError("Enter a valid term in years."); return; }

    const r = annualRate / 100 / 12;
    const n = yrs * 12;
    const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid     = monthly * n;
    const totalInterest = totalPaid - P;
    setResult({ monthly, totalInterest, totalPaid, interestRatio: (totalInterest / P) * 100 });
  }

  function reset() { setPrincipal(""); setRate(""); setYears(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="li-p" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Loan Amount ($)
          </label>
          <input id="li-p" type="number" min="0" step="any" value={principal}
            onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 200000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="li-r" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Interest Rate (%)
            </label>
            <input id="li-r" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 7.0"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="li-y" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Loan Term (years)
            </label>
            <input id="li-y" type="number" min="0" step="any" value={years}
              onChange={(e) => setYears(e.target.value)} placeholder="e.g. 30"
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
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Interest Cost Results</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Interest",      value: `$${fmt(result.totalInterest)}`,  primary: true },
              { label: "Monthly Payment",     value: `$${fmt(result.monthly)}` },
              { label: "Total Amount Paid",   value: `$${fmt(result.totalPaid)}` },
              { label: "Interest as % of Loan", value: `${fmt(result.interestRatio)}%` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-3 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold"
                  style={{ color: primary ? "var(--coral)" : "var(--text-primary)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Paying off this loan early or making extra payments will reduce your total interest significantly.
            See the Extra Payment Loan Calculator for details.
          </p>
        </div>
      )}
    </div>
  );
}
