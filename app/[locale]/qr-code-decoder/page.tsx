import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { contentLocale, getToolCopy } from "@/lib/i18n-content";
import QRDecoderClient from "./QRDecoderClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

const __enMetadata: Metadata = {
  title: "QR Code Decoder - Read QR Codes from Images | BeYourTools",
  description:
    "Upload a QR code image and decode its content instantly - URL, text, WiFi, vCard and more. Works with PNG, JPG and WebP. Free, private, browser-based.",
  keywords: "QR code decoder, read QR code from image, QR code reader online, decode QR code, QR image decoder",
  alternates: { canonical: `${SITE.url}/qr-code-decoder` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qr-code-decoder`,
    title: "QR Code Decoder - Read QR Codes from Images | BeYourTools",
    description: "Upload a QR code image and decode its content instantly. Free and private.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "QR Code Decoder" }],
  },
};



export default async function QRDecoderPage() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const copy = await getToolCopy(locale, "qr-code-decoder");
  const tName = copy.name ?? "";
  const tDescription = copy.description ?? "";
  const tFaqs = copy.faqs;
  const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: tName, url: canonical("/qr-code-decoder") },
  ]),
  softwareApplicationSchema({
    name: "QR Code Decoder",
    description: "Upload a QR code image (PNG, JPG, WebP) and decode its content instantly in your browser.",
    url: canonical("/qr-code-decoder"),
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
          <span style={{ color: "var(--text-secondary)" }}>QR Code Decoder</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>QR Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{tName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Upload or drag in a QR code image to instantly reveal its contents - URL, WiFi credentials, contact info, or plain text. No camera needed. Everything happens in your browser.
          </p>
        </div>

        <QRDecoderClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Decode QR Codes from Images</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>1.</span> Drag and drop a QR code image onto the upload area, or click to browse.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>2.</span> The decoder reads the QR code automatically.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>3.</span> Copy the decoded value or open it as a URL if applicable.</li>
          </ol>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{tName} {t("faqs")}</h2>
          {tFaqs.map(({ question: q, answer: a }) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="qr-code-decoder" />
      </div>
    </>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "qr-code-decoder", __enMetadata);
}
