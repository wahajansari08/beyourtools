"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

type Mode = "growth-rate" | "future-value" | "cagr";

export default function RevenueGrowthClient() {
  const [mode, setMode]       = useState<Mode>("growth-rate");
  const [current, setCurrent] = useState("");
  const [previous, setPrevious] = useState("");
  const [growthPct, setGrowthPct] = useState("");
  const [years, setYears]     = useState("1");
  const [result, setResult] = useState<{
    growthRate?: number; changeAmount?: number;
    futureValue?: number;
    cagr?: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    if (mode === "growth-rate") {
      const cur = parseFloat(current);
      const prev = parseFloat(previous);
      if (!prev || prev === 0)  { setError("Previous revenue cannot be 0."); return; }
      if (isNaN(cur))           { setError("Enter a valid current revenue."); return; }
      const growthRate   = ((cur - prev) / Math.abs(prev)) * 100;
      const changeAmount = cur - prev;
      setResult({ growthRate, changeAmount });
    } else if (mode === "future-value") {
      const base  = parseFloat(current);
      const rate  = parseFloat(growthPct);
      const yrs   = parseFloat(years);
      if (!base || base <= 0)   { setError("Enter a valid starting revenue."); return; }
      if (isNaN(rate))          { setError("Enter a valid growth rate."); return; }
      if (!yrs || yrs <= 0)     { setError("Enter valid years."); return; }
      const futureValue = base * Math.pow(1 + rate / 100, yrs);
      setResult({ futureValue });
    } else {
      const start = parseFloat(previous);
      const end   = parseFloat(current);
      const yrs   = parseFloat(years);
      if (!start || start <= 0) { setError("Enter a valid starting revenue greater than 0."); return; }
      if (!end   || end   <= 0) { setError("Enter a valid ending revenue greater than 0."); return; }
      if (!yrs   || yrs   <= 0) { setError("Enter valid years (> 0)."); return; }
      const cagr = (Math.pow(end / start, 1 / yrs) - 1) * 100;
      setResult({ cagr });
    }
  }

  function reset() { setCurrent(""); setPrevious(""); setGrowthPct(""); setYears("1"); setResult(null); setError(""); }

  const modes: { id: Mode; label: string }[] = [
    { id: "growth-rate",  label: "Growth Rate" },
    { id: "future-value", label: "Projected Revenue" },
    { id: "cagr",         label: "CAGR" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Calculation mode">
        {modes.map((m) => (
          <Btn variant="toggle" size="sm" key={m.id} onClick={() => { setMode(m.id); setResult(null); setError(""); }} selected={mode === m.id}>{m.label}</Btn>
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        {(mode === "growth-rate" || mode === "cagr") && (
          <div>
            <label htmlFor="rg-prev" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {mode === "cagr" ? "Starting Revenue ($)" : "Previous Period Revenue ($)"}
            </label>
            <input id="rg-prev" type="number" step="any" value={previous}
              onChange={(e) => setPrevious(e.target.value)} placeholder="e.g. 500000"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {(mode === "growth-rate" || mode === "cagr" || mode === "future-value") && (
          <div>
            <label htmlFor="rg-cur" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {mode === "future-value" ? "Current Revenue ($)" : mode === "cagr" ? "Ending Revenue ($)" : "Current Period Revenue ($)"}
            </label>
            <input id="rg-cur" type="number" step="any" value={current}
              onChange={(e) => setCurrent(e.target.value)} placeholder="e.g. 650000"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {mode === "future-value" && (
          <div>
            <label htmlFor="rg-pct" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Expected Annual Growth Rate (%)
            </label>
            <input id="rg-pct" type="number" step="any" value={growthPct}
              onChange={(e) => setGrowthPct(e.target.value)} placeholder="e.g. 15"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {(mode === "future-value" || mode === "cagr") && (
          <div>
            <label htmlFor="rg-yrs" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Number of Years
            </label>
            <input id="rg-yrs" type="number" min="1" step="1" value={years}
              onChange={(e) => setYears(e.target.value)} placeholder="e.g. 5"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg border px-4 py-2 text-sm"
          style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Btn variant="primary" size="lg" onClick={calculate}>
          Calculate
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.growthRate !== undefined && [
              { label: "Revenue Growth Rate", value: `${result.growthRate >= 0 ? "+" : ""}${fmt(result.growthRate)}%`, primary: true, color: result.growthRate >= 0 ? "var(--teal)" : "var(--coral)" },
              { label: "Change in Revenue",   value: `${(result.changeAmount ?? 0) >= 0 ? "+" : ""}$${fmt(result.changeAmount ?? 0)}`, color: "var(--text-primary)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-2xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
            {result.futureValue !== undefined && (
              <div className="rounded-lg border p-4 text-center col-span-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                  Projected Revenue in {years} year{parseFloat(years) !== 1 ? "s" : ""}
                </p>
                <p className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--teal)" }}>
                  ${fmt(result.futureValue)}
                </p>
              </div>
            )}
            {result.cagr !== undefined && (
              <div className="rounded-lg border p-4 text-center col-span-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                  CAGR over {years} year{parseFloat(years) !== 1 ? "s" : ""}
                </p>
                <p className="mt-1 font-display text-2xl font-bold" style={{ color: result.cagr >= 0 ? "var(--teal)" : "var(--coral)" }}>
                  {fmt(result.cagr)}%/year
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
