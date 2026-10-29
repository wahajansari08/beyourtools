import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CsvToJsonClient from "./CsvToJsonClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("csv-to-json");

const __enMetadata: Metadata = {
  title: "CSV to JSON Converter: Spreadsheet Rows to JSON | BeYourTools",
  description: content?.tagline ?? "Convert a CSV file to a JSON array with automatic type detection.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/csv-to-json` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/csv-to-json`,
    title: "CSV to JSON Converter: Spreadsheet Rows to JSON | BeYourTools",
    description: "Convert CSV files to JSON arrays in your browser, with quoted-field parsing and type detection.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "CSV to JSON" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to JSON Converter: Spreadsheet Rows to JSON | BeYourTools",
    description: "Convert CSV files to JSON arrays in your browser, with quoted-field parsing and type detection.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="CSV to JSON"
      title="CSV to JSON"
      description={content?.tagline ?? "Convert a CSV file to a JSON array with automatic type detection."}
      category="Convert"
      currentSlug="csv-to-json"
      howTo={content?.howTo}
      faqs={content?.faqs}
      pairGuide={content?.pairGuide}
    >
      <CsvToJsonClient />
    </ToolLayout>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "csv-to-json", __enMetadata);
}
