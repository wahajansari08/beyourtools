"use client";

import { useCallback } from "react";
import TextTransformTool from "@/components/TextTransformTool";
import { repairJson } from "@/lib/json/repair";

export default function RepairClient() {
  const transform = useCallback((input: string) => {
    const result = repairJson(input);
    let info: string | null = null;
    if (!result.error) {
      if (result.wasAlreadyValid) info = "This JSON was already valid — no fixes needed.";
      else if (result.fixes.length > 0) info = `Fixed: ${result.fixes.join(", ")}.`;
    }
    return { output: result.output, error: result.error, info };
  }, []);

  return (
    <TextTransformTool
      inputLabel="Broken JSON"
      outputLabel="Repaired JSON"
      placeholder={"{\n  name: 'Ada',\n  active: true,\n  tags: [1, 2, 3,],\n}"}
      transform={transform}
      downloadFilename="repaired.json"
      downloadMime="application/json"
    />
  );
}
