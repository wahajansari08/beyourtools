"use client";

/**
 * BUG 1 FIX: removed the undefined `animate-[indeterminate_...]` class.
 * Replaced with the same locally-scoped @keyframes approach used in AudioProgress.
 */

interface VideoProgressProps {
  ratio: number | null;
  label?: string;
}

export default function VideoProgress({ ratio, label = "Processing video…" }: VideoProgressProps) {
  const pct = ratio !== null ? Math.round(Math.min(Math.max(ratio, 0), 1) * 100) : null;

  return (
    <div className="space-y-2" role="status" aria-live="polite">
      <style>{`
        @keyframes video-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>

      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--text-muted)" }}>{label}</span>
        {pct !== null && (
          <span className="tabular-nums font-medium" style={{ color: "var(--accent)" }}>
            {pct}%
          </span>
        )}
      </div>

      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--bg-elevated)" }}
        role="progressbar"
        aria-valuenow={pct ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        {pct !== null ? (
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
          />
        ) : (
          <div
            className="absolute top-0 left-0 h-full w-1/4 rounded-full"
            style={{
              backgroundColor: "var(--accent)",
              animation: "video-shimmer 1.4s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}
