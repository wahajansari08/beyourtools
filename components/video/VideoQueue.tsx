"use client";

import VideoFileInfo from "./VideoFileInfo";
import VideoPlayer from "./VideoPlayer";
import type { VideoUpload } from "./VideoUploader";

interface VideoQueueProps {
  uploads: VideoUpload[];
  onChange: (uploads: VideoUpload[]) => void;
}

export default function VideoQueue({ uploads, onChange }: VideoQueueProps) {
  const move = (index: number, direction: -1 | 1) => {
    const next = [...uploads];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    URL.revokeObjectURL(uploads[index].objectUrl);
    onChange(uploads.filter((_, i) => i !== index));
  };

  const totalSize = uploads.reduce((sum, upload) => sum + upload.file.size, 0);
  const totalDuration = uploads.reduce((sum, upload) => sum + (upload.metadata.duration ?? 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 rounded-lg border px-4 py-3 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
        <span>{uploads.length} videos</span>
        <span>{(totalSize / 1048576).toFixed(2)} MB total</span>
        <span>{Math.round(totalDuration)} seconds total</span>
      </div>
      {uploads.map((upload, index) => (
        <div key={upload.objectUrl} className="grid gap-3 rounded-lg border p-3 lg:grid-cols-[180px_1fr_auto]" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <VideoPlayer src={upload.objectUrl} label={`Clip ${index + 1}`} />
          <VideoFileInfo file={upload.file} metadata={upload.metadata} />
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="focus-ring rounded-md border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}>Up</button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === uploads.length - 1} className="focus-ring rounded-md border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}>Down</button>
            <button type="button" onClick={() => remove(index)} className="focus-ring rounded-md border px-3 py-1.5 text-xs" style={{ borderColor: "rgba(239,125,111,0.4)", color: "var(--coral)" }}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

