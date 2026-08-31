"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function HourlyRateClient() {
  const [annualGoal, setAnnualGoal]     = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("50");
  const [overheadPct, setOverheadPct]   = useState("20");
  const [profitPct, setProfitPct]       = useState("10");
  const [result, setResult] = useState<{
    baseRate: number; withOverhead: number; withProfit: number;
    totalHours: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const goal  = parseFloat(annualGoal);
    const hpw   = parseFloat(hoursPerWeek);
    const wpy   = parseFloat(weeksPerYear);
    const oh    = parseFloat(overheadPct) || 0;
    const profit = parseFloat(profitPct) || 0;

    if (!goal || goal <= 0)   { setError("Enter a valid annual income goal."); return; }
    if (!hpw || hpw <= 0)     { setError("Enter valid hours per week."); return; }
    if (!wpy || wpy <= 0)     { setError("Enter valid weeks per year."); return; }

    const totalHours  = hpw * wpy;
    const baseRate    = goal / totalHours;
    const withOverhead = baseRate * (1 + oh / 100);
    const withProfit   = withOverhead * (1 + profit / 100);

    setResult({ baseRate, withOverhead, withProfit, totalHours });
  }

  function reset() {
    setAnnualGoal(""); setHoursPerWeek("40"); setWeeksPerYear("50");
    setOverheadPct("20"); setProfitPct("10"); setResult(null); setError("");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="hr-goal" className="mb-1 block text-xs font-medium"
            style={{ color: "var(--text-muted)" }}>Annual Income Goal ($)</label>
          <input id="hr-goal" type="number" min="0" step="any" value={annualGoal}
            onChange={(e) => setAnnualGoal(e.target.value)} placeholder="e.g. 90000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Gross revenue target (before taxes and expenses).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hr-hpw" className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-muted)" }}>Hours per Week</label>
            <input id="hr-hpw" type="number" min="1" max="168" step="0.5" value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="hr-wpy" className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-muted)" }}>Weeks per Year</label>
            <input id="hr-wpy" type="number" min="1" max="52" step="1" value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
              Exclude vacation; 50 = 2 weeks off.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hr-oh" className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-muted)" }}>Overhead Buffer (%)</label>
            <input id="hr-oh" type="number" min="0" max="100" step="1" value={overheadPct}
              onChange={(e) => setOverheadPct(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
              Covers unpaid admin, non-billable time, expenses.
            </p>
          </div>
          <div>
            <label htmlFor="hr-profit" className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-muted)" }}>Profit Margin (%)</label>
            <input id="hr-profit" type="number" min="0" max="100" step="1" value={profitPct}
              onChange={(e) => setProfitPct(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
              Added on top of overhead for sustainable growth.
            </p>
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
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Hourly Rate — {fmt(result.totalHours, 0)} hours/year
          </h3>
          <div className="space-y-3">
            {[
              { label: "Base Rate (income ÷ hours)", value: result.baseRate, desc: "Bare minimum — no overhead buffer" },
              { label: `With Overhead (+${overheadPct}%)`, value: result.withOverhead, desc: "Covers admin, gaps, non-billable time" },
              { label: `Recommended Rate (+${profitPct}% profit)`, value: result.withProfit, desc: "Sustainable long-term rate", primary: true },
            ].map(({ label, value, desc, primary }) => (
              <div key={label} className="flex items-center justify-between rounded-lg border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{desc}</p>
                </div>
                <p className="font-display text-xl font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>
                  ${fmt(value)}/hr
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
