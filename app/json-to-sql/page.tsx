import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToSqlClient from "./JsonToSqlClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-sql");

export const metadata: Metadata = {
  title: "JSON to SQL Generator - Free Online | BeYourTools",
  description: content?.tagline ?? "Generate SQL CREATE TABLE and INSERT statements from a JSON array.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-sql` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-sql`,
    title: "JSON to SQL Generator - Free Online | BeYourTools",
    description: "Generate SQL statements from JSON arrays in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to SQL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to SQL Generator - Free Online | BeYourTools",
    description: "Generate SQL statements from JSON arrays in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON to SQL"
      title="JSON to SQL"
      description={content?.tagline ?? "Generate SQL CREATE TABLE and INSERT statements from a JSON array."}
      category="Convert"
      currentSlug="json-to-sql"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonToSqlClient />
    </ToolLayout>
  );
}
