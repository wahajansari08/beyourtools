"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import JsonEditor from "@/components/JsonEditor";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-editor");

export default function Page() {
  const [value, setValue] = useState('{\n  "id": 1,\n  "name": "Ada Lovelace",\n  "tags": ["math", "computing"]\n}');

  return (
    <ToolLayout
      eyebrow="JSON Editor"
      title="JSON Editor"
      description={content?.tagline ?? "Edit JSON with a live tree preview that syncs as you type."}
      category="Format & Validate"
      currentSlug="json-editor"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonEditor value={value} onChange={setValue} />
    </ToolLayout>
  );
}
