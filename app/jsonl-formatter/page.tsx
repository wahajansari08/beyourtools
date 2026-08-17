import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonlFormatterClient from "./JsonlFormatterClient";

export const metadata: Metadata = {
  title: "JSONL Formatter — Jsonifyr",
  description: "Pretty-print every line of a JSONL (newline-delimited JSON) file.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSONL Formatter"
      title="JSONL Formatter"
      description="Format each line of a JSONL file individually, keeping the newline-delimited structure intact."
      category="Format & Validate"
      currentSlug="jsonl-formatter"
    >
      <JsonlFormatterClient />
    </ToolLayout>
  );
}
