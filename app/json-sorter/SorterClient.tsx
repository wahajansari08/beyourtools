"use client";

import { useCallback, useState } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import SegmentedControl from "@/components/SegmentedControl";
import { sortJsonKeys } from "@/lib/json/sorter";

export default function SorterClient() {
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const transform = useCallback(
    (input: string) => {
      const result = sortJsonKeys(input, order, 2);
      return { output: result.output, error: result.error };
    },
    [order]
  );

  return (
    <TextTransformTool
      inputLabel="Unsorted JSON"
      outputLabel="Sorted JSON"
      placeholder='{"name":"Ada","id":1,"active":true}'
      transform={transform}
      downloadFilename="sorted.json"
      downloadMime="application/json"
      toolbar={
        <SegmentedControl
          label="Order"
          value={order}
          onChange={setOrder}
          options={[
            { value: "asc", label: "A → Z" },
            { value: "desc", label: "Z → A" },
          ]}
        />
      }
    />
  );
}
