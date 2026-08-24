import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToTypeScriptClient from "./JsonToTypeScriptClient";

export const metadata: Metadata = {
  title: "JSON to TypeScript - BeYourTools",
  description: "Generate TypeScript interfaces from a JSON object or array automatically.",
  alternates: { canonical: "https://beyourtools.com/json-to-typescript" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → TypeScript"
      title="JSON to TypeScript"
      description="Paste any JSON and get typed TypeScript interfaces generated instantly - no manual typing needed."
      category="Convert"
      currentSlug="json-to-typescript"
    >
      <JsonToTypeScriptClient />
    </ToolLayout>
  );
}
