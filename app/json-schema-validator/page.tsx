import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonSchemaValidatorClient from "./JsonSchemaValidatorClient";

export const metadata: Metadata = {
  title: "JSON Schema Validator - BeYourTools",
  description: "Validate JSON against a JSON Schema (draft-07) and see detailed error messages.",
  alternates: { canonical: "https://beyourtools.com/json-schema-validator" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Schema Validator"
      title="JSON Schema Validator"
      description="Paste your JSON and a JSON Schema to validate the data against it. Every violation is reported with its path."
      category="Generate & Schema"
      currentSlug="json-schema-validator"
    >
      <JsonSchemaValidatorClient />
    </ToolLayout>
  );
}
