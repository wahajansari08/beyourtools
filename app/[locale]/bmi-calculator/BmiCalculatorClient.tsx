"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";

type Units = "metric" | "imperial";

function category(bmi: number): { name: string; blurb: string } {
  if (bmi < 18.5) return { name: "Underweight", blurb: "Below the healthy range. Consider talking to a clinician about nutrition." };
  if (bmi < 25) return { name: "Healthy weight", blurb: "Within the WHO healthy range. Keep up whatever is working." };
  if (bmi < 30) return { name: "Overweight", blurb: "Above the healthy range. Small, steady changes matter more than crash diets." };
  return { name: "Obese", blurb: "Well above the healthy range. A clinician can help build a safe plan." };
}

const inputClass = "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
const inputStyle = {
  borderColor: "var(--border-strong)",
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
} as const;

// Gauge spans BMI 14 → 40
const GAUGE_MIN = 14;
const GAUGE_MAX = 40;
const segPct = (bmi: number) =>
  `${Math.min(100, Math.max(0, ((bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100))}%`;

export default function BmiCalculatorClient() {
  const [units, setUnits] = useState<Units>("metric");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightLb, setWeightLb] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const calc = useMemo(() => {
    let kg: number | null = null;
    let m: number | null = null;
    if (units === "metric") {
      const w = parseFloat(weightKg);
      const h = parseFloat(heightCm);
      if (w > 0 && h > 0) {
        kg = w;
        m = h / 100;
      }
    } else {
      const w = parseFloat(weightLb);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const totalIn = ft * 12 + inch;
      if (w > 0 && totalIn > 0) {
        kg = w * 0.45359237;
        m = totalIn * 0.0254;
      }
    }
    if (kg === null || m === null || m <= 0) return null;

    const bmi = kg / (m * m);
    const cat = category(bmi);
    const lowKg = 18.5 * m * m;
    const highKg = 24.9 * m * m;
    const low = units === "metric" ? lowKg : lowKg / 0.45359237;
    const high = units === "metric" ? highKg : highKg / 0.45359237;
    const unit = units === "metric" ? "kg" : "lb";
    return { bmi, cat, low, high, unit };
  }, [units, weightKg, heightCm, weightLb, heightFt, heightIn]);

  const gauge = calc
    ? [
        { from: 14, to: 18.5, label: "Under 18.5", healthy: false },
        { from: 18.5, to: 25, label: "18.5 – 24.9", healthy: true },
        { from: 25, to: 30, label: "25 – 29.9", healthy: false },
        { from: 30, to: 40, label: "30+", healthy: false },
      ]
    : [];

  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      {/* Unit toggle */}
      <div className="mb-5 flex gap-2" role="group" aria-label="Units">
        <Btn variant="toggle" size="sm" selected={units === "metric"} onClick={() => setUnits("metric")}>
          Metric (kg / cm)
        </Btn>
        <Btn variant="toggle" size="sm" selected={units === "imperial"} onClick={() => setUnits("imperial")}>
          Imperial (lb / ft·in)
        </Btn>
      </div>

      {/* Inputs */}
      {units === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bmi-height-cm" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Height (cm)
            </label>
            <input id="bmi-height-cm" type="number" inputMode="decimal" step="any" min={0} value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 175" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="bmi-weight-kg" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Weight (kg)
            </label>
            <input id="bmi-weight-kg" type="number" inputMode="decimal" step="any" min={0} value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 70" className={inputClass} style={inputStyle} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="bmi-height-ft" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Height (ft)
            </label>
            <input id="bmi-height-ft" type="number" inputMode="decimal" step="any" min={0} value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)} placeholder="e.g. 5" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="bmi-height-in" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Height (in)
            </label>
            <input id="bmi-height-in" type="number" inputMode="decimal" step="any" min={0} value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)} placeholder="e.g. 9" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="bmi-weight-lb" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Weight (lb)
            </label>
            <input id="bmi-weight-lb" type="number" inputMode="decimal" step="any" min={0} value={weightLb}
              onChange={(e) => setWeightLb(e.target.value)} placeholder="e.g. 154" className={inputClass} style={inputStyle} />
          </div>
        </div>
      )}

      {/* Result */}
      <div className="mt-6 rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }} role="status" aria-live="polite">
        {calc ? (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                Your BMI
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--accent-text)" }}>
                {calc.cat.name}
              </p>
            </div>
            <p className="mt-1 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              {calc.bmi.toFixed(1)}
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {calc.cat.blurb}
            </p>

            {/* Gauge */}
            <div className="mt-4">
              <div className="relative flex h-3 w-full overflow-hidden rounded-full" role="img"
                aria-label={`BMI gauge: ${calc.bmi.toFixed(1)}, category ${calc.cat.name}`}>
                {gauge.map((s) => (
                  <div
                    key={s.label}
                    title={s.label}
                    className="h-full border-r last:border-r-0"
                    style={{
                      width: `calc(${segPct(s.to)} - ${segPct(s.from)})`,
                      backgroundColor: s.healthy
                        ? "var(--accent)"
                        : "color-mix(in srgb, var(--text-subtle) 25%, transparent)",
                      borderColor: "var(--bg-elevated)",
                    }}
                  />
                ))}
                <div
                  className="absolute top-[-2px] h-[16px] w-[3px] rounded-full"
                  style={{ left: `calc(${segPct(calc.bmi)} - 1.5px)`, backgroundColor: "var(--text-primary)", boxShadow: "0 0 0 2px var(--bg-elevated)" }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px]" style={{ color: "var(--text-subtle)" }}>
                <span>14</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
              <div className="mt-1 flex justify-between text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                <span>Underweight</span>
                <span style={{ color: "var(--accent-text)" }}>Healthy</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>

            {/* Healthy range */}
            <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              Healthy weight range for your height:{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {calc.low.toFixed(1)} – {calc.high.toFixed(1)} {calc.unit}
              </strong>
            </p>
          </>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enter your height and weight above. Your BMI appears live.
          </p>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "var(--text-subtle)" }}>
        Private by design: these numbers are calculated locally in your browser and are never sent or stored anywhere. BMI is a screening measure, not a diagnosis. Muscle mass and body composition affect what it means for you.
      </p>
    </div>
  );
}
