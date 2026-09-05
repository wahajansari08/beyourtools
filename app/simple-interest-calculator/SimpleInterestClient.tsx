"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

type TimeUnit = "years" | "months" | "days";

export default function SimpleInterestClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate]           = useState("");
  const [time, setTime]           = useState("");
  const [unit, setUnit]           = useState<TimeUnit>("years");
  const [result, setResult] = useState<{
    interest: number; total: number; ratePerPeriod: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (!P || P <= 0)   { setError("Enter a valid principal greater than 0."); return; }
    if (r < 0)          { setError("Interest rate cannot be negative."); return; }
    if (!t || t <= 0)   { setError("Enter a valid time period greater than 0."); return; }

    // Convert to years
    const tYears = unit === "years" ? t : unit === "months" ? t / 12 : t / 365;
    const interest = P * r * tYears;
    setResult({ interest, total: P + interest, ratePerPeriod: r * 100 });
  }

  function reset() { setPrincipal(""); setRate(""); setTime(""); setResult(null); setError(""); }

  const units: TimeUnit[] = ["years", "months", "days"];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="si-p" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Principal ($)
          </label>
          <input id="si-p" type="number" min="0" step="any" value={principal}
            onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 10000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="si-r" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Annual Interest Rate (%)
          </label>
          <input id="si-r" type="number" min="0" step="any" value={rate}
            onChange={(e) => setRate(e.target.value)} placeholder="e.g. 5"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label htmlFor="si-t" className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Time Period
            </label>
            <div className="flex gap-1" role="group" aria-label="Time unit">
              {units.map((u) => (
                <Btn variant="toggle" size="sm" key={u} onClick={() => setUnit(u)} selected={unit === u}>{u}</Btn>
              ))}
            </div>
          </div>
          <input id="si-t" type="number" min="0" step="any" value={time}
            onChange={(e) => setTime(e.target.value)} placeholder={`e.g. ${unit === "years" ? "3" : unit === "months" ? "36" : "365"}`}
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
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
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Simple Interest", value: `$${fmt(result.interest)}`, primary: true },
              { label: "Total Amount",    value: `$${fmt(result.total)}` },
              { label: "Principal",       value: `$${fmt(parseFloat(principal))}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
