import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToXmlClient from "./JsonToXmlClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-xml");

const __enMetadata: Metadata = {
  title: "JSON to XML Converter: JSON to Well-Formed XML | BeYourTools",
  description: content?.tagline ?? "Convert JSON objects and arrays to well-formed XML markup.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-xml` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-xml`,
    title: "JSON to XML Converter: JSON to Well-Formed XML | BeYourTools",
    description: "Convert JSON objects and arrays to well-formed XML in your browser, with a root element you choose.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to XML" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to XML Converter: JSON to Well-Formed XML | BeYourTools",
    description: "Convert JSON objects and arrays to well-formed XML in your browser, with a root element you choose.",
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
      pairGuide={content?.pairGuide}
    >
      <JsonToXmlClient />
    </ToolLayout>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "json-to-xml", __enMetadata);
}
