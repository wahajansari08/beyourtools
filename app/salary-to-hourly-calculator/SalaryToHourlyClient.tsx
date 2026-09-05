"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type Period = "annual" | "monthly" | "biweekly" | "weekly";

export default function SalaryToHourlyClient() {
  const [salary, setSalary] = useState("");
  const [period, setPeriod] = useState<Period>("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [result, setResult] = useState<{ hourly: number; annual: number; weekly: number } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const s = parseFloat(salary);
    const hpw = parseFloat(hoursPerWeek);
    const wpy = parseFloat(weeksPerYear);
    if (!s || s <= 0) { setError("Enter a valid salary greater than 0."); return; }
    if (!hpw || hpw <= 0 || hpw > 168) { setError("Hours per week must be 1–168."); return; }
    if (!wpy || wpy <= 0 || wpy > 52) { setError("Weeks per year must be 1–52."); return; }

    let annual = s;
    if (period === "monthly") annual = s * 12;
    else if (period === "biweekly") annual = s * 26;
    else if (period === "weekly") annual = s * wpy;

    const totalHours = hpw * wpy;
    const hourly = annual / totalHours;
    setResult({ hourly, annual, weekly: hourly * hpw });
  }

  function reset() { setSalary(""); setPeriod("annual"); setHoursPerWeek("40"); setWeeksPerYear("52"); setResult(null); setError(""); }

  const periods: { id: Period; label: string }[] = [
    { id: "annual", label: "Annual" },
    { id: "monthly", label: "Monthly" },
    { id: "biweekly", label: "Bi-Weekly" },
    { id: "weekly", label: "Weekly" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Salary Period</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Salary period">
            {periods.map((p) => (
              <Btn variant="toggle" size="sm" key={p.id} onClick={() => { setPeriod(p.id); setResult(null); }} selected={period === p.id}>{p.label}</Btn>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="sth-sal" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {period === "annual" ? "Annual Salary ($)" : period === "monthly" ? "Monthly Salary ($)" : period === "biweekly" ? "Bi-Weekly Salary ($)" : "Weekly Salary ($)"}
          </label>
          <input id="sth-sal" type="number" min="0" step="any" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 60000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sth-hours" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Hours per Week</label>
            <input id="sth-hours" type="number" min="1" max="168" step="0.5" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="sth-weeks" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Weeks per Year</label>
            <input id="sth-weeks" type="number" min="1" max="52" step="1" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        </div>
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <Btn variant="primary" size="lg" onClick={calculate}>
          Calculate
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Hourly Rate", value: `$${fmt(result.hourly)}`, primary: true },
              { label: "Annual Salary", value: `$${fmt(result.annual)}` },
              { label: "Weekly Pay", value: `$${fmt(result.weekly)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold" style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Gross figures before tax and deductions.</p>
        </div>
      )}
    </div>
  );
}
