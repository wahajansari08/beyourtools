"use client";

import { useCallback } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { yamlToJson } from "@/lib/converters/yaml";

export default function YamlToJsonClient() {
  const transform = useCallback((input: string) => {
    const result = yamlToJson(input);
    return { output: result.output, error: result.error };
  }, []);

  return (
    <TextTransformTool
      inputLabel="YAML"
      outputLabel="JSON"
      placeholder={"name: Ada\nroles:\n  - admin\n  - editor"}
      transform={transform}
      downloadFilename="data.json"
      downloadMime="application/json"
      acceptUpload=".yaml,.yml,.txt"
    />
  );
}
