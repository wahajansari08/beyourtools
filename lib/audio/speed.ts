/**
 * Audio speed change -tempo adjustment via FFmpeg atempo filter.
 * Uses FFmpeg WASM.
 *
 * NOTE: FFmpeg's `atempo` filter accepts values in [0.5, 2.0].
 * For speeds outside this range we chain multiple atempo filters.
 * This also changes pitch proportionally (no pitch preservation).
 * This limitation is clearly communicated in the UI.
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0] as const;
export type SpeedOption = typeof SPEED_OPTIONS[number];

export interface SpeedOptions {
  speed: number;
  outputFormat?: "mp3" | "wav";
  bitrate?: string;
  onProgress?: (p: FFmpegProgress) => void;
}

export interface SpeedResult {
  blob: Blob;
  ext: string;
  mime: string;
}

/** Build a chain of atempo filters for speeds outside 0.5–2.0 */
function buildAtempoFilter(speed: number): string {
  if (speed === 1.0) return "atempo=1.0";

  const filters: string[] = [];
  let remaining = speed;

  if (remaining < 0.5) {
    // Chain: 0.5 × 0.5 = 0.25
    while (remaining < 0.5) {
      filters.push("atempo=0.5");
      remaining /= 0.5;
    }
  } else if (remaining > 2.0) {
    // Chain: 2.0 × 2.0 = 4.0
    while (remaining > 2.0) {
      filters.push("atempo=2.0");
      remaining /= 2.0;
    }
  }

  if (Math.abs(remaining - 1.0) > 0.001) {
    filters.push(`atempo=${remaining.toFixed(4)}`);
  }

  return filters.join(",");
}

export async function changeAudioSpeed(file: File, opts: SpeedOptions): Promise<SpeedResult> {
  const { speed, outputFormat = "mp3", bitrate = "192k", onProgress } = opts;

  if (speed <= 0) throw new Error("Speed must be greater than 0.");
  if (speed > 4)  throw new Error("Speed must be 4× or less.");

  const { ffmpeg, fetchFile } = await loadFFmpeg(onProgress);

  const inputName  = await writeInputFile(ffmpeg, fetchFile, file, "speed_in");
  const outputName = `speed_out.${outputFormat}`;

  const filter = buildAtempoFilter(speed);

  const args = [
    "-i", inputName,
    "-af", filter,
    "-y",
  ];

  if (outputFormat === "mp3") {
    args.push("-c:a", "libmp3lame", "-b:a", bitrate);
  } else {
    args.push("-c:a", "pcm_s16le");
  }

  args.push("-vn", outputName);

  await ffmpeg.exec(args);

  const mime = outputFormat === "mp3" ? "audio/mpeg" : "audio/wav";
  const blob = await readOutputFile(ffmpeg, outputName, mime);
  await cleanupFiles(ffmpeg, inputName, outputName);

  return { blob, ext: outputFormat, mime };
}
