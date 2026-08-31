"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

interface Row {
  month: number; year: number; payment: number;
  principal: number; interest: number; balance: number;
}

export default function LoanAmortizationClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate]           = useState("");
  const [years, setYears]         = useState("");
  const [schedule, setSchedule]   = useState<Row[] | null>(null);
  const [summary, setSummary]     = useState<{ monthly: number; totalInterest: number; totalPaid: number } | null>(null);
  const [showAll, setShowAll]     = useState(false);
  const [error, setError]         = useState("");

  function calculate() {
    setError("");
    const P   = parseFloat(principal);
    const ann = parseFloat(rate);
    const yrs = parseFloat(years);
    if (!P || P <= 0)     { setError("Enter a valid loan amount."); return; }
    if (ann < 0)          { setError("Interest rate cannot be negative."); return; }
    if (!yrs || yrs <= 0) { setError("Enter a valid term in years."); return; }
    if (yrs > 50)         { setError("Maximum supported term is 50 years."); return; }

    const r = ann / 100 / 12;
    const n = Math.round(yrs * 12);
    const M = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const rows: Row[] = [];
    let bal = P;
    let totalInterest = 0;
    for (let i = 1; i <= n && bal > 0; i++) {
      const int  = bal * r;
      const princ = Math.min(M - int, bal);
      totalInterest += int;
      bal = Math.max(0, bal - princ);
      rows.push({
        month:     i,
        year:      Math.ceil(i / 12),
        payment:   princ + int,
        principal: princ,
        interest:  int,
        balance:   bal,
      });
    }
    setSchedule(rows);
    setSummary({ monthly: M, totalInterest, totalPaid: P + totalInterest });
    setShowAll(false);
  }

  function reset() { setPrincipal(""); setRate(""); setYears(""); setSchedule(null); setSummary(null); setError(""); }

  const visibleRows = schedule ? (showAll ? schedule : schedule.slice(0, 24)) : [];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="am-p" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Loan Amount ($)
          </label>
          <input id="am-p" type="number" min="0" step="any" value={principal}
            onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 300000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="am-r" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Interest Rate (%)
            </label>
            <input id="am-r" type="number" min="0" step="any" value={rate}
              onChange={(e) => setRate(e.target.value)} placeholder="e.g. 7.0"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="am-y" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Loan Term (years)
            </label>
            <input id="am-y" type="number" min="1" max="50" step="any" value={years}
              onChange={(e) => setYears(e.target.value)} placeholder="e.g. 30"
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
          Generate Schedule
        </button>
        <button type="button" onClick={reset}
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {summary && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          {/* Summary */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Monthly Payment",  value: `$${fmt(summary.monthly)}`,       primary: true },
              { label: "Total Interest",   value: `$${fmt(summary.totalInterest)}` },
              { label: "Total Paid",       value: `$${fmt(summary.totalPaid)}` },
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

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border"
            style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: "var(--bg-elevated)" }}>
                  {["Month", "Year", "Payment", "Principal", "Interest", "Balance"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-semibold"
                      style={{ color: "var(--text-subtle)", borderBottom: "1px solid var(--border)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, idx) => (
                  <tr key={row.month}
                    style={{ backgroundColor: idx % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)" }}>
                    <td className="px-3 py-1.5 font-mono" style={{ color: "var(--text-subtle)" }}>{row.month}</td>
                    <td className="px-3 py-1.5" style={{ color: "var(--text-subtle)" }}>{row.year}</td>
                    <td className="px-3 py-1.5 font-mono" style={{ color: "var(--text-primary)" }}>${fmt(row.payment)}</td>
                    <td className="px-3 py-1.5 font-mono" style={{ color: "var(--teal)" }}>${fmt(row.principal)}</td>
                    <td className="px-3 py-1.5 font-mono" style={{ color: "var(--coral)" }}>${fmt(row.interest)}</td>
                    <td className="px-3 py-1.5 font-mono" style={{ color: "var(--text-muted)" }}>${fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {schedule && schedule.length > 24 && (
            <button type="button" onClick={() => setShowAll((v) => !v)}
              className="focus-ring w-full rounded-lg border py-2 text-xs font-medium transition"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
              {showAll ? "Show fewer rows ↑" : `Show all ${schedule.length} months ↓`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
