"use client";

import { useEffect, useRef, useState } from "react";
import Btn from "@/components/Btn";

// MD5-START
/** Compact incremental MD5 (RFC 1321). Web Crypto has no MD5, so this pure-JS version fills the gap. */
class MD5 {
  private a = 0x67452301;
  private b = 0xefcdab89;
  private c = 0x98badcfe;
  private d = 0x10325476;
  private buf = new Uint8Array(64);
  private bufLen = 0;
  private bitLo = 0;
  private bitHi = 0;

  private static K = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ];

  private static S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  private static rotl(v: number, n: number): number {
    return (v << n) | (v >>> (32 - n));
  }

  private transform(block: Uint8Array): void {
    const dv = new DataView(block.buffer, block.byteOffset, 64);
    const X = new Array<number>(16);
    for (let i = 0; i < 16; i++) X[i] = dv.getUint32(i * 4, true);

    let a = this.a;
    let b = this.b;
    let c = this.c;
    let d = this.d;

    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      f = (f + a + MD5.K[i] + X[g]) | 0;
      a = d;
      d = c;
      c = b;
      b = (b + MD5.rotl(f, MD5.S[i])) | 0;
    }

    this.a = (this.a + a) | 0;
    this.b = (this.b + b) | 0;
    this.c = (this.c + c) | 0;
    this.d = (this.d + d) | 0;
  }

  update(data: Uint8Array): void {
    const bits = data.length * 8;
    const newLo = this.bitLo + bits;
    this.bitHi = (this.bitHi + Math.floor(newLo / 4294967296)) >>> 0;
    this.bitLo = newLo >>> 0;

    let off = 0;
    if (this.bufLen > 0) {
      const take = Math.min(64 - this.bufLen, data.length);
      this.buf.set(data.subarray(0, take), this.bufLen);
      this.bufLen += take;
      off = take;
      if (this.bufLen === 64) {
        this.transform(this.buf);
        this.bufLen = 0;
      }
    }
    while (off + 64 <= data.length) {
      this.transform(data.subarray(off, off + 64));
      off += 64;
    }
    if (off < data.length) {
      this.buf.set(data.subarray(off), 0);
      this.bufLen = data.length - off;
    }
  }

  /** Finalize and return the 32-char lowercase hex digest. The instance is spent afterwards. */
  digest(): string {
    // The appended length is the ORIGINAL message length - capture it before padding.
    const msgLo = this.bitLo;
    const msgHi = this.bitHi;
    const padLen = this.bufLen < 56 ? 56 - this.bufLen : 120 - this.bufLen;
    const pad = new Uint8Array(padLen);
    pad[0] = 0x80;
    this.update(pad);

    const lenBlock = new Uint8Array(8);
    const ldv = new DataView(lenBlock.buffer);
    ldv.setUint32(0, msgLo, true);
    ldv.setUint32(4, msgHi, true);
    this.update(lenBlock);

    const out = new Uint8Array(16);
    const odv = new DataView(out.buffer);
    odv.setUint32(0, this.a >>> 0, true);
    odv.setUint32(4, this.b >>> 0, true);
    odv.setUint32(8, this.c >>> 0, true);
    odv.setUint32(12, this.d >>> 0, true);
    return Array.from(out)
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  }
}
// MD5-END

// ── UI below ────────────────────────────────────────────────────────────────

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

interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

const ALGOS: { key: keyof Hashes; label: string; webcrypto: string | null }[] = [
  { key: "md5", label: "MD5", webcrypto: null },
  { key: "sha1", label: "SHA-1", webcrypto: "SHA-1" },
  { key: "sha256", label: "SHA-256", webcrypto: "SHA-256" },
  { key: "sha384", label: "SHA-384", webcrypto: "SHA-384" },
  { key: "sha512", label: "SHA-512", webcrypto: "SHA-512" },
];

function hexOf(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function HashRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (await copyText(value)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="rounded-lg border p-3" style={rowStyle}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>
          {label}
        </span>
        <Btn variant="ghost" size="sm" onClick={handleCopy} aria-label={`Copy ${label} hash`}>
          {copied ? "Copied" : "Copy"}
        </Btn>
      </div>
      <code
        className="mt-1 block break-all font-mono text-xs leading-relaxed sm:text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </code>
    </div>
  );
}

/**
 * Hash chunks of bytes with all five algorithms.
 * MD5 is fed incrementally; the SHA family uses Web Crypto over the concatenated bytes.
 * Reads are chunked so large files never sit as one giant string in memory.
 */
async function hashChunks(chunks: Uint8Array[], totalLen: number): Promise<Hashes> {
  const md5 = new MD5();
  for (const c of chunks) md5.update(c);
  const md5Hex = md5.digest();

  const all = new Uint8Array(totalLen);
  let off = 0;
  for (const c of chunks) {
    all.set(c, off);
    off += c.length;
  }
  const [s1, s256, s384, s512] = await Promise.all([
    crypto.subtle.digest("SHA-1", all),
    crypto.subtle.digest("SHA-256", all),
    crypto.subtle.digest("SHA-384", all),
    crypto.subtle.digest("SHA-512", all),
  ]);
  return { md5: md5Hex, sha1: hexOf(s1), sha256: hexOf(s256), sha384: hexOf(s384), sha512: hexOf(s512) };
}

