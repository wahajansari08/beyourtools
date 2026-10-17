"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { formatJson } from "@/lib/json/formatter";
import { sortJsonKeys } from "@/lib/json/sorter";

export default function BeautifierClient() {
  const [sortKeys, setSortKeys] = useState<"off" | "on">("off");

  const transform = useCallback(
    (input: string) => {
      if (sortKeys === "on") {
        const result = sortJsonKeys(input, "asc", 2);
        return { output: result.output, error: result.error };
      }
      const result = formatJson(input, 2);
      return { output: result.output, error: result.error };
    },
    [sortKeys]
  );

  return (
    <TextTransformTool
      inputLabel="Messy JSON"
      outputLabel="Beautified JSON"
      placeholder='{"name":"Ada","tags":["math","cs"],"active":true}'
      transform={transform}
      downloadFilename="beautified.json"
      downloadMime="application/json"
      toolbar={
        <SegmentedControl
          label="Sort keys"
          value={sortKeys}
          onChange={setSortKeys}
          options={[
            { value: "off", label: "Original order" },
            { value: "on", label: "A → Z" },
          ]}
        />
      }
    />
  );
}
