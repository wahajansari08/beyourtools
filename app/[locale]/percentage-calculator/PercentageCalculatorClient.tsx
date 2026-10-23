"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";
import SegmentedControl from "@/components/SegmentedControl";

type Mode = "of" | "what" | "change" | "apply" | "difference";

const MODES: { id: Mode; label: string }[] = [
  { id: "of", label: "X% of Y" },
  { id: "what", label: "X is what % of Y" },
  { id: "change", label: "% change X → Y" },
  { id: "apply", label: "Increase / decrease by %" },
  { id: "difference", label: "% difference" },
];

/** Trim trailing zeros for display, locale-aware thousands separators. */
function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(4);
  return Number(n.toFixed(8)).toLocaleString("en-US", { maximumFractionDigits: 8 });
}

interface CalcResult {
  headline: string;
  steps: string[];
  note: string;
  error: string | null;
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
  const [direction, setDirection] = useState<"increase" | "decrease">("increase");

  const result: CalcResult | null = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (a.trim() === "" || b.trim() === "" || Number.isNaN(x) || Number.isNaN(y)) {
      return null;
    }
    if (mode === "of") {
      const decimal = x / 100;
      const value = decimal * y;
      return {
        headline: `${fmt(value)}`,
        steps: [
          `Convert ${fmt(x)}% to a decimal: ${fmt(x)} ÷ 100 = ${fmt(decimal)}`,
          `Multiply by ${fmt(y)}: ${fmt(decimal)} × ${fmt(y)} = ${fmt(value)}`,
        ],
        note: "Useful for tips, discounts and tax: this is the amount the percentage represents.",
        error: null,
      };
    }
    if (mode === "what") {
      if (y === 0) {
        return { headline: "", steps: [], note: "", error: "The second number (Y) can't be zero." };
      }
      const value = (x / y) * 100;
      return {
        headline: `${fmt(value)}%`,
        steps: [
          `Divide the part by the whole: ${fmt(x)} ÷ ${fmt(y)} = ${fmt(x / y)}`,
          `Convert to a percentage: ${fmt(x / y)} × 100 = ${fmt(value)}%`,
        ],
        note: "Useful for test scores, completion rates and shares of a total.",
        error: null,
      };
    }
    if (mode === "change") {
      if (x === 0) {
        return { headline: "", steps: [], note: "", error: "The starting value (X) can't be zero." };
      }
      const diff = y - x;
      const value = (diff / x) * 100;
      const dir = value > 0 ? "increase" : value < 0 ? "decrease" : "no change";
      return {
        headline: `${value > 0 ? "+" : ""}${fmt(value)}%`,
        steps: [
          `Find the difference: ${fmt(y)} − ${fmt(x)} = ${fmt(diff)}`,
          `Divide by the starting value: ${fmt(diff)} ÷ ${fmt(x)} = ${fmt(diff / x)}`,
          `Convert to a percentage: ${fmt(diff / x)} × 100 = ${fmt(value)}%`,
        ],
        note:
          dir === "no change"
            ? "Both values are the same, so there is no change."
            : `That's a ${fmt(Math.abs(value))}% ${dir} from ${fmt(x)} to ${fmt(y)}.`,
        error: null,
      };
    }
    if (mode === "apply") {
      const decimal = y / 100;
      const amount = x * decimal;
      const value = direction === "increase" ? x + amount : x - amount;
      return {
        headline: `${fmt(value)}`,
        steps: [
          `Convert ${fmt(y)}% to a decimal: ${fmt(y)} ÷ 100 = ${fmt(decimal)}`,
          `Find the ${direction} amount: ${fmt(x)} × ${fmt(decimal)} = ${fmt(amount)}`,
          direction === "increase"
            ? `Add it on: ${fmt(x)} + ${fmt(amount)} = ${fmt(value)}`
            : `Take it off: ${fmt(x)} − ${fmt(amount)} = ${fmt(value)}`,
        ],
        note:
          direction === "increase"
            ? `A ${fmt(y)}% increase on ${fmt(x)} adds ${fmt(amount)}.`
            : `A ${fmt(y)}% decrease on ${fmt(x)} takes off ${fmt(amount)} - handy for sale prices.`,
        error: null,
      };
    }
    // difference
    if (x + y === 0) {
      return { headline: "", steps: [], note: "", error: "Both numbers can't be zero (and they can't be opposites)." };
    }
    const avg = (x + y) / 2;
    const value = (Math.abs(x - y) / Math.abs(avg)) * 100;
    return {
      headline: `${fmt(value)}%`,
      steps: [
        `Absolute difference: |${fmt(x)} − ${fmt(y)}| = ${fmt(Math.abs(x - y))}`,
        `Average of the two: (${fmt(x)} + ${fmt(y)}) ÷ 2 = ${fmt(avg)}`,
        `Divide and convert: ${fmt(Math.abs(x - y))} ÷ ${fmt(Math.abs(avg))} × 100 = ${fmt(value)}%`,
      ],
      note: "Percentage difference compares two numbers symmetrically - unlike % change, swapping X and Y gives the same answer.",
      error: null,
    };
  }, [mode, a, b, direction]);

  const labels =
    mode === "of"
      ? { a: "X: the percentage", b: "Y: the base value", aPh: "e.g. 20", bPh: "e.g. 250" }
      : mode === "what"
        ? { a: "X: the part", b: "Y: the whole", aPh: "e.g. 45", bPh: "e.g. 60" }
        : mode === "change"
          ? { a: "X: the old value", b: "Y: the new value", aPh: "e.g. 80", bPh: "e.g. 100" }
          : mode === "apply"
            ? { a: "X: the starting value", b: "Y: the percentage", aPh: "e.g. 100", bPh: "e.g. 20" }
            : { a: "X: first value", b: "Y: second value", aPh: "e.g. 10", bPh: "e.g. 12" };

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

      {mode === "apply" && (
        <div className="mt-4">
          <SegmentedControl
            label="Direction"
            value={direction}
            onChange={setDirection}
            options={[
              { value: "increase", label: "Increase" },
              { value: "decrease", label: "Decrease" },
            ]}
          />
        </div>
      )}

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
            <ol className="mt-3 space-y-1.5 border-t pt-3" style={{ borderColor: "var(--border)" }} aria-label="Step by step">
              {result.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="shrink-0 font-semibold tabular-nums" style={{ color: "var(--accent-text)" }}>
                    {i + 1}.
                  </span>
                  <span className="tabular-nums">{s}</span>
                </li>
              ))}
            </ol>
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
