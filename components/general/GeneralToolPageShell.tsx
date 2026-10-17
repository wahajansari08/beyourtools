import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import { breadcrumbSchema, faqSchema, softwareApplicationSchema, SITE } from "@/lib/seo";
import type { GeneralTool } from "@/lib/general-tools-config";
import { relatedGeneralTools } from "@/lib/general-tools-config";
import { getTranslations } from "next-intl/server";
import { contentLocale, getTranslatedToolContent } from "@/lib/i18n-content";

/**
 * Shared page shell for Text Tools, Developer Tools and Calculators:
 * breadcrumb, header, the interactive client, How-to, Features, FAQ and related.
 */
export default async function GeneralToolPageShell({
  tool,
  client,
}: {
  tool: GeneralTool;
  client: ReactNode;
}) {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const tc = await getTranslatedToolContent(locale, `general:${tool.slug}`);
  const tName = tc?.name ?? tool.name;
  const tTagline = tc?.tagline ?? tool.tagline;
  const tHowTo = (tc?.howTo as { title: string; text: string }[] | undefined) ?? tool.howTo;
  const tFeatures = (tc?.features as string[] | undefined) ?? tool.features;
  const tFaqs = (tc?.faqs as { question: string; answer: string }[] | undefined) ?? tool.faqs;
  const related = relatedGeneralTools(tool.slug, 4);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: tool.category, url: SITE.url + tool.hub },
      { name: tName, url: SITE.url + `/${tool.slug}` },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools ${tName}`,
      description: tool.metaDescription,
      url: SITE.url + `/${tool.slug}`,
      category: "UtilitiesApplication",
    }),
    faqSchema(tool.faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
            BeYourTools
          </Link>
          <span>/</span>
          <Link href={tool.hub} className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
            {tool.category}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{tName}</span>
        </nav>

        {/* Header: answer-first intro */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>
            {tool.category}
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {tName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {tTagline}
          </p>
        </div>

        {/* Interactive tool */}
        {client}

        {/* Privacy note */}
        <div
          className="mt-8 rounded-lg border p-4 text-xs leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Private by design: </span>
          This tool runs entirely in your browser. Nothing you type or upload is sent to a server.
        </div>

        {/* How to */}
        <section className="mt-10" aria-labelledby={`${tool.slug}-howto`}>
          <h2 id={`${tool.slug}-howto`} className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("howToUse")} {tName}
          </h2>
          <ol className="space-y-3">
            {tHowTo.map((step, i) => (
              <li key={step.title} className="flex gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span>
                  <strong style={{ color: "var(--text-secondary)" }}>{step.title}.</strong> {step.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section className="mt-10" aria-labelledby={`${tool.slug}-features`}>
          <h2 id={`${tool.slug}-features`} className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {tName} {t("features")}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {tFeatures.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 rounded-lg border p-3 text-xs"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
              >
                <span style={{ color: "var(--accent-text)" }} aria-hidden="true">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-10" aria-labelledby={`${tool.slug}-faq`}>
          <h2 id={`${tool.slug}-faq`} className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {tName} {t("faqs")}
          </h2>
          <FaqAccordion faqs={tFaqs} />
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10" aria-labelledby={`${tool.slug}-related`}>
            <h2 id={`${tool.slug}-related`} className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {t("relatedTools")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="focus-ring group rounded-xl border p-4 transition hover-card"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{r.name}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{r.description}</p>
                  <span className="mt-2 inline-block text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                    Use tool →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

/** Metadata builder for general tool pages (title/description/keywords/OG). */
export function generalToolMetadata(tool: GeneralTool) {
  const url = `${SITE.url}/${tool.slug}`;
  return {
    title: tool.title,
    description: tool.metaDescription,
    keywords: tool.keywords.join(", "),
    robots: { index: true, follow: true } as const,
    openGraph: {
      type: "website" as const,
      url,
      title: tool.title,
      description: tool.metaDescription,
      siteName: SITE.name,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: tool.title,
      description: tool.metaDescription,
      images: [`${SITE.url}/og-default.png`],
    },
  };
}
