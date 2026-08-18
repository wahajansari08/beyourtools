"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { addWatermark, bytesToBlob } from "@/lib/pdf/engine";

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string; size: number; info: string | null; error: string | null; filename: string;
}

export default function PdfWatermark() {
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(25);
  const [fontSize, setFontSize] = useState(48);
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, filename: "" });
  }, [state.url]);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!text.trim()) { setState((s) => ({ ...s, status: "error", error: "Watermark text cannot be empty." })); return; }
    setState((s) => ({ ...s, status: "processing", filename: file.name }));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await addWatermark(bytes, text, { opacity: opacity / 100, fontSize });
    if (result.error || !result.bytes) { setState((s) => ({ ...s, status: "error", error: result.error ?? "Failed." })); return; }
    const blob = bytesToBlob(result.bytes!, "application/pdf");
    const url = URL.createObjectURL(blob);
    setState((s) => ({ ...s, status: "done", url, size: blob.size, info: result.info ?? null }));
  }, [text, opacity, fontSize]);

  const base = state.filename.replace(/\.pdf$/i, "");

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Adding watermark…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Watermark another PDF"
      toolbar={
        <div className="flex flex-wrap gap-3 w-full">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <label htmlFor="wm-text" className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>Text</label>
            <input id="wm-text" type="text" value={text} onChange={(e) => setText(e.target.value)}
              className="code-surface focus-ring border-0 bg-transparent px-2 py-0.5 font-mono text-[13px] w-40"
              style={{ color: "var(--text-primary)" }} />
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <label htmlFor="wm-opacity" className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>Opacity</label>
            <input id="wm-opacity" type="range" min={5} max={80} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}
              className="h-1.5 w-24 cursor-pointer accent-amber-400" />
            <span className="w-8 text-right font-mono text-xs" style={{ color: "var(--accent)" }}>{opacity}%</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <label htmlFor="wm-size" className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>Size</label>
            <input id="wm-size" type="range" min={16} max={96} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
              className="h-1.5 w-24 cursor-pointer accent-amber-400" />
            <span className="w-6 text-right font-mono text-xs" style={{ color: "var(--accent)" }}>{fontSize}</span>
          </div>
        </div>
      }
      dropzone={<PdfDropzone onFiles={handleFiles} label="Drop a PDF here" />}
      actions={state.url ? <DownloadBtn href={state.url} filename={`${base}-watermarked.pdf`} label={`Download (${formatBytes(state.size)})`} /> : null}
      result={
        <div className="rounded-lg border p-5 text-center text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
          {state.info}
        </div>
      }
    />
  );
}
