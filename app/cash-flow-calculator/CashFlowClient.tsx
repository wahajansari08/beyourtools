"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

interface LineItem { label: string; amount: string; }

function Section({
  title, items, onAdd, onRemove, onUpdate, color,
}: {
  title: string; items: LineItem[]; color: string;
  onAdd: () => void; onRemove: (i: number) => void;
  onUpdate: (i: number, f: keyof LineItem, v: string) => void;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>{title}</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" value={item.label} onChange={(e) => onUpdate(i, "label", e.target.value)}
            className="focus-ring min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-xs"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            aria-label="Line item description" placeholder="Description" />
          <input type="number" min="0" step="any" value={item.amount} onChange={(e) => onUpdate(i, "amount", e.target.value)}
            className="focus-ring w-28 rounded-lg border px-3 py-1.5 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            aria-label="Amount" placeholder="$" />
          {items.length > 1 && (
            <button type="button" onClick={() => onRemove(i)}
              className="focus-ring rounded text-xs shrink-0" style={{ color: "var(--coral)" }}>✕</button>
          )}
        </div>
      ))}
      <button type="button" onClick={onAdd}
        className="focus-ring rounded-lg border px-3 py-1.5 text-xs font-medium transition"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
        + Add item
      </button>
    </div>
  );
}

export default function CashFlowClient() {
  const [operating, setOperating] = useState<LineItem[]>([
    { label: "Net Income", amount: "" },
    { label: "Depreciation & Amortisation", amount: "" },
  ]);
  const [investing, setInvesting] = useState<LineItem[]>([
    { label: "Capital Expenditure", amount: "" },
  ]);
  const [financing, setFinancing] = useState<LineItem[]>([
    { label: "Loan Repayment", amount: "" },
  ]);
  const [signs, setSigns] = useState<{ operating: string[]; investing: string[]; financing: string[] }>({
    operating: ["positive", "positive"],
    investing: ["negative"],
    financing: ["negative"],
  });
  const [result, setResult] = useState<{
    operatingCF: number; investingCF: number; financingCF: number; netCF: number;
  } | null>(null);
  const [error, setError] = useState("");

  function sum(items: LineItem[], sgns: string[]) {
    return items.reduce((acc, item, i) => {
      const val = parseFloat(item.amount) || 0;
      return acc + (sgns[i] === "negative" ? -val : val);
    }, 0);
  }

  function calculate() {
    setError("");
    const operatingCF = sum(operating, signs.operating);
    const investingCF = sum(investing, signs.investing);
    const financingCF = sum(financing, signs.financing);
    setResult({ operatingCF, investingCF, financingCF, netCF: operatingCF + investingCF + financingCF });
  }

  function reset() {
    setOperating([{ label: "Net Income", amount: "" }, { label: "Depreciation & Amortisation", amount: "" }]);
    setInvesting([{ label: "Capital Expenditure", amount: "" }]);
    setFinancing([{ label: "Loan Repayment", amount: "" }]);
    setSigns({ operating: ["positive", "positive"], investing: ["negative"], financing: ["negative"] });
    setResult(null); setError("");
  }

  function addItem(section: "operating" | "investing" | "financing") {
    const setters = { operating: setOperating, investing: setInvesting, financing: setFinancing };
    setters[section]((d) => [...d, { label: "", amount: "" }]);
    setSigns((s) => ({ ...s, [section]: [...s[section], section === "operating" ? "positive" : "negative"] }));
    setResult(null);
  }

  function removeItem(section: "operating" | "investing" | "financing", i: number) {
    const setters = { operating: setOperating, investing: setInvesting, financing: setFinancing };
    setters[section]((d) => d.filter((_, idx) => idx !== i));
    setSigns((s) => ({ ...s, [section]: s[section].filter((_, idx) => idx !== i) }));
    setResult(null);
  }

  function updateItem(section: "operating" | "investing" | "financing", i: number, f: keyof LineItem, v: string) {
    const setters = { operating: setOperating, investing: setInvesting, financing: setFinancing };
    setters[section]((d) => d.map((item, idx) => idx === i ? { ...item, [f]: v } : item));
    setResult(null);
  }

  return (
    <div className="space-y-5">
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
        Enter positive values for inflows and outflows - use the sign indicator to set whether each item is cash in (+) or cash out (−).
        Outflows are treated as negative by default for investing and financing activities.
      </p>

      <Section title="Operating Activities" items={operating} color="var(--teal)"
        onAdd={() => addItem("operating")} onRemove={(i) => removeItem("operating", i)}
        onUpdate={(i, f, v) => updateItem("operating", i, f, v)} />
      <Section title="Investing Activities" items={investing} color="var(--accent-text)"
        onAdd={() => addItem("investing")} onRemove={(i) => removeItem("investing", i)}
        onUpdate={(i, f, v) => updateItem("investing", i, f, v)} />
      <Section title="Financing Activities" items={financing} color="var(--coral)"
        onAdd={() => addItem("financing")} onRemove={(i) => removeItem("financing", i)}
        onUpdate={(i, f, v) => updateItem("financing", i, f, v)} />

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
          Calculate Cash Flow
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Cash Flow Summary</h3>
          <div className="space-y-2">
            {[
              { label: "Operating Cash Flow",  value: result.operatingCF,  color: "var(--teal)" },
              { label: "Investing Cash Flow",  value: result.investingCF,  color: "var(--accent-text)" },
              { label: "Financing Cash Flow",  value: result.financingCF,  color: "var(--coral)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between rounded-lg border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
                <span className="font-display text-base font-bold"
                  style={{ color: value >= 0 ? color : "var(--coral)" }}>
                  {value >= 0 ? "+" : ""}${fmt(value)}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4"
            style={{
              borderColor: result.netCF >= 0 ? "color-mix(in srgb,var(--teal) 30%,transparent)" : "color-mix(in srgb,var(--coral) 30%,transparent)",
              backgroundColor: result.netCF >= 0 ? "color-mix(in srgb,var(--teal) 8%,transparent)" : "color-mix(in srgb,var(--coral) 8%,transparent)",
            }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Net Cash Flow</span>
              <span className="font-display text-2xl font-bold"
                style={{ color: result.netCF >= 0 ? "var(--teal)" : "var(--coral)" }}>
                {result.netCF >= 0 ? "+" : ""}${fmt(result.netCF)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
