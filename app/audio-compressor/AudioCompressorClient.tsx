"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { compressAudio, COMPRESSION_PRESETS, type CompressionPreset } from "@/lib/audio/compress";

const PRESETS = Object.entries(COMPRESSION_PRESETS) as [CompressionPreset, typeof COMPRESSION_PRESETS[CompressionPreset]][];
type OutFmt = "mp3" | "ogg" | "aac";

export default function AudioCompressorClient() {
  const [preset,  setPreset]  = useState<CompressionPreset>("balanced");
  const [outFmt,  setOutFmt]  = useState<OutFmt>("mp3");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        {/* Output format */}
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Output format</p>
          <div className="flex gap-2">
            {(["mp3", "ogg", "aac"] as OutFmt[]).map((f) => (
              <button key={f} type="button" onClick={() => setOutFmt(f)}
                className="focus-ring rounded border px-3 py-1 text-xs font-medium uppercase transition"
                style={{
                  borderColor: outFmt === f ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: outFmt === f ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: outFmt === f ? "var(--accent)" : "var(--text-muted)",
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {/* Preset */}
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Compression level</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRESETS.map(([key, val]) => (
              <button key={key} type="button" onClick={() => setPreset(key)}
                className="focus-ring rounded-lg border p-3 text-left transition"
                style={{
                  borderColor: preset === key ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: preset === key ? "color-mix(in srgb,var(--accent) 8%,transparent)" : "var(--bg-elevated)",
                }}>
                <p className="text-xs font-semibold" style={{ color: preset === key ? "var(--accent)" : "var(--text-secondary)" }}>
                  {val.label} <span className="font-mono">({val.bitrate})</span>
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>{val.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AudioProcessorShell
        accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.opus,.aac,.webm"
        acceptLabel="MP3, WAV, FLAC, M4A, OGG and more"
        processLabel="Compress Audio"
        onProcess={async (file, onProgress) => {
          const r = await compressAudio(file, {
            preset,
            outputFormat: outFmt,
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + `-compressed.${outFmt}`}
        outputMime={outFmt === "mp3" ? "audio/mpeg" : outFmt === "ogg" ? "audio/ogg" : "audio/aac"}
      />
    </div>
  );
}
