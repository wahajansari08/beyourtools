import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
  faqSchema,
  howToSchema,
  SITE,
  canonical,
} from "@/lib/seo";
import { designTools, relatedDesignTools, relatedToolsCrossCategory, type DesignTool } from "@/lib/design-tools-config";
import { imageTools, type ImageToolDef } from "@/lib/image-tools-config";
import { getTranslations } from "next-intl/server";
import { contentLocale, getTranslatedToolContent, type ToolContentEntry } from "@/lib/i18n-content";

/** Build Next.js metadata for a design tool page. */
export function designToolMetadata(tool: DesignTool | ImageToolDef): Metadata {
  const url = canonical(`/${tool.slug}`);
  return {
    title: tool.title,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: { canonical: `${SITE.url}/${tool.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title: tool.title,
      description: tool.metaDescription,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.metaDescription,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

/**
 * Shared page shell for all design tool pages: breadcrumb, header,
 * the interactive client tool, How-to, Features, FAQ and related tools.
 */
export default async function DesignToolPageShell({
  tool,
  client,
}: {
  tool: DesignTool | ImageToolDef;
  client: ReactNode;
}) {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  // Translated overrides (English fallback when untranslated)
  const tc: ToolContentEntry | undefined =
    (await getTranslatedToolContent(locale, `imagetool:${tool.slug}`)) ??
    (await getTranslatedToolContent(locale, `design:${tool.slug}`));
  const tName = tc?.name ?? tool.name;
  const tTagline = tc?.tagline ?? tool.tagline;
  const tHowTo = tc?.howTo ?? tool.howTo;
  const tFeatures = tc?.features ?? tool.features;
  const tFaqs = tc?.faqs ?? tool.faqs;
  const related = relatedToolsCrossCategory(tool.slug, tool.related, 4);
  const isImageTool = imageTools.some((t) => t.slug === tool.slug);
  const hubName = isImageTool ? "Image Tools" : "Design Tools";
  const hubHref = isImageTool ? "/image-converter" : "/design-tools";

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: hubName, url: canonical(hubHref) },
      { name: tName, url: canonical(`/${tool.slug}`) },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools ${tName}`,
      description: tool.description,
      url: canonical(`/${tool.slug}`),
      category: "MultimediaApplication",
    }),
    howToSchema({
      name: tool.howTo.name,
      description: tool.howTo.description,
      steps: tool.howTo.steps,
    }),
    faqSchema(tool.faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
            BeYourTools
          </Link>
          <span>/</span>
          <Link href={hubHref} className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
            {hubName}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{tool.name}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>
            {hubName}
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {tName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {tTagline}
          </p>
        </div>

        {/* Tool */}
        {client}

        {/* How to use */}
        <section className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {typeof tHowTo === "object" && !Array.isArray(tHowTo) && "name" in tHowTo ? tHowTo.name : `${t("howToUse")} ${tName}`}
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {(typeof tHowTo === "object" && !Array.isArray(tHowTo) && "steps" in tHowTo ? tHowTo.steps : []).map((s, i) => (
              <li key={s.name} className="flex gap-2">
                <span className="font-semibold" style={{ color: "var(--accent-text)" }}>
                  {i + 1}.
                </span>
                <span>
                  <strong style={{ color: "var(--text-secondary)" }}>{s.name}:</strong> {s.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {tName} {t("features")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Array.isArray(tFeatures) ? tFeatures : []).map((f, i) => {
              const ft = typeof f === "string" ? { title: f, desc: "" } : f;
              return (
                <div
                  key={typeof f === "string" ? `${f}-${i}` : f.title}
                  className="rounded-lg border p-3"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {ft.title}
                  </p>
                  {ft.desc && (
                    <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      {ft.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {tName} {t("faqs")}
          </h2>
          {(tFaqs ?? []).map((f) => (
            <div key={f.question}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {f.question}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                {f.answer}
              </p>
            </div>
          ))}
        </section>

        {/* Related tools */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {t("relatedTools")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  className="focus-ring rounded-full border px-4 py-1.5 text-xs font-medium transition hover:-translate-y-0.5"
                  style={{
                    borderColor: "var(--border-strong)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Privacy note */}
        <div
          className="mt-10 rounded-lg border p-4 text-xs leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Privacy: </span>
          All processing happens locally in your browser. Your images are never uploaded to any server
          and never leave your device.
        </div>
      </div>
    </>
  );
}

/** Helper for page.tsx files to look up their tool config by slug. */
export function getPageTool(slug: string): DesignTool | ImageToolDef {
  const tool =
    designTools.find((t) => t.slug === slug) ?? imageTools.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Design/image tool not found: ${slug}`);
  return tool;
}
