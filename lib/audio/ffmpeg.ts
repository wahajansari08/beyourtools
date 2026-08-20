/**
 * Singleton FFmpeg loader.
 * Loads @ffmpeg/ffmpeg + WASM from jsDelivr CDN so the large WASM file
 * never enters the Next.js bundle. Import this lazily only on pages that need it.
 *
 * Usage:
 *   const { ffmpeg, fetchFile } = await loadFFmpeg(onProgress);
 */

export interface FFmpegProgress {
  /** 0–1 ratio, or -1 if unknown */
  ratio: number;
  /** Elapsed seconds */
  time: number;
}

let ffmpegInstance: import("@ffmpeg/ffmpeg").FFmpeg | null = null;
let loadPromise: Promise<import("@ffmpeg/ffmpeg").FFmpeg> | null = null;

export async function loadFFmpeg(
  onProgress?: (p: FFmpegProgress) => void
): Promise<{ ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg; fetchFile: typeof import("@ffmpeg/util").fetchFile }> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

  if (!ffmpegInstance) {
    if (!loadPromise) {
      loadPromise = (async () => {
        const ff = new FFmpeg();

        // Stream progress events
        ff.on("progress", ({ progress, time }) => {
          onProgress?.({ ratio: progress, time });
        });

        // Load WASM from CDN (avoids shipping 30 MB in the bundle)
        const base = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.9/dist/esm";
        await ff.load({
          coreURL:   await toBlobURL(`${base}/ffmpeg-core.js`,   "text/javascript"),
          wasmURL:   await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
        });

        ffmpegInstance = ff;
        return ff;
      })();
    }
    await loadPromise;
  } else if (onProgress) {
    // Re-attach progress listener for this call
    ffmpegInstance.on("progress", ({ progress, time }) => {
      onProgress({ ratio: progress, time });
    });
  }

  return { ffmpeg: ffmpegInstance!, fetchFile };
}

/** Write a File/Blob into FFmpeg's virtual FS */
export async function writeInputFile(
  ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg,
  fetchFile: typeof import("@ffmpeg/util").fetchFile,
  file: File,
  name = "input"
): Promise<string> {
  const inputName = `${name}.${file.name.split(".").pop() ?? "bin"}`;
  await ffmpeg.writeFile(inputName, await fetchFile(file));
  return inputName;
}

/** Read output from FFmpeg's virtual FS as a Blob */
export async function readOutputFile(
  ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg,
  name: string,
  mime: string
): Promise<Blob> {
  const data = await ffmpeg.readFile(name) as Uint8Array;
  return new Blob([data.buffer as ArrayBuffer], { type: mime });
}

/** Clean up named files from FFmpeg virtual FS */
export async function cleanupFiles(
  ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg,
  ...names: string[]
): Promise<void> {
  for (const name of names) {
    try { await ffmpeg.deleteFile(name); } catch { /* ignore */ }
  }
}

/** Format seconds as mm:ss */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Format bytes as KB / MB */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1_048_576).toFixed(2)} MB`;
}

/** Get audio duration from a File via HTMLAudioElement */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      resolve(0);
    });
    audio.src = url;
  });
}
