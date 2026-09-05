"use client";

import { useState } from "react";
import AudioProcessorShell from "@/components/audio/AudioProcessorShell";
import { convertAudio, type MP3Bitrate } from "@/lib/audio/convert";
import Btn from "@/components/Btn";

const BITRATES: MP3Bitrate[] = ["64k", "96k", "128k", "192k", "256k", "320k"];

export default function Mp4ToMp3Client() {
  const [bitrate, setBitrate] = useState<MP3Bitrate>("192k");

  return (
    <div className="space-y-4">
      <div className="rounded-lg border px-4 py-3 flex flex-wrap items-center gap-2"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <label className="text-xs font-medium shrink-0" style={{ color: "var(--text-muted)" }}>MP3 bitrate</label>
        <div className="flex flex-wrap gap-1.5">
          {BITRATES.map((b) => (
            <Btn variant="toggle" size="sm" key={b} onClick={() => setBitrate(b)} selected={bitrate === b}>{b}</Btn>
          ))}
        </div>
      </div>

      <AudioProcessorShell
        accept="video/mp4,video/*,.mp4,.m4v,.mov,.mkv,.webm"
        acceptLabel="MP4, MOV, MKV, WebM video files"
        processLabel="Extract MP3 audio"
        onProcess={async (file, onProgress) => {
          const r = await convertAudio(file, {
            outputFormat: "mp3",
            bitrate,
            onProgress: (p) => onProgress(p.ratio),
          });
          return r.blob;
        }}
        outputFilename={(name) => name.replace(/\.[^/.]+$/, "") + ".mp3"}
        outputMime="audio/mpeg"
        showPreview={false}
      />
    </div>
  );
}
