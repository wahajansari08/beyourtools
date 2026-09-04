import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToCsvClient from "./JsonToCsvClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-csv");

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Free Online | BeYourTools",
  description: content?.tagline ?? "Convert a JSON array of objects to a CSV with auto-detected column headers.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-csv` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-csv`,
    title: "JSON to CSV Converter - Free Online | BeYourTools",
    description: "Convert JSON arrays to CSV files in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to CSV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to CSV Converter - Free Online | BeYourTools",
    description: "Convert JSON arrays to CSV files in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON to CSV"
      title="JSON to CSV"
      description={content?.tagline ?? "Convert a JSON array of objects to a CSV with auto-detected column headers."}
      category="Convert"
      currentSlug="json-to-csv"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonToCsvClient />
    </ToolLayout>
  );
}
