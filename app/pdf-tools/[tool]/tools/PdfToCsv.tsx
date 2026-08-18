"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, PdfResultPanel } from "@/components/PdfToolShell";
import CopyButton from "@/components/CopyButton";
import { pdfToCsvProper } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  output: string;
  error: string | null;
  filename: string;
}

export default function PdfToCsv() {
  const [state, setState] = useState<State>({ status: "idle", output: "", error: null, filename: "" });

  const reset = useCallback(() => setState({ status: "idle", output: "", error: null, filename: "" }), []);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState({ status: "processing", output: "", error: null, filename: file.name });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { output, error } = await pdfToCsvProper(bytes);
    if (error) { setState((s) => ({ ...s, status: "error", error })); return; }
    setState((s) => ({ ...s, status: "done", output }));
  }, []);

  const blob = state.output ? new Blob([state.output], { type: "text/csv" }) : null;
  const url = blob ? URL.createObjectURL(blob) : "";
  const outName = state.filename.replace(/\.pdf$/i, ".csv");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Extracting to CSV…"
      error={state.error}
      info={state.status === "done" ? "Extracted to CSV." : null}
      onReset={reset}
      resetLabel="Convert another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={url ? <><DownloadBtn href={url} filename={outName} label="Download .csv" /><CopyButton text={state.output} /></> : null}
      result={
        <PdfResultPanel label="CSV Output">
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {state.output}
          </pre>
        </PdfResultPanel>
      }
    />
  );
}
