"use client";

import { useState } from "react";
import Btn from "@/components/Btn";

const MAX_COUNT = 1000;

/**
 * Cryptographically secure uniform integer in [min, max], using
 * rejection sampling to eliminate modulo bias. Never Math.random.
 */
function secureInt(min: number, max: number): number {
  const range = max - min + 1;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x > limit);
  return min + (x % range);
}

export default function RandomNumberGeneratorClient() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sorted, setSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    setError("");
    setCopied(false);
    const lo = parseInt(min, 10);
    const hi = parseInt(max, 10);
    const n = parseInt(count, 10);

    if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
      setError("Enter valid integers for the minimum and maximum.");
      return;
    }
    if (lo > hi) {
      setError("The minimum must be less than or equal to the maximum.");
      return;
    }
    if (!Number.isFinite(n) || n < 1 || n > MAX_COUNT) {
      setError(`Count must be between 1 and ${MAX_COUNT}.`);
      return;
    }
    const range = hi - lo + 1;
    if (!allowDuplicates && n > range) {
      setError(
        `You asked for ${n} unique numbers, but the range ${lo} to ${hi} only holds ${range}. Widen the range or allow duplicates.`
      );
      return;
    }

    const drawn: number[] = [];
    if (allowDuplicates) {
      for (let i = 0; i < n; i++) drawn.push(secureInt(lo, hi));
    } else {
      const seen = new Set<number>();
      while (seen.size < n) seen.add(secureInt(lo, hi));
      drawn.push(...seen);
    }
    if (sorted) drawn.sort((a, b) => a - b);
    setResults(drawn);
  }

  async function copy() {
    if (results.length === 0) return;
    try {
      await navigator.clipboard.writeText(results.join(", "));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not access the clipboard in this browser.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="rng-min" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Minimum
            </label>
            <input
              id="rng-min"
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label htmlFor="rng-max" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Maximum
            </label>
            <input
              id="rng-max"
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label htmlFor="rng-count" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              How many
            </label>
            <input
              id="rng-count"
              type="number"
              min={1}
              max={MAX_COUNT}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
            Allow duplicates
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
            Sort results
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Btn variant="primary" onClick={generate}>Generate</Btn>
          <Btn variant="secondary" onClick={copy} disabled={results.length === 0}>
            {copied ? "Copied!" : "Copy results"}
          </Btn>
        </div>

        {error && (
          <p className="mt-3 text-sm" role="alert" style={{ color: "var(--color-danger, #e5484d)" }}>
            {error}
          </p>
        )}
      </div>

      {results.length > 0 && (
        <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }} aria-live="polite">
          <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Results ({results.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {results.map((r, i) => (
              <span
                key={i}
                className="rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              >
                {r.toLocaleString("en-US")}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--text-subtle)" }}>
            Generated with crypto.getRandomValues (cryptographic randomness), not Math.random.
          </p>
        </div>
      )}
    </div>
  );
}
