"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import Btn from "@/components/Btn";

const TOOLS = [
  {
    slug: "word-counter",
    name: "Word Counter",
    task: "Count & measure",
    blurb: "Live words, characters, sentences, paragraphs, reading time, readability scores and a word-target tracker.",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    task: "Change format",
    blurb: "15 styles from Title Case to snake_case, shown side by side with per-style copy.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    task: "Change format",
    blurb: "Percent-encode links and query strings, or decode messy encoded URLs back to readable text.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    task: "Generate",
    blurb: "Placeholder paragraphs, sentences, words or lists for mockups, with HTML wrapping.",
  },
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    task: "Listen",
    blurb: "Hear text read aloud with word highlighting, file import and pronunciation fixes.",
  },
];

const TASKS = ["All", "Count & measure", "Change format", "Generate", "Listen"];

const cardCls = "focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card";
const cardStyle = { borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" } as const;
const inputStyle = {
  borderColor: "var(--border-strong)",
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
} as const;

export default function TextToolsFinder() {
  const [query, setQuery] = useState("");
  const [task, setTask] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter(
      (t) =>
        (task === "All" || t.task === task) &&
        (q === "" || `${t.name} ${t.blurb} ${t.task}`.toLowerCase().includes(q))
    );
  }, [query, task]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12" aria-label="Find a text tool">
      <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        Find a text tool
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Search by name or job, or filter by the task you need done. Every tool below is free, runs in your browser, and needs no sign-up.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search text tools, e.g. count words…"
          aria-label="Search text tools"
          className="focus-ring w-full rounded-lg border px-3 py-2.5 text-sm sm:max-w-sm"
          style={inputStyle}
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by task">
          {TASKS.map((t) => (
            <Btn key={t} variant="toggle" size="sm" selected={task === t} onClick={() => setTask(t)}>
              {t}
            </Btn>
          ))}
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className={cardCls} style={cardStyle}>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--accent-text)" }}>
                  {t.task}
                </p>
                <h3 className="mt-1 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {t.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {t.blurb}
                </p>
              </div>
              <span className="mt-4 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                Use tool →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
          No text tool matches that search. Try a different word, or browse all tools below.
        </p>
      )}
    </section>
  );
}
