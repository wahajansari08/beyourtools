import type { Metadata } from "next";
import Link from "next/link";
import { formats, routesBySourceFormat, getFormat, type ImageFormat } from "@/lib/image-tools-config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";
import FormatSelectorClient from "./FormatSelectorClient";

export const metadata: Metadata = {
  title: "Image Converter - Free Online JPG PNG WebP AVIF SVG ICO Converter",
  description: "Free browser-based image converter. Convert between JPG, PNG, WebP, AVIF, GIF, BMP, SVG, ICO, PDF and more - 118 format combinations, no upload, no sign-up.",
  keywords: "image converter, JPG to PNG, PNG to JPG, JPG to WebP, PNG to WebP, image format converter, WebP converter, AVIF converter, SVG converter, free online image converter",
  alternates: { canonical: `${SITE.url}/image-converter` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", url: `${SITE.url}/image-converter`,
    title: "Image Converter - Free Online JPG PNG WebP Converter | BeYourTools",
    description: "118 image conversion combinations in your browser - JPG, PNG, WebP, AVIF, SVG, ICO, PDF. No upload needed.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Image Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Converter - Free Online JPG PNG WebP Converter",
    description: "118 image format conversions in your browser - no upload needed.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

const FORMAT_ICONS: Record<string, string> = {
  jpg:"🖼", png:"🖼", webp:"🌐", gif:"🎞", svg:"✏️",
  avif:"🗜", bmp:"🖼", tiff:"📷", ico:"🪟", heic:"📱",
  jxl:"🗜", psd:"🎨", tga:"🎮", pdf:"📄",
};

export default function ImageConverterHub() {
  const bySource = routesBySourceFormat();
  const activeSources = formats.filter((f) => bySource[f.id]?.length > 0);
  const totalRoutes = Object.values(bySource).reduce((s, r) => s + r.length, 0);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Image Converter", url: canonical("/image-converter") },
    ]),
    softwareApplicationSchema({
      name: "BeYourTools Image Converter",
      description: `${totalRoutes} free browser-based image conversion combinations including JPG, PNG, WebP, AVIF, SVG, ICO, BMP, TIFF and PDF.`,
      url: canonical("/image-converter"),
      category: "MultimediaApplication",
    }),
    faqSchema([
      { question: "How do I convert JPG to WebP for free?", answer: "Use our free JPG to WebP converter - drag and drop your JPG, download the WebP instantly. No upload to any server, no account required." },
      { question: "What image formats can I convert online?", answer: "We support 118 conversion combinations including JPG, PNG, WebP, AVIF, GIF, BMP, SVG, ICO, TIFF, HEIC, JXL, PSD, TGA, and PDF." },
      { question: "Does converting images reduce quality?", answer: "Lossless conversions (PNG to WebP lossless, PNG to BMP) preserve every pixel. Lossy conversions (JPG, WebP lossy) have a quality setting - use 80-85% for minimal visible quality loss." },
      { question: "Are my images uploaded to a server?", answer: "No - all image conversion happens locally in your browser. Your images never leave your device." },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>Image Converter</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          Image Converter
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Convert images between any format - entirely in your browser. Nothing is uploaded to a server.
          Supports JPG, PNG, WebP, AVIF, GIF, BMP, SVG, ICO, PDF, and more.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            {totalRoutes} conversions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            {activeSources.length} formats
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            100% in browser
          </span>
        </div>
      </div>

      {/* Format selector */}
      <FormatSelectorClient />

      {/* Popular */}
      <div className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Popular</h2>
        <div className="flex flex-wrap gap-2">
          {["jpg-to-png","jpg-to-webp","jpg-to-pdf","png-to-jpg","png-to-webp","png-to-svg","webp-to-jpg","webp-to-png","svg-to-png"].map((slug) => {
            const [from,,to] = slug.split("-");
            return (
              <Link
                key={slug}
                href={`/image-converter/${slug}`}
                className="focus-ring rounded-md border px-3 py-1.5 text-xs font-medium transition"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
              >
                {from.toUpperCase()} → {to.toUpperCase()}
              </Link>
            );
          })}
        </div>
      </div>

      {/* All conversions grouped by source */}
      <div className="space-y-10">
        {activeSources.map((fmt) => {
          const routes = bySource[fmt.id as ImageFormat] ?? [];
          return (
            <section key={fmt.id}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">{FORMAT_ICONS[fmt.id] ?? "🖼"}</span>
                <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {fmt.label} Converter
                </h2>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}
                >
                  {routes.length} targets
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {routes.map((route) => {
                  const toFmt = getFormat(route.to)!;
                  return (
                    <Link
                      key={route.slug}
                      href={`/image-converter/${route.slug}`}
                      className="focus-ring group flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition hover:-translate-y-0.5"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                    >
                      <span className="font-mono font-semibold" style={{ color: "var(--teal)" }}>{fmt.label}</span>
                      <span style={{ color: "var(--text-subtle)" }}>→</span>
                      <span className="font-mono font-semibold transition group-hover:opacity-80" style={{ color: "var(--accent)" }}>
                        {toFmt.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Note */}
      <div
        className="mt-12 rounded-lg border p-4 text-xs leading-relaxed"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
      >
        <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Browser support note: </span>
        Most conversions run entirely in your browser - no server needed.
        TIFF, HEIC, JXL, PSD, and TGA require decoding support that varies by browser;
        those converters will show a helpful message if your browser cannot handle the file.
      </div>
    </div>
    </>
  );
}
