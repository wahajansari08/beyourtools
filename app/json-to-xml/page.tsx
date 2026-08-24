import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToXmlClient from "./JsonToXmlClient";

export const metadata: Metadata = {
  title: "JSON to XML - BeYourTools",
  description: "Convert JSON objects into XML markup.",
  alternates: { canonical: "https://beyourtools.com/json-to-xml" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → XML"
      title="JSON to XML"
      description="Convert a JSON object into well-formed XML markup."
      category="Convert"
      currentSlug="json-to-xml"
    >
      <JsonToXmlClient />
    </ToolLayout>
  );
}
