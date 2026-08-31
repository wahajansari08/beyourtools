"use client";
import { useState } from "react";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function CreditCardPayoffClient() {
  const [balance, setBalance]   = useState("");
  const [apr, setApr]           = useState("");
  const [payment, setPayment]   = useState("");
  const [result, setResult] = useState<{
    months: number; totalInterest: number; totalPaid: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const bal = parseFloat(balance);
    const r   = parseFloat(apr) / 100 / 12;
    const M   = parseFloat(payment);

    if (!bal || bal <= 0)             { setError("Enter a valid balance."); return; }
    if (parseFloat(apr) < 0)          { setError("APR cannot be negative."); return; }
    if (!M || M <= 0)                 { setError("Enter a valid monthly payment."); return; }
    if (r > 0 && M <= bal * r) {
      setError(`Payment of $${fmt(M)} doesn't cover monthly interest of $${fmt(bal * r)}. Increase your payment.`);
      return;
    }

    let remaining = bal, months = 0, totalInt = 0;
    while (remaining > 0.005 && months < 600) {
      const int = remaining * r;
      totalInt += int;
      remaining = Math.max(0, remaining + int - M);
      months++;
    }
    setResult({ months, totalInterest: totalInt, totalPaid: bal + totalInt });
  }

  function reset() { setBalance(""); setApr(""); setPayment(""); setResult(null); setError(""); }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="cc-bal" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Current Balance ($)
          </label>
          <input id="cc-bal" type="number" min="0" step="any" value={balance}
            onChange={(e) => setBalance(e.target.value)} placeholder="e.g. 5000"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cc-apr" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Annual Percentage Rate — APR (%)
            </label>
            <input id="cc-apr" type="number" min="0" step="any" value={apr}
              onChange={(e) => setApr(e.target.value)} placeholder="e.g. 20.99"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="cc-pay" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Monthly Payment ($)
            </label>
            <input id="cc-pay" type="number" min="0" step="any" value={payment}
              onChange={(e) => setPayment(e.target.value)} placeholder="e.g. 200"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
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
          Calculate
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Payoff Results</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Payoff Time",    value: `${Math.floor(result.months / 12)}y ${result.months % 12}m`, primary: true },
              { label: "Total Interest", value: `$${fmt(result.totalInterest)}` },
              { label: "Total Paid",     value: `$${fmt(result.totalPaid)}` },
            ].map(({ label, value, primary }) => (
              <div key={label} className="rounded-lg border p-4 text-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold"
                  style={{ color: primary ? "var(--teal)" : "var(--text-primary)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
