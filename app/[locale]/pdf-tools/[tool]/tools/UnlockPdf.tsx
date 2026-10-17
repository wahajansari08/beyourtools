"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { unlockPdf, bytesToBlob } from "@/lib/pdf/engine";
import Btn from "@/components/Btn";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; size: number; info: string | null; error: string | null; filename: string;
}

export default function UnlockPdf() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!password) { setState((s) => ({ ...s, status: "error", error: "Enter the PDF password first." })); return; }
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await unlockPdf(bytes, password);
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Failed." })); return; }
    setState((s) => ({ ...s, status: "done", url: URL.createObjectURL(bytesToBlob(result.bytes!, "application/pdf")), size: result.bytes!.length, info: result.info ?? null }));
  }, [password]);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Removing password…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Unlock another PDF"
      toolbar={
      <div className="flex items-center gap-3 rounded-lg border px-4 py-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <label htmlFor="unlock-pw" className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>PDF password</label>
          <input id="unlock-pw" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter current password"
            className="code-surface focus-ring flex-1 border-0 bg-transparent px-2 py-0.5 font-mono text-[13px]"
            style={{ color: "var(--text-primary)" }} />
          <Btn variant="ghost" size="sm" className="shrink-0" onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}</Btn>
        </div>
      }
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a protected PDF here" sublabel="Enter the password above, then drop the PDF" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-unlocked.pdf`} label={`Download (${formatBytes(state.size)})`} /> : null}
      result={<div className="rounded-lg border p-5 text-center text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>{state.info}</div>}
    />
  );
}
