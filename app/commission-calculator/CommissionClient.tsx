"use client";
import { useState } from "react";

type Mode = "flat" | "tiered";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

interface Tier { upTo: string; rate: string; }

export default function CommissionClient() {
  const [mode, setMode] = useState<Mode>("flat");
  const [sales, setSales] = useState("");
  const [rate, setRate] = useState("");
  const [base, setBase] = useState("");
  const [tiers, setTiers] = useState<Tier[]>([
    { upTo: "10000", rate: "5" },
    { upTo: "25000", rate: "8" },
    { upTo: "", rate: "12" },
  ]);
  const [result, setResult] = useState<{ commission: number; total: number } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const s = parseFloat(sales);
    if (!s || s <= 0) { setError("Enter valid sales amount greater than 0."); return; }
    if (mode === "flat") {
      const r = parseFloat(rate);
      if (isNaN(r) || r < 0 || r > 100) { setError("Commission rate must be 0–100%."); return; }
      const commission = s * (r / 100);
      const b = parseFloat(base) || 0;
      setResult({ commission, total: b + commission });
    } else {
      // tiered
      let remaining = s;
      let commission = 0;
      let prev = 0;
      for (const tier of tiers) {
        const r = parseFloat(tier.rate);
        if (isNaN(r) || r < 0) { setError("All tier rates must be valid numbers."); return; }
        const upTo = tier.upTo === "" ? Infinity : parseFloat(tier.upTo);
        const bracket = Math.min(remaining, upTo - prev);
        if (bracket <= 0) break;
        commission += bracket * (r / 100);
        remaining -= bracket;
        prev = upTo === Infinity ? s : upTo;
        if (remaining <= 0) break;
      }
      const b = parseFloat(base) || 0;
      setResult({ commission, total: b + commission });
    }
  }

  function reset() { setSales(""); setRate(""); setBase(""); setResult(null); setError(""); }

  function updateTier(i: number, field: keyof Tier, value: string) {
    setTiers((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
    setResult(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2" role="group" aria-label="Commission type">
        {(["flat", "tiered"] as Mode[]).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); setResult(null); setError(""); }}
            className="focus-ring rounded border px-3 py-1.5 text-xs font-medium capitalize transition"
            style={{
              borderColor: mode === m ? "var(--accent)" : "var(--border-strong)",
              backgroundColor: mode === m ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
              color: mode === m ? "var(--accent)" : "var(--text-muted)",
            }} aria-pressed={mode === m}>{m === "flat" ? "Flat Rate" : "Tiered Rate"}</button>
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="cm-sales" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Total Sales Amount ($)</label>
          <input id="cm-sales" type="number" min="0" step="any" value={sales} onChange={(e) => setSales(e.target.value)} placeholder="e.g. 15000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        {mode === "flat" && (
          <div>
            <label htmlFor="cm-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Commission Rate (%)</label>
            <input id="cm-rate" type="number" min="0" max="100" step="any" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 10"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {mode === "tiered" && (
          <div className="space-y-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Tiered Rates</p>
            {tiers.map((tier, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Up to ($) {i === tiers.length - 1 ? "(leave blank for unlimited)" : ""}</label>
                  <input type="number" min="0" step="any" value={tier.upTo} onChange={(e) => updateTier(i, "upTo", e.target.value)}
                    placeholder={i === tiers.length - 1 ? "Unlimited" : "e.g. 10000"}
                    className="focus-ring w-full rounded-lg border px-3 py-1.5 text-xs mt-0.5"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} disabled={i === tiers.length - 1} />
                </div>
                <div className="w-24">
                  <label className="text-[11px]" style={{ color: "var(--text-subtle)" }}>Rate (%)</label>
                  <input type="number" min="0" max="100" step="any" value={tier.rate} onChange={(e) => updateTier(i, "rate", e.target.value)}
                    placeholder="e.g. 5"
                    className="focus-ring w-full rounded-lg border px-3 py-1.5 text-xs mt-0.5"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
                </div>
              </div>
            ))}
          </div>
        )}
        <div>
          <label htmlFor="cm-base" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Base Salary ($ - optional)</label>
          <input id="cm-base" type="number" min="0" step="any" value={base} onChange={(e) => setBase(e.target.value)} placeholder="e.g. 3000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={calculate} className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>Calculate</button>
        <button type="button" onClick={reset} className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>Reset</button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-xs" style={{ color: "var(--text-subtle)" }}>Commission Earned</p>
              <p className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--teal)" }}>${fmt(result.commission)}</p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <p className="text-xs" style={{ color: "var(--text-subtle)" }}>Total Pay (incl. base)</p>
              <p className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>${fmt(result.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
