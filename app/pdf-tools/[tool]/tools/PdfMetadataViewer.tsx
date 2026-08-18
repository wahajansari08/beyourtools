"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { PdfResultPanel, formatBytes } from "@/components/PdfToolShell";
import { readMetadata, type PdfMetadata } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  metadata: PdfMetadata | null;
  error: string | null;
}

export default function PdfMetadataViewer() {
  const [state, setState] = useState<State>({ status: "idle", metadata: null, error: null });
  const reset = useCallback(() => setState({ status: "idle", metadata: null, error: null }), []);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState({ status: "processing", metadata: null, error: null });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { metadata, error } = await readMetadata(bytes);
    if (error) { setState((s) => ({ ...s, status: "error", error })); return; }
    setState({ status: "done", metadata, error: null });
  }, []);

  const m = state.metadata;
  const rows: [string, string | null | number | boolean][] = m ? [
    ["Title",             m.title],
    ["Author",            m.author],
    ["Subject",           m.subject],
    ["Keywords",          m.keywords],
    ["Creator",           m.creator],
    ["Producer",          m.producer],
    ["Creation Date",     m.creationDate],
    ["Modified Date",     m.modificationDate],
    ["Pages",             m.pageCount],
    ["File Size",         formatBytes(m.fileSize)],
    ["Encrypted",         m.isEncrypted ? "Yes" : "No"],
  ] : [];

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Reading metadata…"
      error={state.error}
      onReset={reset}
      resetLabel="Inspect another PDF"
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      result={
        <PdfResultPanel label="PDF Metadata">
          <table className="w-full text-[13px]">
            <tbody>
              {rows.map(([key, val]) => (
                <tr key={key} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <td className="py-1.5 pr-4 font-semibold whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{key}</td>
                  <td className="py-1.5 font-mono break-all" style={{ color: "var(--text-secondary)" }}>
                    {val !== null && val !== undefined && val !== "" ? String(val) : <span style={{ color: "var(--text-subtle)" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PdfResultPanel>
      }
    />
  );
}
