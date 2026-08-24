"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import AudioUploader, { type AudioFile } from "@/components/audio/AudioUploader";
import AudioFileInfo from "@/components/audio/AudioFileInfo";
import AudioTrimmer from "@/components/audio/AudioTrimmer";
import AudioProgress from "@/components/audio/AudioProgress";
import AudioDownload from "@/components/audio/AudioDownload";
import StatusBanner from "@/components/StatusBanner";
import { trimAudio } from "@/lib/audio/trim";

type State = "idle" | "ready" | "processing" | "done" | "error";

export default function AudioCutterClient() {
  const [state,     setState]     = useState<State>("idle");
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [startSec,  setStartSec]  = useState(0);
  const [endSec,    setEndSec]    = useState(0);
  const [progress,  setProgress]  = useState<number | null>(null);
  const [outBlob,   setOutBlob]   = useState<Blob | null>(null);
  const [errorMsg,  setErrorMsg]  = useState("");

  // BUG 10 FIX: stable URL managed by effect, not created inline in render
  const [outUrl, setOutUrl] = useState<string>("");

  useEffect(() => {
    if (!outBlob) return;
    const url = URL.createObjectURL(outBlob);
    setOutUrl(url);
    return () => { URL.revokeObjectURL(url); };
  }, [outBlob]);

  const handleFiles = useCallback((files: AudioFile[]) => {
    const f = files[0];
    if (!f) return;
    setAudioFile(f);
    setStartSec(0);
    setEndSec(f.duration ?? 0);
    setState("ready");
    setOutBlob(null);
    setOutUrl("");
    setErrorMsg("");
  }, []);

  const handleCut = useCallback(async () => {
    if (!audioFile) return;
    setState("processing");
    setProgress(null);
    const ext = audioFile.file.name.split(".").pop()?.toLowerCase() ?? "mp3";
    try {
      const result = await trimAudio(audioFile.file, {
        startSec,
        endSec,
        outputFormat: ext,
        onProgress: (p) => setProgress(p.ratio),
      });
      setOutBlob(result.blob);
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not cut the audio. Please try another file.");
      setState("error");
    }
  }, [audioFile, startSec, endSec]);

  const reset = useCallback(() => {
    if (audioFile?.objectUrl) URL.revokeObjectURL(audioFile.objectUrl);
    setAudioFile(null);
    setOutBlob(null);
    setOutUrl("");
    setState("idle");
    setErrorMsg("");
    setProgress(null);
  }, [audioFile]);

  const ext = audioFile?.file.name.split(".").pop()?.toLowerCase() ?? "mp3";

  return (
    <div className="space-y-4">
      {state === "idle" && (
        <AudioUploader
          accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.opus,.aac,.webm"
          acceptLabel="MP3, WAV, FLAC, M4A, OGG and more"
          onFiles={handleFiles} multiple={false}
        />
      )}
      {audioFile && state !== "idle" && (
        <AudioFileInfo name={audioFile.file.name} size={audioFile.file.size} duration={audioFile.duration} mime={audioFile.file.type} />
      )}
      {audioFile && (state === "ready" || state === "processing") && (
        <AudioTrimmer
          src={audioFile.objectUrl}
          duration={audioFile.duration ?? 0}
          startSec={startSec} endSec={endSec}
          onStartChange={setStartSec} onEndChange={setEndSec}
        />
      )}
      {state === "ready" && (
        <button type="button" onClick={handleCut}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          ✂️ Cut Audio
        </button>
      )}
      {state === "processing" && <AudioProgress ratio={progress} label="Cutting audio…" />}
      {state === "error" && (
        <div className="space-y-3">
          <StatusBanner type="error" message={errorMsg} />
          <button type="button" onClick={reset}
            className="focus-ring rounded-lg border px-5 py-2 text-sm font-medium"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            Try again
          </button>
        </div>
      )}
      {state === "done" && outBlob && audioFile && (
        <div className="space-y-4">
          {outUrl && (
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Output preview</p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={outUrl} className="w-full" />
            </div>
          )}
          <AudioDownload
            blob={outBlob}
            filename={audioFile.file.name.replace(/\.[^/.]+$/, "") + `-cut.${ext}`}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}
