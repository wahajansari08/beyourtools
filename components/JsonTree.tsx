"use client";

import { useState } from "react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function valueColor(value: JsonValue): string {
  if (typeof value === "string") return "text-amber-400";
  if (typeof value === "number") return "text-teal-400";
  if (typeof value === "boolean") return "text-coral-400";
  if (value === null) return "text-mist-400";
  return "text-mist-100";
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
      <div className="flex items-start gap-1 py-0.5 pl-4" style={{ paddingLeft: `${depth * 16 + 16}px` }}>
        {label !== null && <span className="text-mist-300">{label}:</span>}
        <span className={valueColor(value)}>{formatPrimitive(value)}</span>
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
        className="focus-ring flex w-full items-center gap-1 rounded py-0.5 pl-4 text-left hover:bg-ink-800"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <span className="w-3 text-mist-400">{open ? "▾" : "▸"}</span>
        {label !== null && <span className="text-mist-300">{label}:</span>}
        <span className="text-mist-400">
          {bracket[0]}
          {!open && (
            <span className="text-mist-500">
              {" "}
              {count} {count === 1 ? "item" : "items"}{" "}
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
          <div className="text-mist-400" style={{ paddingLeft: `${depth * 16 + 20}px` }}>
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
