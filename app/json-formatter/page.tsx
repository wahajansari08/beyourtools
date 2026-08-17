import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FormatterClient from "./FormatterClient";

export const metadata: Metadata = {
  title: "JSON Formatter — Jsonifyr",
  description: "Pretty-print JSON with 2, 4, or tab indentation. Free, fast, runs in your browser.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Formatter"
      title="JSON Formatter"
      description="Paste minified or messy JSON and get a clean, indented version instantly."
      category="Format & Validate"
      currentSlug="json-formatter"
    >
      <FormatterClient />
    </ToolLayout>
  );
}
