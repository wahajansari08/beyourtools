"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import FileUploader from "@/components/FileUploader";
import CopyButton from "@/components/CopyButton";
import { estimateTokens } from "@/lib/encoders/tokens";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-mist-400">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-mist-50">{value}</p>
    </div>
  );
}

export default function TokenCounterClient() {
  const [input, setInput] = useState("");
  const stats = useMemo(() => estimateTokens(input), [input]);

  return (
    <div className="space-y-4">
      <ToolInput
        label="JSON or text"
        value={input}
        onChange={setInput}
        placeholder='{"messages":[{"role":"user","content":"Hello!"}]}'
        rows={14}
        actions={
          <>
            <FileUploader onFileText={(text) => setInput(text)} />
            <CopyButton text={input} />
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Est. tokens" value={stats.estimatedTokens.toLocaleString()} />
        <StatCard label="Characters" value={stats.characters.toLocaleString()} />
        <StatCard label="Words" value={stats.words.toLocaleString()} />
        <StatCard label="Bytes" value={stats.bytes.toLocaleString()} />
      </div>
      <p className="text-xs text-mist-400">
        This is a character-based approximation, not an exact tokenizer count — actual usage varies by model.
      </p>
    </div>
  );
}
