"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";

function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function sipFv(monthly: number, annualPct: number, years: number): number {
  const r = annualPct / 12 / 100;
  const n = Math.round(years * 12);
  if (n <= 0 || monthly <= 0) return 0;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

interface YearRow {
  year: number;
  invested: number;
  value: number;
  gains: number;
}

function Chart({ rows, monthly }: { rows: YearRow[]; monthly: number }) {
  const W = 640;
  const H = 300;
  const padL = 56;
  const padR = 12;
  const padT = 12;
  const padB = 30;
  const maxV = Math.max(...rows.map((r) => r.value), 1);
  const maxYear = Math.max(...rows.map((r) => r.year), 1);
  const x = (year: number) => padL + (year / maxYear) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / maxV) * (H - padT - padB);

  const valuePath = rows.map((r, i) => `${i === 0 ? "M" : "L"}${x(r.year).toFixed(1)},${y(r.value).toFixed(1)}`).join(" ");
  const investedPath = rows.map((r, i) => `${i === 0 ? "M" : "L"}${x(r.year).toFixed(1)},${y(r.invested).toFixed(1)}`).join(" ");
  const areaPath = `${valuePath} L${x(maxYear).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;

  const yTicks = 4;
  const yearStep = Math.max(1, Math.ceil(maxYear / 6));

  return (
    <div role="img" aria-label={`Growth chart: monthly investment of ${monthly} growing over ${maxYear} years`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 340 }}>
        <defs>
          <linearGradient id="sip-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const v = (maxV / yTicks) * i;
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth="1" />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--text-subtle)">
                {v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : Math.round(v)}
              </text>
            </g>
          );
        })}
        {Array.from({ length: Math.floor(maxYear / yearStep) + 1 }, (_, i) => {
          const yr = i * yearStep;
          return (
            <text key={yr} x={x(yr)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--text-subtle)">
              Yr {yr}
            </text>
          );
        })}
        <path d={areaPath} fill="url(#sip-area)" />
        <path d={investedPath} fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="5 4" />
        <path d={valuePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={x(maxYear)} cy={y(rows[rows.length - 1].value)} r="4" fill="var(--accent)" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          Projected value
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
          Total invested (dashed)
        </span>
      </div>
    </div>
  );
}

export default function SipCalculatorClient() {
  const [monthly, setMonthly] = useState("500");
  const [annualPct, setAnnualPct] = useState("12");
  const [years, setYears] = useState("10");
  const [error, setError] = useState("");

  const calc = useMemo(() => {
    const m = parseFloat(monthly);
    const a = parseFloat(annualPct);
    const y = parseFloat(years);
    if (!Number.isFinite(m) || m <= 0) return { ok: false as const, error: "Enter a monthly investment greater than 0." };
    if (!Number.isFinite(a) || a < 0 || a > 100) return { ok: false as const, error: "Enter an expected annual return between 0 and 100." };
    if (!Number.isFinite(y) || y < 1 || y > 50) return { ok: false as const, error: "Enter an investment period between 1 and 50 years." };
    const n = Math.round(y * 12);
    const fv = sipFv(m, a, y);
    const invested = m * n;
    const rows: YearRow[] = [];
    for (let yr = 1; yr <= Math.floor(y); yr++) {
      const inv = m * yr * 12;
      const val = sipFv(m, a, yr);
      rows.push({ year: yr, invested: inv, value: val, gains: val - inv });
    }
    return { ok: true as const, fv, invested, gains: fv - invested, rows };
  }, [monthly, annualPct, years]);

  const inputCls = "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
  const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" } as const;
  const labelCls = "mb-1 block text-xs font-medium";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="sip-monthly" className={labelCls} style={{ color: "var(--text-muted)" }}>
              Monthly investment ($)
            </label>
            <input id="sip-monthly" type="number" min="1" step="any" value={monthly} onChange={(e) => setMonthly(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="sip-rate" className={labelCls} style={{ color: "var(--text-muted)" }}>
              Expected annual return (%)
            </label>
            <input id="sip-rate" type="number" min="0" max="100" step="any" value={annualPct} onChange={(e) => setAnnualPct(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="sip-years" className={labelCls} style={{ color: "var(--text-muted)" }}>
              Investment period (years)
            </label>
            <input id="sip-years" type="number" min="1" max="50" step="1" value={years} onChange={(e) => setYears(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
        </div>
      </div>

      {!calc.ok ? (
        <div className="rounded-xl border p-6 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <p className="text-sm" role="alert" style={{ color: "var(--color-danger, #e5484d)" }}>
            {calc.error ?? "Enter values above to see your projection."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="status" aria-live="polite">
            {[
              { label: "Projected value", value: `$${fmtMoney(calc.fv)}`, accent: true },
              { label: "Total invested", value: `$${fmtMoney(calc.invested)}`, accent: false },
              { label: "Growth", value: `$${fmtMoney(calc.gains)}`, accent: false },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-2xl font-bold tabular-nums sm:text-3xl" style={{ color: s.accent ? "var(--accent)" : "var(--text-primary)" }}>
                  {s.value}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Growth over time
            </h2>
            <Chart rows={calc.rows} monthly={parseFloat(monthly)} />
          </div>

          <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Year-by-year breakdown
            </h2>
            <div className="max-h-80 overflow-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0" style={{ backgroundColor: "var(--bg-elevated)" }}>
                  <tr>
                    {["Year", "Invested", "Value", "Growth"].map((h) => (
                      <th key={h} className="px-4 py-2 text-right font-medium first:text-left" style={{ color: "var(--text-muted)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calc.rows.map((r) => (
                    <tr key={r.year} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="px-4 py-2 tabular-nums" style={{ color: "var(--text-primary)" }}>{r.year}</td>
                      <td className="px-4 py-2 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>${fmtMoney(r.invested)}</td>
                      <td className="px-4 py-2 text-right font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>${fmtMoney(r.value)}</td>
                      <td className="px-4 py-2 text-right tabular-nums" style={{ color: "var(--accent)" }}>+${fmtMoney(r.gains)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Btn variant="ghost" size="sm" onClick={() => { setMonthly("500"); setAnnualPct("12"); setYears("10"); }}>
              Reset to example
            </Btn>
            <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
              Assumes a fixed {annualPct}% return and monthly compounding. Real investments fluctuate.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
