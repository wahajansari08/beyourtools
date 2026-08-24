/**
 * Audio compression - re-encode to a lower bitrate MP3.
 * Uses FFmpeg WASM.
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export type CompressionPreset = "max" | "high" | "balanced" | "quality" | "best";

export const COMPRESSION_PRESETS: Record<CompressionPreset, { label: string; bitrate: string; desc: string }> = {
  max:      { label: "Maximum compression", bitrate: "64k",  desc: "Smallest file, noticeable quality loss" },
  high:     { label: "High compression",    bitrate: "96k",  desc: "Very small file, some quality loss" },
  balanced: { label: "Balanced",            bitrate: "128k", desc: "Good balance of size and quality" },
  quality:  { label: "High quality",        bitrate: "192k", desc: "Near-transparent quality" },
  best:     { label: "Best quality",        bitrate: "320k", desc: "Best quality, larger file" },
};

export interface CompressOptions {
  preset?: CompressionPreset;
  /** Override bitrate directly, e.g. "128k" */
  bitrate?: string;
  outputFormat?: "mp3" | "ogg" | "aac";
  onProgress?: (p: FFmpegProgress) => void;
}

export interface CompressResult {
  blob: Blob;
  ext: string;
  mime: string;
  originalSize: number;
  compressedSize: number;
  reductionPct: number;
}

export async function compressAudio(file: File, opts: CompressOptions = {}): Promise<CompressResult> {
  const outputFmt = opts.outputFormat ?? "mp3";
  const bitrate   = opts.bitrate
    ?? (opts.preset ? COMPRESSION_PRESETS[opts.preset].bitrate : "128k");

  const MIME_MAP: Record<string, string> = {
    mp3: "audio/mpeg",
    ogg: "audio/ogg",
    aac: "audio/aac",
  };
  const mime = MIME_MAP[outputFmt] ?? "audio/mpeg";

  const { ffmpeg, fetchFile } = await loadFFmpeg(opts.onProgress);

  const inputName  = await writeInputFile(ffmpeg, fetchFile, file, "compress_in");
  const outputName = `compressed.${outputFmt}`;

  const args = ["-i", inputName, "-y"];

  if (outputFmt === "mp3") {
    args.push("-c:a", "libmp3lame", "-b:a", bitrate);
  } else if (outputFmt === "ogg") {
    args.push("-c:a", "libvorbis", "-b:a", bitrate);
  } else if (outputFmt === "aac") {
    args.push("-c:a", "aac", "-b:a", bitrate);
  }

  args.push("-vn", outputName);

  await ffmpeg.exec(args);

  const blob = await readOutputFile(ffmpeg, outputName, mime);
  await cleanupFiles(ffmpeg, inputName, outputName);

  const reductionPct = Math.max(
    0,
    Math.round(((file.size - blob.size) / file.size) * 100)
  );

  return {
    blob,
    ext: outputFmt,
    mime,
    originalSize: file.size,
    compressedSize: blob.size,
    reductionPct,
  };
}
