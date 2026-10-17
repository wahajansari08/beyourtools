"use client";

import { useCallback } from "react";
import TextTransformTool from "@/components/TextTransformTool";

export default function JsonlFormatterClient() {
  const transform = useCallback((input: string) => {
    if (!input.trim()) return { output: "", error: null };
    const lines = input.split("\n");
    const outputs: string[] = [];
    const errors: string[] = [];
    lines.forEach((raw, idx) => {
      const text = raw.trim();
      if (!text) return;
      try {
        const parsed = JSON.parse(text);
        outputs.push(JSON.stringify(parsed, null, 2));
      } catch (e) {
        errors.push(`Line ${idx + 1}: ${e instanceof Error ? e.message : "Invalid JSON"}`);
      }
    });
    if (errors.length > 0) {
      return { output: outputs.join("\n\n"), error: errors.join(" • ") };
    }
    return { output: outputs.join("\n\n"), error: null, info: `Formatted ${outputs.length} line${outputs.length === 1 ? "" : "s"}.` };
  }, []);

  return (
    <TextTransformTool
      inputLabel="JSONL input"
      outputLabel="Formatted (separated by blank lines)"
      placeholder={'{"id":1,"name":"Ada"}\n{"id":2,"name":"Grace"}'}
      transform={transform}
      downloadFilename="formatted.jsonl"
      downloadMime="application/json"
      acceptUpload=".jsonl,.txt,.json"
    />
  );
}
