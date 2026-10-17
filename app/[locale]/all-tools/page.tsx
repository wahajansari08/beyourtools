import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizeMetadata, contentLocale, getToolCopy } from "@/lib/i18n-content";
import { SITE } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { tools } from "@/lib/tools-config";
import { pdfTools } from "@/lib/pdf-tools-config";
import { conversionRoutes, imageTools } from "@/lib/image-tools-config";
import { videoTools } from "@/lib/video-tools-config";
import { audioTools } from "@/lib/audio-tools-config";
import { qrBarcodeTools } from "@/lib/qr-barcode-config";
import { designTools } from "@/lib/design-tools-config";
import { generalTools } from "@/lib/general-tools-config";
import { financeTools } from "@/lib/finance-tools-config";
import AllToolsClient, { type ToolGroup } from "./AllToolsClient";

const __enMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "All Tools - Browse Every Free Online Tool | BeYourTools",
  description:
    "Browse all 300+ free online tools: JSON, image, PDF, video, audio, QR codes, finance, text, developer tools and calculators. No sign-up, 100% private.",
  keywords:
    "all tools, free online tools, tool directory, json tools, pdf tools, image converter, calculators",
  alternates: { canonical: `${SITE.url}/all-tools` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/all-tools`,
    siteName: SITE.name,
    title: "All Tools | BeYourTools",
    description: "Every free BeYourTools tool in one searchable index.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools - All Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Tools | BeYourTools",
    description: "Every free tool in one searchable index. No sign-up.",
    images: [`${SITE.url}/og-default.png`],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "allTools", __enMetadata);
}

type RawTool = { slug: string; href: string };

async function resolveItems(locale: string, raw: RawTool[]) {
  return Promise.all(
    raw.map(async ({ slug, href }) => {
      const copy = await getToolCopy(locale, slug);
      return {
        slug,
        href,
        name: copy.name ?? slug,
        description: copy.description ?? "",
      };
    })
  );
}

function pairName(slug: string): string {
  const [from, , to] = slug.split("-");
  return `${from.toUpperCase()} to ${to.toUpperCase()}`;
}

export default async function AllToolsPage() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "allTools" });

  const groups: ToolGroup[] = [
    {
      key: "json",
      title: t("groups.json"),
      tools: await resolveItems(locale, tools.map((x) => ({ slug: x.slug, href: `/${x.slug}` }))),
    },
    {
      key: "image",
      title: t("groups.image"),
      tools: [
        ...(await resolveItems(locale, imageTools.map((x) => ({ slug: x.slug, href: `/${x.slug}` })))),
        ...(await resolveItems(
          locale,
          conversionRoutes.map((r) => ({ slug: r.slug, href: `/image-converter/${r.slug}` }))
        )),
      ],
    },
    {
      key: "design",
      title: t("groups.design"),
      tools: await resolveItems(locale, designTools.map((x) => ({ slug: x.slug, href: `/${x.slug}` }))),
    },
    {
      key: "pdf",
      title: t("groups.pdf"),
      tools: await resolveItems(locale, pdfTools.map((x) => ({ slug: x.slug, href: `/pdf-tools/${x.slug}` }))),
    },
    {
      key: "video",
      title: t("groups.video"),
      tools: await resolveItems(locale, videoTools.map((x) => ({ slug: x.slug, href: `/${x.slug}` }))),
    },
    {
      key: "audio",
      title: t("groups.audio"),
      tools: await resolveItems(locale, audioTools.map((x) => ({ slug: x.slug, href: `/${x.slug}` }))),
    },
    {
      key: "qr",
      title: t("groups.qr"),
      tools: await resolveItems(locale, qrBarcodeTools.map((x) => ({ slug: x.slug, href: `/${x.slug}` }))),
    },
    {
      key: "finance",
      title: t("groups.finance"),
      tools: await resolveItems(locale, financeTools.map((x) => ({ slug: x.slug, href: `/${x.slug}` }))),
    },
    {
      key: "text",
      title: t("groups.text"),
      tools: await resolveItems(
        locale,
        generalTools.filter((x) => x.category === "Text Tools").map((x) => ({ slug: x.slug, href: `/${x.slug}` }))
      ),
    },
    {
      key: "dev",
      title: t("groups.dev"),
      tools: await resolveItems(
        locale,
        generalTools.filter((x) => x.category === "Developer Tools").map((x) => ({ slug: x.slug, href: `/${x.slug}` }))
      ),
    },
    {
      key: "calc",
      title: t("groups.calc"),
      tools: await resolveItems(
        locale,
        generalTools.filter((x) => x.category === "Calculators").map((x) => ({ slug: x.slug, href: `/${x.slug}` }))
      ),
    },
  ];

  // Image pair entries may lack a translated name; fall back to a readable pair name.
  for (const g of groups) {
    for (const tool of g.tools) {
      if (!tool.name || tool.name === tool.slug) tool.name = pairName(tool.slug);
    }
  }

  const total = groups.reduce((n, g) => n + g.tools.length, 0);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t("title"),
            description: t("sub"),
            url: `${SITE.url}/all-tools`,
            numberOfItems: total,
          },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: t("title"), href: "/all-tools" }]} />
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-muted)" }}>
          {t("sub")}
        </p>
        <AllToolsClient groups={groups} total={total} />
      </div>
    </>
  );
}
