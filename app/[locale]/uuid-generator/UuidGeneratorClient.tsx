"use client";

import { useState } from "react";
import Btn from "@/components/Btn";

const inputStyle = {
  borderColor: "var(--border-strong)",
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
} as const;
const cardStyle = {
  borderColor: "var(--border)",
  backgroundColor: "var(--bg-surface)",
} as const;
const labelStyle = { color: "var(--text-muted)" } as const;
const rowStyle = {
  borderColor: "var(--border)",
  backgroundColor: "var(--bg-elevated)",
} as const;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

function formatUuid(id: string, uppercase: boolean, hyphens: boolean): string {
  let out = hyphens ? id : id.replace(/-/g, "");
  if (uppercase) out = out.toUpperCase();
  return out;
}

function UuidRow({ uuid }: { uuid: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (await copyText(uuid)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <li className="flex items-center gap-2 rounded-lg border px-3 py-2" style={rowStyle}>
      <code
        className="flex-1 truncate font-mono text-xs sm:text-sm"
        style={{ color: "var(--text-primary)" }}
        title={uuid}
      >
        {uuid}
      </code>
      <Btn variant="ghost" size="sm" onClick={handleCopy} aria-label={`Copy ${uuid}`}>
        {copied ? "Copied" : "Copy"}
      </Btn>
    </li>
  );
}

export default function UuidGeneratorClient() {
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>(() =>
    Array.from({ length: 10 }, () => formatUuid(crypto.randomUUID(), false, true))
  );
  const [allCopied, setAllCopied] = useState(false);

  function generate() {
    const n = Math.min(1000, Math.max(1, Math.floor(count) || 1));
    setCount(n);
    setUuids(Array.from({ length: n }, () => formatUuid(crypto.randomUUID(), uppercase, hyphens)));
    setAllCopied(false);
  }

  function reformat(up: boolean, hyp: boolean) {
    setUuids((prev) => prev.map((u) => formatUuid(u.replace(/-/g, "").toLowerCase().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5"), up, hyp)));
  }

  function toggleUppercase() {
    const next = !uppercase;
    setUppercase(next);
    reformat(next, hyphens);
  }

  function toggleHyphens() {
    const next = !hyphens;
    setHyphens(next);
    reformat(uppercase, next);
  }

  async function copyAll() {
    if (uuids.length === 0) return;
    if (await copyText(uuids.join("\n"))) {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={cardStyle}>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="uuid-count" className="mb-1 block text-xs font-medium" style={labelStyle}>
              How many? <span className="font-normal">(1–1000)</span>
            </label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="focus-ring w-32 rounded-lg border px-3 py-2 text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium" style={labelStyle}>
              Format
            </span>
            <div className="flex gap-2">
              <Btn variant="toggle" size="sm" selected={uppercase} onClick={toggleUppercase}>
                Uppercase
              </Btn>
              <Btn variant="toggle" size="sm" selected={hyphens} onClick={toggleHyphens}>
                Hyphens
              </Btn>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="primary" onClick={generate}>
            Generate
          </Btn>
          <Btn variant="secondary" onClick={copyAll} disabled={uuids.length === 0}>
            {allCopied ? "Copied all" : "Copy All"}
          </Btn>
        </div>
      </div>

      {uuids.length > 0 && (
        <ul className="space-y-2">
          {uuids.map((u, i) => (
            <UuidRow key={`${u}-${i}`} uuid={u} />
          ))}
        </ul>
      )}

      <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
        Version 4 UUIDs generated with crypto.randomUUID(). Real cryptographic randomness, one per line for
        easy pasting. Everything happens locally in your browser.
      </p>
    </div>
  );
}
