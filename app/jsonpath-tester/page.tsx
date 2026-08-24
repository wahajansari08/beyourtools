import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonPathClient from "./JsonPathClient";

export const metadata: Metadata = {
  title: "JSONPath Tester - BeYourTools",
  description: "Run JSONPath expressions against your JSON data and see matching results instantly.",
  alternates: { canonical: "https://beyourtools.com/jsonpath-tester" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSONPath Tester"
      title="JSONPath Tester"
      description="Paste your JSON and write a JSONPath expression to query it. Supports dot notation, wildcards, array slices, filters, and recursive descent."
      category="Compare & Manipulate"
      currentSlug="jsonpath-tester"
    >
      <JsonPathClient />
    </ToolLayout>
  );
}
