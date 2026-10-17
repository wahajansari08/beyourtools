import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonEditorClient from "./JsonEditorClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-editor");

const __enMetadata: Metadata = {
  title: "JSON Editor - Edit JSON Online with Live Preview | BeYourTools",
  description: content?.tagline ?? "Edit JSON with a live tree preview that syncs as you type.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-editor` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-editor`,
    title: "JSON Editor - Edit JSON Online with Live Preview | BeYourTools",
    description: "Edit JSON with a live tree preview that syncs as you type.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Editor - Edit JSON Online with Live Preview | BeYourTools",
    description: "Edit JSON with a live tree preview that syncs as you type.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "json-editor", __enMetadata);
}

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Editor"
      title="JSON Editor"
      description={content?.tagline ?? "Edit JSON with a live tree preview that syncs as you type."}
      category="Format & Validate"
      currentSlug="json-editor"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonEditorClient />
    </ToolLayout>
  );
}
