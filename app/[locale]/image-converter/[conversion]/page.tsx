import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getConversion,
  getFormat,
  getFormatNotes,
  pairInsight,
  conversionRoutes,
  conversionTitle,
  conversionsFrom,
  conversionsTo,
  type ConversionRoute,
} from "@/lib/image-tools-config";
import ConverterClient from "./ConverterClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, webAppSchema, SITE, canonical } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { getTranslatedToolContent, localeCanonical, hreflangAlternates } from "@/lib/i18n-content";
import { getTranslations } from "next-intl/server";
import Btn from "@/components/Btn";

interface Props {
  params: Promise<{ conversion: string; locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    conversionRoutes.map((r) => ({ locale, conversion: r.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conversion, locale } = await params;
  const route = getConversion(conversion);
  if (!route) return { title: "Not Found" };
  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  const tc = await getTranslatedToolContent(locale, `image:${route.slug}`);
  const t = await getTranslations({ locale, namespace: "common" });
  // Title is templated per locale so grammar is correct in every language
  // (format names like JPG/PNG stay in English).
  const title = t("converterTitle", { from: from.label, to: to.label });
  const description = tc?.description ?? `Convert ${from.label} images to ${to.label} online for free. No upload, no sign-up - conversion runs directly in your browser and your files never leave your device.`;
  const url = localeCanonical(locale, `/image-converter/${route.slug}`);
  const image = `${SITE.url}/og-default.png`;
  const path = `/image-converter/${route.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates(locale, path) },
    keywords: `${from.label} to ${to.label}, convert ${from.label} to ${to.label}, ${from.label} to ${to.label} converter, free image converter`,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: `${from.label} to ${to.label} Converter` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: SITE.twitter,
      images: [image],
    },
  };
}

function RelatedConversions({ route }: { route: ConversionRoute }) {
  const sameFrom = conversionsFrom(route.from).filter((r) => r.slug !== route.slug).slice(0, 8);
  const sameTo   = conversionsTo(route.to).filter((r) => r.slug !== route.slug).slice(0, 8);

  return (
    <div className="mt-10 space-y-6">
      {sameFrom.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            More {getFormat(route.from)!.label} conversions
          </h2>
          <div className="flex flex-wrap gap-2">
            {sameFrom.map((r) => (
              <Btn key={r.slug} variant="pill" href={`/image-converter/${r.slug}`}>
                {conversionTitle(r)}
              </Btn>
            ))}
          </div>
        </div>
      )}
      {sameTo.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Other converters to {getFormat(route.to)!.label}
          </h2>
          <div className="flex flex-wrap gap-2">
            {sameTo.map((r) => (
              <Btn key={r.slug} variant="pill" href={`/image-converter/${r.slug}`}>
                {conversionTitle(r)}
              </Btn>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { conversion, locale } = await params;
  setRequestLocale(locale);
  const route = getConversion(conversion);
  if (!route) notFound();

  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  const fromNotes = getFormatNotes(route.from);
  const toNotes   = getFormatNotes(route.to);
  const tc = await getTranslatedToolContent(locale, `image:${route.slug}`);
  const insights  = tc?.insight ?? pairInsight(route.from, route.to);
  const title = conversionTitle(route);
  const url = localeCanonical(locale, `/image-converter/${route.slug}`);

  const faqs = [
    { question: `How do I convert ${from.label} to ${to.label}?`, answer: `Drop your ${from.label} file onto the upload area or click to browse. The conversion starts automatically. When it finishes, click Download to save your ${to.label} file.` },
    { question: `Is the ${from.label} to ${to.label} converter free?`, answer: "Yes - completely free, no account required, no file limits, and no watermarks added to your images." },
    { question: `Are my ${from.label} files uploaded to a server?`, answer: `No. All conversion happens locally in your browser. Your ${from.label} files never leave your device.` },
    { question: `Can I convert multiple ${from.label} files at once?`, answer: `Yes - drop multiple ${from.label} files at once or add them one by one. Each file is converted automatically and can be downloaded individually or all at once as a ZIP.` },
    { question: `What is the difference between ${from.label} and ${to.label}?`, answer: `${from.label} and ${to.label} are different image formats with different compression methods and feature support. Use the converter to switch between them based on your needs.` },
    { question: `Will converting ${from.label} to ${to.label} reduce my file size?`, answer: `File size changes depend on the underlying compression algorithms. Converting uncompressed or lossless formats (such as PNG, BMP, or TIFF) into high-efficiency formats (such as WebP, AVIF, or JPG) frequently achieves a 30% to 80% reduction in storage size while maintaining excellent visual fidelity. Conversely, converting to lossless formats preserves exact pixel values.` },
    { question: `Is this ${from.label} to ${to.label} converter secure for confidential images?`, answer: `Yes. All processing executes locally inside your web browser using HTML5 Canvas, OffscreenCanvas, and WebAssembly APIs. Your graphics and personal photos never travel over the network, are never stored on external databases, and are immediately cleared from browser memory when you close the tab.` },
  ];

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools",    url: SITE.url },
      { name: "Image Converter", url: canonical("/image-converter") },
      { name: title,             url },
    ]),
    webAppSchema({
      name: `${from.label} to ${to.label} Converter`,
      description: `Free online ${from.label} to ${to.label} image converter. Runs entirely in your browser - no upload required.`,
      url,
    }),
    faqSchema(faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/"               className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/image-converter" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>Image Converter</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {from.label} to {to.label} Converter
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Convert {from.label} images to {to.label} format directly in your browser.
            No file upload, no account required - files never leave your device.
          </p>
        </div>

        {/* Converter */}
        <ConverterClient
          fromFormat={route.from}
          toFormat={route.to}
          fromLabel={from.label}
          toLabel={to.label}
          acceptMimes={from.mimes.join(",")}
          acceptExts={from.extensions.map((e) => `.${e}`).join(",")}
        />

        {/* How to use */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            How to convert {from.label} to {to.label}
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--accent-text)" }}>1.</span>Drop your {from.label} file onto the upload area or click to browse.</li>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--accent-text)" }}>2.</span>The converter processes your file locally - no upload needed.</li>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--accent-text)" }}>3.</span>Click <strong>Download</strong> to save your {to.label} file.</li>
          </ol>
        </section>

        {/* Format guide: {from} vs {to}, built from per-format facts, unique to this pair */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {from.label} vs {to.label}: format guide
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {fromNotes.detail} {toNotes.detail} In practice, converting {from.label} to {to.label} is the right move when you need {toNotes.bestFor}.
          </p>
          {insights.length > 0 && (
            <ul className="space-y-2 text-sm list-disc pl-5" style={{ color: "var(--text-muted)" }}>
              {insights.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ backgroundColor: "var(--bg-elevated)" }}>
                  <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>Feature</th>
                  <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>{from.label}</th>
                  <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>{to.label}</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--text-muted)" }}>
                {[
                  ["Format type", fromNotes.kind, toNotes.kind],
                  ["Compression", fromNotes.compression, toNotes.compression],
                  ["Transparency", fromNotes.transparency ? "Yes" : "No", toNotes.transparency ? "Yes" : "No"],
                  ["Animation", fromNotes.animation ? "Yes" : "No", toNotes.animation ? "Yes" : "No"],
                  ["Best for", fromNotes.bestFor, toNotes.bestFor],
                ].map(([label, a, b]) => (
                  <tr key={label}>
                    <td className="border px-3 py-2 font-medium" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>{label}</td>
                    <td className="border px-3 py-2" style={{ borderColor: "var(--border)" }}>{a}</td>
                    <td className="border px-3 py-2" style={{ borderColor: "var(--border)" }}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Best Practices for {from.label} to {to.label} Conversion
          </h2>
          <ul className="space-y-2 text-sm list-disc pl-5" style={{ color: "var(--text-muted)" }}>
            <li>
              <strong style={{ color: "var(--text-secondary)" }}>Preserve Aspect Ratio and Detail:</strong> Our in-browser conversion engine retains the original pixel dimensions and aspect ratio of your source {from.label} graphic without introducing unwanted scaling artifacts.
            </li>
            <li>
              <strong style={{ color: "var(--text-secondary)" }}>Transparency Handling:</strong> If converting an image containing transparent pixels into a format that does not support transparency (such as JPEG), transparent backgrounds are cleanly filled with a solid neutral background.
            </li>
            <li>
              <strong style={{ color: "var(--text-secondary)" }}>Web Performance Optimization:</strong> For web deployment, modern formats offer enhanced compression curves that drastically cut byte payload, helping websites score higher on Google PageSpeed Insights and mobile usability benchmarks.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{from.label} to {to.label} Frequently Asked Questions</h2>
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{faq.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Related */}
        <RelatedConversions route={route} />
      </div>
    </>
  );
}
