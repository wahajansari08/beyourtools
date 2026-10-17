"use client";

import { useEffect, useState } from "react";
import Btn from "@/components/Btn";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import CopyButton from "@/components/CopyButton";
import SegmentedControl from "@/components/SegmentedControl";

type Direction = "encode" | "decode";
type Mode = "component" | "uri";

const DECODE_ERROR =
  "Could not decode that input - it is not valid percent-encoding (for example, a stray % not followed by two hex digits). Showing the last valid result instead.";

export default function UrlEncoderDecoderClient() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [mode, setMode] = useState<Mode>("component");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Live conversion. On failure we keep the last good output and show an error.
  useEffect(() => {
    if (input === "") {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const fn =
        direction === "encode"
          ? mode === "component"
            ? encodeURIComponent
            : encodeURI
          : mode === "component"
            ? decodeURIComponent
            : decodeURI;
      setOutput(fn(input));
      setError(null);
    } catch {
      setError(direction === "decode" ? DECODE_ERROR : "Could not encode that input.");
    }
  }, [input, direction, mode]);

  const swap = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError(null);
  };

  const inputLabel = direction === "encode" ? "Text to encode" : "URL to decode";
  const outputLabel = direction === "encode" ? "Encoded" : "Decoded";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <SegmentedControl<Direction>
          label="Mode"
          value={direction}
          onChange={setDirection}
          options={[
            { value: "encode", label: "Encode" },
            { value: "decode", label: "Decode" },
          ]}
        />

        <fieldset>
          <legend className="sr-only">Encoding scope</legend>
          <div className="flex items-center gap-4" role="radiogroup" aria-label="Encoding scope">
            <label className="focus-ring flex cursor-pointer items-center gap-1.5 rounded text-xs" style={{ color: "var(--text-muted)" }}>
              <input
                type="radio"
                name="url-encode-scope"
                value="component"
                checked={mode === "component"}
                onChange={() => setMode("component")}
                className="focus-ring h-3.5 w-3.5"
                style={{ accentColor: "var(--accent)" }}
              />
              Component (encodeURIComponent)
            </label>
            <label className="focus-ring flex cursor-pointer items-center gap-1.5 rounded text-xs" style={{ color: "var(--text-muted)" }}>
              <input
                type="radio"
                name="url-encode-scope"
                value="uri"
                checked={mode === "uri"}
                onChange={() => setMode("uri")}
                className="focus-ring h-3.5 w-3.5"
                style={{ accentColor: "var(--accent)" }}
              />
              Full URI (encodeURI)
            </label>
          </div>
        </fieldset>

        <Btn variant="secondary" size="sm" onClick={swap} disabled={!output}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M8 2.5a.75.75 0 0 1 .75.75v8.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V3.25A.75.75 0 0 1 8 2.5Z" transform="rotate(90 8 8)" />
          </svg>
          Swap
        </Btn>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label={inputLabel}
          value={input}
          onChange={setInput}
          placeholder={
            direction === "encode"
              ? "https://example.com/search?q=hello world&lang=en"
              : "https://example.com/search?q=hello%20world%26lang%3Den"
          }
          rows={10}
          actions={<CopyButton text={input} />}
        />
        <ToolOutput
          label={outputLabel}
          value={output}
          placeholder="Result will appear here."
          rows={10}
          actions={<CopyButton text={output} />}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border px-3.5 py-3 text-xs leading-relaxed"
          style={{ borderColor: "var(--coral)", backgroundColor: "color-mix(in srgb, var(--coral) 8%, transparent)", color: "var(--text-primary)" }}
        >
          {error}
        </div>
      )}

      <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
        {mode === "component"
          ? "Component mode encodes everything except unreserved characters - use it for individual query values."
          : "Full URI mode leaves : / ? & = # alone so a complete URL stays a valid URL."}
      </p>
    </div>
  );
}
