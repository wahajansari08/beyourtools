"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import StatusBanner from "@/components/StatusBanner";
import FileUploader from "@/components/FileUploader";
import CopyButton from "@/components/CopyButton";
import { validateWithSchema } from "@/lib/generators/schema";

const EXAMPLE_JSON = `{
  "id": 1,
  "name": "Ada Lovelace",
  "active": true
}`;

const EXAMPLE_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id":     { "type": "integer" },
    "name":   { "type": "string"  },
    "active": { "type": "boolean" }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}`;

export default function JsonSchemaValidatorClient() {
  const [json,   setJson]   = useState(EXAMPLE_JSON);
  const [schema, setSchema] = useState(EXAMPLE_SCHEMA);

  const result    = useMemo(() => validateWithSchema(json, schema), [json, schema]);
  const issueText = result.issues.length > 0 ? result.issues.map((i) => `${i.path}: ${i.message}`).join("\n") : "";

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput label="JSON Data"   value={json}   onChange={setJson}   placeholder={EXAMPLE_JSON}   error={result.error} actions={<FileUploader onFileText={(t) => setJson(t)} />} />
        <ToolInput label="JSON Schema" value={schema} onChange={setSchema} placeholder={EXAMPLE_SCHEMA}                      actions={<FileUploader onFileText={(t) => setSchema(t)} />} />
      </div>

      {result.error && <StatusBanner type="error" message={result.error} />}

      {!result.error && (json.trim() || schema.trim()) && (
        <>
          {result.valid ? (
            <StatusBanner type="success" message="Valid - JSON matches the schema." />
          ) : (
            result.issues.length > 0 && (
              <>
                <StatusBanner type="error" message={`Invalid - ${result.issues.length} violation${result.issues.length !== 1 ? "s" : ""} found.`} />
                <ToolOutput label="Violations" value={issueText} actions={<CopyButton text={issueText} />}>
                  <div>
                    {result.issues.map((issue, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap items-baseline gap-x-3 border-b px-3.5 py-2 font-mono text-[13px] last:border-0"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <span className="shrink-0 font-semibold" style={{ color: "var(--accent)" }}>{issue.path}</span>
                        <span style={{ color: "var(--coral)" }}>{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </ToolOutput>
              </>
            )
          )}
        </>
      )}
    </div>
  );
}
