"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, PdfResultPanel } from "@/components/PdfToolShell";
import CopyButton from "@/components/CopyButton";
import { extractTextFromBytes } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  text: string;
  error: string | null;
  filename: string;
}

export default function PdfToText() {
  const [state, setState] = useState<State>({ status: "idle", text: "", error: null, filename: "" });

  const reset = useCallback(() => setState({ status: "idle", text: "", error: null, filename: "" }), []);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState({ status: "processing", text: "", error: null, filename: file.name });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { text, error } = extractTextFromBytes(bytes);
    if (error) { setState((s) => ({ ...s, status: "error", error })); return; }
    setState((s) => ({ ...s, status: "done", text }));
  }, []);

  const blob = state.text ? new Blob([state.text], { type: "text/plain" }) : null;
  const url = blob ? URL.createObjectURL(blob) : "";
  const outName = state.filename.replace(/\.pdf$/i, ".txt");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Extracting text…"
      error={state.error}
      info={state.status === "done" ? `Extracted ${state.text.length.toLocaleString()} characters.` : null}
      onReset={reset}
      resetLabel="Extract from another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={url ? <><DownloadBtn href={url} filename={outName} label="Download .txt" /><CopyButton text={state.text} /></> : null}
      result={
        <PdfResultPanel label="Extracted Text">
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-mist-200">
            {state.text}
          </pre>
        </PdfResultPanel>
      }
    />
  );
}
