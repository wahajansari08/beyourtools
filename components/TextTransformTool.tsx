"use client";

import { ReactNode, useMemo, useState } from "react";
import ToolInput from "./ToolInput";
import ToolOutput from "./ToolOutput";
import StatusBanner from "./StatusBanner";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import FileUploader from "./FileUploader";

export interface TransformResult {
  output: string;
  error: string | null;
  info?: string | null;
}

export default function TextTransformTool({
  inputLabel,
  outputLabel,
  placeholder,
  outputPlaceholder,
  transform,
  downloadFilename,
  downloadMime = "text/plain",
  toolbar,
  defaultValue = "",
  acceptUpload,
  value,
  onInputChange,
}: {
  inputLabel: string;
  outputLabel: string;
  placeholder?: string;
  outputPlaceholder?: string;
  transform: (input: string) => TransformResult;
  downloadFilename: string;
  downloadMime?: string;
  toolbar?: ReactNode;
  defaultValue?: string;
  acceptUpload?: string;
  /** Optional controlled input. When provided, the component reports edits via onInputChange. */
  value?: string;
  onInputChange?: (value: string) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const input = value !== undefined ? value : uncontrolled;
  const setInput = (next: string) => {
    if (value === undefined) setUncontrolled(next);
    onInputChange?.(next);
  };
  const result = useMemo(() => transform(input), [input, transform]);

  return (
    <div className="space-y-3">
      {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label={inputLabel}
          value={input}
          onChange={setInput}
          placeholder={placeholder}
          error={result.error}
          actions={
            <>
              <FileUploader accept={acceptUpload} onFileText={(text) => setInput(text)} />
              <CopyButton text={input} />
            </>
          }
        />
        <ToolOutput
          label={outputLabel}
          value={result.output}
          placeholder={outputPlaceholder}
          actions={
            <>
              <CopyButton text={result.output} />
              <DownloadButton text={result.output} filename={downloadFilename} mime={downloadMime} />
            </>
          }
        />
      </div>
      {result.error && <StatusBanner type="error" message={result.error} />}
      {!result.error && result.info && <StatusBanner type="success" message={result.info} />}
    </div>
  );
}
