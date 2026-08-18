"use client";

import { useCallback, useRef, useState } from "react";

export interface DroppedFile {
  file: File;
  previewUrl: string;
}

export default function ImageDropzone({
  accept,
  onFile,
  label = "Drop image here",
}: {
  accept: string;
  onFile: (f: DroppedFile) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      onFile({ file, previewUrl });
    },
    [onFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      className="focus-ring flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition"
      style={{
        borderColor: dragging ? "var(--accent)" : "var(--border-strong)",
        backgroundColor: dragging ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "var(--bg-surface)",
      }}
      aria-label="Upload image"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-10 w-10 transition"
        style={{ color: dragging ? "var(--accent)" : "var(--text-subtle)" }}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
      <div>
        <p className="text-sm font-medium" style={{ color: dragging ? "var(--accent)" : "var(--text-secondary)" }}>
          {label}
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>or click to browse</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </button>
  );
}
