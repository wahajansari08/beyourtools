"use client";

import { useState } from "react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function valueStyle(value: JsonValue): React.CSSProperties {
  if (typeof value === "string") return { color: "var(--accent)" };
  if (typeof value === "number") return { color: "var(--teal)" };
  if (typeof value === "boolean") return { color: "var(--coral)" };
  if (value === null) return { color: "var(--text-subtle)" };
  return { color: "var(--text-primary)" };
}

function formatPrimitive(value: JsonValue): string {
  if (typeof value === "string") return `"${value}"`;
  if (value === null) return "null";
  return String(value);
}

function Node({ label, value, depth }: { label: string | null; value: JsonValue; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  if (!isExpandable) {
    return (
      <div className="flex items-start gap-1 py-0.5" style={{ paddingLeft: `${depth * 16 + 16}px` }}>
        {label !== null && <span style={{ color: "var(--text-muted)" }}>{label}:</span>}
        <span style={valueStyle(value)}>{formatPrimitive(value)}</span>
      </div>
    );
  }

  const entries = isArray
    ? (value as JsonValue[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, JsonValue>);
  const bracket = isArray ? ["[", "]"] : ["{", "}"];
  const count = entries.length;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex w-full items-center gap-1 rounded py-0.5 text-left transition hover:opacity-80"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <span className="w-3" style={{ color: "var(--text-subtle)" }}>{open ? "▾" : "▸"}</span>
        {label !== null && <span style={{ color: "var(--text-muted)" }}>{label}:</span>}
        <span style={{ color: "var(--text-subtle)" }}>
          {bracket[0]}
          {!open && (
            <span style={{ color: "var(--text-subtle)", opacity: 0.7 }}>
              {" "}{count} {count === 1 ? "item" : "items"}{" "}
            </span>
          )}
          {!open && bracket[1]}
        </span>
      </button>
      {open && (
        <div>
          {entries.map(([k, v]) => (
            <Node key={k} label={isArray ? null : k} value={v} depth={depth + 1} />
          ))}
          <div style={{ paddingLeft: `${depth * 16 + 20}px`, color: "var(--text-subtle)" }}>
            {bracket[1]}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JsonTree({ data }: { data: unknown }) {
  return (
    <div className="px-1 py-2 font-mono text-[13px] leading-[1.6em]">
      <Node label={null} value={data as JsonValue} depth={0} />
    </div>
  );
}
