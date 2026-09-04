"use client";
import { useState } from "react";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

type PayPeriod = "weekly" | "biweekly" | "semimonthly" | "monthly";
const PAY_PERIODS: Record<PayPeriod, { label: string; perYear: number }> = {
  weekly:      { label: "Weekly",       perYear: 52 },
  biweekly:    { label: "Bi-Weekly",    perYear: 26 },
  semimonthly: { label: "Semi-Monthly", perYear: 24 },
  monthly:     { label: "Monthly",      perYear: 12 },
};

// 2024 federal tax brackets (single filer, annualised)
function federalTax(annualIncome: number): number {
  const brackets = [
    { limit: 11600,  rate: 0.10 },
    { limit: 47150,  rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ];
  let tax = 0;
  let prev = 0;
  for (const { limit, rate } of brackets) {
    if (annualIncome <= prev) break;
    tax += (Math.min(annualIncome, limit) - prev) * rate;
    prev = limit;
  }
  return tax;
}

export default function PaycheckClient() {
  const [annualSalary, setAnnualSalary] = useState("");
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("biweekly");
  const [stateTaxRate, setStateTaxRate] = useState("5");
  const [retirement401k, setRetirement401k] = useState("0");
  const [healthInsurance, setHealthInsurance] = useState("0");
  const [otherDeductions, setOtherDeductions] = useState("0");
  const [result, setResult] = useState<{
    grossPaycheck: number; federalTax: number; stateTax: number;
    socialSecurity: number; medicare: number; totalDeductions: number; netPay: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const annual = parseFloat(annualSalary);
    if (!annual || annual <= 0) { setError("Enter a valid annual salary."); return; }
    const stateRate = parseFloat(stateTaxRate) || 0;
    if (stateRate < 0 || stateRate > 20) { setError("State tax rate must be 0–20%."); return; }
    const pp = PAY_PERIODS[payPeriod];
    const grossPaycheck = annual / pp.perYear;

    // Pre-tax deductions (reduce taxable income)
    const retirementPerPaycheck = (parseFloat(retirement401k) || 0) / 100 * grossPaycheck;
    const healthPerPaycheck = parseFloat(healthInsurance) || 0;
    const otherPerPaycheck = parseFloat(otherDeductions) || 0;
    const preTaxDeductions = retirementPerPaycheck + healthPerPaycheck;
    const taxableAnnual = (grossPaycheck - preTaxDeductions) * pp.perYear;

    const fedTaxAnnual = federalTax(taxableAnnual);
    const fedPerPaycheck = fedTaxAnnual / pp.perYear;
    const statePerPaycheck = (taxableAnnual * stateRate / 100) / pp.perYear;
    const ssPerPaycheck = Math.min(grossPaycheck, (160200 / pp.perYear)) * 0.062;
    const medicarePerPaycheck = grossPaycheck * 0.0145;

    const totalDeductions = fedPerPaycheck + statePerPaycheck + ssPerPaycheck + medicarePerPaycheck + preTaxDeductions + otherPerPaycheck;
    const netPay = grossPaycheck - totalDeductions;

    setResult({
      grossPaycheck,
      federalTax: fedPerPaycheck,
      stateTax: statePerPaycheck,
      socialSecurity: ssPerPaycheck,
      medicare: medicarePerPaycheck,
      totalDeductions,
      netPay,
    });
  }

  function reset() {
    setAnnualSalary(""); setStateTaxRate("5"); setRetirement401k("0");
    setHealthInsurance("0"); setOtherDeductions("0"); setResult(null); setError("");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="pc-annual" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Annual Salary ($)</label>
          <input id="pc-annual" type="number" min="0" step="any" value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} placeholder="e.g. 75000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Pay Period</p>
          <div className="flex flex-wrap gap-2" role="group">
            {(Object.entries(PAY_PERIODS) as [PayPeriod, { label: string; perYear: number }][]).map(([key, { label }]) => (
              <button key={key} type="button" onClick={() => { setPayPeriod(key); setResult(null); }}
                className="focus-ring rounded border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: payPeriod === key ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: payPeriod === key ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: payPeriod === key ? "var(--accent)" : "var(--text-muted)",
                }} aria-pressed={payPeriod === key}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="pc-state" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            State Income Tax Rate (% - enter 0 for no state tax)
          </label>
          <input id="pc-state" type="number" min="0" max="20" step="0.1" value={stateTaxRate} onChange={(e) => setStateTaxRate(e.target.value)}
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>US average ≈ 5%. No state tax: AK, FL, NV, NH, SD, TN, TX, WA, WY.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="pc-401k" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>401(k) Contribution (%)</label>
            <input id="pc-401k" type="number" min="0" max="100" step="0.5" value={retirement401k} onChange={(e) => setRetirement401k(e.target.value)} placeholder="e.g. 6"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="pc-health" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Health Insurance ($/paycheck)</label>
            <input id="pc-health" type="number" min="0" step="any" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} placeholder="e.g. 150"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="pc-other" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Other Deductions ($/paycheck)</label>
            <input id="pc-other" type="number" min="0" step="any" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} placeholder="e.g. 50"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        </div>
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={calculate} className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>Calculate</button>
        <button type="button" onClick={reset} className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>Reset</button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Paycheck Breakdown - {PAY_PERIODS[payPeriod].label}</h3>
          <div className="space-y-2">
            {[
              { label: "Gross Pay", value: result.grossPaycheck, type: "positive" as const },
              { label: "Federal Income Tax", value: -result.federalTax, type: "deduct" as const },
              { label: "State Income Tax", value: -result.stateTax, type: "deduct" as const },
              { label: "Social Security (6.2%)", value: -result.socialSecurity, type: "deduct" as const },
              { label: "Medicare (1.45%)", value: -result.medicare, type: "deduct" as const },
            ].map(({ label, value, type }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b"
                style={{ borderColor: "var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                <span className="text-xs font-medium font-mono" style={{ color: type === "positive" ? "var(--text-primary)" : "var(--coral)" }}>
                  {value < 0 ? "-" : ""}${fmt(Math.abs(value))}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: "color-mix(in srgb,var(--teal) 30%,transparent)", backgroundColor: "color-mix(in srgb,var(--teal) 8%,transparent)" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Estimated Take-Home Pay</span>
              <span className="font-display text-2xl font-bold" style={{ color: "var(--teal)" }}>${fmt(result.netPay)}</span>
            </div>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            ⚠ Estimate only - uses 2024 US federal brackets for single filers. Actual tax depends on filing status, W-4 elections, and deductions. Consult a tax professional for exact figures.
          </p>
        </div>
      )}
    </div>
  );
}
