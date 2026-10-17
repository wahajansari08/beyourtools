import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { contentLocale, getToolCopy } from "@/lib/i18n-content";
import QRScannerClient from "./QRScannerClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

const __enMetadata: Metadata = {
  title: "QR Code Scanner Online - Scan QR Codes Free | BeYourTools",
  description:
    "Scan QR codes using your device camera or upload an image. Decodes URLs, text, WiFi, vCards and more - free, private, no app download needed.",
  keywords: "QR code scanner online, scan QR code, QR code reader, camera QR scanner, free QR scanner",
  alternates: { canonical: `${SITE.url}/qr-code-scanner` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qr-code-scanner`,
    title: "QR Code Scanner Online - Scan QR Codes Free | BeYourTools",
    description: "Scan QR codes from your camera or upload an image - free and private.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "QR Code Scanner" }],
  },
};



export default async function QRScannerPage() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const copy = await getToolCopy(locale, "qr-code-scanner");
  const tName = copy.name ?? "";
  const tDescription = copy.description ?? "";
  const tFaqs = copy.faqs;
  const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: tName, url: canonical("/qr-code-scanner") },
  ]),
  softwareApplicationSchema({
    name: "QR Code Scanner",
    description: "Free browser-based QR code scanner. Use your device camera or upload an image to decode any QR code.",
    url: canonical("/qr-code-scanner"),
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
          <span style={{ color: "var(--text-secondary)" }}>QR Code Scanner</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>QR Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{tName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Scan QR codes in real time using your device camera. Switch between front and rear cameras,
            or upload an image if you have no camera. Works on desktop and mobile over HTTPS.
          </p>
        </div>

        <QRScannerClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Scan QR Codes</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>1.</span> Click <strong>Start Camera Scan</strong> and allow camera access when prompted.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>2.</span> Point your camera at a QR code - it detects automatically.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>3.</span> Copy the result, open it as a URL, or scan another code.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>4.</span> No camera? Upload a QR code image using the upload option.</li>
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

        <QRRelatedTools currentSlug="qr-code-scanner" />
      </div>
    </>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "qr-code-scanner", __enMetadata);
}
