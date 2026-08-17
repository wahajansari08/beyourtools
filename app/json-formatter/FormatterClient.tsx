"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { formatJson } from "@/lib/json/formatter";

export default function FormatterClient() {
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");

  const transform = useCallback(
    (input: string) => {
      const result = formatJson(input, indent === "tab" ? "tab" : Number(indent));
      return { output: result.output, error: result.error };
    },
    [indent]
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
      }
    />
  );
}
