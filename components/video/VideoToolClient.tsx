"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VideoTool } from "@/lib/video-tools-config";
import { addAudioToVideo, mergeVideos, processVideo, type QualityPreset, type ResolutionPreset, type VideoFormat, type CropRect } from "@/lib/video/process";
import { captureMultipleFrames, captureVideoFrame } from "@/lib/video/browser";
import { formatBytes } from "@/lib/video/ffmpeg";
import VideoDownload from "./VideoDownload";
import VideoFileInfo from "./VideoFileInfo";
import VideoPlayer from "./VideoPlayer";
import VideoProgress from "./VideoProgress";
import VideoQueue from "./VideoQueue";
import VideoTimeline from "./VideoTimeline";
import VideoUploader, { type VideoUpload } from "./VideoUploader";

type State = "idle" | "ready" | "processing" | "done" | "error";

const QUALITIES: { value: QualityPreset; label: string }[] = [
  { value: "maximum", label: "Maximum compression" },
  { value: "high", label: "High compression" },
  { value: "balanced", label: "Balanced" },
  { value: "high-quality", label: "High quality" },
  { value: "best", label: "Best quality" },
];

const RESOLUTIONS: { value: ResolutionPreset; label: string }[] = [
  { value: "original", label: "Original" },
  { value: "1080", label: "1080p" },
  { value: "720", label: "720p" },
  { value: "480", label: "480p" },
  { value: "360", label: "360p" },
  { value: "custom", label: "Custom" },
];

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const BITRATES = ["96k", "128k", "192k", "256k", "320k"];
const OUTPUT_FORMATS: VideoFormat[] = ["mp4", "webm", "mov", "mkv"];
const RESIZE_PRESETS = [
  { label: "1920 x 1080", width: 1920, height: 1080 },
  { label: "1280 x 720", width: 1280, height: 720 },
  { label: "854 x 480", width: 854, height: 480 },
  { label: "640 x 360", width: 640, height: 360 },
];

function replaceExt(name: string, ext: string): string {
  const base = name.replace(/\.[^/.]+$/, "") || "video";
  return `${base}.${ext}`;
}

function outputFilename(tool: VideoTool, original: string, mime: string, imageType?: string): string {
  if (mime === "application/zip") return "video-frames.zip";
  // BUG 4 FIX: use the actual imageType mime to pick the right extension for
  // thumbnail and frame tools rather than always falling back to tool.outputExt
  // (which is always "png" in the config regardless of what the user selected).
  if ((tool.kind === "thumbnail" || tool.kind === "frames") && imageType) {
    const imgExt = imageType === "image/jpeg" ? "jpg" : "png";
    const base = tool.kind === "thumbnail" ? "video-thumbnail" : "video-frame-001";
    return `${base}.${imgExt}`;
  }
  const names: Partial<Record<string, string>> = {
    "video-compressor": "compressed-video",
    "video-cutter": "cut-video",
    "video-trimmer": "trimmed-video",
    "video-converter": "converted-video",
    "mp4-to-mp3": "extracted-audio",
    "video-resizer": "resized-video",
    "video-cropper": "cropped-video",
    "video-to-gif": "video-clip",
    "gif-to-mp4": "converted-gif",
    "video-merger": "merged-video",
    "video-joiner": "joined-video",
    "video-speed-changer": "speed-changed-video",
    "video-to-webm": "converted-video",
    "video-thumbnail-generator": "video-thumbnail",
    "extract-video-frames": "video-frame-001",
    "remove-audio-from-video": "video-without-audio",
    "add-audio-to-video": "video-with-audio",
  };
  return `${names[tool.slug] ?? original.replace(/\.[^/.]+$/, "")}.${tool.outputExt}`;
}

function safeDuration(upload: VideoUpload | null): number {
  return Math.max(upload?.metadata.duration ?? 0, 0);
}

