"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import StatusBanner from "@/components/StatusBanner";
import FileUploader from "@/components/FileUploader";
import CopyButton from "@/components/CopyButton";
import { diffJson, summarizeDiff, type DiffEntry } from "@/lib/json/diff";

function formatValue(v: unknown): string {
  if (v === undefined) return "-";
  return typeof v === "string" ? `"${v}"` : JSON.stringify(v);
}

function DiffRow({ entry }: { entry: DiffEntry }) {
  const color =
    entry.type === "added"
      ? "var(--teal)"
      : entry.type === "removed"
      ? "var(--coral)"
      : "var(--accent)";
  const symbol = entry.type === "added" ? "+" : entry.type === "removed" ? "-" : "~";
  return (
    <div
      className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b px-3.5 py-2 font-mono text-[13px] last:border-0"
      style={{ borderColor: "var(--border)" }}
    >
      <span style={{ color }}>{symbol}</span>
      <span style={{ color: "var(--text-secondary)" }}>{entry.path}</span>
      {entry.type === "changed" && (
        <span style={{ color: "var(--text-muted)" }}>
          <span style={{ color: "var(--coral)" }}>{formatValue(entry.left)}</span>
          {" → "}
          <span style={{ color: "var(--teal)" }}>{formatValue(entry.right)}</span>
        </span>
      )}
      {entry.type === "added"   && <span style={{ color: "var(--teal)"  }}>{formatValue(entry.right)}</span>}
      {entry.type === "removed" && <span style={{ color: "var(--coral)" }}>{formatValue(entry.left)}</span>}
    </div>
  );
}

export default function DiffClient() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const { entries, error } = useMemo(() => {
    if (!left.trim() || !right.trim()) return { entries: [] as DiffEntry[], error: null as string | null };
    try {
      const l = JSON.parse(left);
      const r = JSON.parse(right);
      return { entries: diffJson(l, r), error: null };
    } catch (e) {
      return { entries: [] as DiffEntry[], error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [left, right]);

  const summary = summarizeDiff(entries);
  const diffText = entries
    .map((e) => `${e.type.toUpperCase()} ${e.path}${e.type === "changed" ? ` : ${formatValue(e.left)} -> ${formatValue(e.right)}` : ""}`)
    .join("\n");

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput label="Original (A)" value={left} onChange={setLeft} placeholder='{"name":"Ada","age":30}' rows={12} actions={<FileUploader onFileText={(t) => setLeft(t)} />} />
        <ToolInput label="Changed (B)"  value={right} onChange={setRight} placeholder='{"name":"Ada","age":31,"active":true}' rows={12} actions={<FileUploader onFileText={(t) => setRight(t)} />} />
      </div>

      {error && <StatusBanner type="error" message={error} />}

      {!error && left.trim() && right.trim() && (
        <ToolOutput label="Differences" value={diffText} placeholder="No differences to show yet." actions={<CopyButton text={diffText} />}>
          {entries.length === 0 ? (
            <div className="px-3.5 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
              These two JSON documents are identical.
            </div>
          ) : (
            <div>
              <div className="flex gap-4 border-b px-3.5 py-2 text-[11px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                <span style={{ color: "var(--teal)"  }}>{summary.added} added</span>
                <span style={{ color: "var(--coral)" }}>{summary.removed} removed</span>
                <span style={{ color: "var(--accent)"}}>{summary.changed} changed</span>
              </div>
              {entries.map((entry, i) => (
                <DiffRow key={`${entry.path}-${i}`} entry={entry} />
              ))}
            </div>
          )}
        </ToolOutput>
      )}
    </div>
  );
}
