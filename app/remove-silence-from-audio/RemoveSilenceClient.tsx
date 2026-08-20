"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { removeSilence } from "@/lib/audio/silence";

export default function RemoveSilenceClient() {
  const [thresholdDb,    setThresholdDb]    = useState(-40);
  const [minDuration,    setMinDuration]    = useState(0.5);
  const [padding,        setPadding]        = useState(0.1);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl border p-4 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>

        {/* Threshold */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="thresh-db" className="text-xs" style={{ color: "var(--text-muted)" }}>
              Silence threshold
            </label>
            <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>
              {thresholdDb} dBFS
            </span>
          </div>
          <input id="thresh-db" type="range" min={-60} max={-20} step={1} value={thresholdDb}
            onChange={(e) => setThresholdDb(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-amber-400" />
          <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
            <span>-60 dBFS (very quiet)</span><span>-20 dBFS (more aggressive)</span>
          </div>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Audio below this level is treated as silence. -40 dBFS is a safe default for most recordings.
          </p>
        </div>

        {/* Min duration */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="min-dur" className="text-xs" style={{ color: "var(--text-muted)" }}>
              Minimum silence duration to remove
            </label>
            <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>
              {minDuration.toFixed(1)}s
            </span>
          </div>
          <input id="min-dur" type="range" min={0.1} max={3} step={0.1} value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-amber-400" />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Only silence longer than this is removed. Shorter pauses (e.g. natural breathing) are kept.
          </p>
        </div>

        {/* Padding */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="padding" className="text-xs" style={{ color: "var(--text-muted)" }}>
              Keep padding around speech
            </label>
            <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>
              {padding.toFixed(2)}s
            </span>
          </div>
          <input id="padding" type="range" min={0} max={0.5} step={0.05} value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-amber-400" />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            A small amount of silence to keep at the edges of speech sections to avoid cutting words.
          </p>
        </div>
      </div>

      <AudioProcessorShell
        accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.opus,.aac,.webm"
        acceptLabel="MP3, WAV, FLAC, M4A, OGG and more"
        processLabel="Remove silence"
        onProcess={async (file, onProgress) => {
          const r = await removeSilence(file, {
            thresholdDb, minSilenceDuration: minDuration, padding,
            outputFormat: "mp3",
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + "-no-silence.mp3"}
        outputMime="audio/mpeg"
      />
    </div>
  );
}
