import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  softwareApplicationSchema,
  SITE,
  canonical,
} from "@/lib/seo";
import {
  formats,
  getFormat,
  conversionsFrom,
  routesBySourceFormat,
  type ImageFormat,
} from "@/lib/image-tools-config";
import Btn from "@/components/Btn";

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const bySource = routesBySourceFormat();
  return formats
    .filter((f) => (bySource[f.id]?.length ?? 0) > 0)
    .map((f) => ({ format: f.id }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string }>;
}): Promise<Metadata> {
  const { format: fmtId } = await params;
  const fmt = getFormat(fmtId);
  if (!fmt) return {};

  const routes = conversionsFrom(fmt.id as ImageFormat);
  const targets = routes.map((r) => getFormat(r.to)?.label ?? r.to.toUpperCase()).join(", ");

  return {
    title: `${fmt.label} Image Converter - Convert ${fmt.label} to ${routes.slice(0, 4).map((r) => getFormat(r.to)?.label ?? r.to.toUpperCase()).join(", ")} and More | BeYourTools`,
    description: `Free online ${fmt.label} image converter. Convert ${fmt.label} files to ${targets}. All conversions run in your browser with no upload required.`,
    keywords: routes
      .map((r) => `${fmt.label} to ${getFormat(r.to)?.label ?? r.to.toUpperCase()}`)
      .concat([`${fmt.label} converter`, "image converter", "free online", "browser-based"])
      .join(", "),
    alternates: { canonical: `${SITE.url}/image-converter/from/${fmtId}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE.url}/image-converter/from/${fmtId}`,
      title: `${fmt.label} Image Converter | BeYourTools`,
      description: `Convert ${fmt.label} images to ${targets} in your browser. Free, instant, no upload.`,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: `${fmt.label} Converter` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fmt.label} Image Converter | BeYourTools`,
      description: `Convert ${fmt.label} images to ${targets} in your browser.`,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

// ── Format descriptions ───────────────────────────────────────────────────────

const FORMAT_DESC: Partial<Record<ImageFormat, { intro: string; faqs: { question: string; answer: string }[] }>> = {
  jpg: {
    intro: "JPG (JPEG) is the most widely used compressed image format, ideal for photographs and complex images. Convert your JPG files to PNG for transparency support, WebP for smaller file sizes, PDF for documents, or any of the other formats below.",
    faqs: [
      { question: "Does converting JPG to PNG improve quality?", answer: "No. JPG uses lossy compression, so once detail is lost it cannot be recovered. Converting to PNG preserves the current quality without further loss, but the PNG file will be larger." },
      { question: "What is the best format to convert JPG to for the web?", answer: "WebP is generally the best choice for the web: it produces files around 25-35% smaller than JPEG at equivalent visual quality. AVIF is even smaller but has slightly less browser support." },
      { question: "Can I convert JPG to PDF?", answer: "Yes. The JPG to PDF converter embeds your JPG image into a PDF document. You can also combine multiple JPG images into a single multi-page PDF." },
      { question: "Why does my converted file look different from the original?", answer: "If you convert to another lossy format (e.g. JPG to WebP), a small amount of re-encoding quality loss is expected. For lossless output, convert to PNG." },
    ],
  },
  png: {
    intro: "PNG is a lossless compressed format that supports transparency (alpha channel), making it ideal for graphics, logos, and images with flat colours or text. Convert PNG to JPG for smaller photo files, WebP for the web, or SVG for scalable vector use.",
    faqs: [
      { question: "Why is my PNG file so much larger than the equivalent JPG?", answer: "PNG uses lossless compression, which preserves every pixel exactly. JPG achieves smaller sizes through lossy compression that discards some image detail. For photographs, JPG is almost always the better choice for file size." },
      { question: "Can I convert PNG to SVG?", answer: "Yes, but the result is a raster image embedded in an SVG wrapper, not a true vector image. True vectorisation (tracing paths from raster pixels) requires specialised software." },
      { question: "Does converting PNG to JPG lose the transparency?", answer: "Yes. JPG does not support transparency. Transparent areas are filled with a background colour (usually white) when converting to JPG." },
      { question: "What is the best format to convert PNG to for email attachments?", answer: "JPG for photographs (much smaller), and PNG or WebP for graphics. Keep PNG for anything with text, logos, or sharp edges where quality matters." },
    ],
  },
  webp: {
    intro: "WebP is a modern image format developed by Google that provides superior compression for both lossy and lossless images compared to JPEG and PNG. Convert WebP files to JPG or PNG for broader compatibility with older tools and platforms.",
    faqs: [
      { question: "Why would I convert WebP to JPG or PNG?", answer: "WebP has excellent browser support but some older tools, email clients, and operating systems do not handle WebP natively. Converting to JPG or PNG ensures compatibility everywhere." },
      { question: "Is WebP lossless or lossy?", answer: "WebP supports both. Lossless WebP is comparable to PNG but typically 25% smaller. Lossy WebP is comparable to JPEG but 25-35% smaller at equivalent quality." },
      { question: "Can I convert WebP to GIF for animated images?", answer: "If you have a single-frame (static) WebP, it converts to a static GIF normally. Animated WebP to animated GIF conversion requires specialised tools." },
      { question: "Does converting WebP to JPG improve compatibility?", answer: "Yes. JPG is universally supported. WebP is supported in all modern browsers but may not open in older photo editors, CMS systems, or email clients." },
    ],
  },
  gif: {
    intro: "GIF is a classic animated image format with a 256-colour palette. Convert GIF to MP4 or WebM for smaller animated files, or to JPG/PNG to extract a static frame.",
    faqs: [
      { question: "Why should I convert GIF to MP4?", answer: "MP4 (H.264) video files are typically 5-10x smaller than equivalent animated GIFs while looking visually identical. Most social platforms and messaging apps auto-play MP4 videos like GIFs." },
      { question: "Can I convert an animated GIF to a still image?", answer: "Converting to JPG or PNG extracts the first frame as a static image. The animation is not preserved in static image formats." },
      { question: "Does GIF conversion preserve animation?", answer: "Converting to video formats (MP4, WebM) preserves the animation. Converting to static formats (JPG, PNG, WebP) extracts only the first frame." },
      { question: "Why does my GIF look washed out after conversion?", answer: "GIFs use an 8-bit, 256-colour palette per frame. When converting to formats with full colour depth (JPG, PNG), dithering artefacts from the original palette may be visible. The converter cannot add detail that was not in the GIF." },
    ],
  },
  svg: {
    intro: "SVG is a vector format that scales to any size without losing quality. Convert SVG to PNG, JPG, or WebP to produce a rasterised (pixel-based) version of your vector graphic at any resolution.",
    faqs: [
      { question: "What resolution should I choose when converting SVG to PNG?", answer: "This depends on your use case. For web images, 1x or 2x the intended display size is standard. For print at 300 DPI, multiply your print dimensions in inches by 300. SVG scales losslessly so choose as large as you need." },
      { question: "Does converting SVG to PNG preserve transparency?", answer: "Yes. PNG supports transparency (alpha channel) so transparent areas in your SVG are preserved. If you convert to JPG, transparent areas will be filled with a background colour." },
      { question: "Can I convert a multi-element SVG to a single image?", answer: "Yes. The SVG to PNG converter renders the full SVG viewport (including all elements, paths, and groups) as a single flat image." },
      { question: "Why does my converted SVG look slightly different?", answer: "SVG rendering can vary between browsers. The converter uses the browser's SVG engine, so very complex SVGs with custom fonts or filters may render slightly differently from how they appear in a dedicated SVG editor." },
    ],
  },
};

const DEFAULT_META = {
  intro: (fmt: string) =>
    `Convert ${fmt} images to other formats in your browser. Free, instant, and private with no file upload required.`,
  faqs: (fmt: string) => [
    { question: `What formats can ${fmt} be converted to?`, answer: `Use the conversion links below to convert ${fmt} to any of the supported output formats. Each converter runs entirely in your browser.` },
    { question: "Is there a file size limit?", answer: "There is no hard limit enforced by the tool, but very large files may be slower to process due to browser memory constraints. Files over 50MB may cause slowdowns on lower-end devices." },
    { question: "Do my images get uploaded to a server?", answer: "No. All image conversions run entirely in your browser using Canvas API and WebAssembly. Your images never leave your device." },
    { question: "What image quality is used for conversions?", answer: "Conversions to JPEG and WebP use a high quality setting by default. You can choose quality levels on the individual conversion tool page." },
  ],
};

// ── Color cycle ───────────────────────────────────────────────────────────────

const COLOR_CYCLE = [
  { color: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
  { color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
  { color: "var(--coral)",       bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)"  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ImageFormatPage({
  params,
}: {
  params: Promise<{ format: string }>;
}) {
  const { format: fmtId } = await params;
  const fmt = getFormat(fmtId);
  if (!fmt) notFound();

  const routes = conversionsFrom(fmt.id as ImageFormat);
  if (routes.length === 0) notFound();

  const bySource = routesBySourceFormat();
  const allFormats = formats.filter((f) => (bySource[f.id]?.length ?? 0) > 0 && f.id !== fmt.id);

  const meta = FORMAT_DESC[fmt.id as ImageFormat];
  const intro = meta?.intro ?? DEFAULT_META.intro(fmt.label);
  const faqs = meta?.faqs ?? DEFAULT_META.faqs(fmt.label);

  const pageUrl = canonical(`/image-converter/from/${fmtId}`);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Image Converter", url: canonical("/image-converter") },
      { name: `${fmt.label} Converter`, url: pageUrl },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools ${fmt.label} Image Converter`,
      description: `Convert ${fmt.label} images to ${routes.map((r) => getFormat(r.to)?.label ?? r.to.toUpperCase()).join(", ")} in your browser.`,
      url: pageUrl,
      category: "UtilitiesApplication",
    }),
    itemListSchema(
      routes.map((r) => ({
        name: `${fmt.label} to ${getFormat(r.to)?.label ?? r.to.toUpperCase()}`,
        url: canonical(`/image-converter/${r.slug}`),
        description: `Convert ${fmt.label} to ${getFormat(r.to)?.label ?? r.to.toUpperCase()} in your browser.`,
      }))
    ),
    faqSchema(faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
            <li><Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/image-converter" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>Image Converter</Link></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{fmt.label} Converter</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-sm font-bold"
              style={{
                backgroundColor: "color-mix(in srgb,var(--teal) 10%,transparent)",
                border: "1px solid color-mix(in srgb,var(--teal) 30%,transparent)",
                color: "var(--teal)",
              }}
              aria-hidden="true"
            >
              {fmt.label}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>
              Image Converter
            </p>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {fmt.label} Image Converter
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${routes.length} output formats`, "100% browser-based", "No upload required", "Free forever"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--teal)" }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Conversion grid */}
        <section aria-labelledby="conversions-heading">
          <h2
            id="conversions-heading"
            className="mb-4 font-display text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Convert {fmt.label} to...
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {routes.map((route, idx) => {
              const toFmt = getFormat(route.to);
              const c = COLOR_CYCLE[idx % COLOR_CYCLE.length];
              return (
                <Btn
                  key={route.slug}
                  variant="pill"
                  href={`/image-converter/${route.slug}`}
                  className="flex-col gap-2 py-3 text-center"
                  style={{ borderColor: c.border, backgroundColor: c.bg, color: c.color }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold"
                    style={{ backgroundColor: "color-mix(in srgb,var(--bg-page) 30%,transparent)" }}
                    aria-hidden="true"
                  >
                    {toFmt?.label ?? route.to.toUpperCase()}
                  </span>
                  <p className="text-xs font-semibold">
                    {fmt.label} to {toFmt?.label ?? route.to.toUpperCase()}
                  </p>
                </Btn>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqs.map(({ question, answer }) => (
              <div key={question}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{question}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other formats */}
        <section className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Other Format Converters
          </h2>
          <div className="flex flex-wrap gap-2">
            {allFormats.slice(0, 12).map((f) => (
              <Btn key={f.id} variant="pill" href={`/image-converter/from/${f.id}`}>
                {f.label} Converter
              </Btn>
            ))}
          </div>
          <div className="mt-4">
            <Btn variant="ghost" size="sm" href="/image-converter">
              ← All Image Converters
            </Btn>
          </div>
        </section>
      </div>
    </>
  );
}
