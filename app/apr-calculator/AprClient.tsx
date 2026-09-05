"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number, d = 4) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function AprClient() {
  const [loanAmount, setLoanAmount]   = useState("");
  const [fees, setFees]               = useState("");
  const [rate, setRate]               = useState("");
  const [years, setYears]             = useState("");
  const [result, setResult] = useState<{
    apr: number; monthlyPayment: number; totalCost: number; totalInterest: number; totalFees: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const P      = parseFloat(loanAmount);
    const feeAmt = parseFloat(fees) || 0;
    const r      = parseFloat(rate) / 100 / 12;
    const n      = parseFloat(years) * 12;

    if (!P || P <= 0)          { setError("Enter a valid loan amount."); return; }
    if (parseFloat(rate) < 0)  { setError("Interest rate cannot be negative."); return; }
    if (!parseFloat(years) || parseFloat(years) <= 0) { setError("Enter a valid loan term."); return; }

    // Monthly payment on the full loan amount (at stated rate)
    const M = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // APR: find the monthly rate r_apr where PV of payments = net proceeds (P - fees).
    // PV(r) = M * [1 - (1+r)^-n] / r  →  bisect since PV is strictly decreasing in r.
    const netProceeds = P - feeAmt;
    if (netProceeds <= 0) {
      setError("Fees cannot exceed the loan amount.");
      return;
    }
    function pv(rMonth: number): number {
      if (rMonth <= 0) return M * n;
      return M * (1 - Math.pow(1 + rMonth, -n)) / rMonth;
    }
    let lo = 1e-8, hi = 2.0; // monthly rate: ~0% to 200% annual
    for (let i = 0; i < 300; i++) {
      const mid = (lo + hi) / 2;
      if (pv(mid) > netProceeds) lo = mid; else hi = mid;
      if (hi - lo < 1e-10) break;
    }
    const apr = lo * 12 * 100;

    setResult({
      apr,
      monthlyPayment: M,
      totalCost: M * n,
      totalInterest: M * n - P,
      totalFees: feeAmt,
    });
  }

  function reset() { setLoanAmount(""); setFees(""); setRate(""); setYears(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="apr-loan" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Loan Amount ($)
          </label>
          <input id="apr-loan" type="number" min="0" step="any" value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)} placeholder="e.g. 30000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="apr-fees" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Total Fees ($) - origination, points, closing costs
          </label>
          <input id="apr-fees" type="number" min="0" step="any" value={fees}
            onChange={(e) => setFees(e.target.value)} placeholder="e.g. 900"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Include all upfront costs paid at closing or folded into the loan.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="apr-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Stated Interest Rate (%)
            </label>
            <input id="apr-rate" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 6.5"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="apr-years" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Loan Term (years)
            </label>
            <input id="apr-years" type="number" min="0" step="any" value={years}
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
        <Btn variant="primary" size="lg" onClick={calculate}>
          Calculate APR
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>APR Results</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "True APR",            value: `${fmt(result.apr, 4)}%`,  primary: true },
              { label: "Monthly Payment",     value: `$${fmt(result.monthlyPayment, 2)}` },
              { label: "Total Interest",      value: `$${fmt(result.totalInterest, 2)}` },
              { label: "Total Fees",          value: `$${fmt(result.totalFees, 2)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-3 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Stated rate: {rate}% · True APR (including fees): {fmt(result.apr, 4)}%.
            The difference represents the annualised cost of upfront fees.
          </p>
        </div>
      )}
    </div>
  );
}
