"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";

export interface DroppedFile {
  file: File;
  previewUrl: string;
}

export default function ImageDropzone({
  accept,
  onFile,
  label = "Drop image here",
}: {
  accept: string;          // e.g. "image/jpeg,image/png"
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
    // Reset so re-selecting the same file fires again
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={clsx(
        "focus-ring flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition",
        dragging
          ? "border-amber-400 bg-amber-400/5"
          : "border-ink-600 bg-ink-900 hover:border-ink-500 hover:bg-ink-800"
      )}
      aria-label="Upload image"
    >
      {/* Upload icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className={clsx("h-10 w-10 transition", dragging ? "text-amber-400" : "text-mist-400")}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>

      <div>
        <p className={clsx("text-sm font-medium", dragging ? "text-amber-400" : "text-mist-200")}>
          {label}
        </p>
        <p className="mt-1 text-xs text-mist-400">or click to browse</p>
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
