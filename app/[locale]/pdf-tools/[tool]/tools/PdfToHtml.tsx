"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, PdfResultPanel } from "@/components/PdfToolShell";
import CopyButton from "@/components/CopyButton";
import { pdfToHtml } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  output: string;
  error: string | null;
  filename: string;
}

export default function PdfToHtml() {
  const [state, setState] = useState<State>({ status: "idle", output: "", error: null, filename: "" });
  const reset = useCallback(() => setState({ status: "idle", output: "", error: null, filename: "" }), []);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState({ status: "processing", output: "", error: null, filename: file.name });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { output, error } = await pdfToHtml(bytes);
    if (error) { setState((s) => ({ ...s, status: "error", error })); return; }
    setState((s) => ({ ...s, status: "done", output }));
  }, []);

  const blob = state.output ? new Blob([state.output], { type: "text/html" }) : null;
  const url = blob ? URL.createObjectURL(blob) : "";
  const outName = state.filename.replace(/\.pdf$/i, ".html");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Converting to HTML…"
      error={state.error}
      info={state.status === "done" ? "HTML document generated." : null}
      onReset={reset}
      resetLabel="Convert another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={url ? <><DownloadBtn href={url} filename={outName} label="Download .html" /><CopyButton text={state.output} /></> : null}
      result={
        <PdfResultPanel label="HTML Output">
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {state.output}
          </pre>
        </PdfResultPanel>
      }
    />
  );
}
