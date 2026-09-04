import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToYamlClient from "./JsonToYamlClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-yaml");

export const metadata: Metadata = {
  title: "JSON to YAML Converter - Free Online | BeYourTools",
  description: content?.tagline ?? "Convert JSON to clean, readable YAML with correct type handling.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-yaml` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-yaml`,
    title: "JSON to YAML Converter - Free Online | BeYourTools",
    description: "Convert JSON to YAML format instantly in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to YAML" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to YAML Converter - Free Online | BeYourTools",
    description: "Convert JSON to YAML format instantly in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON to YAML"
      title="JSON to YAML"
      description={content?.tagline ?? "Convert JSON to clean, readable YAML with correct type handling."}
      category="Convert"
      currentSlug="json-to-yaml"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonToYamlClient />
    </ToolLayout>
  );
}
