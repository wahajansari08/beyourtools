"use client";
import { useState } from "react";
import Btn from "@/components/Btn";

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function OvertimeClient() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [regularHours, setRegularHours] = useState("40");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [multiplier, setMultiplier] = useState("1.5");
  const [result, setResult] = useState<{
    regularPay: number; overtimePay: number; totalPay: number; overtimeRate: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const rate = parseFloat(hourlyRate);
    const reg = parseFloat(regularHours);
    const ot = parseFloat(overtimeHours);
    const mult = parseFloat(multiplier);
    if (!rate || rate <= 0) { setError("Enter a valid hourly rate."); return; }
    if (isNaN(reg) || reg < 0) { setError("Enter valid regular hours."); return; }
    if (isNaN(ot) || ot < 0) { setError("Enter valid overtime hours (0 or more)."); return; }
    if (!mult || mult < 1) { setError("Multiplier must be at least 1."); return; }
    const overtimeRate = rate * mult;
    setResult({
      regularPay: rate * reg,
      overtimePay: overtimeRate * ot,
      totalPay: rate * reg + overtimeRate * ot,
      overtimeRate,
    });
  }

  function reset() { setHourlyRate(""); setRegularHours("40"); setOvertimeHours(""); setMultiplier("1.5"); setResult(null); setError(""); }

  const presets = [
    { label: "1.5× (time & a half)", value: "1.5" },
    { label: "2× (double time)", value: "2" },
    { label: "2.5× (double time & a half)", value: "2.5" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <label htmlFor="ot-rate" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Regular Hourly Rate ($)</label>
          <input id="ot-rate" type="number" min="0" step="any" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g. 20"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ot-reg" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Regular Hours</label>
            <input id="ot-reg" type="number" min="0" step="0.5" value={regularHours} onChange={(e) => setRegularHours(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="ot-oth" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Overtime Hours</label>
            <input id="ot-oth" type="number" min="0" step="0.5" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} placeholder="e.g. 8"
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Overtime Multiplier</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {presets.map((p) => (
              <Btn variant="toggle" size="sm" key={p.value} onClick={() => setMultiplier(p.value)} selected={multiplier === p.value}>{p.label}</Btn>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="ot-mult" className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>Custom multiplier:</label>
            <input id="ot-mult" type="number" min="1" step="0.25" value={multiplier} onChange={(e) => setMultiplier(e.target.value)}
              className="focus-ring w-24 rounded-lg border px-3 py-1.5 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
            <span className="text-xs" style={{ color: "var(--text-subtle)" }}>×</span>
          </div>
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
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Results</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Regular Pay", value: `$${fmt(result.regularPay)}`, sub: `${regularHours} hrs × $${fmt(parseFloat(hourlyRate))}` },
              { label: "Overtime Pay", value: `$${fmt(result.overtimePay)}`, sub: `${overtimeHours} hrs × $${fmt(result.overtimeRate)} (${multiplier}×)` },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>{label}</p>
                <p className="mt-1 font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-subtle)" }}>{sub}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4 text-center" style={{ borderColor: "color-mix(in srgb,var(--teal) 30%,transparent)", backgroundColor: "color-mix(in srgb,var(--teal) 8%,transparent)" }}>
            <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Total Pay This Period</p>
            <p className="mt-1 font-display text-xl font-bold" style={{ color: "var(--teal)" }}>${fmt(result.totalPay)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
