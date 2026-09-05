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
  qrBarcodeTools,
  qrBarcodeCategories,
  qrBarcodeByCategory,
  type QRBarcodeCategory,
} from "@/lib/qr-barcode-config";
import Btn from "@/components/Btn";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fromSlug(slug: string): QRBarcodeCategory | undefined {
  return qrBarcodeCategories.find((c) => toSlug(c) === slug);
}

export function generateStaticParams() {
  return qrBarcodeCategories.map((c) => ({ category: toSlug(c) }));
}

// ── Category metadata ─────────────────────────────────────────────────────────

const COLORS: Record<QRBarcodeCategory, { color: string; bg: string; border: string }> = {
  "QR Tools":      { color: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
  "Barcode Tools": { color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
};

const CAT_ICONS: Record<QRBarcodeCategory, string> = {
  "QR Tools":      "▦",
  "Barcode Tools": "|||",
};

const CAT_META: Record<
  QRBarcodeCategory,
  { description: string; intro: string; faqs: { question: string; answer: string }[] }
> = {
  "QR Tools": {
    description:
      "Free online QR code generator, scanner, and decoder. Create QR codes for URLs, WiFi, contact cards, and more. Scan and decode QR codes from images. No upload required.",
    intro:
      "Generate QR codes for any purpose, scan them live with your camera, or upload an image to decode it. Every tool runs entirely in your browser with no files sent to a server.",
    faqs: [
      {
        question: "What can I encode in a QR code?",
        answer:
          "QR codes can encode URLs, plain text, email addresses, phone numbers, SMS messages, WiFi credentials, vCard contact information, calendar events, and geographic coordinates. Our QR Code Generator supports all common formats with dedicated input templates.",
      },
      {
        question: "How do I create a QR code with a logo?",
        answer:
          "Use the QR Code Generator with Logo tool. Generate your QR code as normal, then upload a logo image to overlay in the centre. The tool uses error correction to ensure the QR code remains scannable even with the logo covering part of it.",
      },
      {
        question: "Can I decode a QR code from an image file?",
        answer:
          "Yes. The QR Code Decoder accepts image files (JPG, PNG, WebP) and decodes the QR code content. This is useful when you have a screenshot or photo of a QR code you want to read without a phone.",
      },
      {
        question: "What QR code error correction level should I use?",
        answer:
          "Higher error correction levels (Q or H) allow the QR code to be scanned even if up to 25-30% of it is damaged or obscured. Use level H if you plan to add a logo. Use level L or M for clean codes where file size matters.",
      },
    ],
  },
  "Barcode Tools": {
    description:
      "Free online barcode generator, scanner, and decoder. Generate Code 128, EAN-13, UPC-A, and more barcode formats. Scan and decode barcodes from images. Browser-based.",
    intro:
      "Generate industry-standard barcodes for products, inventory, and logistics, or scan and decode barcodes from images and your device camera. All tools run entirely in your browser.",
    faqs: [
      {
        question: "What barcode formats are supported?",
        answer:
          "Our barcode generators support Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14, and more. For retail products, EAN-13 and UPC-A are the standard. Code 128 handles any ASCII character and is used in shipping and logistics.",
      },
      {
        question: "How do I generate a UPC-A barcode?",
        answer:
          "Use the UPC Barcode Generator. Enter your 11-digit UPC number (the 12th digit is the check digit, calculated automatically). Download the barcode as SVG or PNG for use in print and packaging.",
      },
      {
        question: "What is the difference between EAN-13 and UPC-A?",
        answer:
          "UPC-A is a 12-digit barcode used primarily in North America. EAN-13 is a 13-digit barcode used internationally; it is a superset of UPC-A where a leading zero makes any UPC-A code a valid EAN-13. Both are used for retail product identification.",
      },
      {
        question: "Can I scan a barcode from an image file?",
        answer:
          "Yes. The Barcode Decoder accepts image files and decodes any barcode it finds in the image, including Code 128, EAN, UPC, Code 39, QR codes, and more. Upload a photo of a barcode label to read its value.",
      },
    ],
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) return {};
  const m = CAT_META[cat];
  const catTools = qrBarcodeByCategory(cat);

  return {
    title: `${cat} - Free Online ${cat} | BeYourTools`,
    description: m.description,
    keywords: catTools
      .map((t) => t.name)
      .concat(["QR code", "barcode", cat, "free online", "browser-based"])
      .join(", "),
    alternates: { canonical: `${SITE.url}/qr-barcode-tools/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE.url}/qr-barcode-tools/${slug}`,
      title: `${cat} | BeYourTools`,
      description: m.description,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: cat }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat} | BeYourTools`,
      description: m.description,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function QRBarcodeCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) notFound();

  const catTools = qrBarcodeByCategory(cat);
  const c = COLORS[cat];
  const m = CAT_META[cat];
  const pageUrl = canonical(`/qr-barcode-tools/${slug}`);
  const siblings = qrBarcodeCategories.filter((q) => q !== cat);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
      { name: cat, url: pageUrl },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools ${cat}`,
      description: m.description,
      url: pageUrl,
      category: "UtilitiesApplication",
    }),
    itemListSchema(
      catTools.map((t) => ({
        name: t.name,
        url: canonical(`/${t.slug}`),
        description: t.description,
      }))
    ),
    faqSchema(m.faqs),
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
            <li><Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR & Barcode Tools</Link></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{cat}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-bold"
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.color }}
              aria-hidden="true"
            >
              {CAT_ICONS[cat]}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.color }}>QR & Barcodes</p>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {cat}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{m.intro}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${catTools.length} tools`, "100% browser-based", "No upload required", "Free forever"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tool grid */}
        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="mb-4 font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            All {cat}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
                      aria-hidden="true"
                    >
                      {tool.icon}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
                </div>
                <span className="mt-4 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: c.color }} aria-hidden="true">
                  Use tool →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {m.faqs.map(({ question, answer }) => (
              <div key={question}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{question}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other categories */}
        {siblings.length > 0 && (
          <section className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Also in QR & Barcode Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((sib) => (
                <Btn variant="pill" key={sib} href={`/qr-barcode-tools/${toSlug(sib)}`}>
                <span aria-hidden="true">{CAT_ICONS[sib]}</span>
                  {sib}
              </Btn>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/qr-barcode-tools" className="focus-ring text-xs font-medium hover:underline" style={{ color: "var(--teal)" }}>
                ← All QR & Barcode Tools
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
