import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import XmlToJsonClient from "./XmlToJsonClient";

export const metadata: Metadata = {
  title: "XML to JSON - BeYourTools",
  description: "Convert XML documents into JSON.",
  alternates: { canonical: "https://beyourtools.com/xml-to-json" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="XML → JSON"
      title="XML to JSON"
      description="Paste XML markup and convert it into JSON."
      category="Convert"
      currentSlug="xml-to-json"
    >
      <XmlToJsonClient />
    </ToolLayout>
  );
}
