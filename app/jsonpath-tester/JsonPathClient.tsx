"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import StatusBanner from "@/components/StatusBanner";
import FileUploader from "@/components/FileUploader";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";
import { evaluateJsonPath } from "@/lib/json/jsonpath";

const EXAMPLE_JSON = `{
  "store": {
    "books": [
      { "title": "Eloquent JavaScript", "author": "Marijn Haverbeke", "price": 29.99 },
      { "title": "You Don't Know JS", "author": "Kyle Simpson", "price": 24.99 },
      { "title": "Clean Code", "author": "Robert Martin", "price": 34.99 }
    ],
    "name": "The Code Shelf"
  }
}`;

const EXAMPLE_EXPRESSIONS = [
  { label: "All books",             expr: "$.store.books[*]"              },
  { label: "First book",            expr: "$.store.books[0]"              },
  { label: "All titles",            expr: "$.store.books[*].title"        },
  { label: "Books under $30",       expr: "$.store.books[?(@.price < 30)]"},
  { label: "All prices (recursive)",expr: "$..price"                      },
];

export default function JsonPathClient() {
  const [json, setJson]             = useState(EXAMPLE_JSON);
  const [expression, setExpression] = useState("$.store.books[*].title");

  const result = useMemo(() => evaluateJsonPath(json, expression), [json, expression]);

  const outputText =
    result.error || result.matches.length === 0
      ? ""
      : JSON.stringify(
          result.matches.length === 1 ? result.matches[0].value : result.matches.map((m) => m.value),
          null, 2
        );

  return (
    <div className="space-y-3">
      {/* Expression input */}
      <div
        className="flex flex-col overflow-hidden rounded-lg border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div
          className="flex items-center justify-between gap-2 border-b px-3 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              JSONPath Expression
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_EXPRESSIONS.map((e) => (
              <button
                key={e.expr}
                type="button"
                onClick={() => setExpression(e.expr)}
                className="focus-ring rounded border px-2 py-0.5 text-[11px] transition"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="$.store.books[*].title"
          spellCheck={false}
          className="code-surface focus-ring w-full border-0 px-3.5 py-2.5 font-mono text-[13px] placeholder:opacity-40"
          style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-surface)" }}
        />
      </div>

      {/* JSON + Results */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="JSON Input"
          value={json}
          onChange={setJson}
          placeholder='{"key": "value"}'
          error={result.error}
          actions={<FileUploader onFileText={(text) => setJson(text)} />}
        />

        <ToolOutput
          label={
            result.matches.length > 0
              ? `Results (${result.matches.length} match${result.matches.length !== 1 ? "es" : ""})`
              : "Results"
          }
          value={outputText}
          placeholder="Results will appear here."
          actions={
            <>
              <CopyButton text={outputText} />
              <DownloadButton text={outputText} filename="results.json" mime="application/json" />
            </>
          }
        >
          {!result.error && result.matches.length === 0 && json.trim() && expression.trim() ? (
            <div className="px-3.5 py-3 font-mono text-[13px] opacity-50" style={{ color: "var(--text-muted)" }}>
              No matches found.
            </div>
          ) : !result.error && result.matches.length > 0 ? (
            <div>
              {result.matches.map((match, i) => (
                <div
                  key={i}
                  className="border-b px-3.5 py-2 font-mono text-[13px] last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="mb-0.5 text-[11px]" style={{ color: "var(--accent)" }}>{match.path}</div>
                  <pre className="whitespace-pre-wrap break-words" style={{ color: "var(--text-primary)" }}>
                    {JSON.stringify(match.value, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : null}
        </ToolOutput>
      </div>

      {result.error && <StatusBanner type="error" message={result.error} />}
      {!result.error && result.matches.length > 0 && (
        <StatusBanner type="success" message={`${result.matches.length} match${result.matches.length !== 1 ? "es" : ""} found.`} />
      )}

      {/* Quick reference */}
      <details
        className="rounded-lg border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <summary
          className="cursor-pointer px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          JSONPath Quick Reference
        </summary>
        <div className="grid gap-x-6 gap-y-1 px-3.5 pb-3 pt-1 text-[12px] sm:grid-cols-2">
          {[
            ["$",                  "Root element"],
            [".",                  "Child operator"],
            ["..",                 "Recursive descent"],
            ["*",                  "Wildcard (all children)"],
            ["[n]",               "Array index (negative ok)"],
            ["[start:end]",       "Array slice"],
            ["[a,b]",             "Union of indices/keys"],
            ["[*]",               "All array elements"],
            ["[?(@.key)]",        "Filter - key exists"],
            ["[?(@.key == val)]", "Filter - equality"],
            ["[?(@.num > val)]",  "Filter - comparison"],
          ].map(([expr, desc]) => (
            <div key={expr} className="flex gap-2 py-0.5">
              <code className="w-36 shrink-0 font-mono" style={{ color: "var(--accent)" }}>{expr}</code>
              <span style={{ color: "var(--text-muted)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
