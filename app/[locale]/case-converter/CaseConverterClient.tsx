"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";

// Words that stay lowercase in Title Case (headline style), per task spec.
const SMALL_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "for", "nor",
  "on", "at", "to", "from", "by", "of", "in", "vs",
]);

type CaseKey =
  | "upper" | "lower" | "title" | "sentence" | "capitalized"
  | "camel" | "pascal" | "snake" | "kebab"
  | "constant" | "dot" | "path" | "train"
  | "alternating" | "inverse" | "random";

const CASE_LABELS: Record<CaseKey, string> = {
  upper: "UPPER CASE",
  lower: "lower case",
  title: "Title Case",
  sentence: "Sentence case",
  capitalized: "Capitalized Case",
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
  constant: "CONSTANT_CASE",
  dot: "dot.case",
  path: "path/case",
  train: "Train-Case",
  alternating: "aLtErNaTiNg",
  inverse: "InVeRsE",
  random: "rAnDoM cAsE",
};

const CASES = Object.keys(CASE_LABELS) as CaseKey[];

function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function toTitleCase(text: string): string {
  const parts = text.split(/(\s+)/);
  let sentenceStart = true;
  return parts
    .map((part) => {
      if (/^\s*$/.test(part)) return part;
      const m = part.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}][\p{L}\p{N}'’-]*)(.*)$/u);
      if (!m) return part;
      const [, lead, core, trail] = m;
      const lower = core.toLowerCase();
      const capitalize = sentenceStart || !SMALL_WORDS.has(lower);
      sentenceStart = /[.!?…]$/.test(trail);
      return lead + (capitalize ? cap(lower) : lower) + trail;
    })
    .join("");
}

function toSentenceCase(text: string): string {
  let result = "";
  let sentenceStart = true;
  for (const ch of text) {
    if (sentenceStart && /\p{L}/u.test(ch)) {
      result += ch.toUpperCase();
      sentenceStart = false;
    } else {
      result += ch.toLowerCase();
      if (/[.!?…\n]/.test(ch)) sentenceStart = true;
    }
  }
  return result;
}

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

/** Tiny deterministic PRNG so Random Case can be re-rolled on demand. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Collapse runs of spaces/tabs, trim every line, drop empty lines. */
function removeExtraSpaces(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter((line) => line !== "")
    .join("\n");
}

function convert(text: string, caseKey: CaseKey, randomSeed = 0): string {
  switch (caseKey) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "capitalized":
      // Capitalize every word (unlike Title Case, small words are capped too).
      return text
        .split(/(\s+)/)
        .map((part) => (/^\s*$/.test(part) ? part : cap(part.toLowerCase())))
        .join("");
    case "camel": {
      const w = splitWords(text);
      return w.map((x, i) => (i === 0 ? x.toLowerCase() : cap(x.toLowerCase()))).join("");
    }
    case "pascal":
      return splitWords(text).map((x) => cap(x.toLowerCase())).join("");
    case "snake":
      return splitWords(text).map((x) => x.toLowerCase()).join("_");
    case "kebab":
      return splitWords(text).map((x) => x.toLowerCase()).join("-");
    case "constant":
      return splitWords(text).map((x) => x.toUpperCase()).join("_");
    case "dot":
      return splitWords(text).map((x) => x.toLowerCase()).join(".");
    case "path":
      return splitWords(text).map((x) => x.toLowerCase()).join("/");
    case "train":
      return splitWords(text).map((x) => cap(x.toLowerCase())).join("-");
    case "alternating": {
      let i = 0;
      return [...text]
        .map((ch) => {
          if (!/\p{L}/u.test(ch)) return ch;
          const out = i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase();
          i++;
          return out;
        })
        .join("");
    }
    case "inverse":
      return [...text]
        .map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
        .join("");
    case "random": {
      const rand = mulberry32(randomSeed || 1);
      return [...text]
        .map((ch) => {
          if (!/\p{L}/u.test(ch)) return ch;
          return rand() < 0.5 ? ch.toLowerCase() : ch.toUpperCase();
        })
        .join("");
    }
  }
}

