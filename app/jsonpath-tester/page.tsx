import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonPathClient from "./JsonPathClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("jsonpath-tester");

export const metadata: Metadata = {
  title: "JSONPath Tester - Test JSONPath Expressions | BeYourTools",
  description: content?.tagline ?? "Run JSONPath expressions against any JSON document and see matching results in real time.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/jsonpath-tester` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/jsonpath-tester`,
    title: "JSONPath Tester - Test JSONPath Expressions | BeYourTools",
    description: "Evaluate JSONPath queries against JSON with live results.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSONPath Tester" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSONPath Tester - Test JSONPath Expressions | BeYourTools",
    description: "Evaluate JSONPath queries against JSON with live results.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSONPath Tester"
      title="JSONPath Tester"
      description={content?.tagline ?? "Run JSONPath expressions against any JSON document and see matching results in real time."}
      category="Compare & Manipulate"
      currentSlug="jsonpath-tester"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonPathClient />
    </ToolLayout>
  );
}
