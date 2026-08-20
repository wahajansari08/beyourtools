/**
 * Remove silence from audio using FFmpeg silenceremove filter.
 * Uses FFmpeg WASM.
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export interface SilenceOptions {
  /** Silence threshold in dB, e.g. -40 */
  thresholdDb?: number;
  /** Minimum silence duration to remove, in seconds */
  minSilenceDuration?: number;
  /** Padding to keep around speech, in seconds */
  padding?: number;
  outputFormat?: "mp3" | "wav";
  bitrate?: string;
  onProgress?: (p: FFmpegProgress) => void;
}

export interface SilenceResult {
  blob: Blob;
  ext: string;
  mime: string;
}

export async function removeSilence(file: File, opts: SilenceOptions = {}): Promise<SilenceResult> {
  const {
    thresholdDb        = -40,
    minSilenceDuration = 0.5,
    padding            = 0.1,
    outputFormat       = "mp3",
    bitrate            = "192k",
    onProgress,
  } = opts;

  const { ffmpeg, fetchFile } = await loadFFmpeg(onProgress);

  const inputName  = await writeInputFile(ffmpeg, fetchFile, file, "silence_in");
  const outputName = `no_silence.${outputFormat}`;

  // silenceremove: remove silence from start, middle, and end
  // start_periods=1 removes leading silence
  // stop_periods=-1 removes all silence regions
  const threshLinear = Math.pow(10, thresholdDb / 20);
  const filter = [
    `silenceremove=`,
    `start_periods=1:start_silence=${padding}:start_threshold=${threshLinear}`,
    `:stop_periods=-1:stop_silence=${minSilenceDuration}:stop_threshold=${threshLinear}`,
  ].join("");

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
