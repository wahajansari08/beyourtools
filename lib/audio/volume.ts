/**
 * Volume adjustment — apply gain to an audio file.
 * Uses Web Audio API (OfflineAudioContext) + WAV encoder,
 * then re-encodes to MP3 via FFmpeg if needed.
 *
 * Gain is a linear multiplier, e.g. 2.0 = +100%.
 * We use a DynamicsCompressorNode to reduce clipping.
 */

import {
  loadFFmpeg,
  writeInputFile,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export interface VolumeOptions {
  /** Linear gain multiplier, e.g. 1.5 = +50% */
  gain: number;
  outputFormat?: "mp3" | "wav";
  bitrate?: string;
  onProgress?: (p: FFmpegProgress) => void;
}

export interface VolumeResult {
  blob: Blob;
  ext: string;
  mime: string;
}

export async function adjustVolume(file: File, opts: VolumeOptions): Promise<VolumeResult> {
  const { gain, outputFormat = "mp3", bitrate = "192k", onProgress } = opts;

  if (gain <= 0) throw new Error("Gain must be greater than 0.");
  if (gain > 10) throw new Error("Gain too high — maximum is 10× to prevent damage.");

  // Use FFmpeg volume filter — simpler and more reliable across browsers
  const { ffmpeg, fetchFile } = await loadFFmpeg(onProgress);

  const inputName  = await writeInputFile(ffmpeg, fetchFile, file, "vol_in");
  const outputName = `volume_out.${outputFormat}`;

  const args = [
    "-i", inputName,
    "-af", `volume=${gain}`,
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
