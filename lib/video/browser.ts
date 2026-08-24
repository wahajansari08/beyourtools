export interface VideoMetadata {
  duration: number | null;
  width: number | null;
  height: number | null;
  aspectRatio: string | null;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function getAspectRatio(width: number | null, height: number | null): string | null {
  if (!width || !height) return null;
  const divisor = gcd(width, height);
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
}

export function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;

    const done = (metadata: VideoMetadata) => {
      URL.revokeObjectURL(url);
      resolve(metadata);
    };

    video.onloadedmetadata = () => {
      const width = video.videoWidth || null;
      const height = video.videoHeight || null;
      done({
        duration: Number.isFinite(video.duration) ? video.duration : null,
        width,
        height,
        aspectRatio: getAspectRatio(width, height),
      });
    };

    video.onerror = () => done({ duration: null, width: null, height: null, aspectRatio: null });
    video.src = url;
  });
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "Unknown";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export async function captureVideoFrame(
  file: File,
  timestamp: number,
  type: "image/png" | "image/jpeg",
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onerror = () => {
      cleanup();
      reject(new Error("This video could not be decoded by the browser. Try converting it to MP4 first."));
    };

    video.onloadedmetadata = () => {
      const safeTime = Math.min(Math.max(timestamp, 0), Math.max(video.duration - 0.05, 0));
      video.currentTime = safeTime;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        cleanup();
        reject(new Error("Your browser could not create a canvas for frame extraction."));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) resolve(blob);
          else reject(new Error("The selected frame could not be exported."));
        },
        type,
        quality
      );
    };

    video.src = url;
  });
}

export async function captureMultipleFrames(
  file: File,
  start: number,
  interval: number,
  count: number,
  type: "image/png" | "image/jpeg"
): Promise<Blob[]> {
  const safeCount = Math.min(Math.max(count, 1), 12);
  const safeInterval = Math.max(interval, 0.1);
  const frames: Blob[] = [];

  for (let i = 0; i < safeCount; i++) {
    frames.push(await captureVideoFrame(file, start + i * safeInterval, type));
  }

  return frames;
}

