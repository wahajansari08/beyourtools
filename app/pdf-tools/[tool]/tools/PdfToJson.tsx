"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, PdfResultPanel } from "@/components/PdfToolShell";
import CopyButton from "@/components/CopyButton";
import { pdfToJson } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  output: string;
  error: string | null;
  filename: string;
}

export default function PdfToJsonTool() {
  const [state, setState] = useState<State>({ status: "idle", output: "", error: null, filename: "" });

  const reset = useCallback(() => setState({ status: "idle", output: "", error: null, filename: "" }), []);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState({ status: "processing", output: "", error: null, filename: file.name });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { output, error } = await pdfToJson(bytes);
    if (error) { setState((s) => ({ ...s, status: "error", error })); return; }
    setState((s) => ({ ...s, status: "done", output }));
  }, []);

  const blob = state.output ? new Blob([state.output], { type: "application/json" }) : null;
  const url = blob ? URL.createObjectURL(blob) : "";
  const outName = state.filename.replace(/\.pdf$/i, ".json");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Converting to JSON…"
      error={state.error}
      info={state.status === "done" ? "PDF converted to JSON." : null}
      onReset={reset}
      resetLabel="Convert another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={url ? <><DownloadBtn href={url} filename={outName} label="Download .json" /><CopyButton text={state.output} /></> : null}
      result={
        <PdfResultPanel label="JSON Output">
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-mist-200">
            {state.output}
          </pre>
        </PdfResultPanel>
      }
    />
  );
}
