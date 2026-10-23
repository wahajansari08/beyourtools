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
  const [recursive, setRecursive] = useState(false);
  const [plusAsSpace, setPlusAsSpace] = useState(false);
  const [perLine, setPerLine] = useState(false);

  // Live conversion. On failure we keep the last good output and show an error.
  useEffect(() => {
    if (input === "") {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const single = (s: string): string => {
        const fn =
          direction === "encode"
            ? mode === "component"
              ? encodeURIComponent
              : encodeURI
            : mode === "component"
              ? decodeURIComponent
              : decodeURI;
        let value = direction === "decode" && plusAsSpace ? s.replace(/\+/g, " ") : s;
        let passes = 0;
        let next = fn(value);
        if (direction === "decode" && recursive) {
          // Keep decoding while the output still changes (up to 16 passes)
          // - handles double/triple-encoded strings.
          while (next !== value && passes < 16) {
            value = next;
            next = fn(value);
            passes += 1;
          }
          return value;
        }
        return next;
      };
      setOutput(perLine ? input.split("\n").map(single).join("\n") : single(input));
      setError(null);
    } catch {
      setError(direction === "decode" ? DECODE_ERROR : "Could not encode that input.");
    }
  }, [input, direction, mode, recursive, plusAsSpace, perLine]);

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

      <div className="flex flex-wrap items-center gap-2">
        {direction === "decode" && (
          <Btn variant="toggle" size="sm" selected={recursive} onClick={() => setRecursive((v) => !v)} aria-pressed={recursive}>
            Decode recursively
          </Btn>
        )}
        {direction === "decode" && (
          <Btn variant="toggle" size="sm" selected={plusAsSpace} onClick={() => setPlusAsSpace((v) => !v)} aria-pressed={plusAsSpace}>
            Treat + as space
          </Btn>
        )}
        <Btn variant="toggle" size="sm" selected={perLine} onClick={() => setPerLine((v) => !v)} aria-pressed={perLine}>
          Process each line separately
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

      <p className="text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
        {mode === "component"
          ? "Component mode encodes everything except unreserved characters - use it for individual query values."
          : "Full URI mode leaves : / ? & = # alone so a complete URL stays a valid URL."}{" "}
        {direction === "decode" && recursive && "Recursive decode repeats until the text stops changing (up to 16 passes) - paste double-encoded strings with confidence."}{" "}
        {direction === "decode" && plusAsSpace && "Plus signs are read as spaces, matching HTML form encoding."}{" "}
        {perLine && "Each line is converted on its own, so lists of URLs convert in one paste."}
      </p>
    </div>
  );
}
