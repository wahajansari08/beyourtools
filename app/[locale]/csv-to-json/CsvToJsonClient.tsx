"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { csvToJson } from "@/lib/converters/csv";

export default function CsvToJsonClient() {
  const [delimiter, setDelimiter] = useState<"," | ";" | "\t">(",");

  const transform = useCallback(
    (input: string) => {
      const result = csvToJson(input, delimiter);
      return { output: result.output, error: result.error };
    },
    [delimiter]
  );

  return (
    <TextTransformTool
      inputLabel="CSV"
      outputLabel="JSON array"
      placeholder={"name,age\nAda,30\nGrace,34"}
      transform={transform}
      downloadFilename="data.json"
      downloadMime="application/json"
      acceptUpload=".csv,.txt"
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
