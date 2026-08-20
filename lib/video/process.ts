import {
  cleanupFiles,
  loadFFmpeg,
  readOutputFile,
  type FFmpegProgress,
} from "./ffmpeg";

export type VideoFormat = "mp4" | "webm" | "mov" | "mkv";
export type QualityPreset = "maximum" | "high" | "balanced" | "high-quality" | "best";
export type ResolutionPreset = "original" | "1080" | "720" | "480" | "360" | "custom";

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VideoProcessOptions {
  outputFormat?: VideoFormat;
  quality?: QualityPreset;
  resolution?: ResolutionPreset;
  width?: number;
  height?: number;
  allowUpscale?: boolean;
  startSec?: number;
  endSec?: number;
  speed?: number;
  fps?: number;
  gifWidth?: number;
  audioBitrate?: string;
  crop?: CropRect;
  audioFile?: File;
  audioMode?: "replace" | "mix";
  videoVolume?: number;
  audioVolume?: number;
  audioStartSec?: number;
  onProgress?: (progress: FFmpegProgress) => void;
}

export interface VideoProcessResult {
  blob: Blob;
  ext: string;
  mime: string;
}

const MIME: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
  mp3: "audio/mpeg",
  gif: "image/gif",
};

const CRF: Record<QualityPreset, string> = {
  maximum: "32",
  high: "28",
  balanced: "24",
  "high-quality": "20",
  best: "18",
};

const WEBM_CRF: Record<QualityPreset, string> = {
  maximum: "42",
  high: "36",
  balanced: "31",
  "high-quality": "26",
  best: "22",
};

const RESOLUTION_HEIGHT: Partial<Record<ResolutionPreset, number>> = {
  "1080": 1080,
  "720": 720,
  "480": 480,
  "360": 360,
};

function extension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() || "mp4";
}

function outputName(ext: string): string {
  return `output.${ext}`;
}

function normalizeProgress(onProgress?: (progress: FFmpegProgress) => void) {
  return onProgress
    ? (progress: FFmpegProgress) => {
        if (Number.isFinite(progress.ratio)) {
          onProgress({ ...progress, ratio: Math.min(Math.max(progress.ratio, 0), 1) });
        } else {
          onProgress(progress);
        }
      }
    : undefined;
}

function scaleFilter(opts: VideoProcessOptions): string | null {
  if (opts.resolution === "custom" && opts.width && opts.height) {
    const expr = opts.allowUpscale
      ? `scale=${Math.round(opts.width)}:${Math.round(opts.height)}`
      : `scale='min(${Math.round(opts.width)},iw)':'min(${Math.round(opts.height)},ih)':force_original_aspect_ratio=decrease`;
    return expr;
  }

  const targetHeight = opts.resolution ? RESOLUTION_HEIGHT[opts.resolution] : undefined;
  if (!targetHeight) return null;
  return opts.allowUpscale
    ? `scale=-2:${targetHeight}`
    : `scale=-2:'min(${targetHeight},ih)'`;
}

function videoEncodeArgs(ext: string, opts: VideoProcessOptions): string[] {
  const quality = opts.quality ?? "balanced";
  if (ext === "webm") {
    const args = ["-c:v", "libvpx-vp9", "-crf", WEBM_CRF[quality], "-b:v", "0", "-c:a", "libopus", "-b:a", "128k"];
    if (opts.fps) args.unshift("-r", String(opts.fps));
    return args;
  }

  return [
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    CRF[quality],
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "faststart",
  ];
}

function friendlyError(): Error {
  return new Error("We couldn't process this video. Please try another file, smaller clip, or a more common format such as MP4.");
}

async function writeFile(ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg, fetchFile: typeof import("@ffmpeg/util").fetchFile, file: File, name: string) {
  await ffmpeg.writeFile(name, await fetchFile(file));
}

