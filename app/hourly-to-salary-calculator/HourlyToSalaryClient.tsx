"use client";
import { useState } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function HourlyToSalaryClient() {
  const [hourly, setHourly] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [result, setResult] = useState<{
    annual: number; monthly: number; biWeekly: number; weekly: number; daily: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const h = parseFloat(hourly);
    const hpw = parseFloat(hoursPerWeek);
    const wpy = parseFloat(weeksPerYear);
    if (!h || h <= 0) { setError("Enter a valid hourly rate greater than 0."); return; }
    if (!hpw || hpw <= 0 || hpw > 168) { setError("Hours per week must be between 1 and 168."); return; }
    if (!wpy || wpy <= 0 || wpy > 52) { setError("Weeks per year must be between 1 and 52."); return; }
    const annual = h * hpw * wpy;
    setResult({
      annual,
      monthly: annual / 12,
      biWeekly: annual / 26,
      weekly: h * hpw,
      daily: h * (hpw / 5),
    });
  }

  function reset() { setHourly(""); setHoursPerWeek("40"); setWeeksPerYear("52"); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="hts-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Hourly Rate ($)</label>
          <input id="hts-rate" type="number" min="0" step="any" value={hourly} onChange={(e) => setHourly(e.target.value)} placeholder="e.g. 25"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hts-hours" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Hours per Week</label>
            <input id="hts-hours" type="number" min="1" max="168" step="0.5" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="hts-weeks" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Weeks per Year</label>
            <input id="hts-weeks" type="number" min="1" max="52" step="1" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Use 50 for 2 weeks unpaid leave.</p>
          </div>
        </div>
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={calculate} className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>Calculate</button>
        <button type="button" onClick={reset} className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>Reset</button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Salary Equivalents</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Annual Salary", value: `$${fmt(result.annual)}`, primary: true },
              { label: "Monthly", value: `$${fmt(result.monthly)}` },
              { label: "Bi-Weekly (26×)", value: `$${fmt(result.biWeekly)}` },
              { label: "Weekly", value: `$${fmt(result.weekly)}` },
              { label: "Daily (5-day week)", value: `$${fmt(result.daily)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold" style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>These are gross figures before tax, FICA, or any other deductions.</p>
        </div>
      )}
    </div>
  );
}
