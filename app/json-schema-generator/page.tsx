import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonSchemaGeneratorClient from "./JsonSchemaGeneratorClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-schema-generator");

export const metadata: Metadata = {
  title: "JSON Schema Generator - Free Online | BeYourTools",
  description: content?.tagline ?? "Infer a JSON Schema from any JSON sample with types detected automatically.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-schema-generator` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-schema-generator`,
    title: "JSON Schema Generator - Free Online | BeYourTools",
    description: "Generate JSON Schema from JSON samples automatically.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Schema Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Schema Generator - Free Online | BeYourTools",
    description: "Generate JSON Schema from JSON samples automatically.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="Schema Generator"
      title="JSON Schema Generator"
      description={content?.tagline ?? "Infer a JSON Schema from any JSON sample with types detected automatically."}
      category="Generate & Schema"
      currentSlug="json-schema-generator"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonSchemaGeneratorClient />
    </ToolLayout>
  );
}
