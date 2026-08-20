"use client";

import { useState, useCallback } from "react";
import AudioUploader, { type AudioFile } from "@/components/audio/AudioUploader";
import AudioProgress from "@/components/audio/AudioProgress";
import AudioDownload from "@/components/audio/AudioDownload";
import StatusBanner from "@/components/StatusBanner";
import { mergeAudio } from "@/lib/audio/merge";
import { formatBytes } from "@/lib/audio/ffmpeg";
import { FORMAT_LABEL, type AudioFormat } from "@/lib/audio/convert";

type State = "idle" | "processing" | "done" | "error";

function fmtDur(sec: number | null): string {
  if (!sec || !isFinite(sec)) return "—";
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const OUT_FORMATS: { value: AudioFormat; label: string }[] = [
  { value: "mp3", label: "MP3" },
  { value: "wav", label: "WAV" },
  { value: "ogg", label: "OGG" },
];

export default function AudioJoinerClient() {
  const [files,    setFiles]    = useState<AudioFile[]>([]);
  const [outFmt,   setOutFmt]   = useState<AudioFormat>("mp3");
  const [state,    setState]    = useState<State>("idle");
  const [progress, setProgress] = useState<number | null>(null);
  const [outBlob,  setOutBlob]  = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdd = useCallback((added: AudioFile[]) => setFiles((p) => [...p, ...added]), []);
  const removeFile = (idx: number) => setFiles((p) => { const a = [...p]; const r = a.splice(idx, 1)[0]; if (r?.objectUrl) URL.revokeObjectURL(r.objectUrl); return a; });
  const moveUp   = (i: number) => setFiles((p) => { if (i === 0) return p; const a = [...p]; [a[i-1],a[i]] = [a[i],a[i-1]]; return a; });
  const moveDown = (i: number) => setFiles((p) => { if (i >= p.length-1) return p; const a = [...p]; [a[i],a[i+1]] = [a[i+1],a[i]]; return a; });

  const handleJoin = useCallback(async () => {
    if (files.length < 2) return;
    setState("processing"); setProgress(null);
    try {
      const result = await mergeAudio(files.map((f) => f.file), {
        outputFormat: outFmt,
        onProgress: (p) => setProgress(p.ratio),
      });
      setOutBlob(result.blob); setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to join files."); setState("error");
    }
  }, [files, outFmt]);

  const reset = () => {
    files.forEach((f) => { if (f.objectUrl) URL.revokeObjectURL(f.objectUrl); });
    setFiles([]); setOutBlob(null); setState("idle"); setErrorMsg("");
  };

  const totalDuration = files.reduce((s, f) => s + (f.duration ?? 0), 0);
  const outUrl = outBlob ? URL.createObjectURL(outBlob) : "";

  return (
    <div className="space-y-4">
      {/* Output format */}
      {state !== "done" && (
        <div className="rounded-lg border px-4 py-3 flex flex-wrap items-center gap-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <span className="text-xs font-medium shrink-0" style={{ color: "var(--text-muted)" }}>Output</span>
          {OUT_FORMATS.map((f) => (
            <button key={f.value} type="button" onClick={() => setOutFmt(f.value)}
              className="focus-ring rounded border px-3 py-1 text-xs font-medium transition"
              style={{
                borderColor: outFmt === f.value ? "var(--accent)" : "var(--border-strong)",
                backgroundColor: outFmt === f.value ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                color: outFmt === f.value ? "var(--accent)" : "var(--text-muted)",
              }}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {state !== "done" && (
        <AudioUploader
          accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.opus,.aac,.webm"
          acceptLabel="MP3, WAV, FLAC, M4A, OGG and more"
          onFiles={handleAdd} multiple
        />
      )}

      {files.length > 0 && state !== "done" && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
            <span className="text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>
              {files.length} file{files.length !== 1 ? "s" : ""} · {fmtDur(totalDuration)}
            </span>
            <button type="button" onClick={reset} className="text-xs" style={{ color: "var(--text-subtle)" }}>Clear all</button>
          </div>
          <ul>
            {files.map((f, i) => (
              <li key={f.objectUrl} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                <span className="w-5 shrink-0 text-center text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium" style={{ color: "var(--text-primary)" }}>{f.file.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{formatBytes(f.file.size)} · {fmtDur(f.duration)}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Move up"
                    className="focus-ring rounded p-1 text-xs disabled:opacity-30" style={{ color: "var(--text-muted)" }}>▲</button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === files.length - 1} aria-label="Move down"
                    className="focus-ring rounded p-1 text-xs disabled:opacity-30" style={{ color: "var(--text-muted)" }}>▼</button>
                  <button type="button" onClick={() => removeFile(i)} aria-label="Remove"
                    className="focus-ring rounded p-1 text-xs" style={{ color: "var(--coral)" }}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length >= 2 && state === "idle" && (
        <button type="button" onClick={handleJoin}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          ➕ Join {files.length} files → {FORMAT_LABEL[outFmt]}
        </button>
      )}

      {state === "processing" && <AudioProgress ratio={progress} label="Joining audio files…" />}
      {state === "error" && (
        <div className="space-y-3">
          <StatusBanner type="error" message={errorMsg} />
          <button type="button" onClick={reset}
            className="focus-ring rounded-lg border px-5 py-2 text-sm font-medium"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            Try again
          </button>
        </div>
      )}
      {state === "done" && outBlob && (
        <div className="space-y-4">
          {outUrl && (
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Joined audio preview</p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={outUrl} className="w-full" />
            </div>
          )}
          <AudioDownload blob={outBlob} filename={`joined-audio.${outFmt}`} onReset={reset} />
        </div>
      )}
    </div>
  );
}
