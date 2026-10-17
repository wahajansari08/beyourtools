"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import StatusBanner from "@/components/StatusBanner";
import FileUploader from "@/components/FileUploader";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";
import { mergeJsonStrings } from "@/lib/json/merge";

export default function MergeClient() {
  const [base, setBase] = useState("");
  const [override, setOverride] = useState("");
  const result = useMemo(() => mergeJsonStrings(base, override), [base, override]);

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="Base object (A)"
          value={base}
          onChange={setBase}
          placeholder='{"name":"Ada","settings":{"theme":"dark"}}'
          rows={12}
          actions={<FileUploader onFileText={(text) => setBase(text)} />}
        />
        <ToolInput
          label="Override object (B)"
          value={override}
          onChange={setOverride}
          placeholder='{"settings":{"notifications":true}}'
          rows={12}
          actions={<FileUploader onFileText={(text) => setOverride(text)} />}
        />
      </div>
      <ToolOutput
        label="Merged result"
        value={result.output}
        placeholder="The merged JSON will appear here."
        actions={
          <>
            <CopyButton text={result.output} />
            <DownloadButton text={result.output} filename="merged.json" mime="application/json" />
          </>
        }
      />
      {result.error && <StatusBanner type="error" message={result.error} />}
    </div>
  );
}
