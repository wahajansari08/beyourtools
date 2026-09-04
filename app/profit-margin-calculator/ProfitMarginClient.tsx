"use client";
import { useState } from "react";

type MarginType = "gross" | "operating" | "net";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProfitMarginClient() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [opex, setOpex] = useState("");
  const [taxes, setTaxes] = useState("");
  const [mode, setMode] = useState<MarginType>("gross");
  const [result, setResult] = useState<{ margin: number; profit: number } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const rev = parseFloat(revenue);
    if (!rev || rev <= 0) { setError("Enter a valid revenue amount greater than 0."); return; }
    if (mode === "gross") {
      const c = parseFloat(cogs);
      if (isNaN(c) || c < 0) { setError("Enter a valid cost of goods sold (COGS)."); return; }
      const profit = rev - c;
      setResult({ profit, margin: (profit / rev) * 100 });
    } else if (mode === "operating") {
      const c = parseFloat(cogs);
      const o = parseFloat(opex);
      if (isNaN(c) || c < 0) { setError("Enter a valid COGS."); return; }
      if (isNaN(o) || o < 0) { setError("Enter valid operating expenses."); return; }
      const profit = rev - c - o;
      setResult({ profit, margin: (profit / rev) * 100 });
    } else {
      const c = parseFloat(cogs);
      const o = parseFloat(opex);
      const t = parseFloat(taxes);
      if (isNaN(c) || c < 0) { setError("Enter a valid COGS."); return; }
      if (isNaN(o) || o < 0) { setError("Enter valid operating expenses."); return; }
      if (isNaN(t) || t < 0) { setError("Enter valid taxes & interest."); return; }
      const profit = rev - c - o - t;
      setResult({ profit, margin: (profit / rev) * 100 });
    }
  }

  function reset() { setRevenue(""); setCogs(""); setOpex(""); setTaxes(""); setResult(null); setError(""); }

  const modeLabels: Record<MarginType, string> = { gross: "Gross Margin", operating: "Operating Margin", net: "Net Margin" };

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Margin type">
        {(["gross", "operating", "net"] as MarginType[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setResult(null); setError(""); }}
            className="focus-ring rounded border px-3 py-1.5 text-xs font-medium capitalize transition"
            style={{
              borderColor: mode === m ? "var(--accent)" : "var(--border-strong)",
              backgroundColor: mode === m ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
              color: mode === m ? "var(--accent)" : "var(--text-muted)",
            }}
            aria-pressed={mode === m}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }} htmlFor="pm-revenue">
            Total Revenue ($)
          </label>
          <input
            id="pm-revenue"
            type="number"
            min="0"
            step="any"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="e.g. 100000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }} htmlFor="pm-cogs">
            Cost of Goods Sold - COGS ($)
          </label>
          <input
            id="pm-cogs"
            type="number"
            min="0"
            step="any"
            value={cogs}
            onChange={(e) => setCogs(e.target.value)}
            placeholder="e.g. 60000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </div>
        {(mode === "operating" || mode === "net") && (
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }} htmlFor="pm-opex">
              Operating Expenses ($)
            </label>
            <input
              id="pm-opex"
              type="number"
              min="0"
              step="any"
              value={opex}
              onChange={(e) => setOpex(e.target.value)}
              placeholder="e.g. 20000"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            />
          </div>
        )}
        {mode === "net" && (
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }} htmlFor="pm-taxes">
              Taxes & Interest ($)
            </label>
            <input
              id="pm-taxes"
              type="number"
              min="0"
              step="any"
              value={taxes}
              onChange={(e) => setTaxes(e.target.value)}
              placeholder="e.g. 5000"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            />
          </div>
        )}
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

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
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{modeLabels[mode]}</p>
              <p className="mt-1 font-display text-xl font-bold" style={{ color: result.margin >= 0 ? "var(--teal)" : "var(--coral)" }}>
                {fmt(result.margin)}%
              </p>
            </div>
            <div className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                {mode === "gross" ? "Gross Profit" : mode === "operating" ? "Operating Income (EBIT)" : "Net Profit"}
              </p>
              <p className="mt-1 font-display text-xl font-bold" style={{ color: result.profit >= 0 ? "var(--teal)" : "var(--coral)" }}>
                ${fmt(result.profit)}
              </p>
            </div>
          </div>
          {result.margin < 0 && (
            <p className="text-xs" style={{ color: "var(--coral)" }}>⚠ Negative margin - costs exceed revenue at this level.</p>
          )}
        </div>
      )}
    </div>
  );
}
