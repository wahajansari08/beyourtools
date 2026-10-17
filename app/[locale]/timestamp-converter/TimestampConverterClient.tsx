"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";
import CopyButton from "@/components/CopyButton";

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function relativeTime(targetMs: number): string {
  const diffSec = Math.round((targetMs - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 5) return "just now";
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  for (const [unit, secs] of units) {
    if (abs >= secs || unit === "second") {
      return RELATIVE_FORMATTER.format(Math.round(diffSec / secs), unit);
    }
  }
  return "just now";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          {label}
        </p>
        <p className="mt-0.5 break-all font-mono text-[13px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {value}
        </p>
      </div>
      <div className="shrink-0">
        <CopyButton text={value} />
      </div>
    </div>
  );
}

export default function TimestampConverterClient() {
  const [input, setInput] = useState("");
  const [reverseInput, setReverseInput] = useState("");

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed === "") return { ms: null as number | null, error: null as string | null };
    if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
      return { ms: null, error: "Enter a plain number, e.g. 1729185600 or 1729185600000." };
    }
    const n = Number(trimmed);
    if (!Number.isFinite(n)) {
      return { ms: null, error: "That number is out of range." };
    }
    // Auto-detect: values below 1e12 are seconds, anything larger is milliseconds.
    const ms = Math.round(Math.abs(n) < 1e12 ? n * 1000 : n);
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) {
      return { ms: null, error: "That number is not a valid date." };
    }
    return { ms, error: null };
  }, [input]);

  const reverse = useMemo(() => {
    if (reverseInput === "") return null;
    const date = new Date(reverseInput);
    if (Number.isNaN(date.getTime())) return null;
    const ms = date.getTime();
    return { seconds: String(Math.floor(ms / 1000)), ms: String(ms) };
  }, [reverseInput]);

  const now = () => {
    const seconds = Math.floor(Date.now() / 1000);
    setInput(String(seconds));
  };

  const date = parsed.ms !== null ? new Date(parsed.ms) : null;

  return (
    <div className="space-y-8">
      {/* Timestamp -> date */}
      <section aria-label="Timestamp to date">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a Unix timestamp - 1729185600 or 1729185600000"
            spellCheck={false}
            className="focus-ring w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm"
            style={{
              borderColor: parsed.error ? "var(--coral)" : "var(--border-strong)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-primary)",
            }}
          />
          <Btn variant="primary" onClick={now} className="shrink-0">
            Now
          </Btn>
        </div>
        <p className="mt-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          Leave empty and press Now for the current time. Seconds or milliseconds are detected automatically.
        </p>

        {parsed.error && (
          <div
            role="alert"
            className="mt-3 rounded-lg border px-3.5 py-3 text-xs"
            style={{ borderColor: "var(--coral)", backgroundColor: "color-mix(in srgb, var(--coral) 8%, transparent)", color: "var(--text-primary)" }}
          >
            {parsed.error}
          </div>
        )}

        {date && (
          <div className="mt-4 space-y-2">
            <Row label="UTC" value={date.toUTCString()} />
            <Row label="Local time" value={date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" })} />
            <Row label="ISO 8601" value={date.toISOString()} />
            <Row label="Date only (UTC)" value={date.toISOString().slice(0, 10)} />
            <Row label="Relative time" value={relativeTime(parsed.ms!)} />
          </div>
        )}
      </section>

      {/* Date -> timestamp */}
      <section aria-label="Date to timestamp" className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Date to timestamp
        </h2>
        <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
          Pick a date and time (interpreted in your local timezone).
        </p>
        <input
          type="datetime-local"
          value={reverseInput}
          onChange={(e) => setReverseInput(e.target.value)}
          step={1}
          className="focus-ring mt-3 w-full rounded-lg border px-3.5 py-2.5 text-sm sm:w-auto"
          style={{
            borderColor: "var(--border-strong)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-primary)",
            colorScheme: "light dark",
          }}
        />
        {reverse && (
          <div className="mt-4 space-y-2">
            <Row label="Unix seconds" value={reverse.seconds} />
            <Row label="Unix milliseconds" value={reverse.ms} />
          </div>
        )}
      </section>
    </div>
  );
}
