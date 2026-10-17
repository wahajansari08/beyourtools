import { localizeMetadata, contentLocale, withPageCopy } from "@/lib/i18n-content";
import pagesEn from "@/content/en/pages.json";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema } from "@/lib/seo";

const __enMetadata: Metadata = {
  title: "Cookie Policy & Tracking Preferences | BeYourTools",
  description: "BeYourTools Cookie Policy. Learn which cookies we use, why, and how to control them.",
  alternates: { canonical: `${SITE.url}/cookie-policy` },
  openGraph: {
    title: "Cookie Policy & Tracking Preferences | BeYourTools",
    description: "BeYourTools Cookie Policy. Learn which cookies we use, why, and how to control them.",
    url: `${SITE.url}/cookie-policy`,
    type: "website",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools Cookie Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy & Tracking Preferences | BeYourTools",
    description: "BeYourTools Cookie Policy. Learn which cookies we use, why, and how to control them.",
    images: [`${SITE.url}/og-default.png`],
  },
  robots: { index: true, follow: true },
};

const EN_COPY = (
  pagesEn as unknown as Record<
    string,
    { title: string; effectiveLabel: string; effectiveDate: string; sections: { heading: string; html: string }[] }
  >
)["cookie-policy"];

export default async function CookiePolicyPage() {
  const locale = await contentLocale();
  const copy = await withPageCopy(locale, "cookie-policy", EN_COPY);
  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: copy.title, url: `${SITE.url}/cookie-policy` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{copy.title}</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>{copy.title}</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{copy.effectiveLabel.replace("{date}", copy.effectiveDate)}</p>

      <div className="policy-content mt-8 space-y-8">
        {copy.sections.map((sec: { heading: string; html: string }) => (
          <section key={sec.heading}>
            <h2>{sec.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: sec.html }} />
          </section>
        ))}
      </div>
    </div>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "cookie-policy", __enMetadata);
}
