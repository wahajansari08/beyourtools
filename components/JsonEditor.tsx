"use client";

import ToolInput from "./ToolInput";
import ToolOutput from "./ToolOutput";
import JsonTree from "./JsonTree";
import StatusBanner from "./StatusBanner";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import FileUploader from "./FileUploader";

export default function JsonEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  let parsed: unknown = undefined;
  let error: string | null = null;
  if (value.trim()) {
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid JSON";
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="Editor"
          value={value}
          onChange={onChange}
          placeholder='{"hello": "world"}'
          error={error}
          actions={
            <>
              <FileUploader onFileText={(text) => onChange(text)} />
              <CopyButton text={value} />
            </>
          }
        />
        <ToolOutput
          label="Live preview"
          value={value}
          actions={<DownloadButton text={value} filename="data.json" mime="application/json" />}
        >
          {parsed !== undefined ? <JsonTree data={parsed} /> : null}
        </ToolOutput>
      </div>
      {error && <StatusBanner type="error" message={error} />}
    </div>
  );
}
