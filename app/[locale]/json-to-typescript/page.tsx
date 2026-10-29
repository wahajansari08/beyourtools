import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToTypeScriptClient from "./JsonToTypeScriptClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-typescript");

const __enMetadata: Metadata = {
  title: "JSON to TypeScript: Generate Interfaces from JSON | BeYourTools",
  description: content?.tagline ?? "Generate TypeScript interface definitions from any JSON sample.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-typescript` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-typescript`,
    title: "JSON to TypeScript: Generate Interfaces from JSON | BeYourTools",
    description: "Generate TypeScript interfaces from a JSON sample in your browser, with nested types inferred automatically.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to TypeScript" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to TypeScript: Generate Interfaces from JSON | BeYourTools",
    description: "Generate TypeScript interfaces from a JSON sample in your browser, with nested types inferred automatically.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON to TypeScript"
      title="JSON to TypeScript"
      description={content?.tagline ?? "Generate TypeScript interface definitions from any JSON sample."}
      category="Convert"
      currentSlug="json-to-typescript"
      howTo={content?.howTo}
      faqs={content?.faqs}
      pairGuide={content?.pairGuide}
    >
      <JsonToTypeScriptClient />
    </ToolLayout>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "json-to-typescript", __enMetadata);
}
