"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";

interface UnitDef {
  id: string;
  label: string;
  /** factor to convert this unit into the category's base unit */
  toBase: number;
}

interface CategoryDef {
  id: string;
  label: string;
  units: UnitDef[];
  /** unit ids shown as "common equivalents" below the result */
  common: string[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "length",
    label: "Length",
    common: ["km", "m", "mi", "ft"],
    units: [
      { id: "mm", label: "Millimeters (mm)", toBase: 0.001 },
      { id: "cm", label: "Centimeters (cm)", toBase: 0.01 },
      { id: "m", label: "Meters (m)", toBase: 1 },
      { id: "km", label: "Kilometers (km)", toBase: 1000 },
      { id: "in", label: "Inches (in)", toBase: 0.0254 },
      { id: "ft", label: "Feet (ft)", toBase: 0.3048 },
      { id: "yd", label: "Yards (yd)", toBase: 0.9144 },
      { id: "mi", label: "Miles (mi)", toBase: 1609.344 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    common: ["kg", "g", "lb", "oz"],
    units: [
      { id: "mg", label: "Milligrams (mg)", toBase: 0.000001 },
      { id: "g", label: "Grams (g)", toBase: 0.001 },
      { id: "kg", label: "Kilograms (kg)", toBase: 1 },
      { id: "t", label: "Metric tons (t)", toBase: 1000 },
      { id: "oz", label: "Ounces (oz)", toBase: 0.028349523125 },
      { id: "lb", label: "Pounds (lb)", toBase: 0.45359237 },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    common: ["c", "f", "k"],
    units: [
      { id: "c", label: "Celsius (°C)", toBase: 1 },
      { id: "f", label: "Fahrenheit (°F)", toBase: 1 },
      { id: "k", label: "Kelvin (K)", toBase: 1 },
    ],
  },
  {
    id: "area",
    label: "Area",
    common: ["m2", "km2", "ft2", "acre"],
    units: [
      { id: "cm2", label: "Square cm (cm²)", toBase: 0.0001 },
      { id: "m2", label: "Square m (m²)", toBase: 1 },
      { id: "ha", label: "Hectares (ha)", toBase: 10000 },
      { id: "km2", label: "Square km (km²)", toBase: 1000000 },
      { id: "in2", label: "Square in (in²)", toBase: 0.00064516 },
      { id: "ft2", label: "Square ft (ft²)", toBase: 0.09290304 },
      { id: "yd2", label: "Square yd (yd²)", toBase: 0.83612736 },
      { id: "acre", label: "Acres", toBase: 4046.8564224 },
      { id: "mi2", label: "Square mi (mi²)", toBase: 2589988.110336 },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    common: ["l", "ml", "cup", "gal"],
    units: [
      { id: "ml", label: "Milliliters (ml)", toBase: 0.001 },
      { id: "l", label: "Liters (l)", toBase: 1 },
      { id: "m3", label: "Cubic m (m³)", toBase: 1000 },
      { id: "tsp", label: "Teaspoons (tsp)", toBase: 0.00492892159375 },
      { id: "tbsp", label: "Tablespoons (tbsp)", toBase: 0.01478676478125 },
      { id: "floz", label: "Fluid oz (fl oz)", toBase: 0.0295735295625 },
      { id: "cup", label: "Cups", toBase: 0.2365882365 },
      { id: "pt", label: "Pints (pt)", toBase: 0.473176473 },
      { id: "gal", label: "Gallons (gal)", toBase: 3.785411784 },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    common: ["kmh", "ms", "mph", "knot"],
    units: [
      { id: "ms", label: "Meters/sec (m/s)", toBase: 1 },
      { id: "kmh", label: "Kilometers/hour (km/h)", toBase: 1 / 3.6 },
      { id: "mph", label: "Miles/hour (mph)", toBase: 0.44704 },
      { id: "fts", label: "Feet/sec (ft/s)", toBase: 0.3048 },
      { id: "knot", label: "Knots", toBase: 0.514444444 },
    ],
  },
];

function toCelsius(value: number, from: string): number {
  if (from === "f") return ((value - 32) * 5) / 9;
  if (from === "k") return value - 273.15;
  return value;
}

function fromCelsius(c: number, to: string): number {
  if (to === "f") return (c * 9) / 5 + 32;
  if (to === "k") return c + 273.15;
  return c;
}

function convert(value: number, from: string, to: string, category: CategoryDef): number {
  if (category.id === "temperature") return fromCelsius(toCelsius(value, from), to);
  const fromDef = category.units.find((u) => u.id === from)!;
  const toDef = category.units.find((u) => u.id === to)!;
  return (value * fromDef.toBase) / toDef.toBase;
}

function formatNumber(n: number): string {
  if (!isFinite(n)) return "n/a";
  if (n !== 0 && Math.abs(n) < 0.000001) return n.toExponential(3);
  if (Math.abs(n) >= 1e12) return n.toExponential(3);
  const rounded = Math.round(n * 1e6) / 1e6;
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

const inputCls =
  "focus-ring w-full rounded-lg border px-3 py-2.5 text-sm";
const inputStyle = {
  borderColor: "var(--border-strong)",
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
};

export default function UnitConverterClient() {
  const [catId, setCatId] = useState("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("km");
  const [to, setTo] = useState("mi");

  const category = CATEGORIES.find((c) => c.id === catId)!;

  const selectCategory = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id)!;
    setCatId(id);
    setFrom(cat.units[0].id);
    setTo(cat.units[1].id);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const parsed = parseFloat(value);
  const valid = value.trim() !== "" && !isNaN(parsed);

  const result = useMemo(
    () => (valid ? convert(parsed, from, to, category) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parsed, valid, from, to, catId]
  );

  const equivalents = useMemo(() => {
    if (!valid || result === null) return [];
    return category.common
      .filter((u) => u !== to)
      .map((u) => ({ id: u, value: convert(parsed, from, u, category) }));
  }, [valid, result, parsed, from, to, category]);

  const unitLabel = (id: string) => category.units.find((u) => u.id === id)?.label ?? id;

  return (
    <div>
      {/* Category tabs */}
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Conversion category">
        {CATEGORIES.map((c) => (
          <Btn
            key={c.id}
            variant="toggle"
            size="sm"
            selected={c.id === catId}
            onClick={() => selectCategory(c.id)}
            role="tab"
            aria-selected={c.id === catId}
          >
            {c.label}
          </Btn>
        ))}
      </div>

      <div
        className="rounded-xl border p-4 sm:p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div>
            <label htmlFor="uc-value" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Value
            </label>
            <input
              id="uc-value"
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a number"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div className="hidden sm:block" />
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 sm:contents">
            <div>
              <label htmlFor="uc-from" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                From
              </label>
              <select id="uc-from" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} style={inputStyle}>
                {category.units.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>
            <Btn variant="icon" onClick={swap} aria-label="Swap units" title="Swap units" className="mb-0.5">
              ⇄
            </Btn>
            <div>
              <label htmlFor="uc-to" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                To
              </label>
              <select id="uc-to" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} style={inputStyle}>
                {category.units.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result */}
        <div
          className="mt-4 rounded-lg border p-4 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
          role="status"
          aria-live="polite"
        >
          {valid && result !== null ? (
            <>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {formatNumber(parsed)} {unitLabel(from)} =
              </p>
              <p className="mt-1 text-3xl font-bold sm:text-4xl" style={{ color: "var(--accent-text)" }}>
                {formatNumber(result)}
              </p>
              <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {unitLabel(to)}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Enter a value to see the converted result.
            </p>
          )}
        </div>
      </div>

      {/* Common equivalents */}
      {equivalents.length > 0 && (
        <div
          className="mt-4 rounded-xl border p-4 sm:p-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Also equals
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {equivalents.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setTo(e.id)}
                className="focus-ring rounded-lg border p-3 text-left transition hover:opacity-90"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                title={`Convert to ${unitLabel(e.id)}`}
              >
                <p className="truncate text-base font-bold" style={{ color: "var(--text-primary)" }}>
                  {formatNumber(e.value)}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                  {unitLabel(e.id)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
