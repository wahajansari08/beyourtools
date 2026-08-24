"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { changeAudioSpeed, SPEED_OPTIONS } from "@/lib/audio/speed";

export default function SpeedChangerClient() {
  const [speed,  setSpeed]  = useState(1.5);
  const [custom, setCustom] = useState(false);

  return (
    <div className="space-y-4">
      {/* Speed controls */}
      <div className="rounded-xl border p-4 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Speed</p>
          <div className="flex flex-wrap gap-2">
            {SPEED_OPTIONS.map((s) => (
              <button key={s} type="button"
                onClick={() => { setSpeed(s); setCustom(false); }}
                className="focus-ring rounded border px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  borderColor: speed === s && !custom ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: speed === s && !custom ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: speed === s && !custom ? "var(--accent)" : "var(--text-muted)",
                }}>
                {s}×
              </button>
            ))}
            <button type="button" onClick={() => setCustom(true)}
              className="focus-ring rounded border px-3 py-1.5 text-xs font-medium transition"
              style={{
                borderColor: custom ? "var(--accent)" : "var(--border-strong)",
                backgroundColor: custom ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                color: custom ? "var(--accent)" : "var(--text-muted)",
              }}>
              Custom
            </button>
          </div>
        </div>

        {custom && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="speed-slider" className="text-xs" style={{ color: "var(--text-muted)" }}>Custom speed</label>
              <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>{speed.toFixed(2)}×</span>
            </div>
            <input id="speed-slider" type="range" min={0.25} max={4} step={0.05} value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-amber-400" />
            <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
              <span>0.25× (slowest)</span><span>4× (fastest)</span>
            </div>
          </div>
        )}

        {/* Pitch warning */}
        <p className="rounded-lg border px-3 py-2.5 text-[11px] leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}>
          ⚠️ Changing speed also changes pitch proportionally (faster = higher pitch, slower = lower pitch).
          This tool does not perform pitch-preserving time-stretching.
        </p>
      </div>

      <AudioProcessorShell
        accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.opus,.aac,.webm"
        acceptLabel="MP3, WAV, FLAC, M4A, OGG and more"
        processLabel={`Export at ${speed.toFixed(2)}× speed`}
        onProcess={async (file, onProgress) => {
          const r = await changeAudioSpeed(file, {
            speed,
            outputFormat: "mp3",
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + `-${speed.toFixed(2)}x.mp3`}
        outputMime="audio/mpeg"
      />
    </div>
  );
}
