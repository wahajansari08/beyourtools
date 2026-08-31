"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function RoasClient() {
  const [revenue, setRevenue] = useState("");
  const [adSpend, setAdSpend] = useState("");
  const [margin,  setMargin]  = useState("");
  const [result, setResult] = useState<{
    roas: number; costPerRevenue: number; profit: number | null; breakEvenRoas: number | null;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const rev  = parseFloat(revenue);
    const spend = parseFloat(adSpend);
    const mg   = parseFloat(margin);
    if (!rev  || rev  <= 0) { setError("Enter a valid revenue greater than 0."); return; }
    if (!spend || spend <= 0) { setError("Enter a valid ad spend greater than 0."); return; }

    const roas            = rev / spend;
    const costPerRevenue  = (spend / rev) * 100;
    let profit: number | null = null;
    let breakEvenRoas: number | null = null;
    if (!isNaN(mg) && mg > 0 && mg < 100) {
      profit        = rev * (mg / 100) - spend;
      breakEvenRoas = 100 / mg;    // break-even when margin% × revenue = spend → revenue/spend = 100/margin%
    }
    setResult({ roas, costPerRevenue, profit, breakEvenRoas });
  }

  function reset() { setRevenue(""); setAdSpend(""); setMargin(""); setResult(null); setError(""); }

  function roasColor(roas: number, breakEven: number | null) {
    if (!breakEven) return "var(--teal)";
    return roas >= breakEven ? "var(--teal)" : "var(--coral)";
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="roas-rev" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Revenue from Ads ($)
          </label>
          <input id="roas-rev" type="number" min="0" step="any" value={revenue}
            onChange={(e) => setRevenue(e.target.value)} placeholder="e.g. 20000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="roas-spend" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Ad Spend ($)
          </label>
          <input id="roas-spend" type="number" min="0" step="any" value={adSpend}
            onChange={(e) => setAdSpend(e.target.value)} placeholder="e.g. 5000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="roas-margin" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Gross Margin (% — optional, to calculate break-even ROAS)
          </label>
          <input id="roas-margin" type="number" min="0" max="100" step="any" value={margin}
            onChange={(e) => setMargin(e.target.value)} placeholder="e.g. 30"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Gross margin after product costs, before ad spend.
          </p>
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
          Calculate ROAS
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>ROAS Results</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "ROAS",                value: `${fmt(result.roas)}:1`,           color: roasColor(result.roas, result.breakEvenRoas) },
              { label: "$ Revenue per $ Spent", value: `$${fmt(result.roas)} per $1`,   color: "var(--text-primary)" },
              { label: "Ad Cost as % of Revenue", value: `${fmt(result.costPerRevenue)}%`, color: "var(--text-primary)" },
              ...(result.breakEvenRoas !== null ? [{ label: "Break-Even ROAS", value: `${fmt(result.breakEvenRoas)}:1`, color: "var(--text-primary)" }] : []),
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border p-3 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
          {result.profit !== null && (
            <div className="rounded-lg border p-4"
              style={{
                borderColor: result.profit >= 0 ? "color-mix(in srgb,var(--teal) 30%,transparent)" : "color-mix(in srgb,var(--coral) 30%,transparent)",
                backgroundColor: result.profit >= 0 ? "color-mix(in srgb,var(--teal) 6%,transparent)" : "color-mix(in srgb,var(--coral) 6%,transparent)",
              }}>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Profit after ad spend (at {margin}% margin)</p>
              <p className="mt-1 font-display text-xl font-bold"
                style={{ color: result.profit >= 0 ? "var(--teal)" : "var(--coral)" }}>
                {result.profit >= 0 ? "+" : ""}${fmt(result.profit)}
                <span className="text-xs font-normal ml-2" style={{ color: "var(--text-subtle)" }}>
                  {result.breakEvenRoas !== null && result.roas < result.breakEvenRoas
                    ? `⚠ Below break-even ROAS of ${fmt(result.breakEvenRoas)}:1`
                    : "✓ Profitable"}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
