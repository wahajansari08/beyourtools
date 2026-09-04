"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function LoanPaymentClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate]           = useState("");
  const [years, setYears]         = useState("");
  const [result, setResult] = useState<{
    monthly: number; totalPaid: number; totalInterest: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;   // monthly rate
    const n = parseFloat(years) * 12;         // total months

    if (!P || P <= 0)          { setError("Enter a valid loan amount greater than 0."); return; }
    if (parseFloat(rate) < 0)  { setError("Interest rate cannot be negative."); return; }
    if (!parseFloat(years) || parseFloat(years) <= 0) { setError("Enter a valid loan term in years."); return; }

    let monthly: number;
    if (r === 0) {
      monthly = P / n;
    } else {
      monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalPaid     = monthly * n;
    const totalInterest = totalPaid - P;
    setResult({ monthly, totalPaid, totalInterest });
  }

  function reset() { setPrincipal(""); setRate(""); setYears(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="lp-p" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Loan Amount ($)
          </label>
          <input id="lp-p" type="number" min="0" step="any" value={principal}
            onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 25000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lp-r" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Interest Rate (%)
            </label>
            <input id="lp-r" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 6.5"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="lp-y" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Loan Term (years)
            </label>
            <input id="lp-y" type="number" min="0" step="any" value={years}
              onChange={(e) => setYears(e.target.value)} placeholder="e.g. 5"
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Loan Payment Results</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Monthly Payment",  value: `$${fmt(result.monthly)}`,       primary: true },
              { label: "Total Amount Paid", value: `$${fmt(result.totalPaid)}` },
              { label: "Total Interest",    value: `$${fmt(result.totalInterest)}` },
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

          {/* Simple interest-vs-principal visual */}
          <div className="space-y-1">
            <p className="text-[11px] font-medium" style={{ color: "var(--text-subtle)" }}>
              Breakdown - Principal vs. Interest
            </p>
            <div className="flex h-4 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--border-strong)" }}>
              <div
                className="h-full transition-all"
                style={{
                  width: `${(parseFloat(principal) / result.totalPaid) * 100}%`,
                  backgroundColor: "var(--teal)",
                }}
                title={`Principal: $${fmt(parseFloat(principal))}`}
              />
              <div
                className="h-full"
                style={{ flex: 1, backgroundColor: "var(--coral)", opacity: 0.7 }}
                title={`Interest: $${fmt(result.totalInterest)}`}
              />
            </div>
            <div className="flex gap-4 text-[11px]" style={{ color: "var(--text-subtle)" }}>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--teal)" }} />
                Principal ${fmt(parseFloat(principal))}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--coral)", opacity: 0.7 }} />
                Interest ${fmt(result.totalInterest)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
