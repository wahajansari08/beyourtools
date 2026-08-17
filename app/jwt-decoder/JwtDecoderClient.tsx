"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import StatusBanner from "@/components/StatusBanner";
import CopyButton from "@/components/CopyButton";
import { decodeJwt } from "@/lib/encoders/jwt";

export default function JwtDecoderClient() {
  const [token, setToken] = useState("");
  const result = useMemo(() => decodeJwt(token), [token]);

  const headerText = result.header ? JSON.stringify(result.header, null, 2) : "";
  const payloadText = result.payload ? JSON.stringify(result.payload, null, 2) : "";

  return (
    <div className="space-y-3">
      <ToolInput
        label="JWT"
        value={token}
        onChange={setToken}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        error={result.error}
        rows={6}
        actions={<CopyButton text={token} />}
      />
      {token.trim() && result.error && <StatusBanner type="error" message={result.error} />}
      {token.trim() && !result.error && (
        <>
          {result.expiresAt && (
            <StatusBanner
              type={result.expired ? "error" : "success"}
              message={result.expired ? `Token expired at ${result.expiresAt}` : `Token valid until ${result.expiresAt}`}
            />
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <ToolOutput label="Header" value={headerText} actions={<CopyButton text={headerText} />} />
            <ToolOutput label="Payload" value={payloadText} actions={<CopyButton text={payloadText} />} />
          </div>
          <div className="rounded-lg border border-ink-700 bg-ink-900 px-3.5 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-mist-400">Signature</span>
            <p className="mt-1 break-all font-mono text-xs text-mist-400">{result.signature}</p>
          </div>
        </>
      )}
    </div>
  );
}
