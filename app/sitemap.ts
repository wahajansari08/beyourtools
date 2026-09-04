import type { MetadataRoute } from "next";
import { tools, categories as jsonCategories } from "@/lib/tools-config";
import { pdfTools, pdfToolCategories } from "@/lib/pdf-tools-config";
import { conversionRoutes, formats, routesBySourceFormat } from "@/lib/image-tools-config";
import { blogPosts } from "@/lib/blog";
import { videoTools, videoCategories } from "@/lib/video-tools-config";
import { audioTools, audioCategories } from "@/lib/audio-tools-config";
import { qrBarcodeTools, qrBarcodeCategories } from "@/lib/qr-barcode-config";
import { financeTools, financeClusters, clusterSlugs } from "@/lib/finance-tools-config";

const BASE = "https://beyourtools.com";
const now  = new Date().toISOString();

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function url(
  path: string,
  opts: { freq?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number; lastMod?: string } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE}${path}`,
    lastModified: opts.lastMod ?? now,
    changeFrequency: opts.freq ?? "monthly",
    priority: opts.priority ?? 0.7,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static / category pages ────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    url("/",                     { freq: "weekly",  priority: 1.0 }),
    url("/json-tools",            { freq: "weekly",  priority: 0.9 }),
    url("/image-converter",       { freq: "weekly",  priority: 0.9 }),
    url("/pdf-tools",             { freq: "weekly",  priority: 0.9 }),
    url("/video-tools",           { freq: "weekly",  priority: 0.9 }),
    url("/audio-tools",           { freq: "weekly",  priority: 0.9 }),
    url("/qr-barcode-tools",      { freq: "weekly",  priority: 0.9 }),
    url("/finance-tools",         { freq: "weekly",  priority: 0.9 }),
    url("/blog",                  { freq: "daily",   priority: 0.8 }),
    url("/about",          { freq: "monthly", priority: 0.5 }),
    url("/contact",        { freq: "monthly", priority: 0.5 }),
    url("/privacy-policy", { freq: "monthly", priority: 0.4 }),
    url("/terms",          { freq: "monthly", priority: 0.4 }),
    url("/cookie-policy",  { freq: "monthly", priority: 0.4 }),
    url("/disclaimer",     { freq: "monthly", priority: 0.4 }),
  ];

  // ── JSON sub-category pages ────────────────────────────────────────────────
  const jsonCategoryPages: MetadataRoute.Sitemap = jsonCategories.map((c) =>
    url(`/json-tools/${toSlug(c)}`, { freq: "weekly", priority: 0.85 })
  );

  // ── JSON tools ─────────────────────────────────────────────────────────────
  const jsonToolPages: MetadataRoute.Sitemap = tools.map((t) =>
    url(`/${t.slug}`, { priority: 0.8 })
  );

  // ── PDF sub-category pages ─────────────────────────────────────────────────
  const pdfCategoryPages: MetadataRoute.Sitemap = pdfToolCategories.map((c) =>
    url(`/pdf-tools/category/${toSlug(c)}`, { freq: "weekly", priority: 0.85 })
  );

  // ── PDF tools ──────────────────────────────────────────────────────────────
  const pdfToolPages: MetadataRoute.Sitemap = pdfTools.map((t) =>
    url(`/pdf-tools/${t.slug}`, { priority: 0.7 })
  );

  // ── Image format group pages ───────────────────────────────────────────────
  const bySource = routesBySourceFormat();
  const imageFormatPages: MetadataRoute.Sitemap = formats
    .filter((f) => (bySource[f.id]?.length ?? 0) > 0)
    .map((f) => url(`/image-converter/from/${f.id}`, { freq: "weekly", priority: 0.85 }));

  // ── Image converters ───────────────────────────────────────────────────────
  const imagePages: MetadataRoute.Sitemap = conversionRoutes.map((r) =>
    url(`/image-converter/${r.slug}`, { priority: 0.75 })
  );

  // ── Image converter index ──────────────────────────────────────────────────
  const imageIndexPage: MetadataRoute.Sitemap = [
    url("/image-converter", { freq: "weekly", priority: 0.9 }),
  ];

  // ── Video sub-category pages ───────────────────────────────────────────────
  const videoCategoryPages: MetadataRoute.Sitemap = videoCategories.map((c) =>
    url(`/video-tools/${toSlug(c)}`, { freq: "weekly", priority: 0.85 })
  );

  // ── Video tools ────────────────────────────────────────────────────────────
  const videoPages: MetadataRoute.Sitemap = videoTools.map((t) =>
    url(`/${t.slug}`, { priority: 0.8 })
  );

  // ── Audio sub-category pages ───────────────────────────────────────────────
  const audioCategoryPages: MetadataRoute.Sitemap = audioCategories.map((c) =>
    url(`/audio-tools/${toSlug(c)}`, { freq: "weekly", priority: 0.85 })
  );

  // ── Audio tools ────────────────────────────────────────────────────────────
  const audioPages: MetadataRoute.Sitemap = audioTools.map((t) =>
    url(`/${t.slug}`, { priority: 0.8 })
  );

  // ── QR & Barcode sub-category pages ───────────────────────────────────────
  const qrBarcodeCategoryPages: MetadataRoute.Sitemap = qrBarcodeCategories.map((c) =>
    url(`/qr-barcode-tools/${toSlug(c)}`, { freq: "weekly", priority: 0.85 })
  );

  // ── QR & Barcode tools ─────────────────────────────────────────────────────
  const qrBarcodePages: MetadataRoute.Sitemap = qrBarcodeTools.map((t) =>
    url(`/${t.slug}`, { priority: 0.8 })
  );

  // ── Finance hub ────────────────────────────────────────────────────────────
  const financeClusterPages: MetadataRoute.Sitemap = financeClusters.map((c) =>
    url(`/finance-tools/${clusterSlugs[c]}`, { freq: "weekly", priority: 0.85 })
  );

  // ── Finance tools (individual) ─────────────────────────────────────────────
  const financeToolPages: MetadataRoute.Sitemap = financeTools.map((t) =>
    url(`/${t.slug}`, { priority: 0.8 })
  );

  // ── Blog posts ─────────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...staticPages,
    // Sub-category pages (high priority - between hub and tool pages)
    ...jsonCategoryPages,
    ...pdfCategoryPages,
    ...imageFormatPages,
    ...videoCategoryPages,
    ...audioCategoryPages,
    ...qrBarcodeCategoryPages,
    ...financeClusterPages,
    // Individual tool pages
    ...jsonToolPages,
    ...pdfToolPages,
    ...imageIndexPage,
    ...imagePages,
    ...videoPages,
    ...audioPages,
    ...qrBarcodePages,
    ...financeToolPages,
    ...blogPages,
  ];
}


