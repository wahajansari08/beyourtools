/**
 * Browser audio recorder utilities using the MediaRecorder API.
 * Used by the AudioRecorder client component.
 */

/** Pick the best supported MIME type for recording */
export function getBestRecordingMime(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const mime of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return ""; // browser will use its default
}

/** Extension for a given MIME type */
export function extForMime(mime: string): string {
  if (mime.startsWith("audio/webm")) return "webm";
  if (mime.startsWith("audio/ogg"))  return "ogg";
  if (mime.startsWith("audio/mp4"))  return "m4a";
  return "webm";
}

/** Generate a recording filename with timestamp */
export function recordingFilename(ext: string): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ts  = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
  return `beyourtools-recording-${ts}.${ext}`;
}

/** Format milliseconds as mm:ss.s */
export function formatRecordingTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const ds = Math.floor((ms % 1000) / 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${ds}`;
}
