"use client";

import { useState } from "react";
import AudioProcessorShell from "./AudioProcessorShell";
import { convertAudio, type MP3Bitrate } from "@/lib/audio/convert";

interface SimpleConvertClientProps {
  fromExt: string;
  toExt: string;
  toMime: string;
  accept: string;
  acceptLabel: string;
  showBitrate?: boolean;
  processLabel?: string;
  noPreviewInput?: boolean;
  extraNote?: string;
}

const BITRATES: MP3Bitrate[] = ["64k", "96k", "128k", "192k", "256k", "320k"];

export default function SimpleConvertClient({
  fromExt,
  toExt,
  toMime,
  accept,
  acceptLabel,
  showBitrate = true,
  processLabel,
  noPreviewInput = false,
  extraNote,
}: SimpleConvertClientProps) {
  const [bitrate, setBitrate] = useState<MP3Bitrate>("192k");

  return (
    <div className="space-y-4">
      {showBitrate && (
        <div className="rounded-lg border px-4 py-3 flex flex-wrap items-center gap-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <label className="text-xs font-medium shrink-0" style={{ color: "var(--text-muted)" }}>
            {toExt.toUpperCase()} bitrate
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BITRATES.map((b) => (
              <button key={b} type="button" onClick={() => setBitrate(b)}
                className="focus-ring rounded border px-2.5 py-1 text-xs font-medium transition"
                style={{
                  borderColor: bitrate === b ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: bitrate === b ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: bitrate === b ? "var(--accent)" : "var(--text-muted)",
                }}>
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {extraNote && (
        <p className="rounded-lg border px-4 py-3 text-xs leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          ℹ️ {extraNote}
        </p>
      )}

      <AudioProcessorShell
        accept={accept}
        acceptLabel={acceptLabel}
        processLabel={processLabel ?? `Convert to ${toExt.toUpperCase()}`}
        onProcess={async (file, onProgress) => {
          const r = await convertAudio(file, {
            outputFormat: toExt as "mp3" | "wav" | "ogg" | "flac" | "m4a" | "aac" | "opus" | "webm",
            bitrate: showBitrate ? bitrate : undefined,
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + "." + toExt}
        outputMime={toMime}
        showPreview={!noPreviewInput}
      />
    </div>
  );
}
