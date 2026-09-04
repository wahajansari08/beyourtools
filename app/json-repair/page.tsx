import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RepairClient from "./RepairClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-repair");

export const metadata: Metadata = {
  title: "JSON Repair - Fix Broken JSON Online | BeYourTools",
  description: content?.tagline ?? "Automatically fix trailing commas, single quotes, unquoted keys, and other common JSON errors.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-repair` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-repair`,
    title: "JSON Repair - Fix Broken JSON Online | BeYourTools",
    description: "Automatically repair invalid JSON with common error fixes.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Repair" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Repair - Fix Broken JSON Online | BeYourTools",
    description: "Automatically repair invalid JSON with common error fixes.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Repair"
      title="JSON Repair"
      description={content?.tagline ?? "Automatically fix trailing commas, single quotes, unquoted keys, and other common JSON errors."}
      category="Format & Validate"
      currentSlug="json-repair"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <RepairClient />
    </ToolLayout>
  );
}
