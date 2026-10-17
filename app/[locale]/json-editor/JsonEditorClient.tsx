"use client";

import { useState } from "react";
import JsonEditor from "@/components/JsonEditor";

export default function JsonEditorClient() {
  const [value, setValue] = useState('{\n  "id": 1,\n  "name": "Ada Lovelace",\n  "tags": ["math", "computing"]\n}');

  return <JsonEditor value={value} onChange={setValue} />;
}
