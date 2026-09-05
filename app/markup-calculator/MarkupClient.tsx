"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

type Mode = "markup-to-price" | "price-to-markup" | "margin-to-markup";

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function MarkupClient() {
  const [mode, setMode] = useState<Mode>("markup-to-price");
  const [cost, setCost] = useState("");
  const [markup, setMarkup] = useState("");
  const [price, setPrice] = useState("");
  const [margin, setMargin] = useState("");
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const c = parseFloat(cost);
    if (mode === "markup-to-price") {
      const m = parseFloat(markup);
      if (!c || c <= 0) { setError("Enter a valid cost greater than 0."); return; }
      if (isNaN(m) || m < 0) { setError("Enter a valid markup percentage."); return; }
      const sellingPrice = c * (1 + m / 100);
      const profitAmount = sellingPrice - c;
      const marginPct = (profitAmount / sellingPrice) * 100;
      setResult({ sellingPrice, profitAmount, marginPct, markupPct: m });
    } else if (mode === "price-to-markup") {
      const p = parseFloat(price);
      if (!c || c <= 0) { setError("Enter a valid cost greater than 0."); return; }
      if (!p || p <= c) { setError("Selling price must be greater than cost."); return; }
      const profitAmount = p - c;
      const markupPct = (profitAmount / c) * 100;
      const marginPct = (profitAmount / p) * 100;
      setResult({ sellingPrice: p, profitAmount, markupPct, marginPct });
    } else {
      const mg = parseFloat(margin);
      if (!c || c <= 0) { setError("Enter a valid cost greater than 0."); return; }
      if (isNaN(mg) || mg <= 0 || mg >= 100) { setError("Margin must be between 0 and 100%."); return; }
      const sellingPrice = c / (1 - mg / 100);
      const profitAmount = sellingPrice - c;
      const markupPct = (profitAmount / c) * 100;
      setResult({ sellingPrice, profitAmount, markupPct, marginPct: mg });
    }
  }

  function reset() { setCost(""); setMarkup(""); setPrice(""); setMargin(""); setResult(null); setError(""); }

  const modes: { id: Mode; label: string }[] = [
    { id: "markup-to-price", label: "Cost + Markup → Price" },
    { id: "price-to-markup", label: "Cost + Price → Markup" },
    { id: "margin-to-markup", label: "Cost + Margin → Price" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Calculation mode">
        {modes.map((m) => (
          <Btn variant="toggle" size="sm" key={m.id} onClick={() => { setMode(m.id); setResult(null); setError(""); }} selected={mode === m.id}>{m.label}</Btn>
        ))}
      </div>

      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="mk-cost" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Cost Price ($)</label>
          <input id="mk-cost" type="number" min="0" step="any" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g. 50"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        {mode === "markup-to-price" && (
          <div>
            <label htmlFor="mk-markup" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Markup (%)</label>
            <input id="mk-markup" type="number" min="0" step="any" value={markup} onChange={(e) => setMarkup(e.target.value)} placeholder="e.g. 40"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {mode === "price-to-markup" && (
          <div>
            <label htmlFor="mk-price" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Selling Price ($)</label>
            <input id="mk-price" type="number" min="0" step="any" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 70"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {mode === "margin-to-markup" && (
          <div>
            <label htmlFor="mk-margin" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Desired Margin (%)</label>
            <input id="mk-margin" type="number" min="0" max="99.99" step="any" value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="e.g. 30"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <Btn variant="primary" size="lg" onClick={calculate}>
          Calculate
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Selling Price", value: `$${fmt(result.sellingPrice)}` },
              { label: "Profit Amount", value: `$${fmt(result.profitAmount)}` },
              { label: "Markup %", value: `${fmt(result.markupPct)}%` },
              { label: "Margin %", value: `${fmt(result.marginPct)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border p-3 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold" style={{ color: "var(--teal)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
