/**
 * Audio format conversion using FFmpeg WASM.
 * Supports: mp3, wav, ogg, flac, m4a, aac, opus, webm
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export type AudioFormat = "mp3" | "wav" | "ogg" | "flac" | "m4a" | "aac" | "opus" | "webm";

export const FORMAT_MIME: Record<AudioFormat, string> = {
  mp3:  "audio/mpeg",
  wav:  "audio/wav",
  ogg:  "audio/ogg",
  flac: "audio/flac",
  m4a:  "audio/mp4",
  aac:  "audio/aac",
  opus: "audio/opus",
  webm: "audio/webm",
};

export const FORMAT_LABEL: Record<AudioFormat, string> = {
  mp3:  "MP3",
  wav:  "WAV",
  ogg:  "OGG",
  flac: "FLAC",
  m4a:  "M4A",
  aac:  "AAC",
  opus: "Opus",
  webm: "WebM",
};

/** Bitrates available for lossy formats */
export const MP3_BITRATES = ["64k", "96k", "128k", "192k", "256k", "320k"] as const;
export type MP3Bitrate = typeof MP3_BITRATES[number];

export interface ConvertOptions {
  outputFormat: AudioFormat;
  bitrate?: MP3Bitrate;
  onProgress?: (p: FFmpegProgress) => void;
}

export interface ConvertResult {
  blob: Blob;
  ext: string;
  mime: string;
  sizeBytes: number;
}

export async function convertAudio(
  file: File,
  opts: ConvertOptions
): Promise<ConvertResult> {
  const { ffmpeg, fetchFile } = await loadFFmpeg(opts.onProgress);

  const inputName  = await writeInputFile(ffmpeg, fetchFile, file, "input");
  const outputName = `output.${opts.outputFormat}`;

  const args: string[] = ["-i", inputName, "-y"];

  // Format-specific encoding args
  switch (opts.outputFormat) {
    case "mp3":
      args.push("-c:a", "libmp3lame");
      if (opts.bitrate) args.push("-b:a", opts.bitrate);
      else args.push("-b:a", "192k");
      break;
    case "wav":
      args.push("-c:a", "pcm_s16le");
      break;
    case "ogg":
      args.push("-c:a", "libvorbis", "-q:a", "4");
      break;
    case "flac":
      args.push("-c:a", "flac");
      break;
    case "m4a":
    case "aac":
      args.push("-c:a", "aac", "-b:a", opts.bitrate ?? "192k");
      break;
    case "opus":
      args.push("-c:a", "libopus", "-b:a", opts.bitrate ?? "128k");
      break;
    case "webm":
      args.push("-c:a", "libopus", "-b:a", opts.bitrate ?? "128k");
      break;
  }

  // Strip video stream (important for mp4 → mp3)
  args.push("-vn", outputName);

  await ffmpeg.exec(args);

  const mime = FORMAT_MIME[opts.outputFormat];
  const blob = await readOutputFile(ffmpeg, outputName, mime);
  await cleanupFiles(ffmpeg, inputName, outputName);

  return { blob, ext: opts.outputFormat, mime, sizeBytes: blob.size };
}

/** Trigger browser download from a Blob */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
