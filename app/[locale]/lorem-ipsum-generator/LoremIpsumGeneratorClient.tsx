"use client";

import { useCallback, useEffect, useState } from "react";
import Btn from "@/components/Btn";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";
import SegmentedControl from "@/components/SegmentedControl";

type Mode = "paragraphs" | "sentences" | "words" | "list" | "characters";

const CLASSIC_START =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const WORD_POOL = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore " +
  "et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip " +
  "ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla " +
  "pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim " +
  "id est laborum vitae libero temporibus maiores autem quae doloribus asperiores repellat dignissimos " +
  "facilis distinctio accusamus praesentium voluptatum deleniti atque corrupti quos dolores quas " +
  "molestias excepturi obcaecati cupiditate provident similique fugit impedit harum quidem " +
  "rerum expedita distinctio nam soluta nobis eligendi optio cumque nihil sapiente tenetur " +
  "suscipit laboriosam nisi aliquid commodi consequatur aut perferendis doloribus asperiores"
).split(" ");

const CLASSIC_WORDS = CLASSIC_START.replace(/[.,]/g, "").toLowerCase().split(" ");

function pickWord(): string {
  return WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
}

function makeSentence(wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) words.push(pickWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  // Occasionally tuck a comma into a longer sentence for natural rhythm.
  if (wordCount > 8 && Math.random() < 0.5) {
    const pos = 3 + Math.floor(Math.random() * (wordCount - 5));
    words[pos] = words[pos] + ",";
  }
  return words.join(" ") + ".";
}

function sentenceLength(): number {
  return 6 + Math.floor(Math.random() * 9); // 6-14 words
}

function makeParagraph(): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 4); // 3-6 sentences
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) sentences.push(makeSentence(sentenceLength()));
  return sentences.join(" ");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function generate(mode: Mode, count: number, classicStart: boolean, asHtml: boolean): string {
  if (mode === "paragraphs") {
    const paragraphs: string[] = [];
    for (let i = 0; i < count; i++) paragraphs.push(makeParagraph());
    if (classicStart && paragraphs.length > 0) {
      paragraphs[0] = CLASSIC_START + " " + paragraphs[0].replace(/^[A-Z][^.]+\.\s*/, "");
    }
    if (asHtml) return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
    return paragraphs.join("\n\n");
  }

  if (mode === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) sentences.push(makeSentence(sentenceLength()));
    if (classicStart && sentences.length > 0) sentences[0] = CLASSIC_START;
    const joined = sentences.join(" ");
    return asHtml ? `<p>${escapeHtml(joined)}</p>` : joined;
  }

  if (mode === "list") {
    const items: string[] = [];
    for (let i = 0; i < count; i++) items.push(makeSentence(sentenceLength()));
    if (classicStart && items.length > 0) items[0] = CLASSIC_START;
    if (asHtml) return `<ul>\n${items.map((s) => `  <li>${escapeHtml(s)}</li>`).join("\n")}\n</ul>`;
    return items.map((s) => `• ${s}`).join("\n");
  }

  if (mode === "characters") {
    // Generate plenty of words, then trim to exactly `count` characters at a word boundary.
    const words: string[] = [];
    if (classicStart) words.push(...CLASSIC_WORDS);
    while (words.join(" ").length < count + 20) words.push(pickWord());
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    let text = words.join(" ");
    if (text.length > count) {
      const cut = text.lastIndexOf(" ", count);
      text = text.slice(0, cut > 0 ? cut : count);
    }
    if (!/[.!?…]$/.test(text)) text += ".";
    return asHtml ? `<p>${escapeHtml(text)}</p>` : text;
  }

  // words
  const words: string[] = [];
  if (classicStart) words.push(...CLASSIC_WORDS.slice(0, Math.min(CLASSIC_WORDS.length, count)));
  while (words.length < count) words.push(pickWord());
  // Shape into sentences of random lengths for readability.
  const sentences: string[] = [];
  let i = 0;
  while (i < words.length) {
    const len = Math.min(sentenceLength(), words.length - i);
    const chunk = words.slice(i, i + len);
    chunk[0] = chunk[0].charAt(0).toUpperCase() + chunk[0].slice(1);
    sentences.push(chunk.join(" ") + ".");
    i += len;
  }
  const joined = sentences.join(" ");
  return asHtml ? `<p>${escapeHtml(joined)}</p>` : joined;
}

const DEFAULT_COUNT: Record<Mode, number> = { paragraphs: 3, sentences: 5, words: 100, list: 5, characters: 280 };
const RANGE: Record<Mode, { min: number; max: number; step: number }> = {
  paragraphs: { min: 1, max: 20, step: 1 },
  sentences: { min: 1, max: 50, step: 1 },
  words: { min: 10, max: 1000, step: 10 },
  list: { min: 2, max: 20, step: 1 },
  characters: { min: 50, max: 5000, step: 10 },
};

export default function LoremIpsumGeneratorClient() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState(DEFAULT_COUNT.paragraphs);
  const [classicStart, setClassicStart] = useState(true);
  const [asHtml, setAsHtml] = useState(false);
  const [output, setOutput] = useState("");

  const regenerate = useCallback(() => {
    setOutput(generate(mode, count, classicStart, asHtml));
  }, [mode, count, classicStart, asHtml]);

  // Generate immediately so the page never looks empty.
  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchMode = (next: Mode) => {
    setMode(next);
    setCount(DEFAULT_COUNT[next]);
  };

  const { min, max, step } = RANGE[mode];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <SegmentedControl<Mode>
          label="Generate"
          value={mode}
          onChange={switchMode}
          options={[
            { value: "paragraphs", label: "Paragraphs" },
            { value: "sentences", label: "Sentences" },
            { value: "words", label: "Words" },
            { value: "list", label: "List" },
            { value: "characters", label: "Characters" },
          ]}
        />

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            aria-label={`Number of ${mode}`}
            className="focus-ring w-36 sm:w-44"
            style={{ accentColor: "var(--accent)" }}
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={count}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) setCount(Math.min(max, Math.max(min, Math.round(n))));
            }}
            aria-label={`Number of ${mode}`}
            className="focus-ring w-20 rounded-lg border px-2 py-1.5 text-center text-sm"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Btn
          variant="toggle"
          size="sm"
          selected={classicStart}
          onClick={() => setClassicStart((v) => !v)}
          aria-pressed={classicStart}
        >
          Start with &ldquo;Lorem ipsum dolor sit amet&hellip;&rdquo;
        </Btn>
        <Btn
          variant="toggle"
          size="sm"
          selected={asHtml}
          onClick={() => setAsHtml((v) => !v)}
          aria-pressed={asHtml}
        >
          Wrap in HTML tags
        </Btn>
        <Btn variant="primary" size="sm" onClick={regenerate}>
          Generate
        </Btn>
      </div>

      <div
        className="max-h-96 overflow-y-auto rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
        aria-live="polite"
      >
        {output}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CopyButton text={output} />
        <DownloadButton text={output} filename={asHtml ? "lorem-ipsum.html" : "lorem-ipsum.txt"} />
        <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
          {output.length.toLocaleString("en-US")} characters
        </span>
      </div>
    </div>
  );
}
