"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import SegmentedControl from "@/components/SegmentedControl";
import { rotatePdf, bytesToBlob } from "@/lib/pdf/engine";

type Deg = "90" | "180" | "270";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; size: number; info: string | null; error: string | null; filename: string;
}

export default function RotatePdf() {
  const [deg, setDeg] = useState<Deg>("90");
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await rotatePdf(bytes, Number(deg) as 90 | 180 | 270);
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Failed." })); return; }
    const blob = bytesToBlob(result.bytes!, "application/pdf");
    const url = URL.createObjectURL(blob);
    setState((s) => ({ ...s, status: "done", url, size: blob.size, info: result.info ?? null }));
  }, [deg]);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Rotating pages…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Rotate another PDF"
      toolbar={
        <SegmentedControl
          label="Rotation"
          value={deg}
          onChange={setDeg}
          options={[{ value: "90", label: "90° CW" }, { value: "180", label: "180°" }, { value: "270", label: "90° CCW" }]}
        />
      }
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-rotated.pdf`} label={`Download (${formatBytes(state.size)})`} /> : null}
      result={<div className="rounded-lg border p-5 text-center text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>{state.info}</div>}
    />
  );
}
