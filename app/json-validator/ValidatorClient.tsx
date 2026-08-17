"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import StatusBanner from "@/components/StatusBanner";
import FileUploader from "@/components/FileUploader";
import CopyButton from "@/components/CopyButton";
import { validateJson } from "@/lib/json/validator";

function describe(parsed: unknown): string {
  if (Array.isArray(parsed)) return `Array with ${parsed.length} item${parsed.length === 1 ? "" : "s"}`;
  if (parsed !== null && typeof parsed === "object") {
    const keys = Object.keys(parsed as object);
    return `Object with ${keys.length} key${keys.length === 1 ? "" : "s"}`;
  }
  return `Value of type ${typeof parsed}`;
}

export default function ValidatorClient() {
  const [input, setInput] = useState("");
  const result = useMemo(() => validateJson(input), [input]);

  return (
    <div className="space-y-3">
      <ToolInput
        label="JSON to validate"
        value={input}
        onChange={setInput}
        placeholder='{"id": 1, "name": "Ada"}'
        error={result.error}
        rows={16}
        actions={
          <>
            <FileUploader onFileText={(text) => setInput(text)} />
            <CopyButton text={input} />
          </>
        }
      />
      {input.trim() && result.valid && <StatusBanner type="success" message={`Valid JSON — ${describe(result.parsed)}.`} />}
      {input.trim() && !result.valid && result.error && <StatusBanner type="error" message={result.error} />}
    </div>
  );
}