async function runSingle(file: File, args: string[], out: string, mime: string, opts: VideoProcessOptions): Promise<VideoProcessResult> {
  const { ffmpeg, fetchFile } = await loadFFmpeg(normalizeProgress(opts.onProgress));
  const input = `input.${extension(file)}`;
  await writeFile(ffmpeg, fetchFile, file, input);

  try {
    await ffmpeg.exec(args.map((arg) => (arg === "$INPUT" ? input : arg)));
    const blob = await readOutputFile(ffmpeg, out, mime);
    return { blob, ext: out.split(".").pop() || "mp4", mime };
  } catch {
    throw friendlyError();
  } finally {
    await cleanupFiles(ffmpeg, input, out, "palette.png");
  }
}

export async function processVideo(file: File, kind: string, opts: VideoProcessOptions = {}): Promise<VideoProcessResult> {
  if (!file || file.size === 0) throw new Error("Please choose a non-empty video file.");

  if (kind === "mp4-to-mp3") {
    const out = outputName("mp3");
    return runSingle(
      file,
      ["-i", "$INPUT", "-vn", "-c:a", "libmp3lame", "-b:a", opts.audioBitrate ?? "192k", "-y", out],
      out,
      MIME.mp3,
      opts
    );
  }

  if (kind === "video-to-gif") {
    const start = opts.startSec ?? 0;
    const duration = Math.max((opts.endSec ?? Math.min(start + 4, start + 4)) - start, 0.2);
    const fps = opts.fps ?? 10;
    const width = opts.gifWidth ?? 480;
    const out = outputName("gif");
    const filter = `fps=${fps},scale=${width}:-1:flags=lanczos`;
    return runSingle(
      file,
      ["-ss", String(start), "-t", String(duration), "-i", "$INPUT", "-vf", `${filter},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`, "-loop", "0", "-y", out],
      out,
      MIME.gif,
      opts
    );
  }

  if (kind === "remove-audio") {
    const out = outputName("mp4");
    return runSingle(file, ["-i", "$INPUT", "-an", "-c:v", "copy", "-movflags", "faststart", "-y", out], out, MIME.mp4, opts);
  }

  if (kind === "speed") {
    const speed = Math.min(Math.max(opts.speed ?? 1, 0.25), 4);
    const out = outputName("mp4");
    const videoFilter = `setpts=${(1 / speed).toFixed(4)}*PTS`;
    const atempoParts: string[] = [];
    let tempo = speed;
    while (tempo > 2) {
      atempoParts.push("atempo=2");
      tempo /= 2;
    }
    while (tempo < 0.5) {
      atempoParts.push("atempo=0.5");
      tempo /= 0.5;
    }
    atempoParts.push(`atempo=${tempo.toFixed(4)}`);
    return runSingle(
      file,
      ["-i", "$INPUT", "-filter:v", videoFilter, "-filter:a", atempoParts.join(","), ...videoEncodeArgs("mp4", opts), "-y", out],
      out,
      MIME.mp4,
      opts
    );
  }

  if (kind === "gif-to-mp4") {
    const out = outputName("mp4");
    const filters = [scaleFilter(opts), "fps=30"].filter(Boolean).join(",");
    const args = ["-i", "$INPUT", "-movflags", "faststart", "-pix_fmt", "yuv420p", "-vf", filters || "fps=30", "-c:v", "libx264", "-crf", CRF[opts.quality ?? "balanced"], "-y", out];
    return runSingle(file, args, out, MIME.mp4, opts);
  }

  const ext = opts.outputFormat ?? (kind === "video-to-webm" ? "webm" : "mp4");
  const out = outputName(ext);
  const args: string[] = [];
  const filters: string[] = [];

  if ((kind === "cut" || kind === "trim") && opts.startSec !== undefined && opts.endSec !== undefined) {
    if (opts.startSec < 0 || opts.endSec <= opts.startSec) throw new Error("Choose a valid start and end time.");
    args.push("-ss", String(opts.startSec), "-t", String(opts.endSec - opts.startSec));
  }

  args.push("-i", "$INPUT");

  if (kind === "crop" && opts.crop) {
    const crop = opts.crop;
    if (crop.width <= 0 || crop.height <= 0) throw new Error("Choose a valid crop area.");
    filters.push(`crop=${Math.round(crop.width)}:${Math.round(crop.height)}:${Math.round(crop.x)}:${Math.round(crop.y)}`);
  }

  const scale = scaleFilter(opts);
  if (scale) filters.push(scale);

  if (filters.length > 0) args.push("-vf", filters.join(","));

  args.push(...videoEncodeArgs(ext, opts), "-y", out);
  return runSingle(file, args, out, MIME[ext], opts);
}

