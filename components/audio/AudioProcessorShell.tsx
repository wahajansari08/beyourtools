"use client";

/**
 * Shared UI shell for audio processing tools.
 * Handles: file upload → file info → process button → progress → result → download.
 * Individual tool pages pass in their processing logic via `onProcess`.
 */

import { useState, useCallback } from "react";
import AudioUploader, { type AudioFile } from "./AudioUploader";
import AudioFileInfo from "./AudioFileInfo";
import AudioPlayer from "./AudioPlayer";
import AudioProgress from "./AudioProgress";
import AudioDownload from "./AudioDownload";
import StatusBanner from "@/components/StatusBanner";

type State = "idle" | "ready" | "processing" | "done" | "error";

interface AudioProcessorShellProps {
  accept?: string;
  acceptLabel?: string;
  multiple?: false;
  /** Label for the process button */
  processLabel: string;
  /** Called when user clicks process. Returns a Blob. */
  onProcess: (file: File, onProgress: (r: number | null) => void) => Promise<Blob>;
  /** Derive output filename from original */
  outputFilename: (original: string) => string;
  outputMime: string;
  /** Optional extra controls rendered between FileInfo and Process button */
  controls?: (file: File) => React.ReactNode;
  /** Show audio player after upload */
  showPreview?: boolean;
  /** Show audio player after output */
  showOutputPreview?: boolean;
}

export default function AudioProcessorShell({
  accept,
  acceptLabel,
  processLabel,
  onProcess,
  outputFilename,
  outputMime,
  controls,
  showPreview = true,
  showOutputPreview = true,
}: AudioProcessorShellProps) {
  const [state,       setState]       = useState<State>("idle");
  const [audioFile,   setAudioFile]   = useState<AudioFile | null>(null);
  const [progress,    setProgress]    = useState<number | null>(null);
  const [outputBlob,  setOutputBlob]  = useState<Blob | null>(null);
  const [outputUrl,   setOutputUrl]   = useState<string>("");
  const [errorMsg,    setErrorMsg]    = useState<string>("");

  const handleFiles = useCallback((files: AudioFile[]) => {
    const f = files[0];
    if (!f) return;
    setAudioFile(f);
    setState("ready");
    setOutputBlob(null);
    setOutputUrl("");
    setErrorMsg("");
    setProgress(null);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!audioFile) return;
    setState("processing");
    setProgress(null);
    setErrorMsg("");
    try {
      const blob = await onProcess(audioFile.file, (r) => setProgress(r));
      const url  = URL.createObjectURL(blob);
      setOutputBlob(blob);
      setOutputUrl(url);
      setState("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Processing failed. Please try another file.";
      setErrorMsg(msg);
      setState("error");
    }
  }, [audioFile, onProcess]);

  const reset = useCallback(() => {
    if (audioFile?.objectUrl) URL.revokeObjectURL(audioFile.objectUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setAudioFile(null);
    setOutputBlob(null);
    setOutputUrl("");
    setState("idle");
    setErrorMsg("");
    setProgress(null);
  }, [audioFile, outputUrl]);

  return (
    <div className="space-y-4">
      {/* Upload -always visible when idle/ready */}
      {(state === "idle" || state === "ready") && (
        <AudioUploader
          accept={accept}
          acceptLabel={acceptLabel}
          onFiles={handleFiles}
          multiple={false}
        />
      )}

      {/* File info + preview + controls */}
      {audioFile && (state === "ready" || state === "processing") && (
        <div className="space-y-3">
          <AudioFileInfo
            name={audioFile.file.name}
            size={audioFile.file.size}
            duration={audioFile.duration}
            mime={audioFile.file.type || undefined}
          />
          {showPreview && <AudioPlayer src={audioFile.objectUrl} label={audioFile.file.name} />}
          {controls?.(audioFile.file)}
        </div>
      )}

      {/* Process button */}
      {state === "ready" && (
        <button
          type="button"
          onClick={handleProcess}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          {processLabel}
        </button>
      )}

      {/* Progress */}
      {state === "processing" && (
        <AudioProgress ratio={progress} label="Processing audio…" />
      )}

      {/* Error */}
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

      {/* Done */}
      {state === "done" && outputBlob && audioFile && (
        <div className="space-y-4">
          {showOutputPreview && outputUrl && (
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Output preview</p>
              <AudioPlayer src={outputUrl} label={outputFilename(audioFile.file.name)} />
            </div>
          )}
          <AudioDownload
            blob={outputBlob}
            filename={outputFilename(audioFile.file.name)}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}
