"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Btn from "@/components/Btn";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
const AMBIGUOUS = "0O1lI|`'\"";

function strengthLabel(bits: number): string {
  if (bits < 60) return "Weak";
  if (bits < 80) return "OK";
  if (bits < 100) return "Strong";
  return "Excellent";
}

/**
 * Uniform random index in [0, max) using crypto.getRandomValues with
 * rejection sampling (no modulo bias). Never Math.random().
 */
function secureIndex(max: number): number {
  const buf = new Uint32Array(1);
  const range = 0xffffffff;
  const limit = Math.floor((range + 1) / max) * max;
  let v: number;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= limit);
  return v % max;
}

export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [quantity, setQuantity] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pool = useMemo(() => {
    const strip = (s: string) =>
      excludeAmbiguous ? s.split("").filter((c) => !AMBIGUOUS.includes(c)).join("") : s;
    const sets = [
      upper ? strip(UPPER) : "",
      lower ? strip(LOWER) : "",
      digits ? strip(DIGITS) : "",
      symbols ? strip(SYMBOLS) : "",
    ];
    return { sets: sets.filter((s) => s.length > 0), combined: sets.join("") };
  }, [upper, lower, digits, symbols, excludeAmbiguous]);

  const entropyBits = useMemo(
    () => (pool.combined.length > 0 ? length * Math.log2(pool.combined.length) : 0),
    [pool, length]
  );

  const generate = useCallback(() => {
    setError(null);
    setCopiedIdx(null);
    if (pool.combined.length === 0) {
      setError("Select at least one character set.");
      setPasswords([]);
      return;
    }
    const out: string[] = [];
    for (let q = 0; q < quantity; q++) {
      // Guarantee at least one char from each selected set (shuffled in).
      const chars: string[] = pool.sets.map((s) => s[secureIndex(s.length)]);
      for (let i = chars.length; i < length; i++) {
        chars.push(pool.combined[secureIndex(pool.combined.length)]);
      }
      // Fisher-Yates with secure randomness
      for (let i = chars.length - 1; i > 0; i--) {
        const j = secureIndex(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      out.push(chars.join(""));
    }
    setPasswords(out);
  }, [pool, length, quantity]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyOne = async (pw: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(pw);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = pw;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedIdx(idx);
    window.setTimeout(() => setCopiedIdx((c) => (c === idx ? null : c)), 1600);
  };

  const strength = strengthLabel(entropyBits);
  const meterPct = Math.min(100, (entropyBits / 128) * 100);

  const toggleLabel = (name: string, on: boolean) => `${name}: ${on ? "on" : "off"}`;

  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      {/* Length */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="pw-length" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Password length
          </label>
          <span className="rounded-md px-2 py-0.5 text-sm font-semibold" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent-text)" }}>
            {length}
          </span>
        </div>
        <input
          id="pw-length"
          type="range"
          min={4}
          max={128}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="focus-ring w-full"
          style={{ accentColor: "var(--accent)" }}
          aria-valuetext={`${length} characters`}
        />
        <div className="mt-1 flex justify-between text-[11px]" style={{ color: "var(--text-subtle)" }}>
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      {/* Character sets */}
      <div className="mb-5">
        <p className="mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Character sets
        </p>
        <div className="flex flex-wrap gap-2">
          <Btn variant="toggle" size="sm" selected={upper} onClick={() => setUpper((v) => !v)} aria-label={toggleLabel("Uppercase", upper)}>
            ABC
          </Btn>
          <Btn variant="toggle" size="sm" selected={lower} onClick={() => setLower((v) => !v)} aria-label={toggleLabel("Lowercase", lower)}>
            abc
          </Btn>
          <Btn variant="toggle" size="sm" selected={digits} onClick={() => setDigits((v) => !v)} aria-label={toggleLabel("Numbers", digits)}>
            123
          </Btn>
          <Btn variant="toggle" size="sm" selected={symbols} onClick={() => setSymbols((v) => !v)} aria-label={toggleLabel("Symbols", symbols)}>
            #&amp;!
          </Btn>
          <Btn
            variant="toggle"
            size="sm"
            selected={excludeAmbiguous}
            onClick={() => setExcludeAmbiguous((v) => !v)}
            aria-label={toggleLabel("Exclude ambiguous characters like 0 O 1 l I", excludeAmbiguous)}
          >
            No 0O1lI
          </Btn>
        </div>
      </div>

      {/* Quantity + generate */}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="pw-qty" className="mb-1 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            How many
          </label>
          <input
            id="pw-qty"
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="focus-ring w-24 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </div>
        <Btn variant="primary" onClick={generate}>
          Generate passwords
        </Btn>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-medium" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      {/* Strength meter */}
      {passwords.length > 0 && (
        <div className="mb-5 rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span style={{ color: "var(--text-muted)" }}>Entropy</span>
            <span className="font-semibold" style={{ color: "var(--accent-text)" }}>
              {entropyBits.toFixed(0)} bits · {strength}
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--bg-page)" }}
            role="progressbar"
            aria-valuenow={Math.round(entropyBits)}
            aria-valuemin={0}
            aria-valuemax={128}
            aria-label={`Password strength: ${strength}, ${entropyBits.toFixed(0)} bits of entropy`}
          >
            <div className="h-full rounded-full transition-all" style={{ width: `${meterPct}%`, backgroundColor: "var(--accent)" }} />
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "var(--text-subtle)" }}>
            bits = length × log₂(pool size). 80+ bits is strong; 100+ is excellent.
          </p>
        </div>
      )}

      {/* Results */}
      {passwords.length > 0 && (
        <ul className="space-y-2">
          {passwords.map((pw, i) => (
            <li
              key={`${i}-${pw.slice(0, 8)}`}
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
            >
              <code className="min-w-0 flex-1 break-all text-sm" style={{ color: "var(--text-primary)" }}>
                {pw}
              </code>
              <Btn variant="secondary" size="sm" onClick={() => copyOne(pw, i)} aria-label={`Copy password ${i + 1}`}>
                {copiedIdx === i ? "Copied" : "Copy"}
              </Btn>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
