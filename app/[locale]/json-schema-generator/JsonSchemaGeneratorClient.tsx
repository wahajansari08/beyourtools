"use client";

import { useCallback } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { generateJsonSchema } from "@/lib/generators/schema";

const PLACEHOLDER = `{
  "id": 1,
  "name": "Ada Lovelace",
  "active": true,
  "score": 9.5,
  "address": {
    "street": "123 Main St",
    "city": "London"
  },
  "tags": ["engineer", "pioneer"]
}`;

export default function JsonSchemaGeneratorClient() {
  const transform = useCallback((input: string) => {
    const result = generateJsonSchema(input);
    return { output: result.output, error: result.error };
  }, []);

  return (
    <TextTransformTool
      inputLabel="JSON Sample"
      outputLabel="JSON Schema (draft-07)"
      placeholder={PLACEHOLDER}
      transform={transform}
      downloadFilename="schema.json"
      downloadMime="application/json"
    />
  );
}
