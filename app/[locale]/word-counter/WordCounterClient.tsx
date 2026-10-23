"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Btn from "@/components/Btn";

const STOPWORDS = new Set(
  (
    "a,an,and,or,but,of,to,in,on,at,for,with,by,as,is,are,was,were,be,been,being," +
    "have,has,had,do,does,did,will,would,can,could,should,may,might,must,shall," +
    "it,its,this,that,these,those,i,you,he,she,we,they,them,his,her,their,our,your," +
    "my,me,him,us,the,not,no,so,if,then,than,when,where,what,which,who,whom,how," +
    "why,all,any,both,each,few,more,most,other,some,such,only,own,same,too,very," +
    "just,about,into,through,during,before,after,above,below,up,down,out,off,over," +
    "under,again,further,once,here,there,from,don't,doesn't,didn't,isn't,aren't," +
    "wasn't,weren't,haven't,hasn't,hadn't,won't,wouldn't,can't,couldn't,shouldn't"
  ).split(",")
);

const SAMPLE =
  "The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the English alphabet, which is why typists have used it for over a century.\n\n" +
  "Counting words is one of the oldest writing problems. Editors, students, and bloggers all face the same question: am I within the limit? A free word counter answers it instantly, without uploading your draft anywhere.\n\n" +
  "Paste your own text above to see live statistics: total words, characters with and without spaces, sentences, paragraphs, reading time, and a breakdown of your most-used words.";

const AUTOSAVE_KEY = "byt:word-counter:text";
const TARGET_KEY = "byt:word-counter:target";

function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  if (s < 60) return `${s} sec`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest === 0 ? `${m} min` : `${m} min ${rest} sec`;
}

