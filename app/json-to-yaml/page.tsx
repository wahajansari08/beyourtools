import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToYamlClient from "./JsonToYamlClient";

export const metadata: Metadata = {
  title: "JSON to YAML - BeYourTools",
  description: "Convert JSON into clean, readable YAML.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → YAML"
      title="JSON to YAML"
      description="Convert JSON data into YAML - handy for config files, Kubernetes manifests, and CI pipelines."
      category="Convert"
      currentSlug="json-to-yaml"
    >
      <JsonToYamlClient />
    </ToolLayout>
  );
}
