import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getConversion,
  getFormat,
  conversionRoutes,
  conversionTitle,
  conversionsFrom,
  conversionsTo,
  type ConversionRoute,
} from "@/lib/image-tools-config";
import ConverterClient from "./ConverterClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, webAppSchema, SITE, canonical } from "@/lib/seo";

interface Props {
  params: Promise<{ conversion: string }>;
}

export async function generateStaticParams() {
  return conversionRoutes.map((r) => ({ conversion: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conversion } = await params;
  const route = getConversion(conversion);
  if (!route) return { title: "Not Found" };
  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  const title = `${from.label} to ${to.label} Converter -Free Online Tool | BeYourTools`;
  const description = `Convert ${from.label} images to ${to.label} online for free. No upload, no sign-up -conversion runs directly in your browser and your files never leave your device.`;
  const url = canonical(`/image-converter/${route.slug}`);
  const image = `${SITE.url}/og-default.png`;
  return {
    title,
    description,
    keywords: `${from.label} to ${to.label}, convert ${from.label} to ${to.label}, ${from.label} to ${to.label} converter, free image converter`,
    alternates: { canonical: `https://beyourtools.com/image-converter/${route.slug}` },
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
              <Link
                key={r.slug}
                href={`/image-converter/${r.slug}`}
                className="focus-ring rounded-md border px-3 py-1.5 text-xs transition"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
              >
                {conversionTitle(r)}
              </Link>
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
              <Link
                key={r.slug}
                href={`/image-converter/${r.slug}`}
                className="focus-ring rounded-md border px-3 py-1.5 text-xs transition"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
              >
                {conversionTitle(r)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { conversion } = await params;
  const route = getConversion(conversion);
  if (!route) notFound();

  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  const title = conversionTitle(route);
  const url = canonical(`/image-converter/${route.slug}`);

  const faqs = [
    { question: `How do I convert ${from.label} to ${to.label}?`, answer: `Drop your ${from.label} file onto the upload area or click to browse. The conversion starts automatically. When it finishes, click Download to save your ${to.label} file.` },
    { question: `Is the ${from.label} to ${to.label} converter free?`, answer: "Yes -completely free, no account required, no file limits, and no watermarks added to your images." },
    { question: `Are my ${from.label} files uploaded to a server?`, answer: `No. All conversion happens locally in your browser. Your ${from.label} files never leave your device.` },
    { question: `Can I convert multiple ${from.label} files at once?`, answer: `Yes -drop multiple ${from.label} files at once or add them one by one. Each file is converted automatically and can be downloaded individually or all at once as a ZIP.` },
    { question: `What is the difference between ${from.label} and ${to.label}?`, answer: `${from.label} and ${to.label} are different image formats with different compression methods and feature support. Use the converter to switch between them based on your needs.` },
  ];

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools",    url: SITE.url },
      { name: "Image Converter", url: `${SITE.url}/image-converter` },
      { name: title,             url },
    ]),
    webAppSchema({
      name: `${from.label} to ${to.label} Converter`,
      description: `Free online ${from.label} to ${to.label} image converter. Runs entirely in your browser -no upload required.`,
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
            No file upload, no account required -files never leave your device.
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
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--teal)" }}>1.</span>Drop your {from.label} file onto the upload area or click to browse.</li>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--teal)" }}>2.</span>The converter processes your file locally -no upload needed.</li>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--teal)" }}>3.</span>Click <strong>Download</strong> to save your {to.label} file.</li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          <dl className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{faq.question}</dt>
                <dd className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{faq.answer}</dd>
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
