"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { jsonToPython } from "@/lib/generators/codegen";

export default function JsonToPythonClient() {
  const [rootName, setRootName] = useState<"Root" | "Model" | "Data">("Root");

  const transform = useCallback(
    (input: string) => {
      const result = jsonToPython(input, rootName);
      return { output: result.output, error: result.error };
    },
    [rootName]
  );

  return (
    <TextTransformTool
      inputLabel="JSON"
      outputLabel="Python Dataclasses"
      placeholder={`{\n  "id": 1,\n  "name": "Ada Lovelace",\n  "active": true,\n  "address": {\n    "city": "London",\n    "country": "UK"\n  },\n  "scores": [9.5, 8.0, 10.0]\n}`}
      transform={transform}
      downloadFilename="models.py"
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
