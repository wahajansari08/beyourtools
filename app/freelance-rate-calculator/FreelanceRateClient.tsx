"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function FreelanceRateClient() {
  const [desiredIncome, setDesiredIncome]     = useState("");
  const [businessExpenses, setBusinessExpenses] = useState("");
  const [selfEmployTax, setSelfEmployTax]     = useState("15.3");
  const [incomeTaxRate, setIncomeTaxRate]     = useState("22");
  const [billableHours, setBillableHours]     = useState("1200");
  const [vacationWeeks, setVacationWeeks]     = useState("2");
  const [result, setResult] = useState<{
    hourlyRate: number; annualGross: number; dailyRate: number;
    totalExpenses: number; taxBurden: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const income  = parseFloat(desiredIncome);
    const expenses = parseFloat(businessExpenses) || 0;
    const seTax   = parseFloat(selfEmployTax) || 0;
    const itax    = parseFloat(incomeTaxRate) || 0;
    const hours   = parseFloat(billableHours);

    if (!income || income <= 0) { setError("Enter a desired annual net income greater than 0."); return; }
    if (!hours  || hours <= 0)  { setError("Enter valid billable hours per year."); return; }
    if (seTax < 0 || seTax > 50) { setError("Self-employment tax must be 0–50%."); return; }
    if (itax < 0 || itax > 60)   { setError("Income tax rate must be 0–60%."); return; }

    const totalTaxRate = (seTax + itax) / 100;
    // Gross needed = (net income + expenses) / (1 - tax rate)
    const annualGross  = (income + expenses) / (1 - totalTaxRate);
    const taxBurden    = annualGross * totalTaxRate;
    const hourlyRate   = annualGross / hours;
    const dailyRate    = hourlyRate * 8;

    setResult({ hourlyRate, annualGross, dailyRate, totalExpenses: expenses, taxBurden });
  }

  function reset() {
    setDesiredIncome(""); setBusinessExpenses(""); setSelfEmployTax("15.3");
    setIncomeTaxRate("22"); setBillableHours("1200"); setVacationWeeks("2");
    setResult(null); setError("");
  }

  // Derive suggested billable hours when vacation changes
  function handleVacation(weeks: string) {
    setVacationWeeks(weeks);
    const vw = parseFloat(weeks) || 0;
    const workingWeeks = 52 - vw;
    setBillableHours(String(Math.round(workingWeeks * 30))); // assume 30 billable hrs/week
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="fr-income" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Desired Annual Net Income ($)
          </label>
          <input id="fr-income" type="number" min="0" step="any" value={desiredIncome}
            onChange={(e) => setDesiredIncome(e.target.value)} placeholder="e.g. 80000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>After-tax take-home you want to earn.</p>
        </div>
        <div>
          <label htmlFor="fr-exp" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Annual Business Expenses ($)
          </label>
          <input id="fr-exp" type="number" min="0" step="any" value={businessExpenses}
            onChange={(e) => setBusinessExpenses(e.target.value)} placeholder="e.g. 5000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Software, equipment, insurance, professional fees, etc.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fr-se" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Self-Employment Tax Rate (%)
            </label>
            <input id="fr-se" type="number" min="0" max="50" step="0.1" value={selfEmployTax}
              onChange={(e) => setSelfEmployTax(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>US: 15.3% (Social Security + Medicare).</p>
          </div>
          <div>
            <label htmlFor="fr-it" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Income Tax Rate (%)
            </label>
            <input id="fr-it" type="number" min="0" max="60" step="0.5" value={incomeTaxRate}
              onChange={(e) => setIncomeTaxRate(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Federal + state combined effective rate.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fr-vac" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Vacation Weeks per Year
            </label>
            <input id="fr-vac" type="number" min="0" max="20" step="1" value={vacationWeeks}
              onChange={(e) => handleVacation(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="fr-hrs" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Billable Hours per Year
            </label>
            <input id="fr-hrs" type="number" min="1" step="10" value={billableHours}
              onChange={(e) => setBillableHours(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Realistic billable hours (not total working hours).</p>
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
          Calculate Rate
        </button>
        <button type="button" onClick={reset}
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Your Minimum Freelance Rate</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Hourly Rate",   value: `$${fmt(result.hourlyRate)}`,  primary: true },
              { label: "Day Rate (8h)", value: `$${fmt(result.dailyRate)}` },
              { label: "Annual Gross",  value: `$${fmt(result.annualGross)}` },
              { label: "Tax Burden",    value: `$${fmt(result.taxBurden)}` },
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
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            This is your break-even rate. Add 10–20% buffer for unpaid admin time, late payments, and dry spells.
          </p>
        </div>
      )}
    </div>
  );
}
