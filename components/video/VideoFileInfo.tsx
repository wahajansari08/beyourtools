"use client";

import { formatBytes } from "@/lib/video/ffmpeg";
import { formatDuration, type VideoMetadata } from "@/lib/video/browser";

interface VideoFileInfoProps {
  file: File;
  metadata: VideoMetadata;
  outputSize?: number;
  outputDimensions?: { width: number; height: number } | null;
}

export default function VideoFileInfo({ file, metadata, outputSize, outputDimensions }: VideoFileInfoProps) {
  const rows = [
    ["File name", file.name],
    ["File size", formatBytes(file.size)],
    ["MIME type", file.type || "Unknown"],
    ["Duration", formatDuration(metadata.duration)],
    ["Dimensions", metadata.width && metadata.height ? `${metadata.width} x ${metadata.height}` : "Unknown"],
    ["Aspect ratio", metadata.aspectRatio ?? "Unknown"],
  ];

  if (outputSize !== undefined) rows.push(["Output size", formatBytes(outputSize)]);
  if (outputSize !== undefined) {
    const reduction = file.size > 0 ? ((1 - outputSize / file.size) * 100).toFixed(1) : "0";
    rows.push(["Size change", `${reduction}% ${outputSize <= file.size ? "smaller" : "larger"}`]);
  }
  if (outputDimensions) rows.push(["Output dimensions", `${outputDimensions.width} x ${outputDimensions.height}`]);

  return (
    <dl className="grid gap-2 rounded-lg border p-4 text-xs sm:grid-cols-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="font-medium" style={{ color: "var(--text-subtle)" }}>{label}</dt>
          <dd className="mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

