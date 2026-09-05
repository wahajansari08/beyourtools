"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import AudioDownload from "@/components/audio/AudioDownload";
import StatusBanner from "@/components/StatusBanner";
import { getBestRecordingMime, extForMime, recordingFilename, formatRecordingTime } from "@/lib/audio/recorder";
import Btn from "@/components/Btn";

type RecordState = "idle" | "requesting" | "recording" | "paused" | "done" | "error";

export default function AudioRecorderClient() {
  const [recState,   setRecState]   = useState<RecordState>("idle");
  const [elapsed,    setElapsed]    = useState(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputExt,  setOutputExt]  = useState("webm");
  const [errorMsg,   setErrorMsg]   = useState("");
  const [mimeUsed,   setMimeUsed]   = useState("");

  // BUG 4 FIX: manage the playback URL in state/effect so it is created once
  // and revoked on cleanup - never call URL.createObjectURL() inline in JSX.
  const [playbackUrl, setPlaybackUrl] = useState<string>("");

  useEffect(() => {
    if (!outputBlob) { setPlaybackUrl(""); return; }
    const url = URL.createObjectURL(outputBlob);
    setPlaybackUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [outputBlob]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef     = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);

  // BUG 5 FIX: move stream ref and stopStream into a useRef / useCallback so
  // the useEffect cleanup always closes over a stable reference.
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // Release mic on unmount - stopStream is stable (useCallback with no deps)
  useEffect(() => () => { stopStream(); stopTimer(); }, [stopStream, stopTimer]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(pausedElapsedRef.current + (Date.now() - startTimeRef.current));
    }, 100);
  }, []);

  const handleStart = useCallback(async () => {
    setRecState("requesting");
    setErrorMsg("");
    chunksRef.current = [];
    pausedElapsedRef.current = 0;
    setElapsed(0);
    setOutputBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mime = getBestRecordingMime();
      const ext  = extForMime(mime);
      setMimeUsed(mime);
      setOutputExt(ext);

      const opts: MediaRecorderOptions = mime ? { mimeType: mime } : {};
      const mr = new MediaRecorder(stream, opts);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
        setOutputBlob(blob);
        stopStream();
        setRecState("done");
      };
      mr.onerror = () => {
        setErrorMsg("Recording failed unexpectedly. Please try again.");
        setRecState("error");
        stopStream();
        stopTimer();
      };

      mr.start(250);
      setRecState("recording");
      startTimer();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Permission") || msg.includes("denied") || msg.includes("NotAllowed")) {
        setErrorMsg("Microphone permission was denied. Please allow microphone access in your browser settings.");
      } else if (msg.includes("NotFound") || msg.includes("DevicesNotFound")) {
        setErrorMsg("No microphone was found on this device.");
      } else {
        setErrorMsg("Could not access the microphone. Please check your browser settings.");
      }
      setRecState("error");
    }
  }, [stopStream, stopTimer, startTimer]);

  const handlePause = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      stopTimer();
      pausedElapsedRef.current = elapsed;
      setRecState("paused");
    }
  }, [elapsed, stopTimer]);

  const handleResume = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecState("recording");
      startTimer();
    }
  }, [startTimer]);

  const handleStop = useCallback(() => {
    stopTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, [stopTimer]);

  const handleReset = useCallback(() => {
    stopTimer();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setOutputBlob(null);
    setElapsed(0);
    pausedElapsedRef.current = 0;
    setRecState("idle");
    setErrorMsg("");
  }, [stopStream, stopTimer]);

  const isRecording = recState === "recording";
  const isPaused    = recState === "paused";
  const isActive    = isRecording || isPaused;

  return (
    <div className="space-y-4">
      {recState !== "done" && (
        <div className="rounded-xl border p-6 space-y-6 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>

          {/* Timer */}
          <div>
            <div className="font-mono text-4xl font-bold tabular-nums"
              style={{ color: isRecording ? "var(--coral)" : "var(--text-primary)" }}>
              {formatRecordingTime(elapsed)}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
              {recState === "idle"       && "Ready to record"}
              {recState === "requesting" && "Requesting microphone…"}
              {isRecording               && "● Recording"}
              {isPaused                  && "⏸ Paused"}
            </p>
          </div>

          {/* Pulsing indicator while recording */}
          {isRecording && (
            <div className="flex justify-center" aria-hidden="true">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: "var(--coral)" }} />
                <span className="relative inline-flex h-3 w-3 rounded-full"
                  style={{ backgroundColor: "var(--coral)" }} />
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {recState === "idle" && (
              <Btn variant="danger" onClick={handleStart}>
          <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
                Start Recording
        </Btn>
            )}

            {isActive && (
              <>
                {isRecording ? (
                  <Btn variant="secondary" onClick={handlePause}>
          ⏸ Pause
        </Btn>
                ) : (
                  <Btn variant="primary" onClick={handleResume}>
          ▶ Resume
        </Btn>
                )}
                <Btn variant="secondary" onClick={handleStop}>
          ■ Stop
        </Btn>
              </>
            )}
          </div>

          {isActive && (
            <Btn variant="ghost" size="sm" onClick={handleReset}>Cancel recording</Btn>
          )}
        </div>
      )}

      {recState === "error" && (
        <div className="space-y-3">
          <StatusBanner type="error" message={errorMsg} />
          <Btn variant="secondary" onClick={handleReset}>
          Try again
        </Btn>
        </div>
      )}

      {recState === "done" && outputBlob && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>Recording complete</p>
              <span className="rounded-full border px-2 py-0.5 font-mono text-[10px]"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--teal)" }}>
                {formatRecordingTime(elapsed)} · {(outputBlob.size / 1024).toFixed(0)} KB
              </span>
            </div>
            {/* BUG 4 FIX: use stable playbackUrl from state, not inline createObjectURL */}
            {playbackUrl && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio controls src={playbackUrl} className="w-full" />
            )}
            {mimeUsed && (
              <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                Recorded as: <span className="font-mono">{mimeUsed}</span>
              </p>
            )}
          </div>

          <AudioDownload
            blob={outputBlob}
            filename={recordingFilename(outputExt)}
            label={`Download .${outputExt}`}
            onReset={handleReset}
          />
        </div>
      )}

      {recState === "idle" && (
        <div className="rounded-lg border px-4 py-3 text-xs leading-relaxed space-y-1"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          <p>🎙️ <strong style={{ color: "var(--text-secondary)" }}>Microphone permission</strong> - your browser will ask for microphone access when you click Start Recording. You can revoke this at any time in your browser settings.</p>
          <p>🔒 Your recording is processed entirely in your browser and is never uploaded to any server.</p>
        </div>
      )}
    </div>
  );
}
