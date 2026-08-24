"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { convertAudio, type MP3Bitrate } from "@/lib/audio/convert";

const BITRATES: MP3Bitrate[] = ["64k", "96k", "128k", "192k", "256k", "320k"];

export default function Mp3ConverterClient() {
  const [bitrate, setBitrate] = useState<MP3Bitrate>("192k");

  return (
    <div className="space-y-4">
      {/* Bitrate selector */}
      <div className="rounded-lg border px-4 py-3 flex flex-wrap items-center gap-2"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <label className="text-xs font-medium shrink-0" style={{ color: "var(--text-muted)" }}>
          MP3 bitrate
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

      <AudioProcessorShell
        accept="audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.opus,.wma,.mp4,.webm"
        acceptLabel="MP3, WAV, M4A, FLAC, OGG, MP4 and more"
        processLabel="Convert to MP3"
        onProcess={async (file, onProgress) => {
          const result = await convertAudio(file, {
            outputFormat: "mp3",
            bitrate,
            onProgress: (p) => onProgress(p.ratio),
          });
          return result.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + ".mp3"}
        outputMime="audio/mpeg"
      />
    </div>
  );
}
