"use client";
import { useState } from "react";

function fmt(n: number, d = 4) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

type CompoundFreq = "daily" | "weekly" | "monthly" | "quarterly" | "semiannually" | "annually";
const FREQS: Record<CompoundFreq, { label: string; n: number }> = {
  daily:        { label: "Daily (365×)",         n: 365 },
  weekly:       { label: "Weekly (52×)",          n: 52  },
  monthly:      { label: "Monthly (12×)",         n: 12  },
  quarterly:    { label: "Quarterly (4×)",        n: 4   },
  semiannually: { label: "Semi-Annually (2×)",    n: 2   },
  annually:     { label: "Annually (1×)",         n: 1   },
};

export default function ApyClient() {
  const [apr, setApr]         = useState("");
  const [freq, setFreq]       = useState<CompoundFreq>("monthly");
  const [principal, setPrincipal] = useState("10000");
  const [years, setYears]     = useState("1");
  const [result, setResult]   = useState<{
    apy: number; interestEarned: number; finalBalance: number; effectiveMonthly: number;
  } | null>(null);
  const [error, setError]     = useState("");

  function calculate() {
    setError("");
    const r    = parseFloat(apr);
    const n    = FREQS[freq].n;
    const P    = parseFloat(principal) || 0;
    const yrs  = parseFloat(years)     || 1;

    if (!r || r <= 0) { setError("Enter a valid APR greater than 0."); return; }
    if (r > 100)      { setError("APR seems too high. Enter as a percentage (e.g. 5 for 5%)."); return; }

    const apy            = (Math.pow(1 + r / 100 / n, n) - 1) * 100;
    const finalBalance   = P * Math.pow(1 + r / 100 / n, n * yrs);
    const interestEarned = finalBalance - P;
    const effectiveMonthly = (Math.pow(1 + r / 100 / n, n / 12) - 1) * 100;

    setResult({ apy, interestEarned, finalBalance, effectiveMonthly });
  }

  function reset() { setApr(""); setPrincipal("10000"); setYears("1"); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="apy-apr" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Annual Percentage Rate — APR (%)
          </label>
          <input id="apy-apr" type="number" min="0" step="any" value={apr}
            onChange={(e) => setApr(e.target.value)} placeholder="e.g. 5.0"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Compounding Frequency</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.entries(FREQS) as [CompoundFreq, { label: string; n: number }][]).map(([key, { label }]) => (
              <button key={key} type="button" onClick={() => { setFreq(key); setResult(null); }}
                className="focus-ring rounded border px-3 py-2 text-xs font-medium text-left transition"
                style={{
                  borderColor: freq === key ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: freq === key ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: freq === key ? "var(--accent)" : "var(--text-muted)",
                }} aria-pressed={freq === key}>{label}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="apy-p" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Principal for Projection ($)
            </label>
            <input id="apy-p" type="number" min="0" step="any" value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="apy-y" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Term (years)
            </label>
            <input id="apy-y" type="number" min="0.1" step="0.5" value={years}
              onChange={(e) => setYears(e.target.value)}
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
          Calculate APY
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>APY Results</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "APY",                  value: `${fmt(result.apy)}%`,              primary: true },
              { label: "Effective Monthly",    value: `${fmt(result.effectiveMonthly, 4)}%` },
              { label: "Interest Earned",      value: `$${fmt(result.interestEarned, 2)}` },
              { label: "Final Balance",        value: `$${fmt(result.finalBalance, 2)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-3 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            APR {apr}% compounded {FREQS[freq].label.toLowerCase()} = APY {fmt(result.apy)}%.
            The higher the compounding frequency, the higher the effective APY.
          </p>
        </div>
      )}
    </div>
  );
}
