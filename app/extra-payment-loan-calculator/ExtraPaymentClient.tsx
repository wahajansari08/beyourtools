"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function amortize(P: number, r: number, M: number) {
  let months = 0, interest = 0, bal = P;
  while (bal > 0.005 && months < 1200) {
    const int = bal * r;
    interest += int;
    bal = bal + int - M;
    months++;
  }
  return { months, interest, total: P + interest };
}

export default function ExtraPaymentClient() {
  const [principal, setPrincipal]   = useState("");
  const [rate, setRate]             = useState("");
  const [years, setYears]           = useState("");
  const [extraMonthly, setExtraMonthly] = useState("0");
  const [lumpSum, setLumpSum]       = useState("0");
  const [lumpMonth, setLumpMonth]   = useState("1");
  const [result, setResult] = useState<{
    baseMonthly: number;
    origMonths: number; origInterest: number;
    newMonths: number;  newInterest: number;
    savedInterest: number; savedMonths: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const yrs = parseFloat(years);
    if (!P || P <= 0)     { setError("Enter a valid loan amount."); return; }
    if (annualRate < 0)   { setError("Interest rate cannot be negative."); return; }
    if (!yrs || yrs <= 0) { setError("Enter a valid term in years."); return; }

    const r = annualRate / 100 / 12;
    const n = yrs * 12;
    const M = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const extra     = parseFloat(extraMonthly) || 0;
    const lump      = parseFloat(lumpSum) || 0;
    const lumpMo    = Math.max(1, parseInt(lumpMonth) || 1);

    // Baseline (no extra)
    const base = amortize(P, r, M);

    // With extra payments
    let months = 0, totalInterest = 0, bal = P;
    while (bal > 0.005 && months < 1200) {
      months++;
      // Apply lump sum at designated month
      if (months === lumpMo && lump > 0) bal = Math.max(0, bal - lump);
      if (bal <= 0) break;
      const int = bal * r;
      totalInterest += int;
      bal = bal + int - M - extra;
    }

    setResult({
      baseMonthly: M,
      origMonths: base.months, origInterest: base.interest,
      newMonths: months, newInterest: totalInterest,
      savedInterest: base.interest - totalInterest,
      savedMonths: base.months - months,
    });
  }

  function reset() {
    setPrincipal(""); setRate(""); setYears(""); setExtraMonthly("0");
    setLumpSum("0"); setLumpMonth("1"); setResult(null); setError("");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          Loan Details
        </p>
        <div>
          <label htmlFor="ep-p" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Loan Amount ($)
          </label>
          <input id="ep-p" type="number" min="0" step="any" value={principal}
            onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 300000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ep-r" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Interest Rate (%)
            </label>
            <input id="ep-r" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 6.5"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="ep-y" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Loan Term (years)
            </label>
            <input id="ep-y" type="number" min="0" step="any" value={years}
              onChange={(e) => setYears(e.target.value)} placeholder="e.g. 30"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide pt-2" style={{ color: "var(--text-subtle)" }}>
          Extra Payments
        </p>
        <div>
          <label htmlFor="ep-extra" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Extra Monthly Payment ($)
          </label>
          <input id="ep-extra" type="number" min="0" step="any" value={extraMonthly}
            onChange={(e) => setExtraMonthly(e.target.value)} placeholder="e.g. 200"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ep-lump" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              One-Time Lump Sum ($)
            </label>
            <input id="ep-lump" type="number" min="0" step="any" value={lumpSum}
              onChange={(e) => setLumpSum(e.target.value)} placeholder="e.g. 5000"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="ep-lumpmo" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Apply in Month #
            </label>
            <input id="ep-lumpmo" type="number" min="1" step="1" value={lumpMonth}
              onChange={(e) => setLumpMonth(e.target.value)} placeholder="e.g. 12"
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
          Calculate Savings
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Extra Payment Savings</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Without Extra Payments", months: result.origMonths, interest: result.origInterest, accent: false },
              { label: "With Extra Payments",    months: result.newMonths,  interest: result.newInterest,  accent: true  },
            ].map(({ label, months, interest, accent }) => (
              <div key={label} className="rounded-lg border p-4 space-y-2"
                style={{
                  borderColor: accent ? "color-mix(in srgb,var(--teal) 30%,transparent)" : "var(--border)",
                  backgroundColor: accent ? "color-mix(in srgb,var(--teal) 6%,transparent)" : "var(--bg-elevated)",
                }}>
                <p className="text-xs font-semibold" style={{ color: accent ? "var(--teal)" : "var(--text-secondary)" }}>{label}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {Math.floor(months / 12)}y {months % 12}m ({months} payments)
                </p>
                <p className="font-display text-xl font-bold" style={{ color: accent ? "var(--teal)" : "var(--text-primary)" }}>
                  ${fmt(interest)} interest
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4" style={{ borderColor: "color-mix(in srgb,var(--teal) 30%,transparent)", backgroundColor: "color-mix(in srgb,var(--teal) 8%,transparent)" }}>
              <p className="text-xs" style={{ color: "var(--text-subtle)" }}>Interest Saved</p>
              <p className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--teal)" }}>
                ${fmt(result.savedInterest)}
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "color-mix(in srgb,var(--teal) 30%,transparent)", backgroundColor: "color-mix(in srgb,var(--teal) 8%,transparent)" }}>
              <p className="text-xs" style={{ color: "var(--text-subtle)" }}>Months Saved</p>
              <p className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--teal)" }}>
                {result.savedMonths} months
              </p>
            </div>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Base monthly payment: ${fmt(result.baseMonthly)}. Extra payments applied to principal.
          </p>
        </div>
      )}
    </div>
  );
}
