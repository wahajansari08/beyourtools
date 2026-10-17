"use client";

import { useCallback } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { xmlToJson } from "@/lib/converters/xml";

export default function XmlToJsonClient() {
  const transform = useCallback((input: string) => {
    const result = xmlToJson(input);
    return { output: result.output, error: result.error };
  }, []);

  return (
    <TextTransformTool
      inputLabel="XML"
      outputLabel="JSON"
      placeholder={"<root>\n  <name>Ada</name>\n  <active>true</active>\n</root>"}
      transform={transform}
      downloadFilename="data.json"
      downloadMime="application/json"
      acceptUpload=".xml,.txt"
    />
  );
}
