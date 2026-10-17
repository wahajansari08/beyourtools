import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { contentLocale, getToolCopy } from "@/lib/i18n-content";
import EANGeneratorClient from "./EANGeneratorClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

const __enMetadata: Metadata = {
  title: "EAN-13 Barcode Generator - Free Online | BeYourTools",
  description:
    "Generate EAN-13 and EAN-8 barcodes with automatic check digits. Enter your digits and download PNG or SVG. 100% free and browser-based.",
  keywords: "EAN-13 barcode generator, EAN barcode, EAN-8 generator, create EAN barcode, EAN check digit, free EAN generator",
  alternates: { canonical: `${SITE.url}/ean-barcode-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/ean-barcode-generator`,
    title: "EAN Barcode Generator - Free Online | BeYourTools",
    description: "Generate EAN-13 and EAN-8 barcodes with check digit validation. Free and browser-based.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "EAN Barcode Generator" }],
  },
};



export default async function EANGeneratorPage() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const copy = await getToolCopy(locale, "ean-barcode-generator");
  const tName = copy.name ?? "";
  const tDescription = copy.description ?? "";
  const tFaqs = copy.faqs;
  const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: tName, url: canonical("/ean-barcode-generator") },
  ]),
  softwareApplicationSchema({
    name: "EAN-13 Barcode Generator",
    description: "Generate EAN-13 and EAN-8 barcodes with automatic check digit calculation. Free, browser-based.",
    url: canonical("/ean-barcode-generator"),
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
          <span style={{ color: "var(--text-secondary)" }}>EAN Barcode Generator</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{tName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate EAN-13 barcodes used on retail products worldwide - and EAN-8 for compact packaging.
            Enter your digits, the check digit is calculated automatically. Download PNG or SVG.
          </p>
        </div>

        <EANGeneratorClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Generate EAN Barcodes</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>1.</span> Choose EAN-13 or EAN-8 using the toggle.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>2.</span> Enter your digits (12 for EAN-13, 7 for EAN-8 with auto check digit).</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>3.</span> Click <strong>Generate</strong>.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>4.</span> Download the barcode as PNG or SVG.</li>
          </ol>
        </section>

        {/* EAN-13 Standards & Architecture Guide */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            GS1 Global Trade Item Numbers (GTIN) &amp; EAN Architecture
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The European Article Number (EAN-13), formally governed under the international <strong>GS1 standard</strong> as GTIN-13, is the universal retail barcode identifier across Europe, Asia, Latin America, and Australia. 
            EAN barcodes facilitate automated point-of-sale inventory depletion, supply chain traceability, and automated warehouse receiving.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Country Prefix &amp; Manufacturer Code</h3>
              <p>
                The first 2–3 digits indicate the GS1 national member organization where the company prefix was registered (e.g., 00–13 for US/Canada, 50 for the UK, 400–440 for Germany). 
                The subsequent digits represent the individual manufacturer identification and specific item reference.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Modulo-10 Check Digit Calculation</h3>
              <p>
                The 13th digit is mathematically derived from the preceding 12 digits using an alternating weighting formula: odd-indexed positions are multiplied by 1 and even-indexed positions by 3. 
                Our engine automatically solves the modulo-10 complement to ensure full compliance with GS1 scanner validation.
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

        <QRRelatedTools currentSlug="ean-barcode-generator" />
      </div>
    </>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "ean-barcode-generator", __enMetadata);
}
