"use client";

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
      {label && (
        <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
          {label}
        </span>
      )}
      <div
        className="inline-flex rounded-md border p-0.5"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)" }}
      >
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="focus-ring rounded px-2.5 py-1 text-xs font-medium transition"
              style={{
                backgroundColor: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "var(--accent-fg)" : "var(--text-muted)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
