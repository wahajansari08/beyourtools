"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { adjustVolume } from "@/lib/audio/volume";
import StatusBanner from "@/components/StatusBanner";

const PRESETS = [
  { label: "+25%", gain: 1.25 },
  { label: "+50%", gain: 1.50 },
  { label: "+75%", gain: 1.75 },
  { label: "+100%", gain: 2.00 },
];

export default function VolumeBoosterClient() {
  const [gain,   setGain]   = useState(1.5);
  const [custom, setCustom] = useState(false);

  const pct = Math.round((gain - 1) * 100);

  return (
    <div className="space-y-4">
      {/* Gain controls */}
      <div className="rounded-xl border p-4 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        {/* Presets */}
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} type="button"
                onClick={() => { setGain(p.gain); setCustom(false); }}
                className="focus-ring rounded border px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  borderColor: gain === p.gain && !custom ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: gain === p.gain && !custom ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: gain === p.gain && !custom ? "var(--accent)" : "var(--text-muted)",
                }}>
                {p.label}
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

        {/* Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="gain-slider" className="text-xs" style={{ color: "var(--text-muted)" }}>
              Volume boost
            </label>
            <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>
              +{pct}% (×{gain.toFixed(2)})
            </span>
          </div>
          <input id="gain-slider" type="range" min={1.05} max={4} step={0.05} value={gain}
            onChange={(e) => { setGain(Number(e.target.value)); setCustom(true); }}
            className="h-1.5 w-full cursor-pointer accent-amber-400" />
          <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
            <span>+5%</span><span>+200%</span>
          </div>
        </div>

        {gain > 2 && (
          <StatusBanner type="info"
            message="High gain may cause clipping (distortion). Use with caution and preview before downloading." />
        )}
      </div>

      <AudioProcessorShell
        accept=".mp3,audio/mpeg" acceptLabel="MP3 files"
        processLabel={`Boost volume +${pct}%`}
        onProcess={async (file, onProgress) => {
          const r = await adjustVolume(file, {
            gain, outputFormat: "mp3",
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.mp3$/i, "") + "-boosted.mp3"}
        outputMime="audio/mpeg"
      />
    </div>
  );
}
