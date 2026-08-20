"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { convertAudio, FORMAT_LABEL, type AudioFormat, type MP3Bitrate } from "@/lib/audio/convert";

const OUTPUT_FORMATS: AudioFormat[] = ["mp3", "wav", "ogg", "flac", "m4a", "opus"];
const BITRATES: MP3Bitrate[] = ["64k", "96k", "128k", "192k", "256k", "320k"];
const LOSSY_FORMATS: AudioFormat[] = ["mp3", "ogg", "m4a", "opus"];

export default function AudioConverterClient() {
  const [outputFmt, setOutputFmt]   = useState<AudioFormat>("mp3");
  const [bitrate,   setBitrate]     = useState<MP3Bitrate>("192k");

  return (
    <div className="space-y-4">
      {/* Format + bitrate */}
      <div className="rounded-xl border p-4 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div>
          <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Output format</p>
          <div className="flex flex-wrap gap-1.5">
            {OUTPUT_FORMATS.map((f) => (
              <button key={f} type="button" onClick={() => setOutputFmt(f)}
                className="focus-ring rounded border px-3 py-1 text-xs font-medium transition"
                style={{
                  borderColor: outputFmt === f ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: outputFmt === f ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                  color: outputFmt === f ? "var(--accent)" : "var(--text-muted)",
                }}>
                {FORMAT_LABEL[f]}
              </button>
            ))}
          </div>
        </div>

        {LOSSY_FORMATS.includes(outputFmt) && (
          <div>
            <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Bitrate</p>
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
      </div>

      <AudioProcessorShell
        accept="audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.opus,.mp4,.webm"
        acceptLabel="MP3, WAV, FLAC, M4A, OGG, Opus, MP4"
        processLabel={`Convert to ${FORMAT_LABEL[outputFmt]}`}
        onProcess={async (file, onProgress) => {
          const r = await convertAudio(file, {
            outputFormat: outputFmt,
            bitrate,
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + "." + outputFmt}
        outputMime={`audio/${outputFmt}`}
      />
    </div>
  );
}