function statusText(state: State): string {
  if (state === "ready") return "Ready";
  if (state === "processing") return "Processing";
  if (state === "done") return "Complete";
  if (state === "error") return "Needs attention";
  return "Waiting for media";
}

function statusColor(state: State): string {
  if (state === "done") return "var(--teal)";
  if (state === "error") return "var(--coral)";
  if (state === "processing") return "var(--accent)";
  return "var(--text-subtle)";
}

export default function VideoToolClient({ tool }: { tool: VideoTool }) {
  const [state, setState] = useState<State>("idle");
  const [uploads, setUploads] = useState<VideoUpload[]>([]);
  const [audioUpload, setAudioUpload] = useState<VideoUpload | null>(null);
  const [quality, setQuality] = useState<QualityPreset>(tool.kind === "compress" ? "balanced" : "high-quality");
  const [resolution, setResolution] = useState<ResolutionPreset>("original");
  const [outputFormat, setOutputFormat] = useState<VideoFormat>(tool.kind === "video-to-webm" ? "webm" : "mp4");
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [allowUpscale, setAllowUpscale] = useState(false);
  const [lockRatio, setLockRatio] = useState(true);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(4);
  const [speed, setSpeed] = useState(1);
  const [fps, setFps] = useState(10);
  const [gifWidth, setGifWidth] = useState(480);
  const [bitrate, setBitrate] = useState("192k");
  const [imageType, setImageType] = useState<"image/png" | "image/jpeg">("image/png");
  const [frameCount, setFrameCount] = useState(1);
  const [frameInterval, setFrameInterval] = useState(1);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 640, height: 360 });
  const [cropRatio, setCropRatio] = useState("free");
  const [audioMode, setAudioMode] = useState<"replace" | "mix">("replace");
  const [videoVolume, setVideoVolume] = useState(1);
  const [audioVolume, setAudioVolume] = useState(1);
  const [audioStartSec, setAudioStartSec] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputMime, setOutputMime] = useState(tool.outputMime);
  const [error, setError] = useState("");
  const [previewIssue, setPreviewIssue] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const uploadFrameTimerRef = useRef<number | null>(null);

  const upload = uploads[0] ?? null;
  const duration = safeDuration(upload);
  const selectedSize = useMemo(() => uploads.reduce((sum, item) => sum + item.file.size, 0), [uploads]);

  useEffect(() => {
    if (!upload) return;
    const nextEnd = Math.max(Math.min(duration || 4, tool.kind === "video-to-gif" ? 4 : duration || 4), 0.2);
    setStart(0);
    setEnd(nextEnd);
    if (upload.metadata.width && upload.metadata.height) {
      setWidth(upload.metadata.width);
      setHeight(upload.metadata.height);
      const cropWidth = Math.max(Math.floor(upload.metadata.width * 0.8), 2);
      const cropHeight = Math.max(Math.floor(upload.metadata.height * 0.8), 2);
      setCrop({
        x: Math.floor((upload.metadata.width - cropWidth) / 2),
        y: Math.floor((upload.metadata.height - cropHeight) / 2),
        width: cropWidth,
        height: cropHeight,
      });
    }
  }, [upload, duration, tool.kind]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed, upload?.objectUrl]);

  useEffect(() => {
    setPreviewIssue("");
    return () => {
      if (uploadFrameTimerRef.current !== null) window.clearTimeout(uploadFrameTimerRef.current);
    };
  }, [upload?.objectUrl]);

  // BUG 3 FIX: outputUrl must NOT be in the cleanup effect deps.
  // When outputUrl is listed as a dep, the effect re-runs every time a new URL
  // is created, immediately revoking it before any download or preview can happen.
  // We use a ref to always hold the latest outputUrl so the cleanup can revoke
  // it on unmount without it being a reactive dependency.
  const outputUrlRef = useRef<string>("");
  useEffect(() => { outputUrlRef.current = outputUrl; }, [outputUrl]);

  useEffect(() => {
    return () => {
      uploads.forEach((item) => URL.revokeObjectURL(item.objectUrl));
      if (audioUpload) URL.revokeObjectURL(audioUpload.objectUrl);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs only on unmount

  const outputDimensions = useMemo(() => {
    if (!upload?.metadata.width || !upload.metadata.height) return null;
    if (tool.kind === "crop") return { width: Math.round(crop.width), height: Math.round(crop.height) };
    if (tool.kind === "resize" || resolution === "custom") return { width, height };
    const heights: Partial<Record<ResolutionPreset, number>> = { "1080": 1080, "720": 720, "480": 480, "360": 360 };
    const target = heights[resolution];
    if (!target) return { width: upload.metadata.width, height: upload.metadata.height };
    if (!allowUpscale && target > upload.metadata.height) return { width: upload.metadata.width, height: upload.metadata.height };
    return { width: Math.round(upload.metadata.width * (target / upload.metadata.height)), height: target };
  }, [allowUpscale, crop, height, resolution, tool.kind, upload, width]);

  const setNewUploads = useCallback((files: VideoUpload[]) => {
    uploads.forEach((item) => URL.revokeObjectURL(item.objectUrl));
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setUploads(files);
    setOutputBlob(null);
    setOutputUrl("");
    setError("");
    setPreviewIssue("");
    setProgress(null);
    setState("ready");
  }, [outputUrl, uploads]);

  const reset = useCallback(() => {
    uploads.forEach((item) => URL.revokeObjectURL(item.objectUrl));
    if (audioUpload) URL.revokeObjectURL(audioUpload.objectUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setUploads([]);
    setAudioUpload(null);
    setOutputBlob(null);
    setOutputUrl("");
    setProgress(null);
    setError("");
    setPreviewIssue("");
    setState("idle");
  }, [audioUpload, outputUrl, uploads]);

  const updateWidth = (nextWidth: number) => {
    const sourceRatio = upload?.metadata.width && upload.metadata.height ? upload.metadata.height / upload.metadata.width : height / width;
    setWidth(Math.max(Math.round(nextWidth), 2));
    if (lockRatio) setHeight(Math.max(Math.round(nextWidth * sourceRatio), 2));
  };

  const updateHeight = (nextHeight: number) => {
    const sourceRatio = upload?.metadata.width && upload.metadata.height ? upload.metadata.width / upload.metadata.height : width / height;
    setHeight(Math.max(Math.round(nextHeight), 2));
    if (lockRatio) setWidth(Math.max(Math.round(nextHeight * sourceRatio), 2));
  };

  const previewSelection = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = start;
      videoRef.current.play().catch(() => undefined);
    }
  };

  const watchUploadFrame = () => {
    const video = videoRef.current as (HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: () => void) => number;
    }) | null;
    if (!video?.requestVideoFrameCallback) return;

    if (uploadFrameTimerRef.current !== null) window.clearTimeout(uploadFrameTimerRef.current);
    uploadFrameTimerRef.current = window.setTimeout(() => {
      setPreviewIssue("The file is playing, but your browser is not rendering decoded video frames. You can still try processing it, or convert from a common MP4/H.264 file.");
    }, 1800);

    video.requestVideoFrameCallback(() => {
      if (uploadFrameTimerRef.current !== null) window.clearTimeout(uploadFrameTimerRef.current);
      uploadFrameTimerRef.current = null;
      setPreviewIssue("");
    });
  };

  const startCropDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!upload?.metadata.width || !upload.metadata.height) return;
    const target = event.currentTarget.parentElement;
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startCrop = crop;
    const scaleX = upload.metadata.width / bounds.width;
    const scaleY = upload.metadata.height / bounds.height;

    event.currentTarget.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      updateCrop({
        x: startCrop.x + (moveEvent.clientX - startClientX) * scaleX,
        y: startCrop.y + (moveEvent.clientY - startClientY) * scaleY,
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const applyCropRatio = (ratio: string) => {
    setCropRatio(ratio);
    if (!upload?.metadata.width || !upload.metadata.height || ratio === "free") return;
    const [rw, rh] = ratio.split(":").map(Number);
    const maxW = upload.metadata.width;
    const maxH = upload.metadata.height;
    let nextW = maxW * 0.8;
    let nextH = nextW * (rh / rw);
    if (nextH > maxH * 0.8) {
      nextH = maxH * 0.8;
      nextW = nextH * (rw / rh);
    }
    setCrop({
      x: Math.round((maxW - nextW) / 2),
      y: Math.round((maxH - nextH) / 2),
      width: Math.round(nextW),
      height: Math.round(nextH),
    });
  };

  const updateCrop = (patch: Partial<CropRect>) => {
    if (!upload?.metadata.width || !upload.metadata.height) return;
    const sourceWidth = upload.metadata.width;
    const sourceHeight = upload.metadata.height;
    setCrop((current) => {
      const next = { ...current, ...patch };
      next.width = Math.min(Math.max(next.width, 2), sourceWidth);
      next.height = Math.min(Math.max(next.height, 2), sourceHeight);
      next.x = Math.min(Math.max(next.x, 0), sourceWidth - next.width);
      next.y = Math.min(Math.max(next.y, 0), sourceHeight - next.height);
      return next;
    });
  };

  const process = async () => {
    if (!upload && !tool.multiple) return;
    setState("processing");
    setProgress(null);
    setError("");
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputBlob(null);
    setOutputUrl("");

    try {
      let blob: Blob;
      let mime = tool.outputMime;

      if (tool.kind === "thumbnail") {
        blob = await captureVideoFrame(upload!.file, start, imageType);
        mime = imageType;
      } else if (tool.kind === "frames") {
        if (frameCount === 1) {
          blob = await captureVideoFrame(upload!.file, start, imageType);
          mime = imageType;
        } else {
          const JSZip = (await import("jszip")).default;
          const zip = new JSZip();
          const frames = await captureMultipleFrames(upload!.file, start, frameInterval, frameCount, imageType);
          const ext = imageType === "image/png" ? "png" : "jpg";
          frames.forEach((frame, index) => zip.file(`video-frame-${String(index + 1).padStart(3, "0")}.${ext}`, frame));
          blob = await zip.generateAsync({ type: "blob" });
          mime = "application/zip";
        }
      } else if (tool.multiple) {
        const result = await mergeVideos(uploads.map((item) => item.file), { quality, onProgress: (p) => setProgress(p.ratio) });
        blob = result.blob;
        mime = result.mime;
      } else if (tool.kind === "add-audio") {
        const result = await addAudioToVideo(upload!.file, {
          audioFile: audioUpload?.file,
          audioMode,
          videoVolume,
          audioVolume,
          audioStartSec,
          quality,
          onProgress: (p) => setProgress(p.ratio),
        });
        blob = result.blob;
        mime = result.mime;
      } else {
        const actualFormat: VideoFormat = tool.kind === "video-to-webm" ? "webm" : tool.kind === "convert" ? outputFormat : tool.outputExt === "webm" ? "webm" : "mp4";
        const result = await processVideo(upload!.file, tool.kind, {
          outputFormat: actualFormat,
          quality,
          resolution,
          width,
          height,
          allowUpscale,
          startSec: start,
          endSec: end,
          speed,
          fps,
          gifWidth,
          audioBitrate: bitrate,
          crop,
          onProgress: (p) => setProgress(p.ratio),
        });
        blob = result.blob;
        mime = result.mime;
      }

      const url = URL.createObjectURL(blob);
      setOutputBlob(blob);
      setOutputMime(mime);
      setOutputUrl(url);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't process this video. Please try another file or format.");
      setState("error");
    }
  };

  // BUG 6 FIX: thumbnail only needs a single frame-position selector (start),
  // not a start+end range. Separate the two concepts so the timeline for
  // thumbnail shows a single handle labelled "Frame position" instead of
  // a misleading start+end pair where end has no effect.
  const showTimeline   = ["cut", "trim", "video-to-gif", "frames"].includes(tool.kind);
  const showFrameSeek  = tool.kind === "thumbnail";
  const showQuality = ["compress", "convert", "mov-to-mp4", "mkv-to-mp4", "webm-to-mp4", "gif-to-mp4", "video-to-webm", "merge", "join", "add-audio"].includes(tool.kind);
  const showResolution = ["compress", "convert", "mov-to-mp4", "mkv-to-mp4", "webm-to-mp4", "gif-to-mp4", "video-to-webm"].includes(tool.kind);
  const canProcess = tool.multiple ? uploads.length >= 2 : Boolean(upload) && (tool.kind !== "add-audio" || Boolean(audioUpload));
  const selectedLabel = tool.multiple
    ? uploads.length > 0 ? `${uploads.length} videos selected` : "No videos selected"
    : upload?.file.name ?? "No file selected";
  const outputChangeLabel = upload && outputBlob
    ? `${Math.abs((1 - outputBlob.size / upload.file.size) * 100).toFixed(1)}% ${outputBlob.size <= upload.file.size ? "smaller" : "larger"}`
    : null;

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border)" }}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor(state) }} aria-hidden="true" />
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{statusText(state)}</p>
            <span className="rounded border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--border-strong)", color: "var(--text-subtle)" }}>
              {tool.engine === "browser" ? "Capturing frame..." : "Processing video..."}
            </span>
          </div>
          <p className="mt-1 truncate text-xs" style={{ color: "var(--text-muted)" }}>
            {selectedLabel}{selectedSize > 0 ? ` - ${formatBytes(selectedSize)}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {outputChangeLabel && (
            <span className="rounded-md border px-2.5 py-1 text-xs font-medium" style={{ borderColor: "var(--border-strong)", color: outputBlob && upload && outputBlob.size <= upload.file.size ? "var(--teal)" : "var(--coral)" }}>
              {outputChangeLabel}
            </span>
          )}
          {(state === "ready" || state === "error" || state === "done") && uploads.length > 0 && (
            <button type="button" onClick={reset} className="focus-ring rounded-md border px-3 py-1.5 text-xs font-medium transition hover:opacity-80" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {(state === "idle" || state === "ready") && (
          <VideoUploader
            accept={tool.accept}
            acceptLabel={tool.acceptLabel}
            multiple={Boolean(tool.multiple)}
            onFiles={setNewUploads}
            label={tool.multiple ? "Drop video files here" : tool.kind === "gif-to-mp4" ? "Drop GIF file here" : "Drop video file here"}
          />
        )}

        {tool.multiple && uploads.length > 0 && (state === "ready" || state === "processing") && (
          <VideoQueue uploads={uploads} onChange={setUploads} />
        )}

        {!tool.multiple && upload && (state === "ready" || state === "processing") && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {tool.kind === "gif-to-mp4" ? (
              <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={upload.objectUrl} alt={upload.file.name} className="mx-auto max-h-[420px] max-w-full rounded-md" />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <video
                  ref={videoRef}
                  src={upload.objectUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full bg-black object-contain"
                  aria-label={upload.file.name}
                  onLoadedMetadata={(event) => {
                    const video = event.currentTarget;
                    if (!video.videoWidth || !video.videoHeight) {
                      setPreviewIssue("The browser loaded the file duration, but it cannot find a displayable video track.");
                    }
                  }}
                  onLoadedData={() => setPreviewIssue("")}
                  onPlay={watchUploadFrame}
                  onError={() => setPreviewIssue("This browser cannot preview this video's codec. Try processing it to MP4/H.264 or choose another source file.")}
                />
                {tool.kind === "crop" && upload.metadata.width && upload.metadata.height && (
                  <div
                    aria-label="Drag crop selection"
                    tabIndex={0}
                    onPointerDown={startCropDrag}
                    className="absolute cursor-move border-2 border-dashed"
                    style={{
                      left: `${(crop.x / upload.metadata.width) * 100}%`,
                      top: `${(crop.y / upload.metadata.height) * 100}%`,
                      width: `${(crop.width / upload.metadata.width) * 100}%`,
                      height: `${(crop.height / upload.metadata.height) * 100}%`,
                      borderColor: "var(--accent)",
                      backgroundColor: "color-mix(in srgb,var(--accent) 12%,transparent)",
                    }}
                  />
                )}
              </div>
            )}
            {previewIssue && (
              <p className="rounded-md border px-3 py-2 text-xs" role="status"
                style={{ borderColor: "rgba(239,125,111,0.3)", backgroundColor: "rgba(239,125,111,0.08)", color: "var(--coral)" }}>
                {previewIssue}
              </p>
            )}
            <VideoFileInfo file={upload.file} metadata={upload.metadata} outputSize={outputBlob?.size} outputDimensions={outputDimensions} />
          </div>

          <div className="space-y-4">
            {showQuality && (
              <fieldset className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <legend className="px-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Quality</legend>
                <div className="mt-2 grid gap-2">
                  {QUALITIES.map((item) => (
                    <label key={item.value} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <input type="radio" name="quality" value={item.value} checked={quality === item.value} onChange={() => setQuality(item.value)} />
                      {item.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {tool.kind === "convert" && (
              <label className="block rounded-lg border p-4 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                Output format
                <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as VideoFormat)} className="focus-ring mt-2 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}>
                  {OUTPUT_FORMATS.map((format) => <option key={format} value={format}>{format.toUpperCase()}</option>)}
                </select>
              </label>
            )}

            {showResolution && (
              <label className="block rounded-lg border p-4 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                Resolution
                <select value={resolution} onChange={(event) => setResolution(event.target.value as ResolutionPreset)} className="focus-ring mt-2 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}>
                  {RESOLUTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <label className="mt-3 flex items-center gap-2">
                  <input type="checkbox" checked={allowUpscale} onChange={(event) => setAllowUpscale(event.target.checked)} />
                  Allow upscaling
                </label>
              </label>
            )}

            {tool.kind === "resize" && (
              <div className="space-y-3 rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Output size</p>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>Width<input type="number" min={2} value={width} onChange={(e) => updateWidth(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>Height<input type="number" min={2} value={height} onChange={(e) => updateHeight(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                </div>
                <label className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}><input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />Lock aspect ratio</label>
                <label className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}><input type="checkbox" checked={allowUpscale} onChange={(e) => setAllowUpscale(e.target.checked)} />Allow upscaling</label>
                <div className="flex flex-wrap gap-2">
                  {RESIZE_PRESETS.map((preset) => (
                    <button key={preset.label} type="button" onClick={() => { setWidth(preset.width); setHeight(preset.height); }} className="focus-ring rounded-md border px-2.5 py-1 text-xs" style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}>{preset.label}</button>
                  ))}
                </div>
              </div>
            )}

            {showTimeline && (
              <VideoTimeline duration={duration} start={start} end={end} onStartChange={setStart} onEndChange={setEnd} onPreview={previewSelection} />
            )}

            {/* BUG 6 FIX: thumbnail uses a single frame-position control, not a range */}
            {showFrameSeek && (
              <div className="space-y-3 rounded-lg border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Frame position</p>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: "var(--text-subtle)" }}>0s</span>
                  <span style={{ color: "var(--accent)" }}>{start.toFixed(1)}s</span>
                  <span style={{ color: "var(--text-subtle)" }}>{duration ? `${duration.toFixed(1)}s` : "—"}</span>
                </div>
                <input type="range" min={0} max={duration || 1} step={0.1} value={start}
                  onChange={(e) => { const v = Number(e.target.value); setStart(v); if (videoRef.current) videoRef.current.currentTime = v; }}
                  className="w-full accent-amber-400" aria-label="Frame position" />
                <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  Exact position (seconds)
                  <input type="number" min={0} max={duration || 0} step={0.1}
                    value={start.toFixed(1)}
                    onChange={(e) => { const v = Math.min(Number(e.target.value), duration || 0); setStart(v); if (videoRef.current) videoRef.current.currentTime = v; }}
                    className="focus-ring rounded-md border px-3 py-2 font-mono"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
                </label>
                <button type="button" onClick={previewSelection}
                  className="focus-ring rounded-md border px-3 py-1.5 text-xs font-medium"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  Jump to frame
                </button>
              </div>
            )}

            {tool.kind === "video-to-gif" && (
              <div className="grid gap-3 rounded-lg border p-4 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                <label>GIF width<input type="number" min={120} max={1280} value={gifWidth} onChange={(e) => setGifWidth(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                <label>FPS<input type="number" min={4} max={24} value={fps} onChange={(e) => setFps(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                <p>GIF files can become very large. Short clips, smaller width, and lower FPS work best.</p>
              </div>
            )}

            {tool.kind === "video-to-webm" && (
              <label className="block rounded-lg border p-4 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>FPS
                <input type="number" min={10} max={60} value={fps} onChange={(e) => setFps(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} />
              </label>
            )}

            {tool.kind === "mp4-to-mp3" && (
              <fieldset className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <legend className="px-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>MP3 bitrate</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BITRATES.map((item) => (
                    <button key={item} type="button" onClick={() => setBitrate(item)} className="focus-ring rounded-md border px-2.5 py-1 text-xs" style={{ borderColor: bitrate === item ? "var(--accent)" : "var(--border-strong)", color: bitrate === item ? "var(--accent)" : "var(--text-secondary)" }}>{item}</button>
                  ))}
                </div>
              </fieldset>
            )}

            {tool.kind === "speed" && (
              <div className="space-y-3 rounded-lg border p-4 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                <p className="font-medium">Changing speed also changes pitch proportionally. Faster audio sounds higher-pitched, slower audio sounds lower-pitched.</p>
                <div className="flex flex-wrap gap-2">
                  {SPEEDS.map((item) => (
                    <button key={item} type="button" onClick={() => setSpeed(item)} className="focus-ring rounded-md border px-2.5 py-1" style={{ borderColor: speed === item ? "var(--accent)" : "var(--border-strong)", color: speed === item ? "var(--accent)" : "var(--text-secondary)" }}>{item}x</button>
                  ))}
                </div>
                <label>Custom speed<input type="number" min={0.25} max={4} step={0.05} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                <p>Estimated output duration: {duration ? `${(duration / speed).toFixed(1)} seconds` : "Unknown"}</p>
              </div>
            )}

            {tool.kind === "crop" && upload.metadata.width && upload.metadata.height && (
              <div className="space-y-3 rounded-lg border p-4 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                <label>Aspect ratio<select value={cropRatio} onChange={(e) => applyCropRatio(e.target.value)} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}><option value="free">Free</option><option value="16:9">16:9</option><option value="4:3">4:3</option><option value="1:1">1:1</option><option value="9:16">9:16</option></select></label>
                <div className="grid grid-cols-2 gap-2">
                  <label>X<input type="number" value={Math.round(crop.x)} onChange={(e) => updateCrop({ x: Number(e.target.value) })} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                  <label>Y<input type="number" value={Math.round(crop.y)} onChange={(e) => updateCrop({ y: Number(e.target.value) })} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                  <label>Width<input type="number" value={Math.round(crop.width)} onChange={(e) => updateCrop({ width: Number(e.target.value) })} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                  <label>Height<input type="number" value={Math.round(crop.height)} onChange={(e) => updateCrop({ height: Number(e.target.value) })} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                </div>
                <p>Crop dimensions: {Math.round(crop.width)} x {Math.round(crop.height)}</p>
              </div>
            )}

            {(tool.kind === "thumbnail" || tool.kind === "frames") && (
              <div className="space-y-3 rounded-lg border p-4 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                <label>Image format<select value={imageType} onChange={(e) => setImageType(e.target.value as "image/png" | "image/jpeg")} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option></select></label>
                {tool.kind === "frames" && (
                  <div className="grid grid-cols-2 gap-2">
                    <label>Frames<input type="number" min={1} max={12} value={frameCount} onChange={(e) => setFrameCount(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                    <label>Interval<input type="number" min={0.1} step={0.1} value={frameInterval} onChange={(e) => setFrameInterval(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                  </div>
                )}
              </div>
            )}

            {tool.kind === "add-audio" && (
              <div className="space-y-3 rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Audio file</p>
                <VideoUploader accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac" acceptLabel="MP3, WAV, M4A, AAC, OGG, FLAC" label="Drop audio file here" onFiles={(files) => setAudioUpload(files[0])} />
                {audioUpload && <VideoPlayer src={audioUpload.objectUrl} label={audioUpload.file.name} audio />}
                <label className="block text-xs" style={{ color: "var(--text-muted)" }}>Mode<select value={audioMode} onChange={(e) => setAudioMode(e.target.value as "replace" | "mix")} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}><option value="replace">Replace original audio</option><option value="mix">Mix with original audio</option></select></label>
                <label className="block text-xs" style={{ color: "var(--text-muted)" }}>Audio start position<input type="number" min={0} step={0.1} value={audioStartSec} onChange={(e) => setAudioStartSec(Number(e.target.value))} className="focus-ring mt-1 w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }} /></label>
                {audioMode === "mix" && (
                  <>
                    <label className="block text-xs" style={{ color: "var(--text-muted)" }}>Video volume<input type="range" min={0} max={2} step={0.05} value={videoVolume} onChange={(e) => setVideoVolume(Number(e.target.value))} className="mt-1 w-full" /></label>
                    <label className="block text-xs" style={{ color: "var(--text-muted)" }}>Added audio volume<input type="range" min={0} max={2} step={0.05} value={audioVolume} onChange={(e) => setAudioVolume(Number(e.target.value))} className="mt-1 w-full" /></label>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        )}

        {state === "ready" && (
          <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {tool.engine === "browser" ? "This runs instantly using local browser processing." : "Processing starts when you click the button below."}
            </p>
            <button type="button" onClick={process} disabled={!canProcess} className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
              {tool.processLabel}
            </button>
          </div>
        )}

        {state === "processing" && <VideoProgress ratio={progress} label={tool.engine === "browser" ? "Capturing frame..." : "Processing video..."} />}

        {state === "error" && (
          <div className="space-y-3">
            <p className="rounded-md border px-3 py-2 text-xs" role="alert" style={{ borderColor: "rgba(239,125,111,0.3)", backgroundColor: "rgba(239,125,111,0.08)", color: "var(--coral)" }}>{error}</p>
            <button type="button" onClick={reset} className="focus-ring rounded-lg border px-5 py-2 text-sm font-medium" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>Try again</button>
          </div>
        )}

        {state === "done" && outputBlob && (
          <div className="space-y-4">
            {outputUrl && outputMime.startsWith("video/") && <VideoPlayer src={outputUrl} label="Output preview" />}
            {outputUrl && outputMime.startsWith("audio/") && <VideoPlayer src={outputUrl} label="Output audio preview" audio />}
            {outputUrl && (outputMime.startsWith("image/") || outputMime === "image/gif") && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={outputUrl} alt="Output preview" className="max-h-[420px] max-w-full rounded-lg border object-contain" style={{ borderColor: "var(--border)" }} />
            )}
            {upload && <VideoFileInfo file={upload.file} metadata={upload.metadata} outputSize={outputBlob.size} outputDimensions={outputDimensions} />}
            <VideoDownload blob={outputBlob} filename={outputFilename(tool, upload?.file.name ?? "video", outputMime, imageType)} onReset={reset} />
          </div>
        )}
      </div>
    </div>
  );
}
