"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";

const monoCls = "focus-ring w-full rounded-lg border px-3 py-2 text-sm font-mono";
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

const FLAG_ORDER = ["g", "i", "m", "s", "u", "y"] as const;

interface Preset {
  label: string;
  pattern: string;
  flags: string;
  sample: string;
}

const PRESETS: Preset[] = [
  {
    label: "Email",
    pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.]+",
    flags: "g",
    sample: "Reach us at jane.doe@example.com or support@site.org for help.",
  },
  {
    label: "URL",
    pattern: "https?://[^\\s/$.?#].[^\\s]*",
    flags: "gi",
    sample: "Visit https://beyourtools.com/regex-tester or http://example.com/docs today.",
  },
  {
    label: "Date (YYYY-MM-DD)",
    pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b",
    flags: "g",
    sample: "Events on 2026-10-17 and 2025-01-02, not on 17-10-2026.",
  },
  {
    label: "Phone",
    pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
    flags: "g",
    sample: "Call (555) 123-4567 or 555.987.6543 between 9 and 5.",
  },
  {
    label: "Hex color",
    pattern: "#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b",
    flags: "g",
    sample: "Palette: #FF5733, #abc, and the invalid #12345678.",
  },
  {
    label: "IPv4",
    pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
    flags: "g",
    sample: "Hosts: 192.168.1.1, 10.0.0.255 and not-quite 999.1.1.1.",
  },
];

interface MatchInfo {
  text: string;
  index: number;
  groups: (string | undefined)[];
}

const MAX_MATCHES = 500;

function findMatches(pattern: string, flagStr: string, text: string): MatchInfo[] {
  const re = new RegExp(pattern, flagStr);
  const out: MatchInfo[] = [];
  if (flagStr.includes("g") || flagStr.includes("y")) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(text)) !== null && guard < MAX_MATCHES * 2) {
      guard += 1;
      out.push({ text: m[0], index: m.index, groups: Array.from(m).slice(1) });
      if (out.length >= MAX_MATCHES) break;
      if (m[0].length === 0) re.lastIndex += 1; // avoid infinite loop on empty matches
    }
  } else {
    const m = re.exec(text);
    if (m) out.push({ text: m[0], index: m.index, groups: Array.from(m).slice(1) });
  }
  return out;
}

function buildSegments(text: string, matches: MatchInfo[]): { text: string; match: boolean }[] {
  const ranges = matches
    .filter((m) => m.text.length > 0)
    .map((m) => ({ start: m.index, end: m.index + m.text.length }))
    .sort((a, b) => a.start - b.start);
  const segs: { text: string; match: boolean }[] = [];
  let pos = 0;
  for (const r of ranges) {
    if (r.start > pos) segs.push({ text: text.slice(pos, r.start), match: false });
    segs.push({ text: text.slice(r.start, r.end), match: true });
    pos = Math.max(pos, r.end);
  }
  if (pos < text.length) segs.push({ text: text.slice(pos), match: false });
  return segs;
}

const CHEATSHEET: { title: string; rows: [string, string][] }[] = [
  {
    title: "Character classes",
    rows: [
      [".", "Any character except newline"],
      ["\\d / \\D", "Digit / non-digit"],
      ["\\w / \\W", "Word char (A-Za-z0-9_) / non-word"],
      ["\\s / \\S", "Whitespace / non-whitespace"],
      ["[abc]", "Any of a, b, c"],
      ["[^abc]", "Anything except a, b, c"],
      ["[a-z]", "Range a through z"],
    ],
  },
  {
    title: "Quantifiers",
    rows: [
      ["*", "0 or more (greedy)"],
      ["+", "1 or more (greedy)"],
      ["?", "0 or 1"],
      ["{n}", "Exactly n"],
      ["{n,}", "n or more"],
      ["{n,m}", "Between n and m"],
      ["*? +? ??", "Lazy versions: match as little as possible"],
    ],
  },
  {
    title: "Anchors",
    rows: [
      ["^", "Start of string (or line with m flag)"],
      ["$", "End of string (or line with m flag)"],
      ["\\b", "Word boundary"],
      ["\\B", "Not a word boundary"],
    ],
  },
  {
    title: "Groups",
    rows: [
      ["(abc)", "Capture group: numbered 1, 2, 3…"],
      ["(?:abc)", "Non-capturing group"],
      ["(?<name>abc)", "Named capture group"],
      ["a|b", "Alternation: a or b"],
      ["\\1", "Backreference to group 1"],
      ["(?=abc)", "Positive lookahead"],
      ["(?!abc)", "Negative lookahead"],
    ],
  },
];

