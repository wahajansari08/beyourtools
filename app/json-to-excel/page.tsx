import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToExcelClient from "./JsonToExcelClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-excel");

export const metadata: Metadata = {
  title: "JSON to Excel Converter - Free Online | BeYourTools",
  description: content?.tagline ?? "Export a JSON array of objects to a downloadable .xlsx Excel workbook.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-excel` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-excel`,
    title: "JSON to Excel Converter - Free Online | BeYourTools",
    description: "Export JSON arrays to Excel .xlsx files in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to Excel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to Excel Converter - Free Online | BeYourTools",
    description: "Export JSON arrays to Excel .xlsx files in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON to Excel"
      title="JSON to Excel"
      description={content?.tagline ?? "Export a JSON array of objects to a downloadable .xlsx Excel workbook."}
      category="Convert"
      currentSlug="json-to-excel"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonToExcelClient />
    </ToolLayout>
  );
}
