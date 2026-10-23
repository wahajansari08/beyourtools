"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import JsonTree from "@/components/JsonTree";
import Btn from "@/components/Btn";
import { formatJson } from "@/lib/json/formatter";

const AUTOSAVE_KEY = "byt:json-formatter:input";

export default function FormatterClient() {
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [view, setView] = useState<"format" | "tree">("format");
  const [rawInput, setRawInput] = useState("");
  const [restored, setRestored] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore the last input from localStorage (your JSON is never sent anywhere).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(AUTOSAVE_KEY);
      if (saved) setRawInput(saved);
    } catch {
      // storage unavailable - carry on without autosave
    }
    setRestored(true);
  }, []);

  const transform = useCallback(
    (input: string) => {
      const result = formatJson(input, {
        indent: indent === "tab" ? "tab" : Number(indent),
        sortKeys,
      });
      return { output: result.output, error: result.error };
    },
    [indent, sortKeys]
  );

  // Debounced autosave of the raw input, keyed to this tool only.
  const handleInputChange = useCallback((value: string) => {
    setRawInput(value);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        if (value.trim()) window.localStorage.setItem(AUTOSAVE_KEY, value);
        else window.localStorage.removeItem(AUTOSAVE_KEY);
      } catch {
        // ignore storage failures
      }
    }, 600);
  }, []);

  const clearSaved = useCallback(() => {
    try {
      window.localStorage.removeItem(AUTOSAVE_KEY);
    } catch {
      // ignore
    }
    setRawInput("");
  }, []);

  // Parsed value for the tree view (null when input is empty or invalid).
  let treeData: unknown = null;
  let treeValid = false;
  if (rawInput.trim()) {
    try {
      treeData = JSON.parse(rawInput);
      treeValid = true;
    } catch {
      treeValid = false;
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SegmentedControl
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: "format", label: "Formatted" },
            { value: "tree", label: "Tree view" },
          ]}
        />
        {restored && rawInput && view === "format" && (
          <Btn variant="ghost" size="sm" onClick={clearSaved}>
            Clear saved input
          </Btn>
        )}
      </div>

      {view === "format" ? (
        <TextTransformTool
          inputLabel="Raw JSON"
          outputLabel="Formatted JSON"
          placeholder='{"id":1,"name":"Ada","active":true}'
          transform={transform}
          downloadFilename="formatted.json"
          downloadMime="application/json"
          acceptUpload=".json,application/json"
          value={rawInput}
          onInputChange={handleInputChange}
          toolbar={
            <>
              <SegmentedControl
                label="Indent"
                value={indent}
                onChange={setIndent}
                options={[
                  { value: "2", label: "2 spaces" },
                  { value: "4", label: "4 spaces" },
                  { value: "tab", label: "Tab" },
                ]}
              />
              <label
                className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium transition"
                style={{
                  borderColor: sortKeys ? "var(--accent)" : "var(--border-strong)",
                  backgroundColor: sortKeys
                    ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                    : "var(--bg-elevated)",
                  color: sortKeys ? "var(--accent-text)" : "var(--text-muted)",
                }}
              >
                <input
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  className="h-3.5 w-3.5 accent-amber-400"
                />
                Sort keys A–Z
              </label>
            </>
          }
        />
      ) : (
        <div
          className="rounded-xl border p-4 sm:p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <div className="mb-3">
            <label htmlFor="json-tree-input" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Paste JSON to explore as a collapsible tree
            </label>
            <textarea
              id="json-tree-input"
              value={rawInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder='{"id":1,"name":"Ada","tags":["dev","json"]}'
              rows={6}
              spellCheck={false}
              className="focus-ring w-full rounded-lg border px-3 py-2 font-mono text-sm"
              style={{
                borderColor: "var(--border-strong)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                resize: "vertical",
              }}
            />
          </div>
          {treeValid ? (
            <div
              className="max-h-[480px] overflow-auto rounded-lg border p-2 font-mono text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
              role="tree"
              aria-label="JSON tree view"
            >
              <JsonTree data={treeData} />
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {rawInput.trim()
                ? "That JSON is not valid yet - fix the syntax above (or run it through the JSON Repair tool) to see the tree."
                : "Paste valid JSON above to explore it as a collapsible tree. Click any object or array to expand it."}
            </p>
          )}
        </div>
      )}

      <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
        Your input is autosaved in this browser only, so a refresh never loses your JSON.
        {view === "format" && " Switch to Tree view to explore nested structures."}
      </p>
    </div>
  );
}
