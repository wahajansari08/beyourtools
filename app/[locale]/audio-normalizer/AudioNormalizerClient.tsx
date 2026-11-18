"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { normalizeAudio, type NormalizationMode } from "@/lib/audio/normalize";
import Btn from "@/components/Btn";

export default function AudioNormalizerClient() {
  const [mode,     setMode]     = useState<NormalizationMode>("peak");
  const [targetDb, setTargetDb] = useState(-1.0);

  return (
    <div className="space-y-4">
      {/* Mode + target */}
      <div className="rounded-xl border p-4 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Normalization mode</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              { value: "peak",    label: "Loudness normalization",    desc: "Adjusts gain so the file's measured loudness reaches the target level." },
              { value: "dynamic", label: "Dynamic normalization", desc: "Balances volume across the whole file for even loudness." },
            ] as { value: NormalizationMode; label: string; desc: string }[]).map((m) => (
              <Btn variant="toggle" size="sm" key={m.value} onClick={() => setMode(m.value)} selected={mode === m.value} className="w-full p-3 text-left">
                <p className="text-xs font-semibold" style={{ color: mode === m.value ? "var(--accent)" : "var(--text-secondary)" }}>
                  {m.label}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>{m.desc}</p>
              </Btn>
            ))}
          </div>
        </div>

        {mode === "peak" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="target-db" className="text-xs" style={{ color: "var(--text-muted)" }}>Target loudness level</label>
              <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>
                {targetDb.toFixed(1)} LUFS
              </span>
            </div>
            <input id="target-db" type="range" min={-12} max={0} step={0.5} value={targetDb}
              onChange={(e) => setTargetDb(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-amber-400" />
            <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
              <span>-12 LUFS</span><span>0 LUFS</span>
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>
              -1.0 LUFS is the recommended default - a loud target, with the peak ceiling set to the same level to avoid clipping.
            </p>
          </div>
        )}
      </div>

      <AudioProcessorShell
        accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.opus,.aac,.webm"
        acceptLabel="MP3, WAV, FLAC, M4A, OGG and more"
        processLabel="Normalize audio"
        onProcess={async (file, onProgress) => {
          const r = await normalizeAudio(file, {
            mode, targetDb,
            outputFormat: "mp3",
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + "-normalized.mp3"}
        outputMime="audio/mpeg"
      />
    </div>
  );
}
