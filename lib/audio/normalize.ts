/**
 * Audio normalization -peak normalization via FFmpeg loudnorm filter.
 * Uses FFmpeg WASM.
 *
 * NOTE: We use FFmpeg's `loudnorm` filter in single-pass mode (linear).
 * Full EBU R128 two-pass is not feasible in a WASM environment due to
 * the intermediate JSON pass. We therefore implement peak normalization
 * using the `dynaudnorm` filter for perceptually even results.
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export type NormalizationMode = "peak" | "dynamic";

export interface NormalizeOptions {
  /** Peak normalization target in dBFS, e.g. -1.0 */
  targetDb?: number;
  mode?: NormalizationMode;
  outputFormat?: "mp3" | "wav";
  bitrate?: string;
  onProgress?: (p: FFmpegProgress) => void;
}

export interface NormalizeResult {
  blob: Blob;
  ext: string;
  mime: string;
}

export async function normalizeAudio(file: File, opts: NormalizeOptions = {}): Promise<NormalizeResult> {
  const {
    targetDb     = -1.0,
    mode         = "peak",
    outputFormat = "mp3",
    bitrate      = "192k",
    onProgress,
  } = opts;

  const { ffmpeg, fetchFile } = await loadFFmpeg(onProgress);

  const inputName  = await writeInputFile(ffmpeg, fetchFile, file, "norm_in");
  const outputName = `normalized.${outputFormat}`;

  // Peak normalization: set maximum peak to targetDb dBFS
  // dynaudnorm for dynamic normalization
  const filter = mode === "peak"
    ? `loudnorm=I=${targetDb}:TP=${targetDb}:LRA=11`
    : `dynaudnorm=p=0.9:s=5`;

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
