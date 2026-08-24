"use client";

/**
 * BUG 8 FIX: the original indeterminate state used
 * `animate-[indeterminate_1.4s_ease-in-out_infinite]` - an arbitrary Tailwind
 * value that references a keyframe ("indeterminate") not defined anywhere in
 * the project. Replaced with a standard `animate-pulse` for the indeterminate
 * bar, and a sliding shimmer built with plain inline styles + a CSS animation
 * declared here via a <style> tag so it works without touching tailwind.config.
 */

interface AudioProgressProps {
  /** 0–1 ratio, or null for indeterminate */
  ratio: number | null;
  label?: string;
}

export default function AudioProgress({ ratio, label = "Processing…" }: AudioProgressProps) {
  const pct = ratio !== null ? Math.round(Math.max(0, Math.min(1, ratio)) * 100) : null;

  return (
    <div className="space-y-2">
      {/* keyframe for the sliding shimmer */}
      <style>{`
        @keyframes audio-shimmer {
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
          /* Determinate */
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
          />
        ) : (
          /* BUG 8 FIX: indeterminate shimmer using a locally-defined keyframe */
          <div
            className="absolute top-0 left-0 h-full w-1/4 rounded-full"
            style={{
              backgroundColor: "var(--accent)",
              animation: "audio-shimmer 1.4s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}
