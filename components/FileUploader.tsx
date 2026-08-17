"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

export default function FileUploader({
  onFileText,
  accept = ".json,.txt,.csv,.yaml,.yml,.xml,.jsonl",
  className,
}: {
  onFileText: (text: string, filename: string) => void;
  accept?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => onFileText(String(reader.result ?? ""), file.name);
    reader.readAsText(file);
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-md border border-dashed px-2.5 py-1.5 text-xs transition",
        dragging ? "border-amber-400 bg-amber-400/5 text-amber-400" : "border-ink-600 text-mist-300 hover:border-ink-500 hover:text-mist-100",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) readFile(file);
      }}
    >
      <button
        type="button"
        className="focus-ring inline-flex items-center gap-1.5 font-medium"
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon />
        Upload file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}
