"use client";

import clsx from "clsx";

export default function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-mist-400">{label}</span>}
      <div className="inline-flex rounded-md border border-ink-600 bg-ink-900 p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "focus-ring rounded px-2.5 py-1 text-xs font-medium transition",
              value === opt.value ? "bg-amber-400 text-ink-950" : "text-mist-300 hover:text-mist-50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
