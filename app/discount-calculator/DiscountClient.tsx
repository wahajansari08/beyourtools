"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function DiscountClient() {
  const [original, setOriginal] = useState("");
  const [discount, setDiscount] = useState("");
  const [result, setResult] = useState<{ finalPrice: number; savings: number; discountAmount: number } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const o = parseFloat(original);
    const d = parseFloat(discount);
    if (!o || o <= 0) { setError("Enter a valid original price greater than 0."); return; }
    if (isNaN(d) || d < 0 || d > 100) { setError("Discount must be between 0 and 100%."); return; }
    const discountAmount = o * (d / 100);
    setResult({ finalPrice: o - discountAmount, savings: discountAmount, discountAmount });
  }

  function reset() { setOriginal(""); setDiscount(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="dc-orig" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Original Price ($)</label>
          <input id="dc-orig" type="number" min="0" step="any" value={original} onChange={(e) => setOriginal(e.target.value)} placeholder="e.g. 120"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <label htmlFor="dc-disc" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Discount (%)</label>
          <input id="dc-disc" type="number" min="0" max="100" step="any" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 25"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
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
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Price After Discount", value: `$${fmt(result.finalPrice)}`, highlight: true },
              { label: "You Save", value: `$${fmt(result.savings)}` },
              { label: "Discount Amount", value: `$${fmt(result.discountAmount)}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold" style={{ color: highlight ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
