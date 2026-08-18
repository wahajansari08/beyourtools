import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonGeneratorClient from "./JsonGeneratorClient";

export const metadata: Metadata = {
  title: "JSON Generator - BeYourTools",
  description: "Generate realistic mock JSON data from a template using {{placeholder}} syntax.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Generator"
      title="JSON Generator"
      description={`Write a JSON template with {{placeholder}} values and generate realistic mock data. Supports name, email, uuid, date, integer, boolean, and more.`}
      category="Generate & Schema"
      currentSlug="json-generator"
    >
      <JsonGeneratorClient />
    </ToolLayout>
  );
}
