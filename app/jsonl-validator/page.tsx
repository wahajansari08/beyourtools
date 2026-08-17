import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonlValidatorClient from "./JsonlValidatorClient";

export const metadata: Metadata = {
  title: "JSONL Validator — Jsonifyr",
  description: "Validate every line of a JSONL file independently and see exactly which lines fail.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSONL Validator"
      title="JSONL Validator"
      description="Check a newline-delimited JSON file line by line, with a report of exactly which lines are invalid."
      category="Format & Validate"
      currentSlug="jsonl-validator"
    >
      <JsonlValidatorClient />
    </ToolLayout>
  );
}
