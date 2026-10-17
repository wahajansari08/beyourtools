"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { jsonToCsv } from "@/lib/converters/csv";

export default function JsonToCsvClient() {
  const [delimiter, setDelimiter] = useState<"," | ";" | "\t">(",");

  const transform = useCallback(
    (input: string) => {
      const result = jsonToCsv(input, delimiter);
      return { output: result.output, error: result.error };
    },
    [delimiter]
  );

  return (
    <TextTransformTool
      inputLabel="JSON array"
      outputLabel="CSV"
      placeholder={'[\n  {"name":"Ada","age":30},\n  {"name":"Grace","age":34}\n]'}
      transform={transform}
      downloadFilename="data.csv"
      downloadMime="text/csv"
      toolbar={
        <SegmentedControl
          label="Delimiter"
          value={delimiter}
          onChange={setDelimiter}
          options={[
            { value: ",", label: "Comma" },
            { value: ";", label: "Semicolon" },
            { value: "\t", label: "Tab" },
          ]}
        />
      }
    />
  );
}
