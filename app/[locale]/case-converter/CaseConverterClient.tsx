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
  | "upper" | "lower" | "title" | "sentence"
  | "camel" | "pascal" | "snake" | "kebab"
  | "alternating" | "inverse";

const CASE_LABELS: Record<CaseKey, string> = {
  upper: "UPPER CASE",
  lower: "lower case",
  title: "Title Case",
  sentence: "Sentence case",
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
  alternating: "aLtErNaTiNg",
  inverse: "InVeRsE",
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

function convert(text: string, caseKey: CaseKey): string {
  switch (caseKey) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
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
  }
}

export default function CaseConverterClient() {
  const [caseKey, setCaseKey] = useState<CaseKey>("title");
  const [input, setInput] = useState("");

  const output = useMemo(() => convert(input, caseKey), [input, caseKey]);
  const wordCount = useMemo(() => output.split(/\s+/).filter(Boolean).length, [output]);

  return (
    <div className="space-y-4">
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
        Output: {output.length.toLocaleString()} characters · {wordCount.toLocaleString()} words
      </p>
    </div>
  );
}
