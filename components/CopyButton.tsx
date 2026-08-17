"use client";

import { useState } from "react";
import clsx from "clsx";

export default function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable; silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={clsx(
        "focus-ring inline-flex items-center gap-1.5 rounded-md border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-xs font-medium text-mist-200 transition hover:border-ink-500 hover:text-mist-50 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      {copied ? (
        <>
          <CheckIcon className="text-teal-400" /> Copied
        </>
      ) : (
        <>
          <CopyIcon /> Copy
        </>
      )}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
