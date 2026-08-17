import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import YamlToJsonClient from "./YamlToJsonClient";

export const metadata: Metadata = {
  title: "YAML to JSON — Jsonifyr",
  description: "Convert YAML documents into JSON.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="YAML → JSON"
      title="YAML to JSON"
      description="Paste a YAML document and convert it into JSON."
      category="Convert"
      currentSlug="yaml-to-json"
    >
      <YamlToJsonClient />
    </ToolLayout>
  );
}
