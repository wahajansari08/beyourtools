"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function MinPaymentClient() {
  const [balance, setBalance] = useState("");
  const [apr, setApr]         = useState("");
  const [minType, setMinType] = useState<"percent" | "fixed">("percent");
  const [minValue, setMinValue] = useState("2");
  const [minFloor, setMinFloor] = useState("25");
  const [result, setResult] = useState<{
    months: number; totalInterest: number; totalPaid: number; firstMin: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const bal  = parseFloat(balance);
    const r    = parseFloat(apr) / 100 / 12;
    const pct  = parseFloat(minValue) / 100;
    const floor = parseFloat(minFloor) || 25;

    if (!bal || bal <= 0)         { setError("Enter a valid balance."); return; }
    if (parseFloat(apr) < 0)      { setError("APR cannot be negative."); return; }
    if (pct <= 0 && minType === "percent") { setError("Minimum % must be greater than 0."); return; }

    let remaining = bal, months = 0, totalInt = 0;
    let firstMin = 0;
    while (remaining > 0.005 && months < 1200) {
      const int = remaining * r;
      totalInt += int;
      remaining += int;
      let payment: number;
      if (minType === "percent") {
        payment = Math.max(remaining * pct, floor);
      } else {
        payment = parseFloat(minValue) || 25;
      }
      payment = Math.min(payment, remaining);
      if (months === 0) firstMin = payment;
      remaining -= payment;
      months++;
    }
    if (months >= 1200) {
      setError("At these minimums the balance never decreases. Increase the minimum payment percentage or floor.");
      return;
    }
    setResult({ months, totalInterest: totalInt, totalPaid: bal + totalInt, firstMin });
  }

  function reset() { setBalance(""); setApr(""); setMinValue("2"); setMinFloor("25"); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="mp-bal" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Credit Card Balance ($)
          </label>
          <input id="mp-bal" type="number" min="0" step="any" value={balance}
            onChange={(e) => setBalance(e.target.value)} placeholder="e.g. 5000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="mp-apr" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Annual Percentage Rate - APR (%)
          </label>
          <input id="mp-apr" type="number" min="0" step="any" value={apr}
            onChange={(e) => setApr(e.target.value)} placeholder="e.g. 22.99"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Minimum Payment Method</p>
          <div className="flex gap-2">
            {([["percent", "% of Balance"], ["fixed", "Fixed Amount"]] as const).map(([val, label]) => (
              <button key={val} type="button" onClick={() => setMinType(val)}
                className="focus-ring rounded border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: minType === val ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: minType === val ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: minType === val ? "var(--accent)" : "var(--text-muted)",
                }} aria-pressed={minType === val}>{label}</button>
            ))}
          </div>
        </div>
        {minType === "percent" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mp-pct" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Minimum % of Balance
              </label>
              <input id="mp-pct" type="number" min="0.5" max="10" step="0.5" value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
              <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>Most cards use 1–3%.</p>
            </div>
            <div>
              <label htmlFor="mp-floor" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Minimum Floor ($)
              </label>
              <input id="mp-floor" type="number" min="0" step="1" value={minFloor}
                onChange={(e) => setMinFloor(e.target.value)}
                className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="mp-fixed" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Fixed Monthly Payment ($)
            </label>
            <input id="mp-fixed" type="number" min="1" step="any" value={minValue}
              onChange={(e) => setMinValue(e.target.value)} placeholder="e.g. 50"
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
        <button type="button" onClick={calculate}
          className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          Calculate
        </button>
        <button type="button" onClick={reset}
          className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Reset
        </button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>The True Cost of Minimum Payments</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "First Min. Payment", value: `$${fmt(result.firstMin)}` },
              { label: "Payoff Time",       value: `${Math.floor(result.months / 12)}y ${result.months % 12}m`, primary: true },
              { label: "Total Interest",    value: `$${fmt(result.totalInterest)}` },
              { label: "Total Paid",        value: `$${fmt(result.totalPaid)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-3 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold"
                  style={{ color: primary ? "var(--coral)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            ⚠ The total interest ($
            {fmt(result.totalInterest)}) represents {fmt((result.totalInterest / parseFloat(balance)) * 100)}% of your original balance - paid purely in interest.
          </p>
        </div>
      )}
    </div>
  );
}
