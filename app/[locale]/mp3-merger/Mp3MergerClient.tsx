"use client";

import { useState, useCallback } from "react";
import AudioUploader, { type AudioFile } from "@/components/audio/AudioUploader";
import AudioProgress from "@/components/audio/AudioProgress";
import AudioDownload from "@/components/audio/AudioDownload";
import StatusBanner from "@/components/StatusBanner";
import { mergeAudio } from "@/lib/audio/merge";
import { formatBytes } from "@/lib/audio/ffmpeg";
import Btn from "@/components/Btn";

type State = "idle" | "processing" | "done" | "error";

function fmtDur(sec: number | null): string {
  if (!sec || !isFinite(sec)) return "-";
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Mp3MergerClient() {
  const [files,    setFiles]    = useState<AudioFile[]>([]);
  const [state,    setState]    = useState<State>("idle");
  const [progress, setProgress] = useState<number | null>(null);
  const [outBlob,  setOutBlob]  = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdd = useCallback((added: AudioFile[]) => {
    setFiles((prev) => [...prev, ...added]);
  }, []);

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const removed = next.splice(idx, 1)[0];
      if (removed?.objectUrl) URL.revokeObjectURL(removed.objectUrl);
      return next;
    });
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };

  const moveDown = (idx: number) => {
    setFiles((prev) => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a;
    });
  };

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    setState("processing");
    setProgress(null);
    try {
      const result = await mergeAudio(files.map((f) => f.file), {
        outputFormat: "mp3",
        onProgress: (p) => setProgress(p.ratio),
      });
      setOutBlob(result.blob);
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to merge files. Please ensure all files are valid MP3.");
      setState("error");
    }
  }, [files]);

  const reset = () => {
    files.forEach((f) => { if (f.objectUrl) URL.revokeObjectURL(f.objectUrl); });
    setFiles([]);
    setOutBlob(null);
    setState("idle");
    setErrorMsg("");
  };

  const totalDuration = files.reduce((s, f) => s + (f.duration ?? 0), 0);
  const outUrl = outBlob ? URL.createObjectURL(outBlob) : "";

  return (
    <div className="space-y-4">
      {state !== "done" && (
        <AudioUploader
          accept=".mp3,audio/mpeg" acceptLabel="MP3 files"
          onFiles={handleAdd} multiple
        />
      )}

      {files.length > 0 && state !== "done" && (
        <div className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
            <span className="text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>
              {files.length} file{files.length !== 1 ? "s" : ""} · total {fmtDur(totalDuration)}
            </span>
            <Btn variant="ghost" size="sm" onClick={reset}>Clear all</Btn>
          </div>
          <ul>
            {files.map((f, i) => (
              <li key={f.objectUrl} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0"
                style={{ borderColor: "var(--border)" }}>
                <span className="w-5 shrink-0 text-center text-xs font-semibold tabular-nums"
                  style={{ color: "var(--text-subtle)" }}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium" style={{ color: "var(--text-primary)" }}>{f.file.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                    {formatBytes(f.file.size)} · {fmtDur(f.duration)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Btn variant="icon" disabled={i === 0} aria-label="Move up" onClick={() => moveUp(i)}>▲</Btn>
                  <Btn variant="icon" disabled={i === files.length - 1} aria-label="Move down" onClick={() => moveDown(i)}>▼</Btn>
                  <Btn variant="danger" aria-label={`Remove ${f.file.name}`} onClick={() => removeFile(i)}>✕</Btn>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length >= 2 && state === "idle" && (
        <Btn variant="primary" size="lg" onClick={handleMerge}>
          🔗 Merge {files.length} MP3 files
        </Btn>
      )}

      {files.length < 2 && files.length > 0 && (
        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>Add at least 2 MP3 files to merge.</p>
      )}

      {state === "processing" && <AudioProgress ratio={progress} label="Merging audio…" />}
      {state === "error" && (
        <div className="space-y-3">
          <StatusBanner type="error" message={errorMsg} />
          <Btn variant="secondary" onClick={reset}>
          Try again
        </Btn>
        </div>
      )}
      {state === "done" && outBlob && (
        <div className="space-y-4">
          {outUrl && (
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Merged preview</p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={outUrl} className="w-full" />
            </div>
          )}
          <AudioDownload blob={outBlob} filename="merged-audio.mp3" onReset={reset} />
        </div>
      )}
    </div>
  );
}
