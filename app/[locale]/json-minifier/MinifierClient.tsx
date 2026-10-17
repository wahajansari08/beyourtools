"use client";

import { useCallback } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { minifyJson } from "@/lib/json/minifier";

export default function MinifierClient() {
  const transform = useCallback((input: string) => {
    const result = minifyJson(input);
    const info =
      !result.error && result.output && result.savedBytes !== undefined && result.savedBytes > 0
        ? `Saved ${result.savedBytes.toLocaleString()} bytes (${result.savedPercent}% smaller).`
        : null;
    return { output: result.output, error: result.error, info };
  }, []);

  return (
    <TextTransformTool
      inputLabel="Formatted JSON"
      outputLabel="Minified JSON"
      placeholder={'{\n  "id": 1,\n  "name": "Ada"\n}'}
      transform={transform}
      downloadFilename="minified.json"
      downloadMime="application/json"
    />
  );
}
