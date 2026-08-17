"use client";

import { useRef, useState, useCallback } from "react";
import clsx from "clsx";

interface Props {
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
  onFiles: (files: File[]) => void;
}

export default function PdfDropzone({
  accept = ".pdf,application/pdf",
  multiple = false,
  label = "Drop PDF here",
  sublabel,
  onFiles,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFiles(Array.from(files));
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFiles]
  );

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      className={clsx(
        "focus-ring flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition",
        dragging
          ? "border-amber-400 bg-amber-400/5"
          : "border-ink-600 bg-ink-900 hover:border-ink-500 hover:bg-ink-800"
      )}
      aria-label="Upload file"
    >
      {/* PDF icon */}
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>

      <div>
        <p className={clsx("text-sm font-medium", dragging ? "text-amber-400" : "text-mist-200")}>{label}</p>
        <p className="mt-1 text-xs text-mist-400">{sublabel ?? (multiple ? "or click to browse (multiple files)" : "or click to browse")}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handle(e.target.files)}
        aria-hidden="true"
        tabIndex={-1}
      />
    </button>
  );
}
