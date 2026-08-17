"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import StatusBanner from "@/components/StatusBanner";
import CopyButton from "@/components/CopyButton";
import FileUploader from "@/components/FileUploader";
import { validateJsonl } from "@/lib/json/validator";

export default function JsonlValidatorClient() {
  const [input, setInput] = useState("");
  const results = useMemo(() => validateJsonl(input), [input]);
  const invalidCount = results.filter((r) => !r.valid).length;

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="JSONL input"
          value={input}
          onChange={setInput}
          placeholder={'{"id":1,"name":"Ada"}\n{"id":2,"name":"Grace"}'}
          actions={
            <>
              <FileUploader accept=".jsonl,.txt,.json" onFileText={(text) => setInput(text)} />
              <CopyButton text={input} />
            </>
          }
        />
        <ToolOutput label="Line-by-line results" placeholder="Results will appear here.">
          {results.length > 0 && (
            <div className="divide-y divide-ink-700 font-mono text-[13px]">
              {results.map((r) => (
                <div key={r.line} className="flex items-start gap-2 px-3.5 py-2">
                  <span className={r.valid ? "text-teal-400" : "text-coral-400"}>{r.valid ? "✓" : "✕"}</span>
                  <span className="text-mist-400">Line {r.line}</span>
                  {!r.valid && <span className="break-words text-coral-400">{r.error}</span>}
                </div>
              ))}
            </div>
          )}
        </ToolOutput>
      </div>
      {input.trim() && results.length > 0 && (
        <StatusBanner
          type={invalidCount === 0 ? "success" : "error"}
          message={
            invalidCount === 0
              ? `All ${results.length} lines are valid JSON.`
              : `${invalidCount} of ${results.length} lines are invalid.`
          }
        />
      )}
    </div>
  );
}
