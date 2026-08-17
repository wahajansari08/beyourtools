import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonSchemaGeneratorClient from "./JsonSchemaGeneratorClient";

export const metadata: Metadata = {
  title: "JSON Schema Generator — Jsonifyr",
  description: "Infer a JSON Schema (draft-07) from any JSON sample automatically.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Schema Generator"
      title="JSON Schema Generator"
      description="Paste a JSON sample and get a draft-07 JSON Schema inferred from its structure and types instantly."
      category="Generate & Schema"
      currentSlug="json-schema-generator"
    >
      <JsonSchemaGeneratorClient />
    </ToolLayout>
  );
}
