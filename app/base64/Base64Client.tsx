"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { base64Encode, base64Decode } from "@/lib/encoders/base64";

export default function Base64Client() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const transform = useCallback(
    (input: string) => {
      if (!input.trim()) return { output: "", error: null };
      const result = mode === "encode" ? base64Encode(input) : base64Decode(input);
      return { output: result.output, error: result.error };
    },
    [mode]
  );

  return (
    <TextTransformTool
      inputLabel={mode === "encode" ? "Plain text" : "Base64"}
      outputLabel={mode === "encode" ? "Base64" : "Plain text"}
      placeholder={mode === "encode" ? '{"hello":"world"}' : "eyJoZWxsbyI6IndvcmxkIn0="}
      transform={transform}
      downloadFilename={mode === "encode" ? "encoded.txt" : "decoded.txt"}
      toolbar={
        <SegmentedControl
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "Encode" },
            { value: "decode", label: "Decode" },
          ]}
        />
      }
    />
  );
}
