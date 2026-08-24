import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToPythonClient from "./JsonToPythonClient";

export const metadata: Metadata = {
  title: "JSON to Python - BeYourTools",
  description: "Generate Python dataclasses from a JSON object or array automatically.",
  alternates: { canonical: "https://beyourtools.com/json-to-python" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → Python"
      title="JSON to Python"
      description="Convert JSON into typed Python dataclasses with correct type annotations - ready to drop into your project."
      category="Convert"
      currentSlug="json-to-python"
    >
      <JsonToPythonClient />
    </ToolLayout>
  );
}
