"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { compressAudio, COMPRESSION_PRESETS, type CompressionPreset } from "@/lib/audio/compress";
import { formatBytes } from "@/lib/audio/ffmpeg";

const PRESETS = Object.entries(COMPRESSION_PRESETS) as [CompressionPreset, typeof COMPRESSION_PRESETS[CompressionPreset]][];

export default function Mp3CompressorClient() {
  const [preset, setPreset] = useState<CompressionPreset>("balanced");

  return (
    <div className="space-y-4">
      {/* Preset selector */}
      <div className="rounded-xl border p-4 space-y-2"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Compression quality</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map(([key, val]) => (
            <button key={key} type="button" onClick={() => setPreset(key)}
              className="focus-ring rounded-lg border p-3 text-left transition"
              style={{
                borderColor: preset === key ? "var(--accent)" : "var(--border-strong)",
                backgroundColor: preset === key ? "color-mix(in srgb,var(--accent) 8%,transparent)" : "var(--bg-elevated)",
              }}>
              <p className="text-xs font-semibold" style={{ color: preset === key ? "var(--accent)" : "var(--text-secondary)" }}>
                {val.label}
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                {val.bitrate} — {val.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <AudioProcessorShell
        accept=".mp3,audio/mpeg" acceptLabel="MP3 files"
        processLabel="Compress MP3"
        onProcess={async (file, onProgress) => {
          const r = await compressAudio(file, {
            preset,
            outputFormat: "mp3",
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.mp3$/i, "") + "-compressed.mp3"}
        outputMime="audio/mpeg"
      />
    </div>
  );
}