export async function mergeVideos(files: File[], opts: VideoProcessOptions = {}): Promise<VideoProcessResult> {
  if (files.length < 2) throw new Error("Please add at least two videos.");

  const { ffmpeg, fetchFile } = await loadFFmpeg(normalizeProgress(opts.onProgress));
  const inputNames: string[] = [];
  const normalized: string[] = [];
  const output = "merged.mp4";

  try {
    for (let i = 0; i < files.length; i++) {
      const input = `merge_input_${i}.${extension(files[i])}`;
      const segment = `segment_${i}.mp4`;
      await writeFile(ffmpeg, fetchFile, files[i], input);
      inputNames.push(input);
      await ffmpeg.exec([
        "-i",
        input,
        "-vf",
        "scale=1280:-2:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        CRF[opts.quality ?? "balanced"],
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-ar",
        "44100",
        "-y",
        segment,
      ]);
      normalized.push(segment);
    }

    const list = normalized.map((name) => `file '${name}'`).join("\n");
    await ffmpeg.writeFile("concat.txt", new TextEncoder().encode(list));
    await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", "-movflags", "faststart", "-y", output]);
    const blob = await readOutputFile(ffmpeg, output, MIME.mp4);
    return { blob, ext: "mp4", mime: MIME.mp4 };
  } catch {
    throw friendlyError();
  } finally {
    await cleanupFiles(ffmpeg, ...inputNames, ...normalized, "concat.txt", output);
  }
}

export async function addAudioToVideo(videoFile: File, opts: VideoProcessOptions): Promise<VideoProcessResult> {
  if (!opts.audioFile) throw new Error("Please choose an audio file to add.");

  const { ffmpeg, fetchFile } = await loadFFmpeg(normalizeProgress(opts.onProgress));
  const videoInput = `video_input.${extension(videoFile)}`;
  const audioInput = `audio_input.${extension(opts.audioFile)}`;
  const output = "video_with_audio.mp4";
  const mode = opts.audioMode ?? "replace";
  const videoVolume = opts.videoVolume ?? 1;
  const audioVolume = opts.audioVolume ?? 1;
  const audioStart = Math.max(opts.audioStartSec ?? 0, 0);

  try {
    await writeFile(ffmpeg, fetchFile, videoFile, videoInput);
    await writeFile(ffmpeg, fetchFile, opts.audioFile, audioInput);

    if (mode === "mix") {
      await ffmpeg.exec([
        "-i",
        videoInput,
        "-itsoffset",
        String(audioStart),
        "-i",
        audioInput,
        "-filter_complex",
        `[0:a]volume=${videoVolume}[a0];[1:a]volume=${audioVolume}[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=2[aout]`,
        "-map",
        "0:v:0",
        "-map",
        "[aout]",
        ...videoEncodeArgs("mp4", opts),
        "-shortest",
        "-y",
        output,
      ]);
    } else {
      await ffmpeg.exec([
        "-i",
        videoInput,
        "-itsoffset",
        String(audioStart),
        "-i",
        audioInput,
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        ...videoEncodeArgs("mp4", opts),
        "-shortest",
        "-y",
        output,
      ]);
    }

    const blob = await readOutputFile(ffmpeg, output, MIME.mp4);
    return { blob, ext: "mp4", mime: MIME.mp4 };
  } catch {
    throw friendlyError();
  } finally {
    await cleanupFiles(ffmpeg, videoInput, audioInput, output);
  }
}
