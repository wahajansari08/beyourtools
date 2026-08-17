"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { jsonToSql } from "@/lib/generators/codegen";

export default function JsonToSqlClient() {
  const [tableName] = useState("records");

  const transform = useCallback(
    (input: string) => {
      const result = jsonToSql(input, tableName);
      return { output: result.output, error: result.error };
    },
    [tableName]
  );

  return (
    <TextTransformTool
      inputLabel="JSON Array"
      outputLabel="SQL"
      placeholder={`[\n  { "id": 1, "name": "Alice", "age": 30, "active": true },\n  { "id": 2, "name": "Bob",   "age": 25, "active": false }\n]`}
      transform={transform}
      downloadFilename="data.sql"
      downloadMime="text/plain"
    />
  );
}
