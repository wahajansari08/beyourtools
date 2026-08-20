/**
 * Audio merging — concatenate multiple audio files.
 * Uses FFmpeg WASM concat demuxer.
 */

import {
  loadFFmpeg,
  readOutputFile,
  cleanupFiles,
  type FFmpegProgress,
} from "./ffmpeg";

export interface MergeOptions {
  outputFormat?: string;
  bitrate?: string;
  onProgress?: (p: FFmpegProgress) => void;
}

export interface MergeResult {
  blob: Blob;
  ext: string;
  mime: string;
}

const MIME: Record<string, string> = {
  mp3:  "audio/mpeg",
  wav:  "audio/wav",
  ogg:  "audio/ogg",
  flac: "audio/flac",
  m4a:  "audio/mp4",
  webm: "audio/webm",
};

export async function mergeAudio(files: File[], opts: MergeOptions = {}): Promise<MergeResult> {
  if (files.length === 0) throw new Error("Please add at least one audio file.");
  if (files.length === 1) throw new Error("Please add at least two audio files to merge.");

  const outputExt = opts.outputFormat ?? "mp3";
  const mime      = MIME[outputExt] ?? "audio/mpeg";

  const { ffmpeg, fetchFile } = await loadFFmpeg(opts.onProgress);

  // Write all input files
  const inputNames: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const ext  = files[i].name.split(".").pop()?.toLowerCase() ?? "mp3";
    const name = `merge_in_${i}.${ext}`;
    await ffmpeg.writeFile(name, await fetchFile(files[i]));
    inputNames.push(name);
  }

  // Write concat list file
  const listContent = inputNames.map((n) => `file '${n}'`).join("\n");
  const encoder = new TextEncoder();
  await ffmpeg.writeFile("concat_list.txt", encoder.encode(listContent));

  const outputName = `merged.${outputExt}`;

  const args = [
    "-f", "concat",
    "-safe", "0",
    "-i", "concat_list.txt",
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
  await cleanupFiles(ffmpeg, ...inputNames, "concat_list.txt", outputName);

  return { blob, ext: outputExt, mime };
}
