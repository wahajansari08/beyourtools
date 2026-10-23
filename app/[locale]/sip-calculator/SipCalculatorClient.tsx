"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";
import SegmentedControl from "@/components/SegmentedControl";

const CURRENCIES = [
  { code: "USD", symbol: "$", locale: "en-US", label: "USD ($)" },
  { code: "EUR", symbol: "€", locale: "de-DE", label: "EUR (€)" },
  { code: "GBP", symbol: "£", locale: "en-GB", label: "GBP (£)" },
  { code: "INR", symbol: "₹", locale: "en-IN", label: "INR (₹)" },
  { code: "PKR", symbol: "₨", locale: "en-PK", label: "PKR (₨)" },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

function getCurrency(code: CurrencyCode) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

function fmtMoney(n: number, cur: (typeof CURRENCIES)[number]): string {
  return new Intl.NumberFormat(cur.locale, {
    style: "currency",
    currency: cur.code,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtShort(n: number, cur: (typeof CURRENCIES)[number]): string {
  const abs = Math.abs(n);
  if (cur.code === "INR" || cur.code === "PKR") {
    if (abs >= 10_000_000) return `${cur.symbol}${(n / 10_000_000).toFixed(1)}Cr`;
    if (abs >= 100_000) return `${cur.symbol}${(n / 100_000).toFixed(1)}L`;
    if (abs >= 1_000) return `${cur.symbol}${Math.round(n / 1_000)}k`;
    return `${cur.symbol}${Math.round(n)}`;
  }
  if (abs >= 1_000_000) return `${cur.symbol}${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${cur.symbol}${Math.round(n / 1_000)}k`;
  return `${cur.symbol}${Math.round(n)}`;
}

interface YearRow {
  year: number;
  invested: number;
  value: number;
  gains: number;
}

/**
 * Future value of a SIP with an optional annual step-up.
 * Each year's 12 monthly payments form an annuity-due at the monthly rate r;
 * the monthly payment grows by `stepUp` every year.
 */
function sipSchedule(
  monthly: number,
  annualPct: number,
  years: number,
  stepUpPct: number
): { fv: number; invested: number; rows: YearRow[] } {
  const r = annualPct / 12 / 100;
  const s = stepUpPct / 100;
  const yearFactor = r === 0 ? 12 : ((Math.pow(1 + r, 12) - 1) / r) * (1 + r);
  const wholeYears = Math.floor(years);
  let fv = 0;
  let invested = 0;
  const rows: YearRow[] = [];
  for (let y = 1; y <= wholeYears; y++) {
    const pay = monthly * Math.pow(1 + s, y - 1);
    invested += pay * 12;
    fv = fv * Math.pow(1 + r, 12) + pay * yearFactor;
    rows.push({ year: y, invested, value: fv, gains: fv - invested });
  }
  return { fv, invested, rows };
}

function Chart({
  rows,
  monthly,
  cur,
}: {
  rows: YearRow[];
  monthly: number;
  cur: (typeof CURRENCIES)[number];
}) {
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
    <div role="img" aria-label={`Growth chart: monthly investment of ${fmtMoney(monthly, cur)} growing over ${maxYear} years`}>
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
                {fmtShort(v, cur)}
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
  const [stepUp, setStepUp] = useState("0");
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");

  const cur = getCurrency(currencyCode);

  const calc = useMemo(() => {
    const m = parseFloat(monthly);
    const a = parseFloat(annualPct);
    const y = parseFloat(years);
    const s = parseFloat(stepUp);
    if (!Number.isFinite(m) || m <= 0) return { ok: false as const, error: "Enter a monthly investment greater than 0." };
    if (!Number.isFinite(a) || a < 0 || a > 100) return { ok: false as const, error: "Enter an expected annual return between 0 and 100." };
    if (!Number.isFinite(y) || y < 1 || y > 50) return { ok: false as const, error: "Enter an investment period between 1 and 50 years." };
    if (!Number.isFinite(s) || s < 0 || s > 100) return { ok: false as const, error: "Enter an annual step-up between 0 and 100%." };
    const { fv, invested, rows } = sipSchedule(m, a, y, s);
    return { ok: true as const, fv, invested, gains: fv - invested, rows, stepUp: s };
  }, [monthly, annualPct, years, stepUp]);

  const inputCls = "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
  const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" } as const;
  const labelCls = "mb-1 block text-xs font-medium";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="mb-4">
          <SegmentedControl<CurrencyCode>
            label="Currency"
            value={currencyCode}
            onChange={setCurrencyCode}
            options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="sip-monthly" className={labelCls} style={{ color: "var(--text-muted)" }}>
              Monthly investment ({cur.symbol})
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
          <div>
            <label htmlFor="sip-stepup" className={labelCls} style={{ color: "var(--text-muted)" }}>
              Annual step-up (%)
            </label>
            <input id="sip-stepup" type="number" min="0" max="100" step="any" value={stepUp} onChange={(e) => setStepUp(e.target.value)} className={inputCls} style={inputStyle} />
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
              Raise your SIP by this % every year.
            </p>
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
              { label: "Projected value", value: fmtMoney(calc.fv, cur), accent: true },
              { label: "Total invested", value: fmtMoney(calc.invested, cur), accent: false },
              { label: "Growth", value: fmtMoney(calc.gains, cur), accent: false },
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

          {calc.stepUp > 0 && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }} role="status">
              With a {calc.stepUp}% annual step-up, your monthly investment grows from {fmtMoney(parseFloat(monthly) || 0, cur)} in year 1
              to {fmtMoney((parseFloat(monthly) || 0) * Math.pow(1 + calc.stepUp / 100, Math.floor(parseFloat(years) || 1) - 1), cur)} in the final year.
            </p>
          )}

          <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Growth over time
            </h2>
            <Chart rows={calc.rows} monthly={parseFloat(monthly)} cur={cur} />
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
                      <td className="px-4 py-2 text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmtMoney(r.invested, cur)}</td>
                      <td className="px-4 py-2 text-right font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>{fmtMoney(r.value, cur)}</td>
                      <td className="px-4 py-2 text-right tabular-nums" style={{ color: "var(--accent)" }}>+{fmtMoney(r.gains, cur)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Btn variant="ghost" size="sm" onClick={() => { setMonthly("500"); setAnnualPct("12"); setYears("10"); setStepUp("0"); }}>
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
