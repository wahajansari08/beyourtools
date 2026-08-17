import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToTypeScriptClient from "./JsonToTypeScriptClient";

export const metadata: Metadata = {
  title: "JSON to TypeScript — Jsonifyr",
  description: "Generate TypeScript interfaces from a JSON object or array automatically.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → TypeScript"
      title="JSON to TypeScript"
      description="Paste any JSON and get typed TypeScript interfaces generated instantly — no manual typing needed."
      category="Convert"
      currentSlug="json-to-typescript"
    >
      <JsonToTypeScriptClient />
    </ToolLayout>
  );
}
