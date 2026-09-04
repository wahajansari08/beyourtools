"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

type Frequency = "monthly" | "quarterly" | "annually";
type Compound   = "monthly" | "quarterly" | "annually" | "daily";

const COMPOUNDS: Record<Compound, number> = { daily: 365, monthly: 12, quarterly: 4, annually: 1 };
const CONTRIB_PER_YEAR: Record<Frequency, number> = { monthly: 12, quarterly: 4, annually: 1 };

export default function SavingsClient() {
  const [initial,    setInitial]    = useState("");
  const [monthly,    setMonthly]    = useState("");
  const [contribFreq, setContribFreq] = useState<Frequency>("monthly");
  const [rate,       setRate]       = useState("");
  const [compound,   setCompound]   = useState<Compound>("monthly");
  const [years,      setYears]      = useState("");
  const [result, setResult] = useState<{
    finalBalance: number; totalContributions: number; totalInterest: number;
    yearlyData: { year: number; balance: number; contributions: number; interest: number }[];
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const P    = parseFloat(initial) || 0;
    const C    = parseFloat(monthly) || 0;
    const r    = parseFloat(rate);
    const yrs  = parseFloat(years);
    const n    = COMPOUNDS[compound];
    const cpy  = CONTRIB_PER_YEAR[contribFreq];

    if (r < 0)          { setError("Interest rate cannot be negative."); return; }
    if (!yrs || yrs <= 0 || yrs > 100) { setError("Enter a valid term between 1 and 100 years."); return; }

    const annualRate = r / 100;
    const yearlyData: { year: number; balance: number; contributions: number; interest: number }[] = [];
    let balance      = P;
    let totalContrib = P;
    let totalInterest = 0;
    const contribPerPeriod = C;

    for (let yr = 1; yr <= yrs; yr++) {
      const startBalance = balance;
      // Compound interest + contributions for this year
      // Simulate each compounding period within the year
      const periodsPerYear = n;
      const ratePerPeriod  = annualRate / periodsPerYear;
      // Contributions deposited cpy times per year → map to compounding periods
      const contribsThisYear = contribPerPeriod * cpy;

      for (let p = 0; p < periodsPerYear; p++) {
        balance *= (1 + ratePerPeriod);
        // Add contribution proportionally across compounding periods
        balance += contribsThisYear / periodsPerYear;
      }

      const yearInterest  = balance - startBalance - contribsThisYear;
      totalContrib  += contribsThisYear;
      totalInterest += yearInterest;
      yearlyData.push({ year: yr, balance, contributions: totalContrib, interest: totalInterest });
    }

    setResult({ finalBalance: balance, totalContributions: totalContrib, totalInterest, yearlyData });
  }

  function reset() {
    setInitial(""); setMonthly(""); setRate(""); setYears(""); setResult(null); setError("");
  }

  const compoundLabels: Record<Compound, string>   = { daily: "Daily", monthly: "Monthly", quarterly: "Quarterly", annually: "Annually" };
  const freqLabels: Record<Frequency, string>      = { monthly: "Monthly", quarterly: "Quarterly", annually: "Annually" };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sv-init" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Initial Deposit ($)
            </label>
            <input id="sv-init" type="number" min="0" step="any" value={initial}
              onChange={(e) => setInitial(e.target.value)} placeholder="e.g. 5000"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="sv-contrib" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Regular Contribution ($)
            </label>
            <input id="sv-contrib" type="number" min="0" step="any" value={monthly}
              onChange={(e) => setMonthly(e.target.value)} placeholder="e.g. 200"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Contribution Frequency</p>
          <div className="flex gap-2" role="group">
            {(Object.keys(freqLabels) as Frequency[]).map((f) => (
              <button key={f} type="button" onClick={() => setContribFreq(f)}
                className="focus-ring rounded border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: contribFreq === f ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: contribFreq === f ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: contribFreq === f ? "var(--accent)" : "var(--text-muted)",
                }} aria-pressed={contribFreq === f}>{freqLabels[f]}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sv-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Interest Rate (%)
            </label>
            <input id="sv-rate" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 4.5"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="sv-years" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Savings Period (years)
            </label>
            <input id="sv-years" type="number" min="1" max="100" step="1" value={years}
              onChange={(e) => setYears(e.target.value)} placeholder="e.g. 20"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Compounding Frequency</p>
          <div className="flex flex-wrap gap-2" role="group">
            {(Object.keys(compoundLabels) as Compound[]).map((c) => (
              <button key={c} type="button" onClick={() => setCompound(c)}
                className="focus-ring rounded border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: compound === c ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: compound === c ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: compound === c ? "var(--accent)" : "var(--text-muted)",
                }} aria-pressed={compound === c}>{compoundLabels[c]}</button>
            ))}
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Savings Projection</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Final Balance",         value: `$${fmt(result.finalBalance)}`,        primary: true },
              { label: "Total Contributions",   value: `$${fmt(result.totalContributions)}` },
              { label: "Interest Earned",       value: `$${fmt(result.totalInterest)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Year-by-year table (first 10 + last) */}
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: "var(--bg-elevated)" }}>
                  {["Year", "Balance", "Contributions", "Interest Earned"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-semibold"
                      style={{ color: "var(--text-subtle)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.yearlyData
                  .filter((_, i, arr) => i < 10 || i === arr.length - 1)
                  .map((row, idx, filtered) => (
                  <>
                    {idx === filtered.length - 1 && result.yearlyData.length > 11 && (
                      <tr key="ellipsis">
                        <td colSpan={4} className="px-3 py-1.5 text-center"
                          style={{ color: "var(--text-subtle)" }}>⋯</td>
                      </tr>
                    )}
                    <tr key={row.year}
                      style={{ backgroundColor: idx % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)" }}>
                      <td className="px-3 py-1.5 font-mono" style={{ color: "var(--text-subtle)" }}>{row.year}</td>
                      <td className="px-3 py-1.5 font-mono font-semibold" style={{ color: "var(--teal)" }}>${fmt(row.balance)}</td>
                      <td className="px-3 py-1.5 font-mono" style={{ color: "var(--text-muted)" }}>${fmt(row.contributions)}</td>
                      <td className="px-3 py-1.5 font-mono" style={{ color: "var(--text-muted)" }}>${fmt(row.interest)}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