const SAMPLE_TEXT =
  "the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs!";

export default function CaseConverterClient() {
  const [caseKey, setCaseKey] = useState<CaseKey>("title");
  const [input, setInput] = useState("");
  const [cleanSpaces, setCleanSpaces] = useState(false);
  const [randomSeed, setRandomSeed] = useState(1);

  const effectiveInput = useMemo(
    () => (cleanSpaces ? removeExtraSpaces(input) : input),
    [input, cleanSpaces]
  );
  const output = useMemo(
    () => convert(effectiveInput, caseKey, randomSeed),
    [effectiveInput, caseKey, randomSeed]
  );
  const wordCount = useMemo(() => output.split(/\s+/).filter(Boolean).length, [output]);
  const lineCount = useMemo(() => (output ? output.split("\n").length : 0), [output]);
  const charsNoSpaces = useMemo(() => output.replace(/\s/g, "").length, [output]);
  const sentenceCount = useMemo(
    () => output.split(/[.!?…]+/).map((s) => s.trim()).filter(Boolean).length,
    [output]
  );
  const readingMinutes = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);
  const allStyles = useMemo(
    () => CASES.map((key) => ({ key, value: convert(effectiveInput, key, randomSeed) })),
    [effectiveInput, randomSeed]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Btn variant="secondary" size="sm" onClick={() => setInput(SAMPLE_TEXT)}>
          Load example text
        </Btn>
        <Btn variant="ghost" size="sm" onClick={() => setInput("")} disabled={input.length === 0}>
          Clear
        </Btn>
        <Btn
          variant="toggle"
          size="sm"
          selected={cleanSpaces}
          onClick={() => setCleanSpaces((v) => !v)}
          aria-pressed={cleanSpaces}
          title="Collapse multiple spaces, trim lines and drop empty lines before converting"
        >
          Remove extra spaces
        </Btn>
        {caseKey === "random" && (
          <Btn variant="secondary" size="sm" onClick={() => setRandomSeed((s) => s + 1)}>
            Shuffle random case
          </Btn>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Case style">
        {CASES.map((key) => (
          <Btn
            key={key}
            variant="toggle"
            size="sm"
            selected={caseKey === key}
            onClick={() => setCaseKey(key)}
            style={{ textTransform: "none" }}
            aria-pressed={caseKey === key}
          >
            {CASE_LABELS[key]}
          </Btn>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="Your text"
          value={input}
          onChange={setInput}
          placeholder="Type or paste your text here…"
          rows={14}
          actions={<CopyButton text={input} />}
        />
        <ToolOutput
          label={CASE_LABELS[caseKey]}
          value={output}
          placeholder="Converted text will appear here."
          rows={14}
          actions={
            <>
              <CopyButton text={output} />
              <DownloadButton text={output} filename="converted.txt" />
            </>
          }
        />
      </div>

      <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
        Output: {output.length.toLocaleString()} characters · {charsNoSpaces.toLocaleString()} without spaces · {wordCount.toLocaleString()} words · {sentenceCount.toLocaleString()} sentences · {lineCount.toLocaleString()} lines · ~{readingMinutes} min read
      </p>

      {input.trim() !== "" && (
        <section aria-label="All case styles">
          <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Every style at a glance — copy any one
          </h2>
          <ul className="space-y-2">
            {allStyles.map(({ key, value }) => (
              <li
                key={key}
                className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <span className="w-32 shrink-0 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {CASE_LABELS[key]}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm" style={{ color: "var(--text-primary)" }}>
                  {value || "—"}
                </span>
                <CopyButton text={value} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs" style={{ color: "var(--text-subtle)" }}>
            Tip: CONSTANT_CASE suits constants in code, dot.case suits package names, path/case suits file paths, and Train-Case suits headings and URL slugs. Use "Remove extra spaces" first when pasting messy text from a PDF or email, and hit "Shuffle random case" to re-roll a fresh rAnDoM mix.
          </p>
        </section>
      )}
    </div>
  );
}
