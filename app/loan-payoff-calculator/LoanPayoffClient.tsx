"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function LoanPayoffClient() {
  const [balance, setBalance]   = useState("");
  const [rate, setRate]         = useState("");
  const [payment, setPayment]   = useState("");
  const [result, setResult] = useState<{
    months: number; years: number; remMonths: number;
    totalInterest: number; totalPaid: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const P = parseFloat(balance);
    const annualRate = parseFloat(rate);
    const M = parseFloat(payment);

    if (!P || P <= 0)         { setError("Enter a valid remaining balance."); return; }
    if (annualRate < 0)       { setError("Interest rate cannot be negative."); return; }
    if (!M || M <= 0)         { setError("Enter a valid monthly payment."); return; }

    const r = annualRate / 100 / 12;
    const minPayment = r === 0 ? 0 : P * r; // interest only
    if (r > 0 && M <= minPayment) {
      setError(`Your payment of $${fmt(M)} doesn't cover the monthly interest of $${fmt(minPayment)}. Increase your payment.`);
      return;
    }

    let months = 0;
    let totalInterest = 0;
    let remaining = P;
    while (remaining > 0.005 && months < 1200) {
      const interest = remaining * r;
      totalInterest += interest;
      remaining = remaining + interest - M;
      months++;
    }
    if (months >= 1200) {
      setError("Payoff period exceeds 100 years. Please increase your monthly payment.");
      return;
    }

    setResult({
      months,
      years: Math.floor(months / 12),
      remMonths: months % 12,
      totalInterest,
      totalPaid: P + totalInterest,
    });
  }

  function reset() { setBalance(""); setRate(""); setPayment(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="lo-bal" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Current Loan Balance ($)
          </label>
          <input id="lo-bal" type="number" min="0" step="any" value={balance}
            onChange={(e) => setBalance(e.target.value)} placeholder="e.g. 15000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lo-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Interest Rate (%)
            </label>
            <input id="lo-rate" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 8.9"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="lo-pay" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Monthly Payment ($)
            </label>
            <input id="lo-pay" type="number" min="0" step="any" value={payment}
              onChange={(e) => setPayment(e.target.value)} placeholder="e.g. 350"
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
        <Btn variant="primary" size="lg" onClick={calculate}>
          Calculate
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Payoff Results</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Time to Pay Off",    value: `${result.years}y ${result.remMonths}m`, primary: true },
              { label: "Total Months",       value: `${result.months}` },
              { label: "Total Interest",     value: `$${fmt(result.totalInterest)}` },
              { label: "Total Paid",         value: `$${fmt(result.totalPaid)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-3 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold"
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
