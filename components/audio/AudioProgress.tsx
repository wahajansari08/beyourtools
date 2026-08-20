"use client";

interface AudioProgressProps {
  /** 0–1 ratio, or null for indeterminate */
  ratio: number | null;
  label?: string;
}

export default function AudioProgress({ ratio, label = "Processing…" }: AudioProgressProps) {
  const pct = ratio !== null ? Math.round(ratio * 100) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--text-muted)" }}>{label}</span>
        {pct !== null && (
          <span className="tabular-nums font-medium" style={{ color: "var(--accent)" }}>{pct}%</span>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }}>
        {pct !== null ? (
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
          />
        ) : (
          /* Indeterminate animation */
          <div className="h-full w-1/3 rounded-full animate-[indeterminate_1.4s_ease-in-out_infinite]"
            style={{ backgroundColor: "var(--accent)" }} />
        )}
      </div>
    </div>
  );
}
