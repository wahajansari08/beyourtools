"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { formatJson } from "@/lib/json/formatter";

export default function FormatterClient() {
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");
  const [sortKeys, setSortKeys] = useState(false);

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

  return (
    <TextTransformTool
      inputLabel="Raw JSON"
      outputLabel="Formatted JSON"
      placeholder='{"id":1,"name":"Ada","active":true}'
      transform={transform}
      downloadFilename="formatted.json"
      downloadMime="application/json"
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
  );
}
