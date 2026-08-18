import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ValidatorClient from "./ValidatorClient";

export const metadata: Metadata = {
  title: "JSON Validator - BeYourTools",
  description: "Validate JSON syntax and get precise line and column error locations.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Validator"
      title="JSON Validator"
      description="Check whether your JSON is syntactically valid, with the exact line and column of any error."
      category="Format & Validate"
      currentSlug="json-validator"
    >
      <ValidatorClient />
    </ToolLayout>
  );
}