export default function HashGeneratorClient() {
  const [tab, setTab] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [hashes, setHashes] = useState<Hashes | null>(null);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [expected, setExpected] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const runId = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const subtleOK = typeof crypto !== "undefined" && !!crypto.subtle;

  // Text tab: hash as you type (debounced)
  useEffect(() => {
    if (tab !== "text") return;
    setError("");
    if (!text) {
      setHashes(null);
      return;
    }
    const id = runId.current + 1;
    runId.current = id;
    const t = setTimeout(async () => {
      try {
        const bytes = new TextEncoder().encode(text);
        const h = await hashChunks([bytes], bytes.length);
        if (runId.current === id) setHashes(h);
      } catch (e) {
        if (runId.current === id) setError(e instanceof Error ? e.message : "Hashing failed.");
      }
    }, 350);
    return () => clearTimeout(t);
  }, [text, tab]);

  async function hashFile(file: File) {
    const id = runId.current + 1;
    runId.current = id;
    setError("");
    setHashes(null);
    setFileName(file.name);
    setFileSize(file.size);
    setComputing(true);
    try {
      const reader = file.stream().getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (runId.current !== id) {
          reader.cancel();
          return;
        }
        chunks.push(value);
        total += value.length;
      }
      const h = await hashChunks(chunks, total);
      if (runId.current === id) setHashes(h);
    } catch (e) {
      if (runId.current === id)
        setError(e instanceof Error ? e.message : "Could not read that file.");
    } finally {
      if (runId.current === id) setComputing(false);
    }
  }

  function onFileChosen(f: File | null | undefined) {
    if (f) void hashFile(f);
  }

  const shown: Hashes | null = hashes
    ? uppercase
      ? {
          md5: hashes.md5.toUpperCase(),
          sha1: hashes.sha1.toUpperCase(),
          sha256: hashes.sha256.toUpperCase(),
          sha384: hashes.sha384.toUpperCase(),
          sha512: hashes.sha512.toUpperCase(),
        }
      : hashes
    : null;

  return (
    <div className="space-y-5">
      {!subtleOK && (
        <p role="alert" className="text-sm font-medium" style={{ color: "var(--coral)" }}>
          Web Crypto is unavailable in this context (it needs HTTPS or localhost), so the SHA hashes can&apos;t
          be computed here.
        </p>
      )}

      <div className="flex gap-2">
        <Btn variant="toggle" size="sm" selected={tab === "text"} onClick={() => setTab("text")}>
          Text
        </Btn>
        <Btn variant="toggle" size="sm" selected={tab === "file"} onClick={() => setTab("file")}>
          File
        </Btn>
      </div>

      <div className="rounded-xl border p-5 space-y-4" style={cardStyle}>
        {tab === "text" ? (
          <div>
            <label htmlFor="hash-text" className="mb-1 block text-xs font-medium" style={labelStyle}>
              Text to hash
            </label>
            <textarea
              id="hash-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Type or paste text; hashes compute as you type…"
              spellCheck={false}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm font-mono"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        ) : (
          <div>
            <span className="mb-1 block text-xs font-medium" style={labelStyle}>
              File to hash <span className="font-normal">(read locally, never uploaded)</span>
            </span>
            <label
              htmlFor="hash-file"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                onFileChosen(e.dataTransfer.files?.[0]);
              }}
              className="focus-ring block cursor-pointer rounded-lg border-2 border-dashed px-6 py-10 text-center transition"
              style={{
                borderColor: dragOver ? "var(--accent)" : "var(--border-strong)",
                backgroundColor: dragOver
                  ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                  : "var(--bg-elevated)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Drop a file here, or click to browse
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
                Large files are streamed through the hash in chunks.
              </p>
              <input
                id="hash-file"
                ref={fileInput}
                type="file"
                className="sr-only"
                onChange={(e) => {
                  onFileChosen(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {fileName && (
              <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                {fileName} ({(fileSize / 1024).toLocaleString("en-US", { maximumFractionDigits: 1 })} KB)
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Btn variant="toggle" size="sm" selected={uppercase} onClick={() => setUppercase((u) => !u)}>
            Uppercase
          </Btn>
          {tab === "file" && fileName && (
            <Btn variant="secondary" size="sm" onClick={() => fileInput.current?.click()}>
              Choose another file
            </Btn>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      {computing && (
        <div className="rounded-xl border p-5 text-center" style={cardStyle}>
          <p className="text-sm font-medium" style={{ color: "var(--accent-text)" }}>
            Computing hashes…
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
            Streaming the file through all five algorithms.
          </p>
        </div>
      )}

      {/* Verify against an expected checksum */}
      <div className="rounded-xl border p-5 space-y-3" style={cardStyle}>
        <div>
          <label htmlFor="hash-expected" className="mb-1 block text-xs font-medium" style={labelStyle}>
            Expected hash <span className="font-normal">(optional - paste the checksum you were given to verify a download)</span>
          </label>
          <input
            id="hash-expected"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
            spellCheck={false}
            autoComplete="off"
            className="focus-ring w-full rounded-lg border px-3 py-2 text-sm font-mono"
            style={inputStyle}
          />
        </div>
        {expected.trim() && shown && !computing && (
          (() => {
            const want = expected.trim().toLowerCase();
            const hit = ALGOS.find((a) => shown[a.key].toLowerCase() === want);
            return hit ? (
              <p role="status" className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium" style={{ borderColor: "var(--accent)", backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent-text)" }}>
                <span aria-hidden="true">✓</span> Match - identical to the computed {hit.label} hash.
              </p>
            ) : (
              <p role="status" className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium" style={{ borderColor: "var(--coral)", backgroundColor: "color-mix(in srgb, var(--coral) 8%, transparent)", color: "var(--coral)" }}>
                <span aria-hidden="true">✕</span> No match - none of the five hashes equal the expected value. The input may be corrupted or incomplete.
              </p>
            );
          })()
        )}
      </div>

      {shown && !computing && (
        <div className="space-y-3">
          {ALGOS.map((a) => (
            <HashRow key={a.key} label={a.label} value={shown[a.key]} />
          ))}
        </div>
      )}
    </div>
  );
}
