"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { jsonToTypeScript } from "@/lib/generators/codegen";

export default function JsonToTypeScriptClient() {
  const [rootName, setRootName] = useState<"Root" | "Model" | "Data">("Root");

  const transform = useCallback(
    (input: string) => {
      const result = jsonToTypeScript(input, rootName);
      return { output: result.output, error: result.error };
    },
    [rootName]
  );

  return (
    <TextTransformTool
      inputLabel="JSON"
      outputLabel="TypeScript Interfaces"
      placeholder={`{\n  "id": 1,\n  "name": "Ada Lovelace",\n  "active": true,\n  "address": {\n    "city": "London",\n    "country": "UK"\n  },\n  "tags": ["engineer", "mathematician"]\n}`}
      transform={transform}
      downloadFilename="types.ts"
      downloadMime="text/plain"
      toolbar={
        <SegmentedControl
          label="Root name"
          value={rootName}
          onChange={setRootName}
          options={[
            { value: "Root", label: "Root" },
            { value: "Model", label: "Model" },
            { value: "Data", label: "Data" },
          ]}
        />
      }
    />
  );
}
