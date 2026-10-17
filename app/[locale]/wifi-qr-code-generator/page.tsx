import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { contentLocale, getToolCopy } from "@/lib/i18n-content";
import WiFiQRClient from "./WiFiQRClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

const __enMetadata: Metadata = {
  title: "WiFi QR Code Generator - Connect Instantly | BeYourTools",
  description:
    "Generate a WiFi QR code your guests can scan to connect instantly. Supports WPA2, WEP, and open networks. Free, private, browser-based.",
  keywords: "WiFi QR code generator, WiFi QR code, share WiFi QR, WPA QR code, guest WiFi QR code",
  alternates: { canonical: `${SITE.url}/wifi-qr-code-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/wifi-qr-code-generator`,
    title: "WiFi QR Code Generator | BeYourTools",
    description: "Share your WiFi with a scannable QR code - free and private.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "WiFi QR Code Generator" }],
  },
};



export default async function WiFiQRGeneratorPage() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const copy = await getToolCopy(locale, "wifi-qr-code-generator");
  const tName = copy.name ?? "";
  const tDescription = copy.description ?? "";
  const tFaqs = copy.faqs;
  const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: tName, url: canonical("/wifi-qr-code-generator") },
  ]),
  softwareApplicationSchema({
    name: "WiFi QR Code Generator",
    description: "Generate a WiFi QR code that lets guests join your network instantly by scanning - no typing required.",
    url: canonical("/wifi-qr-code-generator"),
    category: "UtilitiesApplication",
  }),
  faqSchema(tFaqs),
];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>WiFi QR Code Generator</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>QR Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{tName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Let guests join your WiFi by scanning a QR code - no password typing required.
            Enter your network name, password and security type, then download or print the code.
          </p>
        </div>

        <WiFiQRClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Generate a WiFi QR Code</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>1.</span> Enter your WiFi network name (SSID).</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>2.</span> Choose the security type and enter your password.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>3.</span> Click <strong>Generate WiFi QR Code</strong>.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>4.</span> Download the QR code as PNG or SVG and print or display it near your router.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--accent-text)" }}>5.</span> Guests point their phone camera at the code and tap the join prompt.</li>
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

        <QRRelatedTools currentSlug="wifi-qr-code-generator" />
      </div>
    </>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "wifi-qr-code-generator", __enMetadata);
}
