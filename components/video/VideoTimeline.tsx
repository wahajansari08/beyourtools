"use client";

import { formatDuration } from "@/lib/video/browser";

interface VideoTimelineProps {
  duration: number | null;
  start: number;
  end: number;
  onStartChange: (value: number) => void;
  onEndChange: (value: number) => void;
  onPreview?: () => void;
}

export default function VideoTimeline({ duration, start, end, onStartChange, onEndChange, onPreview }: VideoTimelineProps) {
  const max = Math.max(duration ?? 1, 1);
  const selected = Math.max(end - start, 0);

  return (
    <div className="space-y-3 rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span style={{ color: "var(--text-muted)" }}>Original duration: {formatDuration(duration)}</span>
        <span style={{ color: "var(--accent)" }}>Selected: {formatDuration(selected)}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
          Start time
          <input
            type="number"
            min={0}
            max={max}
            step="0.1"
            value={Number(start.toFixed(1))}
            onChange={(event) => onStartChange(Math.min(Number(event.target.value), end - 0.1))}
            className="focus-ring w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </label>
        <label className="space-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
          End time
          <input
            type="number"
            min={0}
            max={max}
            step="0.1"
            value={Number(end.toFixed(1))}
            onChange={(event) => onEndChange(Math.max(Number(event.target.value), start + 0.1))}
            className="focus-ring w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </label>
      </div>
      <label className="block text-xs" style={{ color: "var(--text-muted)" }}>
        Start handle
        <input type="range" min={0} max={max} step="0.1" value={start} onChange={(event) => onStartChange(Math.min(Number(event.target.value), end - 0.1))} className="mt-2 w-full" />
      </label>
      <label className="block text-xs" style={{ color: "var(--text-muted)" }}>
        End handle
        <input type="range" min={0} max={max} step="0.1" value={end} onChange={(event) => onEndChange(Math.max(Number(event.target.value), start + 0.1))} className="mt-2 w-full" />
      </label>
      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="focus-ring rounded-md border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
        >
          Preview selection
        </button>
      )}
    </div>
  );
}

