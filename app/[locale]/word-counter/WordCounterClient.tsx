"use client";

import { useMemo, useState } from "react";
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

function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  if (s < 60) return `${s} sec`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest === 0 ? `${m} min` : `${m} min ${rest} sec`;
}

interface Stat {
  label: string;
  value: string;
}

export default function WordCounterClient() {
  const [text, setText] = useState("");

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

    return { main, top, wordCount };
  }, [text]);

  return (
    <div>
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <label htmlFor="wc-text" className="mb-2 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Your text
        </label>
        <textarea
          id="wc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={10}
          className="focus-ring w-full resize-y rounded-lg border px-3 py-2.5 text-sm leading-relaxed"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="secondary" size="sm" onClick={() => setText(SAMPLE)}>
            Load sample
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => setText("")}>
            Clear
          </Btn>
        </div>
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
      </div>

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
