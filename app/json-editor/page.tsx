"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import JsonEditor from "@/components/JsonEditor";

export default function Page() {
  const [value, setValue] = useState('{\n  "id": 1,\n  "name": "Ada Lovelace",\n  "tags": ["math", "computing"]\n}');

  return (
    <ToolLayout
      eyebrow="JSON Editor"
      title="JSON Editor"
      description="Edit JSON directly and see a live, structured preview update as you type."
      category="Format & Validate"
      currentSlug="json-editor"
    >
      <JsonEditor value={value} onChange={setValue} />
    </ToolLayout>
  );
}
