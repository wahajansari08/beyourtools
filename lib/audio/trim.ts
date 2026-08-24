/**
 * Audio trimming - cut a section [startSec, endSec] from an audio file.
 * Uses FFmpeg WASM.
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export interface TrimOptions {
  startSec: number;
  endSec: number;
  /** Output format extension, e.g. "mp3" */
  outputFormat?: string;
  /** MP3 bitrate when outputting mp3 */
  bitrate?: string;
  onProgress?: (p: FFmpegProgress) => void;
}

export interface TrimResult {
  blob: Blob;
  ext: string;
  mime: string;
  durationSec: number;
}

const MIME: Record<string, string> = {
  mp3:  "audio/mpeg",
  wav:  "audio/wav",
  ogg:  "audio/ogg",
  flac: "audio/flac",
  m4a:  "audio/mp4",
  aac:  "audio/aac",
  opus: "audio/opus",
  webm: "audio/webm",
};

export async function trimAudio(file: File, opts: TrimOptions): Promise<TrimResult> {
  const { startSec, endSec, onProgress } = opts;

  if (endSec <= startSec) {
    throw new Error("End time must be after start time.");
  }

  const inputExt  = file.name.split(".").pop()?.toLowerCase() ?? "mp3";
  const outputExt = opts.outputFormat ?? inputExt;
  const mime      = MIME[outputExt] ?? "audio/mpeg";

  const { ffmpeg, fetchFile } = await loadFFmpeg(onProgress);

  const inputName  = await writeInputFile(ffmpeg, fetchFile, file, "trim_in");
  const outputName = `trim_out.${outputExt}`;

  const duration = endSec - startSec;
  const args = [
    "-ss", String(startSec),
    "-t",  String(duration),
    "-i",  inputName,
    "-y",
  ];

  if (outputExt === "mp3") {
    args.push("-c:a", "libmp3lame", "-b:a", opts.bitrate ?? "192k");
  } else if (outputExt === "wav") {
    args.push("-c:a", "pcm_s16le");
  } else {
    args.push("-c:a", "copy");
  }

  args.push("-vn", outputName);

  await ffmpeg.exec(args);

  const blob = await readOutputFile(ffmpeg, outputName, mime);
  await cleanupFiles(ffmpeg, inputName, outputName);

  return { blob, ext: outputExt, mime, durationSec: duration };
}
