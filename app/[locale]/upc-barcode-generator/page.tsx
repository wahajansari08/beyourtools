import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { contentLocale, getToolCopy } from "@/lib/i18n-content";
import UPCGeneratorClient from "./UPCGeneratorClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

const __enMetadata: Metadata = {
  title: "UPC Barcode Generator - Create UPC-A Free | BeYourTools",
  description:
    "Generate valid UPC-A barcodes with automatic check digit calculation. Enter 11 digits and get a complete 12-digit UPC-A barcode. Download PNG or SVG.",
  keywords: "UPC barcode generator, UPC-A barcode, create UPC barcode, UPC check digit, free UPC generator",
  alternates: { canonical: `${SITE.url}/upc-barcode-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/upc-barcode-generator`,
    title: "UPC Barcode Generator - Free Online | BeYourTools",
    description: "Generate UPC-A barcodes with automatic check digit calculation. Free and browser-based.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "UPC Barcode Generator" }],
  },
};



export default async function UPCGeneratorPage() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const copy = await getToolCopy(locale, "upc-barcode-generator");
  const tName = copy.name ?? "";
  const tDescription = copy.description ?? "";
  const tFaqs = copy.faqs;
  const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: tName, url: canonical("/upc-barcode-generator") },
  ]),
  softwareApplicationSchema({
    name: "UPC Barcode Generator",
    description: "Generate UPC-A barcodes with automatic check digit calculation. Enter 11 digits and get a complete, valid 12-digit UPC-A barcode.",
    url: canonical("/upc-barcode-generator"),
    category: "UtilitiesApplication",
  }),
  faqSchema(tFaqs),
];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>UPC Barcode Generator</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{tName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate UPC-A barcodes used on North American retail products. Enter 11 digits and the tool calculates
            the correct 12th check digit automatically. Download as PNG or SVG.
          </p>
        </div>

        <UPCGeneratorClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Generate UPC Barcodes</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>1.</span> Enter your 11-digit UPC number (the check digit will be calculated for you).</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>2.</span> Or disable auto-check and enter the full 12-digit code to validate it.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>3.</span> Click <strong>Generate UPC Barcode</strong>.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>4.</span> Download PNG or SVG, or copy the full 12-digit code.</li>
          </ol>
        </section>

        <section className="mt-10 rounded-lg border p-4 text-sm"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Example</p>
          <p>Input: <code className="font-mono text-xs px-1 rounded" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent)" }}>03600029145</code> (11 digits)</p>
          <p className="mt-1">Output: <code className="font-mono text-xs px-1 rounded" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent-text)" }}>036000291452</code> (check digit = 2)</p>
        </section>

        {/* UPC Standards & Point-of-Sale Guide */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            North American Retail Point-of-Sale (POS) &amp; UPC Symbology
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The Universal Product Code (UPC-A) is the foundational barcode standard for consumer goods throughout the United States and Canada. 
            Introduced in 1974, UPC-A encases exactly 12 numeric digits representing the product manufacturer and individual SKU item code, allowing high-speed optical scanning at supermarket and retail cash registers.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Number System &amp; Manufacturer Prefix</h3>
              <p>
                The first digit identifies the numbering category (such as standard goods, weighted produce, or pharmacy coupons). 
                The subsequent 5 digits correspond to the company prefix assigned by GS1 US, followed by the 5-digit product code selected by the brand owner.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Modulo-10 Checksum Algorithm</h3>
              <p>
                The 12th digit guarantees optical scanning accuracy. Digits in odd positions (1, 3, 5, 7, 9, 11) are multiplied by 3, while digits in even positions are summed directly. 
                Subtracting the unit value from 10 yields the check digit, preventing cashier key-in typos and scan misidentifications.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{tName} {t("faqs")}</h2>
          {tFaqs.map(({ question: q, answer: a }) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="upc-barcode-generator" />
      </div>
    </>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "upc-barcode-generator", __enMetadata);
}
