"use client";

import { useState, useCallback } from "react";
import BarcodeResultBox from "@/components/barcode/BarcodeResultBox";
import StatusBanner from "@/components/StatusBanner";

type State = "idle" | "decoding" | "done" | "error";

export default function BarcodeDecoderClient() {
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState("");
  const [format, setFormat] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const decode = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, WebP, etc.).");
      setState("error");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setState("decoding");
    setError("");
    try {
      const { decodeBarcodeFromFile } = await import("@/lib/barcode-decode");
      const res = await decodeBarcodeFromFile(file);
      setResult(res.text);
      setFormat(res.format);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No barcode detected in this image.");
      setState("error");
    }
  }, []);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setState("idle");
    setResult("");
    setFormat("");
    setError("");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) decode(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) decode(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-5">
      {state === "idle" && (
        <label
          htmlFor="bc-file-input"
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition"
          style={{
            borderColor: dragging ? "var(--accent)" : "var(--border-strong)",
            backgroundColor: dragging ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "var(--bg-surface)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={1.5} className="h-12 w-12" aria-hidden="true"
            style={{ color: dragging ? "var(--accent)" : "var(--text-subtle)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            <p className="text-sm font-medium" style={{ color: dragging ? "var(--accent)" : "var(--text-secondary)" }}>
              Drop a barcode image here
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
              or click to browse - PNG, JPG, WebP supported
            </p>
          </div>
          <input id="bc-file-input" type="file" accept="image/*" className="sr-only"
            onChange={onFileChange} tabIndex={-1} aria-hidden="true" />
        </label>
      )}

      {state === "decoding" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-12"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Uploaded barcode" className="max-h-48 max-w-full rounded object-contain"
              style={{ opacity: 0.6 }} />
          )}
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Detecting barcode…</p>
          </div>
        </div>
      )}

      {(state === "done" || state === "error") && (
        <div className="space-y-4">
          {preview && (
            <div className="flex justify-center rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Uploaded barcode" className="max-h-56 max-w-full rounded object-contain" />
            </div>
          )}
          {state === "done" && (
            <BarcodeResultBox value={result} format={format} onReset={reset} />
          )}
          {state === "error" && (
            <div className="space-y-3">
              <StatusBanner type="error" message={error} />
              <button type="button" onClick={reset}
                className="focus-ring rounded-lg border px-5 py-2 text-sm font-medium transition"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                Try another image
              </button>
            </div>
          )}
        </div>
      )}

      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 Images are decoded locally in your browser and never uploaded to any server.
      </p>
    </div>
  );
}
