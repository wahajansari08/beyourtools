"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import AudioUploader, { type AudioFile } from "@/components/audio/AudioUploader";
import AudioFileInfo from "@/components/audio/AudioFileInfo";
import AudioTrimmer from "@/components/audio/AudioTrimmer";
import AudioProgress from "@/components/audio/AudioProgress";
import AudioDownload from "@/components/audio/AudioDownload";
import StatusBanner from "@/components/StatusBanner";
import { trimAudio } from "@/lib/audio/trim";
import Btn from "@/components/Btn";

type State = "idle" | "ready" | "processing" | "done" | "error";

export default function Mp3CutterClient() {
  const [state,     setState]     = useState<State>("idle");
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [startSec,  setStartSec]  = useState(0);
  const [endSec,    setEndSec]    = useState(0);
  const [progress,  setProgress]  = useState<number | null>(null);
  const [outBlob,   setOutBlob]   = useState<Blob | null>(null);
  const [errorMsg,  setErrorMsg]  = useState("");

  // BUG 3 + 10 FIX: manage output URL in a ref so we can revoke it properly
  // instead of calling URL.createObjectURL() inline during render.
  const outUrlRef = useRef<string>("");
  const [outUrl,  setOutUrl]  = useState<string>("");

  // Revoke output URL when component unmounts or blob changes
  useEffect(() => {
    if (!outBlob) return;
    const url = URL.createObjectURL(outBlob);
    outUrlRef.current = url;
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
    try {
      const result = await trimAudio(audioFile.file, {
        startSec,
        endSec,
        outputFormat: "mp3",
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

  return (
    <div className="space-y-4">
      {state === "idle" && (
        <AudioUploader
          accept=".mp3,audio/mpeg" acceptLabel="MP3 files"
          onFiles={handleFiles} multiple={false}
        />
      )}

      {audioFile && state !== "idle" && (
        <AudioFileInfo
          name={audioFile.file.name}
          size={audioFile.file.size}
          duration={audioFile.duration}
          mime={audioFile.file.type}
        />
      )}

      {audioFile && (state === "ready" || state === "processing") && (
        <AudioTrimmer
          src={audioFile.objectUrl}
          duration={audioFile.duration ?? 0}
          startSec={startSec}
          endSec={endSec}
          onStartChange={setStartSec}
          onEndChange={setEndSec}
        />
      )}

      {state === "ready" && (
        <Btn variant="primary" size="lg" onClick={handleCut}>
          ✂️ Cut MP3
        </Btn>
      )}

      {state === "processing" && <AudioProgress ratio={progress} label="Cutting audio…" />}

      {state === "error" && (
        <div className="space-y-3">
          <StatusBanner type="error" message={errorMsg} />
          <Btn variant="secondary" onClick={reset}>
          Try again
        </Btn>
        </div>
      )}

      {state === "done" && outBlob && audioFile && (
        <div className="space-y-4">
          {outUrl && (
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Output preview</p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={outUrl} className="w-full" style={{ accentColor: "var(--accent)" }} />
            </div>
          )}
          <AudioDownload
            blob={outBlob}
            filename={audioFile.file.name.replace(/\.mp3$/i, "") + "-cut.mp3"}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}
