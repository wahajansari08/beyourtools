"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Btn from "@/components/Btn";
import { processVideo, type QualityPreset } from "@/lib/video/process";
import { formatBytes } from "@/lib/video/ffmpeg";

const PRESETS = [
  { id: "9:16", w: 1080, h: 1920, label: "9:16 Vertical", hint: "Reels · Shorts · TikTok · Status" },
  { id: "1:1",  w: 1080, h: 1080, label: "1:1 Square",    hint: "Square feed posts" },
  { id: "4:5",  w: 1080, h: 1350, label: "4:5 Portrait",  hint: "Portrait feed posts" },
  { id: "16:9", w: 1920, h: 1080, label: "16:9 Landscape", hint: "YouTube · wide screens" },
] as const;

const QUALITIES: { id: QualityPreset; label: string; hint: string }[] = [
  { id: "balanced",     label: "Balanced", hint: "Smaller file, good quality" },
  { id: "high-quality", label: "High",     hint: "Larger file, better quality" },
  { id: "best",         label: "Best",     hint: "Largest file, maximum quality" },
];

type Status = "idle" | "processing" | "done" | "error";

export default function SocialVideoResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ width: number; height: number; duration: number } | null>(null);
  const [presetId, setPresetId] = useState<string>("9:16");
  const [mode, setMode] = useState<"fill" | "blur">("fill");
  const [quality, setQuality] = useState<QualityPreset>("high-quality");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preset = PRESETS.find((p) => p.id === presetId)!;

  // Revoke object URLs on unmount / replacement
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [previewUrl, result]);

  const handleFile = useCallback((f: File | undefined | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please choose a video file (MP4, MOV, WebM, …).");
      return;
    }
    setError(null);
    setResult(null);
    setStatus("idle");
    setProgress(0);
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    // Read dimensions/duration
    const v = document.createElement("video");
    v.preload = "metadata";
    v.src = url;
    v.onloadedmetadata = () => {
      setMeta({ width: v.videoWidth, height: v.videoHeight, duration: v.duration });
      URL.revokeObjectURL(v.src);
    };
  }, [previewUrl]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, [handleFile]);

  const startResize = useCallback(async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);
    setError(null);
    setResult(null);
    try {
      const out = await processVideo(file, "social-resize", {
        aspect: { w: preset.w, h: preset.h },
        fitMode: mode,
        quality,
        onProgress: (p) => {
          if (Number.isFinite(p.ratio)) setProgress(Math.round(Math.min(Math.max(p.ratio, 0), 1) * 100));
        },
      });
      const url = URL.createObjectURL(out.blob);
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      setResult({ url, size: out.blob.size, name: `${base}-${preset.id.replace(":", "x")}.mp4` });
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed. Try a smaller file or a different format.");
      setStatus("error");
    }
  }, [file, preset, mode, quality]);

  const reset = useCallback(() => {
    setFile(null);
    setMeta(null);
    setResult(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [previewUrl]);

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      {!file ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a video file"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className="focus-ring cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition"
          style={{
            borderColor: dragOver ? "var(--accent)" : "var(--border-strong)",
            backgroundColor: dragOver ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--bg-surface)",
          }}
        >
          <p className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Drop your video here
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            or click to browse. MP4, MOV, WebM, MKV and AVI work here
          </p>
          <p className="mt-2 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            Processed 100% in your browser. Nothing is uploaded.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{file.name}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
                {formatBytes(file.size)}
                {meta ? ` · ${meta.width}×${meta.height}` : ""}
                {meta && Number.isFinite(meta.duration) ? ` · ${Math.round(meta.duration)}s` : ""}
              </p>
            </div>
            <Btn variant="ghost" size="sm" onClick={reset}>Choose another</Btn>
          </div>

          {previewUrl && (
            <video src={previewUrl} controls playsInline className="mt-4 max-h-64 w-full rounded-xl bg-black" />
          )}
        </div>
      )}

      {error && (
        <p className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>
          {error}
        </p>
      )}

      {file && (
        <>
          {/* Aspect presets */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Aspect ratio
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPresetId(p.id)}
                  aria-pressed={presetId === p.id}
                  className="focus-ring rounded-xl border p-3 text-left transition"
                  style={{
                    borderColor: presetId === p.id ? "var(--accent)" : "var(--border)",
                    backgroundColor: presetId === p.id ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-surface)",
                  }}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p.id}</span>
                    <span
                      aria-hidden="true"
                      className="inline-block rounded-[3px] border-2"
                      style={{
                        width: p.w > p.h ? 26 : p.w === p.h ? 18 : 14,
                        height: p.h > p.w ? 26 : p.h === p.w ? 18 : 14,
                        borderColor: presetId === p.id ? "var(--accent)" : "var(--border-strong)",
                      }}
                    />
                  </span>
                  <span className="mt-1 block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{p.label}</span>
                  <span className="block text-[10px]" style={{ color: "var(--text-subtle)" }}>{p.hint}</span>
                  <span className="mt-1 block font-mono text-[10px]" style={{ color: "var(--text-subtle)" }}>{p.w}×{p.h}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fill mode */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Fill mode
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("fill")}
                aria-pressed={mode === "fill"}
                className="focus-ring rounded-xl border p-3 text-left transition"
                style={{
                  borderColor: mode === "fill" ? "var(--accent)" : "var(--border)",
                  backgroundColor: mode === "fill" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-surface)",
                }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Crop to fill</span>
                <span className="mt-1 block text-xs" style={{ color: "var(--text-muted)" }}>
                  Zooms in and trims the edges so the whole frame is filled. Best for punchy vertical clips.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode("blur")}
                aria-pressed={mode === "blur"}
                className="focus-ring rounded-xl border p-3 text-left transition"
                style={{
                  borderColor: mode === "blur" ? "var(--accent)" : "var(--border)",
                  backgroundColor: mode === "blur" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-surface)",
                }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Fit with blurred background</span>
                <span className="mt-1 block text-xs" style={{ color: "var(--text-muted)" }}>
                  Keeps the entire video visible over a blurred copy of itself. Nothing gets cut off.
                </span>
              </button>
            </div>
          </div>

          {/* Quality */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Quality
            </p>
            <div className="flex flex-wrap gap-2">
              {QUALITIES.map((q) => (
                <Btn
                  key={q.id}
                  variant="toggle"
                  selected={quality === q.id}
                  onClick={() => setQuality(q.id)}
                  title={q.hint}
                >
                  {q.label}
                </Btn>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="flex flex-wrap items-center gap-3">
            <Btn variant="primary" size="lg" onClick={startResize} disabled={status === "processing"}>
              {status === "processing" ? `Resizing… ${progress}%` : `Resize to ${preset.id}`}
            </Btn>
            {status === "processing" && (
              <div className="h-2 min-w-40 flex-1 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
                />
              </div>
            )}
          </div>

          {/* Result */}
          {status === "done" && result && (
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Your resized video is ready</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Output size: <strong style={{ color: "var(--text-primary)" }}>{formatBytes(result.size)}</strong></span>
                <span>Original: <strong style={{ color: "var(--text-primary)" }}>{formatBytes(file.size)}</strong></span>
                <span>Format: <strong style={{ color: "var(--text-primary)" }}>{preset.w}×{preset.h} MP4</strong></span>
              </div>
              <video src={result.url} controls playsInline className="mt-4 max-h-64 w-full rounded-xl bg-black" />
              <div className="mt-4">
                <a href={result.url} download={result.name} className="focus-ring inline-block rounded-lg">
                  <Btn variant="primary" size="lg">Download MP4</Btn>
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
