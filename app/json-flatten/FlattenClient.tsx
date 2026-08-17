"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { flattenJson, unflattenJson } from "@/lib/json/flatten";

export default function FlattenClient() {
  const [mode, setMode] = useState<"flatten" | "unflatten">("flatten");

  const transform = useCallback(
    (input: string) => {
      if (!input.trim()) return { output: "", error: null };
      try {
        const parsed = JSON.parse(input);
        if (mode === "flatten") {
          const flat = flattenJson(parsed);
          return { output: JSON.stringify(flat, null, 2), error: null };
        }
        const nested = unflattenJson(parsed);
        return { output: JSON.stringify(nested, null, 2), error: null };
      } catch (e) {
        return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
      }
    },
    [mode]
  );

  return (
    <TextTransformTool
      inputLabel={mode === "flatten" ? "Nested JSON" : "Flat JSON"}
      outputLabel={mode === "flatten" ? "Flattened JSON" : "Nested JSON"}
      placeholder={
        mode === "flatten"
          ? '{"user":{"id":1,"address":{"city":"Karachi"}}}'
          : '{"user.id":1,"user.address.city":"Karachi"}'
      }
      transform={transform}
      downloadFilename={mode === "flatten" ? "flattened.json" : "nested.json"}
      downloadMime="application/json"
      toolbar={
        <SegmentedControl
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "flatten", label: "Flatten" },
            { value: "unflatten", label: "Unflatten" },
          ]}
        />
      }
    />
  );
}
