"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { protectPdf, bytesToBlob } from "@/lib/pdf/engine";
import Btn from "@/components/Btn";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; size: number; info: string | null; error: string | null; filename: string;
}

export default function ProtectPdf() {
  const [password, setPassword] = useState("");
  const [owner, setOwner] = useState("");
  const [show, setShow] = useState(false);
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!password) { setState((s) => ({ ...s, status: "error", error: "Enter a user password first." })); return; }
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await protectPdf(bytes, password, owner || undefined);
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Failed." })); return; }
    setState((s) => ({ ...s, status: "done", url: URL.createObjectURL(bytesToBlob(result.bytes!, "application/pdf")), size: result.bytes!.length, info: result.info ?? null }));
  }, [password, owner]);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Encrypting PDF…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Protect another PDF"
      toolbar={
        <div className="flex flex-wrap gap-3 w-full">
          {[
            { id: "user-pw", label: "User password *", value: password, set: setPassword, placeholder: "Required - to open the PDF" },
            { id: "owner-pw", label: "Owner password", value: owner, set: setOwner, placeholder: "Optional - to edit/print" },
          ].map(({ id, label, value, set, placeholder }) => (
            <div key={id} className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <label htmlFor={id} className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>{label}</label>
              <input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                className="code-surface focus-ring border-0 bg-transparent px-2 py-0.5 font-mono text-[13px] w-44"
                style={{ color: "var(--text-primary)" }} />
            </div>
          ))}
          <Btn variant="secondary" size="sm" onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"} passwords</Btn>
        </div>
      }
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" sublabel="Set passwords above, then drop the PDF" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-protected.pdf`} label={`Download (${formatBytes(state.size)})`} /> : null}
      result={<div className="rounded-lg border p-5 text-center text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>{state.info}</div>}
    />
  );
}
