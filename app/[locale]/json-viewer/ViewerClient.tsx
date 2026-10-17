"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import JsonTree from "@/components/JsonTree";
import StatusBanner from "@/components/StatusBanner";
import CopyButton from "@/components/CopyButton";
import FileUploader from "@/components/FileUploader";
import { validateJson } from "@/lib/json/validator";

export default function ViewerClient() {
  const [input, setInput] = useState("");
  const result = useMemo(() => validateJson(input), [input]);

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="JSON"
          value={input}
          onChange={setInput}
          placeholder='{"user":{"id":1,"roles":["admin","editor"]}}'
          error={result.error}
          actions={
            <>
              <FileUploader onFileText={(text) => setInput(text)} />
              <CopyButton text={input} />
            </>
          }
        />
        <ToolOutput label="Tree view" placeholder="Your JSON tree will appear here.">
          {result.valid ? <JsonTree data={result.parsed} /> : null}
        </ToolOutput>
      </div>
      {input.trim() && !result.valid && result.error && <StatusBanner type="error" message={result.error} />}
    </div>
  );
}
