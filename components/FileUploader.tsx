"use client";

import { useRef } from "react";

export default function FileUploader({
  onFileText,
  accept = ".json,application/json,text/plain",
}: {
  onFileText: (text: string) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onFileText(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="focus-ring flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-medium transition"
        style={{
          borderColor: "var(--border-strong)",
          backgroundColor: "var(--bg-elevated)",
          color: "var(--text-muted)",
        }}
        aria-label="Upload file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V7H2.75a.75.75 0 0 0 0 1.5H7.25v4.25a.75.75 0 0 0 1.5 0V8.5h4.25a.75.75 0 0 0 0-1.5H8.75V2.75Z" />
        </svg>
        Upload
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}
