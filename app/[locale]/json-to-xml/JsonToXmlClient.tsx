"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { jsonToXml } from "@/lib/converters/xml";

export default function JsonToXmlClient() {
  const [rootName, setRootName] = useState("root");

  const transform = useCallback(
    (input: string) => {
      const result = jsonToXml(input, rootName || "root");
      return { output: result.output, error: result.error };
    },
    [rootName]
  );

  return (
    <TextTransformTool
      inputLabel="JSON"
      outputLabel="XML"
      placeholder={'{\n  "name": "Ada",\n  "active": true\n}'}
      transform={transform}
      downloadFilename="data.xml"
      downloadMime="application/xml"
      toolbar={
        <label className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          Root element
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
            className="focus-ring w-28 rounded-md border px-2 py-1 font-mono text-xs"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          />
        </label>
      }
    />
  );
}
