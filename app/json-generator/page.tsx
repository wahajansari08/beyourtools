import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonGeneratorClient from "./JsonGeneratorClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-generator");

export const metadata: Metadata = {
  title: "JSON Generator - Generate Mock JSON Data | BeYourTools",
  description: content?.tagline ?? "Generate realistic mock JSON data from a template using Faker-style helpers.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-generator` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-generator`,
    title: "JSON Generator - Generate Mock JSON Data | BeYourTools",
    description: "Generate fake JSON test data from templates in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Generator - Generate Mock JSON Data | BeYourTools",
    description: "Generate fake JSON test data from templates in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Generator"
      title="JSON Generator"
      description={content?.tagline ?? "Generate realistic mock JSON data from a template using Faker-style helpers."}
      category="Generate & Schema"
      currentSlug="json-generator"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonGeneratorClient />
    </ToolLayout>
  );
}
