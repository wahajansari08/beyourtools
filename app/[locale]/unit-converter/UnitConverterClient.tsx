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
      { id: "nmi", label: "Nautical miles (nmi)", toBase: 1852 },
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
      { id: "st", label: "Stones (st)", toBase: 6.35029318 },
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
  {
    id: "data",
    label: "Data Storage",
    common: ["mb", "gb", "kb", "byte"],
    units: [
      { id: "bit", label: "Bits (bit)", toBase: 0.125 },
      { id: "byte", label: "Bytes (B)", toBase: 1 },
      { id: "kb", label: "Kilobytes (KB)", toBase: 1000 },
      { id: "mb", label: "Megabytes (MB)", toBase: 1000000 },
      { id: "gb", label: "Gigabytes (GB)", toBase: 1000000000 },
      { id: "tb", label: "Terabytes (TB)", toBase: 1000000000000 },
      { id: "pb", label: "Petabytes (PB)", toBase: 1000000000000000 },
      { id: "kib", label: "Kibibytes (KiB)", toBase: 1024 },
      { id: "mib", label: "Mebibytes (MiB)", toBase: 1048576 },
      { id: "gib", label: "Gibibytes (GiB)", toBase: 1073741824 },
    ],
  },
  {
    id: "pressure",
    label: "Pressure",
    common: ["bar", "psi", "atm", "kpa"],
    units: [
      { id: "pa", label: "Pascals (Pa)", toBase: 1 },
      { id: "kpa", label: "Kilopascals (kPa)", toBase: 1000 },
      { id: "mbar", label: "Millibars (mbar)", toBase: 100 },
      { id: "bar", label: "Bars (bar)", toBase: 100000 },
      { id: "psi", label: "Pounds/sq in (psi)", toBase: 6894.757293168 },
      { id: "atm", label: "Atmospheres (atm)", toBase: 101325 },
      { id: "torr", label: "Torr (Torr)", toBase: 133.32236842105263 },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    common: ["kcal", "kj", "kwh", "btu"],
    units: [
      { id: "j", label: "Joules (J)", toBase: 1 },
      { id: "kj", label: "Kilojoules (kJ)", toBase: 1000 },
      { id: "cal", label: "Calories (cal)", toBase: 4.184 },
      { id: "kcal", label: "Kilocalories (kcal)", toBase: 4184 },
      { id: "wh", label: "Watt-hours (Wh)", toBase: 3600 },
      { id: "kwh", label: "Kilowatt-hours (kWh)", toBase: 3600000 },
      { id: "btu", label: "British thermal units (BTU)", toBase: 1055.05585262 },
    ],
  },
  {
    id: "time",
    label: "Time",
    common: ["s", "min", "h", "day"],
    units: [
      { id: "ms-time", label: "Milliseconds (ms)", toBase: 0.001 },
      { id: "s", label: "Seconds (s)", toBase: 1 },
      { id: "min", label: "Minutes (min)", toBase: 60 },
      { id: "h", label: "Hours (h)", toBase: 3600 },
      { id: "day", label: "Days", toBase: 86400 },
      { id: "week", label: "Weeks", toBase: 604800 },
      { id: "month", label: "Months (30 days)", toBase: 2592000 },
      { id: "year", label: "Years (365 days)", toBase: 31536000 },
    ],
  },
  {
    id: "angle",
    label: "Angle",
    common: ["deg", "rad", "grad", "turn"],
    units: [
      { id: "deg", label: "Degrees (°)", toBase: 1 },
      { id: "rad", label: "Radians (rad)", toBase: 57.29577951308232 },
      { id: "grad", label: "Gradians (grad)", toBase: 0.9 },
      { id: "turn", label: "Turns (revolutions)", toBase: 360 },
    ],
  },
  {
    id: "power",
    label: "Power",
    common: ["w", "kw", "hp", "mw"],
    units: [
      { id: "w", label: "Watts (W)", toBase: 1 },
      { id: "kw", label: "Kilowatts (kW)", toBase: 1000 },
      { id: "mw", label: "Megawatts (MW)", toBase: 1000000 },
      { id: "hp", label: "Horsepower (hp)", toBase: 745.699872 },
      { id: "btuh", label: "BTU/hour (BTU/h)", toBase: 0.29307107 },
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

function formatNumber(n: number, decimals = 6): string {
  if (!isFinite(n)) return "n/a";
  if (n !== 0 && Math.abs(n) < 0.000001) return n.toExponential(3);
  if (Math.abs(n) >= 1e12) return n.toExponential(3);
  const factor = 10 ** decimals;
  const rounded = Math.round(n * factor) / factor;
  return rounded.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

const inputCls =
  "focus-ring w-full rounded-lg border px-3 py-2.5 text-sm";

interface QuickChip {
  label: string;
  cat: string;
  from: string;
  to: string;
  value: string;
}

const QUICK_CHIPS: QuickChip[] = [
  { label: "1 km → miles", cat: "length", from: "km", to: "mi", value: "1" },
  { label: "1 kg → pounds", cat: "weight", from: "kg", to: "lb", value: "1" },
  { label: "100 °C → °F", cat: "temperature", from: "c", to: "f", value: "100" },
  { label: "1 GB → MB", cat: "data", from: "gb", to: "mb", value: "1" },
  { label: "1 bar → psi", cat: "pressure", from: "bar", to: "psi", value: "1" },
  { label: "1,000 kcal → kJ", cat: "energy", from: "kcal", to: "kj", value: "1000" },
  { label: "1 h → minutes", cat: "time", from: "h", to: "min", value: "1" },
  { label: "180° → radians", cat: "angle", from: "deg", to: "rad", value: "180" },
];

const TEMP_FORMULAS: Record<string, string> = {
  "c-f": "°F = (°C × 9/5) + 32",
  "c-k": "K = °C + 273.15",
  "f-c": "°C = (°F − 32) × 5/9",
  "f-k": "K = (°F − 32) × 5/9 + 273.15",
  "k-c": "°C = K − 273.15",
  "k-f": "°F = (K − 273.15) × 9/5 + 32",
};
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
  const [precision, setPrecision] = useState(6);
  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    if (!valid || result === null) return;
    const text = `${formatNumber(parsed, precision)} ${to}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

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

  const applyChip = (chip: QuickChip) => {
    setCatId(chip.cat);
    setFrom(chip.from);
    setTo(chip.to);
    setValue(chip.value);
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

  const formula = useMemo(() => {
    if (!valid) return null;
    if (from === to) return "Same unit — the value stays unchanged.";
    if (category.id === "temperature") return TEMP_FORMULAS[`${from}-${to}`] ?? null;
    const fromDef = category.units.find((u) => u.id === from);
    const toDef = category.units.find((u) => u.id === to);
    if (!fromDef || !toDef) return null;
    return `1 ${from} = ${formatNumber(fromDef.toBase / toDef.toBase, precision)} ${to}`;
  }, [valid, from, to, category, precision]);

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

      {/* Common conversions */}
      <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Common conversions">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Popular:
        </span>
        {QUICK_CHIPS.map((chip) => (
          <Btn
            key={chip.label}
            variant="ghost"
            size="sm"
            onClick={() => applyChip(chip)}
            title={`Convert ${chip.label}`}
          >
            {chip.label}
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
                {formatNumber(parsed, precision)} {unitLabel(from)} =
              </p>
              <p className="mt-1 text-3xl font-bold sm:text-4xl" style={{ color: "var(--accent-text)" }}>
                {formatNumber(result, precision)}
              </p>
              <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {unitLabel(to)}
              </p>
              {formula && (
                <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  Formula: {formula}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <label className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  Decimal places
                  <select
                    value={precision}
                    onChange={(e) => setPrecision(Number(e.target.value))}
                    className="focus-ring rounded-lg border px-2 py-1.5 text-sm"
                    style={inputStyle}
                    aria-label="Decimal places"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <Btn variant="ghost" size="sm" onClick={copyResult}>
                  {copied ? "Copied!" : "Copy result"}
                </Btn>
              </div>
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
                  {formatNumber(e.value, precision)}
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
