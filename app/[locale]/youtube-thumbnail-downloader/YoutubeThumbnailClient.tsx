"use client";

import { useCallback, useState } from "react";
import Btn from "@/components/Btn";

const QUALITIES = [
  { id: "default",       label: "Small",  size: "120 × 90" },
  { id: "mqdefault",     label: "Medium", size: "320 × 180" },
  { id: "hqdefault",     label: "High",   size: "480 × 360" },
  { id: "sddefault",     label: "SD",     size: "640 × 480" },
  { id: "maxresdefault", label: "Full HD", size: "1280 × 720" },
] as const;

/** Extract an 11-char YouTube video ID from watch, youtu.be, shorts and embed URLs. */
export function extractVideoId(input: string): string | null {
  const url = input.trim();
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?[^#\s]*v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export default function YoutubeThumbnailClient() {
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleFetch = useCallback(() => {
    const id = extractVideoId(input);
    if (!id) {
      setVideoId(null);
      setError("That doesn't look like a valid YouTube link. Paste a watch, youtu.be, Shorts or embed URL containing an 11-character video ID.");
      return;
    }
    setError(null);
    setVideoId(id);
  }, [input]);

  const download = useCallback(async (qualityId: string) => {
    if (!videoId) return;
    const src = `https://i.ytimg.com/vi/${videoId}/${qualityId}.jpg`;
    setDownloading(qualityId);
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `youtube-thumbnail-${videoId}-${qualityId}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      // Fallback: open the image in a new tab so the user can save it manually.
      window.open(src, "_blank", "noopener");
    } finally {
      setDownloading(null);
    }
  }, [videoId]);

  return (
    <div className="space-y-6">
      {/* URL input */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <label htmlFor="yt-url" className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          YouTube video URL
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="yt-url"
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleFetch(); }}
            placeholder="https://www.youtube.com/watch?v=…"
            spellCheck={false}
            autoComplete="off"
            className="focus-ring min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          />
          <Btn variant="primary" size="md" onClick={handleFetch}>
            Get thumbnails
          </Btn>
        </div>
        <p className="mt-2 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          Works with youtube.com/watch, youtu.be, /shorts/ and /embed/ links, or just paste the 11-character video ID.
        </p>
        {error && (
          <p className="mt-3 rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--coral)", color: "var(--coral)", backgroundColor: "color-mix(in srgb,var(--coral) 8%,transparent)" }}>
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      {videoId && (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Available thumbnails
            </h2>
            <span className="rounded-full border px-2.5 py-0.5 font-mono text-[11px]" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
              {videoId}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUALITIES.map((q) => {
              const src = `https://i.ytimg.com/vi/${videoId}/${q.id}.jpg`;
              return (
                <div
                  key={q.id}
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`YouTube thumbnail (${q.label}, ${q.size})`}
                    loading="lazy"
                    className="aspect-video w-full bg-black object-contain"
                  />
                  <div className="flex items-center justify-between gap-2 p-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{q.label}</p>
                      <p className="font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>{q.size}</p>
                    </div>
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() => download(q.id)}
                      disabled={downloading !== null}
                    >
                      {downloading === q.id ? "Saving…" : "Download"}
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: "var(--text-subtle)" }}>
            This downloads only the public thumbnail image, not the video. Thumbnails belong to the video owner;
            only reuse ones you own or have permission to use.
          </p>
        </div>
      )}
    </div>
  );
}
