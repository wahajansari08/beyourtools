import { localizeMetadata, contentLocale, getHubCopy } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { designTools, designCategories, designByCategory, type DesignTool } from "@/lib/design-tools-config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";
import Btn from "@/components/Btn";

const __enMetadata: Metadata = {
  title: "Design Tools - Free Color Picker, Palette & Favicon Generator | BeYourTools",
  description:
    "3 free browser-based design tools: pick colors from any image, generate color palettes and create favicons. Fast, private, no file upload.",
  keywords:
    "design tools, color picker, color palette generator, favicon generator, free online design tools",
  alternates: { canonical: `${SITE.url}/design-tools` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/design-tools`,
    title: "Design Tools - Free Color Picker, Palette & Favicon Generator | BeYourTools",
    description: "3 free browser-based tools. Pick colors, generate palettes and create favicons privately in your browser.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Design Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Tools - Free Color Picker, Palette & Favicon Generator | BeYourTools",
    description: "3 free design tools - color picker, palettes, favicons. No upload needed.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "design-tools", __enMetadata);
}



const CATEGORY_COLORS: Record<(typeof designCategories)[number], { dot: string; bg: string; border: string; text: string }> = {
  "Color Tools":   { dot: "var(--accent-text)",   bg: "color-mix(in srgb,var(--accent-text) 10%,transparent)",   border: "color-mix(in srgb,var(--accent-text) 30%,transparent)",   text: "var(--accent-text)"   },
  "Favicons":      { dot: "var(--accent)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent)" },
  "Signature Tools": { dot: "var(--coral)", bg: "color-mix(in srgb,var(--coral) 10%,transparent)", border: "color-mix(in srgb,var(--coral) 30%,transparent)", text: "var(--coral)" },
};

function CategoryIconSvg({ category }: { category: string }) {
  if (category === "Color Tools") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399.078-.78.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.043-1.256m0 0a15.995 15.995 0 0 1-4.043 1.256m0 0a15.996 15.996 0 0 1-1.622 3.395m3.42-3.42a15.994 15.994 0 0 0-3.388 1.62M7.5 21l3.5-3.5" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
    </svg>
  );
}

function ToolCard({ tool }: { tool: DesignTool }) {
  const c = CATEGORY_COLORS[tool.category] ?? CATEGORY_COLORS["Color Tools"];
  return (
    <Link
      href={`/${tool.slug}`}
      className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            aria-hidden="true"
          >
            <CategoryIconSvg category={tool.category} />
          </span>
          <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {tool.name}
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {tool.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: c.bg, color: c.text }}
        >
          {tool.category}
        </span>
        <span className="text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>
          Use tool →
        </span>
      </div>
    </Link>
  );
}

const POPULAR = ["color-picker", "color-palette-generator", "favicon-generator"];

export default async function DesignToolsPage() {
  const locale = await contentLocale();
  const hub = await getHubCopy(locale, "design-tools");
const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "Design Tools", url: canonical("/design-tools") },
  ]),
  softwareApplicationSchema({
    name: "BeYourTools Design Tools",
    description: `${designTools.length} free browser-based design tools: color picker, color palette generator and favicon generator.`,
    url: canonical("/design-tools"),
    category: "MultimediaApplication",
  }),
  faqSchema(hub.faqs),
];
  const popularTools = POPULAR.map((s) => designTools.find((t) => t.slug === s)).filter(Boolean) as DesignTool[];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{hub.title}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>{hub.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{hub.intro}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${designTools.length} tools`, "100% browser-based", "Files never uploaded", "Fast & private"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent-text)" }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Popular quick links */}
        <div className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Popular Design Tools</h2>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((t) => (
              <Btn variant="pill" key={t.slug} href={`/${t.slug}`}>
                {t.name}
              </Btn>
            ))}
          </div>
        </div>

        {/* Tools by category */}
        <div className="space-y-12">
          {designCategories.map((cat) => {
            const tools = designByCategory(cat);
            const c = CATEGORY_COLORS[cat];
            return (
              <section key={cat}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dot }} aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>{cat}</h2>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}
                  >
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
                </div>
              </section>
            );
          })}
        </div>

        {/* Privacy note */}
        <div
          className="mt-12 rounded-lg border p-4 text-xs leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Privacy: </span>
          All design processing happens locally in your browser.
          Your images are never uploaded to any server and never leave your device.
        </div>
      </div>
    </>
  );
}
