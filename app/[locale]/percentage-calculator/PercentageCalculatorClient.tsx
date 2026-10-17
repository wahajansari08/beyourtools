"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";

type Mode = "of" | "what" | "change";

const MODES: { id: Mode; label: string }[] = [
  { id: "of", label: "X% of Y" },
  { id: "what", label: "X is what % of Y" },
  { id: "change", label: "% change from X to Y" },
];

/** Trim trailing zeros for display, locale-aware thousands separators. */
function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(4);
  return Number(n.toFixed(8)).toLocaleString("en-US", { maximumFractionDigits: 8 });
}

const inputClass =
  "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
const inputStyle = {
  borderColor: "var(--border-strong)",
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
} as const;

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const result = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (a.trim() === "" || b.trim() === "" || Number.isNaN(x) || Number.isNaN(y)) {
      return null;
    }
    if (mode === "of") {
      const value = (x / 100) * y;
      return {
        headline: `${fmt(value)}`,
        formula: `${fmt(x)}% of ${fmt(y)} = (${fmt(x)} ÷ 100) × ${fmt(y)} = ${fmt(value)}`,
        note: "Useful for tips, discounts and tax: this is the amount the percentage represents.",
        error: null as string | null,
      };
    }
    if (mode === "what") {
      if (y === 0) {
        return { headline: "", formula: "", note: "", error: "The second number (Y) can't be zero." };
      }
      const value = (x / y) * 100;
      return {
        headline: `${fmt(value)}%`,
        formula: `${fmt(x)} ÷ ${fmt(y)} × 100 = ${fmt(value)}%`,
        note: "Useful for test scores, completion rates and shares of a total.",
        error: null as string | null,
      };
    }
    // change
    if (x === 0) {
      return { headline: "", formula: "", note: "", error: "The starting value (X) can't be zero." };
    }
    const value = ((y - x) / x) * 100;
    const dir = value > 0 ? "increase" : value < 0 ? "decrease" : "no change";
    return {
      headline: `${value > 0 ? "+" : ""}${fmt(value)}%`,
      formula: `(${fmt(y)} − ${fmt(x)}) ÷ ${fmt(x)} × 100 = ${fmt(value)}%`,
      note:
        dir === "no change"
          ? "Both values are the same, so there is no change."
          : `That's a ${Math.abs(value).toFixed(2).replace(/\.?0+$/, "")}% ${dir}.`,
      error: null as string | null,
    };
  }, [mode, a, b]);

  const labels =
    mode === "of"
      ? { a: "X: the percentage", b: "Y: the base value", aPh: "e.g. 20", bPh: "e.g. 250" }
      : mode === "what"
        ? { a: "X: the part", b: "Y: the whole", aPh: "e.g. 45", bPh: "e.g. 60" }
        : { a: "X: the old value", b: "Y: the new value", aPh: "e.g. 80", bPh: "e.g. 100" };

  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      {/* Mode tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Calculator mode">
        {MODES.map((m) => (
          <Btn key={m.id} variant="toggle" size="sm" selected={mode === m.id} onClick={() => setMode(m.id)}>
            {m.label}
          </Btn>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pct-a" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {labels.a}
          </label>
          <input
            id="pct-a"
            type="number"
            inputMode="decimal"
            step="any"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder={labels.aPh}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="pct-b" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {labels.b}
          </label>
          <input
            id="pct-b"
            type="number"
            inputMode="decimal"
            step="any"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder={labels.bPh}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Result */}
      <div
        className="mt-6 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
        role="status"
        aria-live="polite"
      >
        {result?.error ? (
          <p className="text-sm font-medium" style={{ color: "var(--coral)" }} role="alert">
            {result.error}
          </p>
        ) : result ? (
          <>
            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Result
            </p>
            <p className="mt-1 text-3xl font-bold" style={{ color: "var(--accent-text)" }}>
              {result.headline}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
              {result.formula}
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {result.note}
            </p>
          </>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enter both numbers above. The answer appears live.
          </p>
        )}
      </div>
    </div>
  );
}
