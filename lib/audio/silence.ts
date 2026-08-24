/**
 * Remove silence from audio using FFmpeg silenceremove filter.
 * Uses FFmpeg WASM.
 *
 * BUG 7 FIX: the original filter string was assembled with array.join("") across
 * lines that contained template-literal newlines/indentation, producing a filter
 * string with embedded whitespace that FFmpeg rejected. Now built as a single
 * string with no extraneous whitespace.
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export interface SilenceOptions {
  /** Silence threshold in dBFS, e.g. -40 */
  thresholdDb?: number;
  /** Minimum silence duration to remove, in seconds */
  minSilenceDuration?: number;
  /** Padding to keep at edges of speech, in seconds */
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

  // Convert dBFS threshold to linear amplitude (0 – 1)
  const threshLinear = Math.pow(10, thresholdDb / 20).toFixed(6);

  // BUG 7 FIX: build the filter string as a single concatenated string with NO
  // newlines or spaces -FFmpeg's filter parser treats whitespace as a separator.
  const filter =
    `silenceremove=` +
    `start_periods=1:start_silence=${padding}:start_threshold=${threshLinear}:` +
    `stop_periods=-1:stop_silence=${minSilenceDuration}:stop_threshold=${threshLinear}`;

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

  args.push(outputName);

  await ffmpeg.exec(args);

  const mime = outputFormat === "mp3" ? "audio/mpeg" : "audio/wav";
  const blob = await readOutputFile(ffmpeg, outputName, mime);
  await cleanupFiles(ffmpeg, inputName, outputName);

  return { blob, ext: outputFormat, mime };
}
