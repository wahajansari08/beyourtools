"use client";

interface VideoProgressProps {
  ratio: number | null;
  label?: string;
}

export default function VideoProgress({ ratio, label = "Processing video..." }: VideoProgressProps) {
  const pct = ratio !== null ? Math.round(Math.min(Math.max(ratio, 0), 1) * 100) : null;

  return (
    <div className="space-y-2" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--text-muted)" }}>{label}</span>
        {pct !== null && (
          <span className="tabular-nums font-medium" style={{ color: "var(--accent)" }}>
            {pct}%
          </span>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }}>
        {pct !== null ? (
          <div className="h-full rounded-full transition-all duration-200" style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }} />
        ) : (
          <div className="h-full w-1/3 animate-[indeterminate_1.4s_ease-in-out_infinite] rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        )}
      </div>
    </div>
  );
}

