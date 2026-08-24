/**
 * Audio merging — concatenate multiple audio files.
 * Uses FFmpeg WASM.
 *
 * BUG 6 FIX: the concat demuxer with -c:a copy fails when input files have
 * different sample rates, channel counts, or codecs. We now use the filter_complex
 * concat approach which decodes every input and re-encodes a uniform output.
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

  const outputName = `merged.${outputExt}`;

  // BUG 6 FIX: build a filter_complex concat graph that decodes every input,
  // concatenates them as audio streams, and re-encodes the result.
  // This handles mismatched sample rates, channels and codecs.
  const n = files.length;
  const inputArgs = inputNames.flatMap((name) => ["-i", name]);

  // [0:a][1:a]...[n-1:a]concat=n=N:v=0:a=1[outa]
  const inLabels   = inputNames.map((_, i) => `[${i}:a]`).join("");
  const filterStr  = `${inLabels}concat=n=${n}:v=0:a=1[outa]`;

  const args = [
    ...inputArgs,
    "-filter_complex", filterStr,
    "-map", "[outa]",
    "-y",
  ];

  if (outputExt === "mp3") {
    args.push("-c:a", "libmp3lame", "-b:a", opts.bitrate ?? "192k");
  } else if (outputExt === "wav") {
    args.push("-c:a", "pcm_s16le");
  } else if (outputExt === "ogg") {
    args.push("-c:a", "libvorbis", "-q:a", "4");
  } else {
    args.push("-c:a", "libmp3lame", "-b:a", opts.bitrate ?? "192k");
  }

  args.push(outputName);

  await ffmpeg.exec(args);

  const blob = await readOutputFile(ffmpeg, outputName, mime);
  await cleanupFiles(ffmpeg, ...inputNames, outputName);

  return { blob, ext: outputExt, mime };
}
