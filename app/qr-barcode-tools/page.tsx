import type { Metadata } from "next";
import Link from "next/link";
import { qrBarcodeTools, qrBarcodeCategories, qrBarcodeByCategory, type QRBarcodeTool } from "@/lib/qr-barcode-config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "QR & Barcode Tools - Free Online QR Code Generator & Scanner | BeYourTools",
  description: "Free browser-based QR code and barcode tools. Generate, scan and decode QR codes and barcodes - Code 128, EAN-13, UPC-A, WiFi QR and more. No upload, no sign-up.",
  keywords: "QR code generator, barcode generator, QR code scanner, barcode decoder, WiFi QR code, EAN-13, UPC barcode, Code 128, free online tools",
  alternates: { canonical: `${SITE.url}/qr-barcode-tools` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qr-barcode-tools`,
    title: "QR & Barcode Tools - Free Online Generator & Scanner | BeYourTools",
    description: "10 free browser-based QR code and barcode tools - generate, scan, decode. No upload needed.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "QR & Barcode Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR & Barcode Tools - Free QR Code Generator & Scanner | BeYourTools",
    description: "10 free QR code and barcode tools - generate, scan, decode. No upload needed.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
  ]),
  softwareApplicationSchema({
    name: "BeYourTools QR & Barcode Tools",
    description: `${qrBarcodeTools.length} free browser-based QR code and barcode tools including generator, scanner, decoder, WiFi QR, EAN-13, UPC-A and Code 128.`,
    url: canonical("/qr-barcode-tools"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    {
      question: "Are these QR and barcode tools free?",
      answer: "Yes - all tools are completely free with no sign-up, no watermarks and no usage limits.",
    },
    {
      question: "Do these tools upload my data to a server?",
      answer: "No. All QR code generation, barcode generation, and image decoding happens entirely in your browser. Nothing is ever sent to a server.",
    },
    {
      question: "Can I scan QR codes and barcodes without an app?",
      answer: "Yes. The QR Code Scanner and Barcode Scanner tools use your device camera directly in the browser - no app download needed.",
    },
    {
      question: "Which barcode formats are supported?",
      answer: "Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, MSI, Codabar and more for generation. The decoder and scanner auto-detect the format from any image.",
    },
  ]),
];

const POPULAR_SLUGS = [
  "qr-code-generator",
  "barcode-generator",
  "wifi-qr-code-generator",
  "qr-code-scanner",
  "ean-barcode-generator",
  "upc-barcode-generator",
];

const CATEGORY_COLORS: Record<string, { dot: string; border: string; bg: string }> = {
  "QR Tools": {
    dot: "var(--teal)",
    border: "color-mix(in srgb, var(--teal) 30%, transparent)",
    bg: "color-mix(in srgb, var(--teal) 8%, transparent)",
  },
  "Barcode Tools": {
    dot: "var(--accent)",
    border: "color-mix(in srgb, var(--accent) 30%, transparent)",
    bg: "color-mix(in srgb, var(--accent) 8%, transparent)",
  },
};

function ToolCard({ tool }: { tool: QRBarcodeTool }) {
  const colors = CATEGORY_COLORS[tool.category];
  return (
    <Link
      href={`/${tool.slug}`}
      className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
            style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
            aria-hidden="true"
          >
            {tool.icon}
          </span>
          <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {tool.name}
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {tool.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: colors.bg, color: tool.category === "QR Tools" ? "var(--teal)" : "var(--accent)" }}
        >
          {tool.category}
        </span>
        <span
          className="text-xs font-medium opacity-0 transition group-hover:opacity-100"
          style={{ color: "var(--accent)" }}
        >
          Use tool →
        </span>
      </div>
    </Link>
  );
}

export default function QRBarcodeToolsPage() {
  const total = qrBarcodeTools.length;
  const popularTools = POPULAR_SLUGS
    .map((s) => qrBarcodeTools.find((t) => t.slug === s))
    .filter(Boolean) as QRBarcodeTool[];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
            BeYourTools
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>QR &amp; Barcode Tools</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            QR &amp; Barcode Tools
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate, scan and decode QR codes and barcodes - entirely in your browser.
            No file uploads, no account required. Supports WiFi QR codes, EAN-13, UPC-A,
            Code 128 and many more formats.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--teal)" }} />
              {total} tools
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              100% browser-based
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--teal)" }} />
              No upload needed
            </span>
          </div>
        </div>

        {/* Popular quick-links */}
        <div className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Popular
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: "var(--border-strong)",
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                <span aria-hidden="true">{tool.icon}</span>
                {tool.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Tools grouped by category */}
        <div className="space-y-12">
          {qrBarcodeCategories.map((cat) => {
            const catTools = qrBarcodeByCategory(cat);
            const colors = CATEGORY_COLORS[cat];
            return (
              <section key={cat}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.dot }} aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    {cat}
                  </h2>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      borderColor: "var(--border-strong)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-subtle)",
                    }}
                  >
                    {catTools.length} tools
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Privacy note */}
        <div
          className="mt-12 rounded-lg border p-4 text-xs leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Privacy note: </span>
          All QR code and barcode processing happens entirely in your browser.
          No images, barcodes, or personal data are ever sent to a server.
          Camera access (for scanner tools) is only used locally and can be revoked at any time.
        </div>
      </div>
    </>
  );
}
