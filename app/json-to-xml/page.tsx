import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToXmlClient from "./JsonToXmlClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-xml");

export const metadata: Metadata = {
  title: "JSON to XML Converter - Free Online | BeYourTools",
  description: content?.tagline ?? "Convert JSON objects and arrays to well-formed XML markup.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-xml` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-xml`,
    title: "JSON to XML Converter - Free Online | BeYourTools",
    description: "Convert JSON to XML with configurable root element names.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to XML" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to XML Converter - Free Online | BeYourTools",
    description: "Convert JSON to XML with configurable root element names.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON to XML"
      title="JSON to XML"
      description={content?.tagline ?? "Convert JSON objects and arrays to well-formed XML markup."}
      category="Convert"
      currentSlug="json-to-xml"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonToXmlClient />
    </ToolLayout>
  );
}
