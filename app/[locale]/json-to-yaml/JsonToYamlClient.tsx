"use client";

import { useCallback } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { jsonToYaml } from "@/lib/converters/yaml";

export default function JsonToYamlClient() {
  const transform = useCallback((input: string) => {
    const result = jsonToYaml(input);
    return { output: result.output, error: result.error };
  }, []);

  return (
    <TextTransformTool
      inputLabel="JSON"
      outputLabel="YAML"
      placeholder={'{\n  "name": "Ada",\n  "roles": ["admin", "editor"]\n}'}
      transform={transform}
      downloadFilename="data.yaml"
      downloadMime="text/yaml"
    />
  );
}
