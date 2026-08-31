"use client";
import { useState } from "react";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

type InputMode = "percent" | "amount" | "newSalary";

export default function PayRaiseClient() {
  const [currentSalary, setCurrentSalary] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("percent");
  const [raisePercent, setRaisePercent] = useState("");
  const [raiseAmount, setRaiseAmount] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [paychecksPerYear, setPaychecksPerYear] = useState("26");
  const [result, setResult] = useState<{
    newAnnual: number; raiseAmount: number; raisePercent: number;
    perPaycheck: number; oldPaycheck: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const cur = parseFloat(currentSalary);
    const ppy = parseFloat(paychecksPerYear);
    if (!cur || cur <= 0) { setError("Enter a valid current salary."); return; }
    if (!ppy || ppy <= 0) { setError("Enter a valid number of paychecks per year."); return; }

    let newAnnual: number;
    if (inputMode === "percent") {
      const pct = parseFloat(raisePercent);
      if (isNaN(pct) || pct < 0) { setError("Enter a valid raise percentage."); return; }
      newAnnual = cur * (1 + pct / 100);
    } else if (inputMode === "amount") {
      const amt = parseFloat(raiseAmount);
      if (isNaN(amt) || amt < 0) { setError("Enter a valid raise amount."); return; }
      newAnnual = cur + amt;
    } else {
      const ns = parseFloat(newSalary);
      if (!ns || ns <= cur) { setError("New salary must be greater than current salary."); return; }
      newAnnual = ns;
    }

    const raiseDollar = newAnnual - cur;
    const raisePct = (raiseDollar / cur) * 100;
    setResult({
      newAnnual,
      raiseAmount: raiseDollar,
      raisePercent: raisePct,
      perPaycheck: newAnnual / ppy,
      oldPaycheck: cur / ppy,
    });
  }

  function reset() { setCurrentSalary(""); setRaisePercent(""); setRaiseAmount(""); setNewSalary(""); setResult(null); setError(""); }

  const modes: { id: InputMode; label: string }[] = [
    { id: "percent", label: "By %" },
    { id: "amount", label: "By $" },
    { id: "newSalary", label: "New Salary" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="pr-cur" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Current Annual Salary ($)</label>
          <input id="pr-cur" type="number" min="0" step="any" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} placeholder="e.g. 65000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Define raise by</p>
          <div className="flex gap-2" role="group" aria-label="Raise input type">
            {modes.map((m) => (
              <button key={m.id} type="button" onClick={() => { setInputMode(m.id); setResult(null); }}
                className="focus-ring rounded border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: inputMode === m.id ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: inputMode === m.id ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: inputMode === m.id ? "var(--accent)" : "var(--text-muted)",
                }} aria-pressed={inputMode === m.id}>{m.label}</button>
            ))}
          </div>
        </div>
        {inputMode === "percent" && (
          <div>
            <label htmlFor="pr-pct" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Raise Percentage (%)</label>
            <input id="pr-pct" type="number" min="0" step="any" value={raisePercent} onChange={(e) => setRaisePercent(e.target.value)} placeholder="e.g. 5"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {inputMode === "amount" && (
          <div>
            <label htmlFor="pr-amt" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Raise Amount ($)</label>
            <input id="pr-amt" type="number" min="0" step="any" value={raiseAmount} onChange={(e) => setRaiseAmount(e.target.value)} placeholder="e.g. 3500"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        {inputMode === "newSalary" && (
          <div>
            <label htmlFor="pr-new" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>New Annual Salary ($)</label>
            <input id="pr-new" type="number" min="0" step="any" value={newSalary} onChange={(e) => setNewSalary(e.target.value)} placeholder="e.g. 70000"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        )}
        <div>
          <label htmlFor="pr-ppy" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Paychecks per Year</label>
          <select id="pr-ppy" value={paychecksPerYear} onChange={(e) => setPaychecksPerYear(e.target.value)}
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}>
            <option value="52">52 — Weekly</option>
            <option value="26">26 — Bi-Weekly</option>
            <option value="24">24 — Semi-Monthly</option>
            <option value="12">12 — Monthly</option>
          </select>
        </div>
      </div>

      {error && <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={calculate} className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>Calculate</button>
        <button type="button" onClick={reset} className="focus-ring rounded-lg border px-5 py-2.5 text-sm font-medium transition"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>Reset</button>
      </div>

      {result && (
        <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Your Pay Raise</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "New Annual Salary", value: `$${fmt(result.newAnnual)}`, primary: true },
              { label: "Raise Amount", value: `+$${fmt(result.raiseAmount)}` },
              { label: "Raise %", value: `+${fmt(result.raisePercent)}%` },
              { label: `Per Paycheck (÷${paychecksPerYear})`, value: `$${fmt(result.perPaycheck)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-3 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-lg font-bold" style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Paycheck increase: +${fmt(result.perPaycheck - result.oldPaycheck)} per paycheck (gross, before taxes).
          </p>
        </div>
      )}
    </div>
  );
}