function encodeShare(state: { pattern: string; flags: string; test: string; replacement: string }): string {
  try {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

function decodeShare(hash: string): { pattern: string; flags: string; test: string; replacement: string } | null {
  try {
    const clean = hash.replace(/^#r=/, "").replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(clean)));
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.pattern === "string") {
      return {
        pattern: parsed.pattern,
        flags: typeof parsed.flags === "string" ? parsed.flags : "g",
        test: typeof parsed.test === "string" ? parsed.test : "",
        replacement: typeof parsed.replacement === "string" ? parsed.replacement : "",
      };
    }
  } catch {
    // not a valid share link
  }
  return null;
}

export default function RegexTesterClient() {
  // Restore from a share link (#r=...) on first load.
  const shared = useMemo(
    () => (typeof window !== "undefined" ? decodeShare(window.location.hash) : null),
    []
  );
  const [pattern, setPattern] = useState(shared?.pattern ?? "");
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    const next: Record<string, boolean> = {};
    for (const f of FLAG_ORDER) next[f] = shared ? shared.flags.includes(f) : f === "g";
    return next;
  });
  const [test, setTest] = useState(shared?.test ?? "");
  const [replacement, setReplacement] = useState(shared?.replacement ?? "");
  const [tab, setTab] = useState<"test" | "replace">("test");
  const [shareMsg, setShareMsg] = useState("");

  const flagStr = useMemo(() => FLAG_ORDER.filter((f) => flags[f]).join(""), [flags]);

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as MatchInfo[], error: "" };
    try {
      return { matches: findMatches(pattern, flagStr, test), error: "" };
    } catch (e) {
      return { matches: [] as MatchInfo[], error: e instanceof Error ? e.message : "Invalid pattern" };
    }
  }, [pattern, flagStr, test]);

  const replaced = useMemo(() => {
    if (!pattern || error) return "";
    try {
      const re = new RegExp(pattern, flagStr.includes("g") ? flagStr : flagStr + "g");
      return test.replace(re, replacement);
    } catch {
      return "";
    }
  }, [pattern, flagStr, test, replacement, error]);

  const copyShareLink = async () => {
    const code = encodeShare({ pattern, flags: flagStr, test, replacement });
    if (!code) return;
    const url = `${window.location.origin}${window.location.pathname}#r=${code}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.location.hash = `r=${code}`;
      setShareMsg("Link placed in the address bar - copy it from there.");
      return;
    }
    try {
      window.history.replaceState(null, "", `#r=${code}`);
    } catch {
      // ignore
    }
    setShareMsg("Share link copied - it restores this exact pattern, flags and test text.");
    window.setTimeout(() => setShareMsg(""), 4000);
  };

  const segments = useMemo(() => buildSegments(test, matches), [test, matches]);

  function toggleFlag(f: string) {
    setFlags((prev) => ({ ...prev, [f]: !prev[f] }));
  }

  function loadPreset(p: Preset) {
    setPattern(p.pattern);
    setTest(p.sample);
    const next: Record<string, boolean> = {};
    for (const f of FLAG_ORDER) next[f] = p.flags.includes(f);
    setFlags(next);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5 space-y-4" style={cardStyle}>
        <div>
          <label htmlFor="regex-pattern" className="mb-1 block text-xs font-medium" style={labelStyle}>
            Pattern <span className="font-normal">(without the / slashes /)</span>
          </label>
          <input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. (\w+)@(\w+)"
            spellCheck={false}
            autoComplete="off"
            className={monoCls}
            style={inputStyle}
          />
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium" style={labelStyle}>
            Flags
          </span>
          <div className="flex flex-wrap gap-2">
            {FLAG_ORDER.map((f) => (
              <Btn key={f} variant="toggle" size="sm" selected={!!flags[f]} onClick={() => toggleFlag(f)}>
                {f}
              </Btn>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="regex-test" className="mb-1 block text-xs font-medium" style={labelStyle}>
            Test string
          </label>
          <textarea
            id="regex-test"
            value={test}
            onChange={(e) => setTest(e.target.value)}
            rows={5}
            placeholder="Paste the text you want to match against…"
            spellCheck={false}
            className={monoCls}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium" style={labelStyle}>
            Common patterns
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Btn key={p.label} variant="pill" onClick={() => loadPreset(p)}>
                {p.label}
              </Btn>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Btn variant="toggle" size="sm" selected={tab === "test"} onClick={() => setTab("test")}>
          Match
        </Btn>
        <Btn variant="toggle" size="sm" selected={tab === "replace"} onClick={() => setTab("replace")}>
          Replace
        </Btn>
        <span className="flex-1" />
        <Btn variant="secondary" size="sm" onClick={copyShareLink} disabled={!pattern || !!error}>
          Copy share link
        </Btn>
      </div>
      {shareMsg && (
        <p className="text-xs" style={{ color: "var(--accent-text)" }} role="status">
          {shareMsg}
        </p>
      )}

      {error && (
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--coral)", backgroundColor: "var(--bg-surface)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--coral)" }}>
            Invalid pattern
          </p>
          <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
        </div>
      )}

      {tab === "replace" && !error && pattern && (
        <div className="rounded-xl border p-5 space-y-4" style={cardStyle}>
          <div>
            <label htmlFor="regex-replacement" className="mb-1 block text-xs font-medium" style={labelStyle}>
              Replacement <span className="font-normal">(supports $1, $2 … $&amp; for the whole match, $` and $&apos; for before/after, $&lt;name&gt; for named groups)</span>
            </label>
            <input
              id="regex-replacement"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="e.g. [$1]"
              spellCheck={false}
              autoComplete="off"
              className={monoCls}
              style={inputStyle}
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium" style={labelStyle}>
              Result {matches.length > 0 && <span style={{ color: "var(--text-secondary)" }}>({matches.length} replacement{matches.length === 1 ? "" : "s"})</span>}
            </p>
            <div
              className="whitespace-pre-wrap break-words rounded-lg border p-3 font-mono text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              aria-live="polite"
            >
              {test ? replaced || <span style={{ color: "var(--text-subtle)" }}>No changes - nothing matched.</span> : <span style={{ color: "var(--text-subtle)" }}>Add a test string above to preview the replacement.</span>}
            </div>
          </div>
        </div>
      )}

      {!error && pattern && (
        <div className="rounded-xl border p-5" style={cardStyle}>
          <p className="mb-2 text-xs font-medium" style={labelStyle}>
            Live preview:{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              {matches.length === 0 ? "no matches" : `${matches.length} match${matches.length === 1 ? "" : "es"}`}
            </span>
          </p>
          {test ? (
            <div
              className="whitespace-pre-wrap break-words rounded-lg border p-3 font-mono text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {segments.map((s, i) =>
                s.match ? (
                  <span
                    key={i}
                    className="rounded px-0.5"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                  >
                    {s.text}
                  </span>
                ) : (
                  <span key={i}>{s.text}</span>
                )
              )}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
              Add a test string above to see highlighting.
            </p>
          )}
        </div>
      )}

      {!error && matches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Matches ({matches.length})
          </h3>
          {matches.map((m, i) => (
            <div key={`${m.index}-${i}`} className="rounded-xl border p-4" style={cardStyle}>
              <p className="text-sm">
                <span className="font-semibold" style={{ color: "var(--accent-text)" }}>
                  Match {i + 1}
                </span>{" "}
                <span style={{ color: "var(--text-subtle)" }}>at index {m.index}:</span>{" "}
                <code
                  className="rounded px-1 py-0.5 font-mono text-xs"
                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                >
                  {m.text || "(empty match)"}
                </code>
              </p>
              {m.groups.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {m.groups.map((g, gi) => (
                    <li key={gi} className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--text-subtle)" }}>Group {gi + 1}:</span>{" "}
                      {g === undefined ? (
                        <span className="italic" style={{ color: "var(--text-subtle)" }}>
                          (no match)
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-primary)" }}>“{g}”</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
                  No capture groups in this pattern.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <details className="rounded-xl border p-5" style={cardStyle}>
        <summary className="focus-ring cursor-pointer text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Regex cheatsheet
        </summary>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {CHEATSHEET.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>
                {section.title}
              </h4>
              <dl className="space-y-1.5">
                {section.rows.map(([syntax, meaning]) => (
                  <div key={syntax} className="flex gap-3 text-xs">
                    <dt
                      className="shrink-0 rounded px-1.5 py-0.5 font-mono"
                      style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                    >
                      {syntax}
                    </dt>
                    <dd style={{ color: "var(--text-muted)" }}>{meaning}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