/** Heuristic syllable count: groups of vowels, silent trailing e discounted. */
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^la]e|ed|es)$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function readingEaseLabel(score: number): string {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

interface Stat {
  label: string;
  value: string;
}

export default function WordCounterClient() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore autosaved text + target (browser only, never uploaded).
  useEffect(() => {
    try {
      const savedText = window.localStorage.getItem(AUTOSAVE_KEY);
      if (savedText) setText(savedText);
      const savedTarget = window.localStorage.getItem(TARGET_KEY);
      if (savedTarget) setTarget(savedTarget);
    } catch {
      // storage unavailable
    }
  }, []);

  const queueSave = (nextText: string, nextTarget: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        if (nextText.trim()) window.localStorage.setItem(AUTOSAVE_KEY, nextText);
        else window.localStorage.removeItem(AUTOSAVE_KEY);
        if (nextTarget.trim()) window.localStorage.setItem(TARGET_KEY, nextTarget);
        else window.localStorage.removeItem(TARGET_KEY);
      } catch {
        // ignore storage failures
      }
    }, 600);
  };

  const onTextChange = (v: string) => {
    setText(v);
    queueSave(v, target);
  };

  const onTargetChange = (v: string) => {
    setTarget(v);
    queueSave(text, v);
  };

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const sentences = trimmed
      ? trimmed
          .split(/[.!?…]+/)
          .map((s) => s.trim())
          .filter(Boolean).length
      : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n|\n/).filter((p) => p.trim()).length : 0;

    // Readability: Flesch Reading Ease + Flesch-Kincaid Grade Level
    let syllables = 0;
    for (const w of words) syllables += countSyllables(w);
    const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
    const avgSyllablesPerWord = wordCount > 0 ? syllables / wordCount : 0;
    const readingEase =
      wordCount > 0 && sentences > 0
        ? 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
        : null;
    const gradeLevel =
      wordCount > 0 && sentences > 0
        ? 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
        : null;

    // Keyword density: lowercase words longer than 2 chars, minus stopwords
    const freq = new Map<string, number>();
    for (const w of words) {
      const clean = w.toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, "");
      if (clean.length > 2 && !STOPWORDS.has(clean)) {
        freq.set(clean, (freq.get(clean) ?? 0) + 1);
      }
    }
    const top = [...freq.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percent: wordCount > 0 ? (count / wordCount) * 100 : 0,
      }));

    const main: Stat[] = [
      { label: "Words", value: wordCount.toLocaleString("en-US") },
      { label: "Characters", value: text.length.toLocaleString("en-US") },
      { label: "Characters (no spaces)", value: text.replace(/\s/g, "").length.toLocaleString("en-US") },
      { label: "Sentences", value: sentences.toLocaleString("en-US") },
      { label: "Paragraphs", value: paragraphs.toLocaleString("en-US") },
      { label: "Reading time", value: formatDuration((wordCount / 200) * 60) },
      { label: "Speaking time", value: formatDuration((wordCount / 130) * 60) },
    ];

    return { main, top, wordCount, readingEase, gradeLevel };
  }, [text]);

  const targetNum = parseInt(target, 10);
  const targetValid = Number.isFinite(targetNum) && targetNum > 0;
  const targetPct = targetValid ? Math.min(100, (stats.wordCount / targetNum) * 100) : 0;
  const targetMet = targetValid && stats.wordCount >= targetNum;

  return (
    <div>
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="wc-text" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Your text
          </label>
          <div className="flex items-center gap-2">
            <label htmlFor="wc-target" className="text-xs" style={{ color: "var(--text-subtle)" }}>
              Word target
            </label>
            <input
              id="wc-target"
              type="number"
              min={1}
              inputMode="numeric"
              value={target}
              onChange={(e) => onTargetChange(e.target.value)}
              placeholder="e.g. 500"
              aria-label="Word count target (optional)"
              className="focus-ring w-24 rounded-lg border px-2 py-1 text-xs"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            />
          </div>
        </div>
        <textarea
          id="wc-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={10}
          className="focus-ring w-full resize-y rounded-lg border px-3 py-2.5 text-sm leading-relaxed"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
        />
        {targetValid && (
          <div className="mt-3" role="status" aria-live="polite">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>
                {stats.wordCount.toLocaleString("en-US")} of {targetNum.toLocaleString("en-US")} words
                {targetMet ? " - target reached" : ` - ${(targetNum - stats.wordCount).toLocaleString("en-US")} to go`}
              </span>
              <span className="font-semibold tabular-nums" style={{ color: targetMet ? "var(--accent)" : "var(--text-muted)" }}>
                {targetPct.toFixed(0)}%
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--bg-page)" }}
              role="progressbar"
              aria-valuenow={Math.round(targetPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Word target progress: ${targetPct.toFixed(0)} percent`}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${targetPct}%`, backgroundColor: targetMet ? "var(--accent)" : "var(--text-muted)" }}
              />
            </div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="secondary" size="sm" onClick={() => onTextChange(SAMPLE)}>
            Load sample
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => { onTextChange(""); }}>
            Clear
          </Btn>
        </div>
        <p className="mt-2 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          Your text is autosaved in this browser only - a refresh never loses your draft.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3" role="status" aria-live="polite">
        {stats.main.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border p-3 sm:p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <p className="text-xl font-bold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
              {s.value}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
        {/* Readability card */}
        <div
          className="rounded-xl border p-3 sm:p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          {stats.readingEase === null ? (
            <>
              <p className="text-xl font-bold sm:text-2xl" style={{ color: "var(--text-subtle)" }}>—</p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>Readability</p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold sm:text-2xl" style={{ color: "var(--accent-text)" }}>
                {stats.readingEase.toFixed(0)}
                <span className="ml-1.5 align-middle text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {readingEaseLabel(stats.readingEase)}
                </span>
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                Reading ease · grade {(stats.gradeLevel ?? 0).toFixed(1)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Readability explainer */}
      {stats.readingEase !== null && (
        <div className="mt-4 rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="mb-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Readability
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Flesch Reading Ease runs 0–100: higher means easier to read. Scores of 60–70 suit a general audience;
            30–50 is typical of academic writing. The grade level estimates the US school grade needed to follow the text.
            Shorter sentences and simpler words raise the score.
          </p>
        </div>
      )}

      {/* Keyword density */}
      <div
        className="mt-4 rounded-xl border p-4 sm:p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <h2 className="mb-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Keyword density
        </h2>
        <p className="mb-3 text-xs" style={{ color: "var(--text-subtle)" }}>
          Top 5 words (3+ letters, common words skipped). Percent of total words.
        </p>
        {stats.top.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {stats.wordCount === 0 ? "Type something above to see your top keywords." : "Not enough distinct words yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: "var(--text-muted)" }}>
                  <th scope="col" className="py-1.5 pr-4 font-medium">Word</th>
                  <th scope="col" className="py-1.5 pr-4 font-medium">Count</th>
                  <th scope="col" className="py-1.5 font-medium">Density</th>
                </tr>
              </thead>
              <tbody>
                {stats.top.map((k) => (
                  <tr key={k.word} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="py-1.5 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                      {k.word}
                    </td>
                    <td className="py-1.5 pr-4" style={{ color: "var(--text-secondary)" }}>
                      {k.count}
                    </td>
                    <td className="py-1.5" style={{ color: "var(--text-secondary)" }}>
                      {k.percent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
