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
  pdfTools,
  pdfToolCategories,
  pdfToolsByCategory,
  type PdfToolCategory,
} from "@/lib/pdf-tools-config";
import Btn from "@/components/Btn";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fromSlug(slug: string): PdfToolCategory | undefined {
  return pdfToolCategories.find((c) => toSlug(c) === slug);
}

export function generateStaticParams() {
  return pdfToolCategories.map((c) => ({ slug: toSlug(c) }));
}

// ── Category metadata ─────────────────────────────────────────────────────────

const COLORS = [
  { color: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
  { color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
  { color: "var(--coral)",       bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)"  },
  { color: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
  { color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
];

const CAT_ICONS: Record<PdfToolCategory, string> = {
  "Convert":           "⇄",
  "Edit & Organize":   "✏️",
  "Security":          "🔒",
  "Extract & Analyze": "🔍",
  "Repair & Compare":  "⚙️",
};

const CAT_META: Record<
  PdfToolCategory,
  { description: string; intro: string; faqs: { question: string; answer: string }[] }
> = {
  "Convert": {
    description:
      "Free online PDF converters. Convert PDFs to JPG, PNG, and text. Convert JPG, PNG, and HTML to PDF. All conversion runs in your browser with no upload.",
    intro:
      "These tools convert between PDF and other file formats. Whether you need to extract pages as images, create a PDF from photos, or get the text out of a document, each converter runs entirely in your browser.",
    faqs: [
      {
        question: "Can I convert a multi-page PDF to images?",
        answer:
          "Yes. The PDF to JPG and PDF to PNG converters process every page of your PDF and produce a separate image for each page. You can download all images as a ZIP file or individually.",
      },
      {
        question: "What is the image quality of PDF to JPG conversion?",
        answer:
          "The conversion renders PDF pages at 150 DPI by default, which is suitable for screen use. For print-quality images you would need a higher DPI setting, which some tools offer.",
      },
      {
        question: "Can I combine multiple images into one PDF?",
        answer:
          "Yes. The JPG to PDF and PNG to PDF tools accept multiple images and combine them into a single PDF, with one image per page. You can reorder images before generating the PDF.",
      },
      {
        question: "Does PDF to Text preserve formatting?",
        answer:
          "PDF to Text extracts the raw text content from the PDF. Formatting, columns, and tables may not be perfectly preserved since text extraction ignores layout. For documents where layout matters, use PDF to JPG/PNG instead.",
      },
    ],
  },
  "Edit & Organize": {
    description:
      "Free online PDF editor and organiser tools. Merge, split, rotate, reorder, watermark, and compress PDF files. All editing runs in your browser with no upload.",
    intro:
      "Organise and modify PDF files without any desktop software. Combine multiple PDFs into one, split a large PDF into parts, rotate pages, add watermarks, and compress for sharing.",
    faqs: [
      {
        question: "How do I merge multiple PDFs into one?",
        answer:
          "Use the Merge PDF tool. Upload two or more PDF files, arrange them in the order you want, and click Merge. The output is a single PDF with all pages combined in sequence.",
      },
      {
        question: "Can I split a PDF by page range?",
        answer:
          "Yes. The Split PDF tool lets you define page ranges to extract as separate PDFs. For example, you can extract pages 1-5 as one file and pages 6-10 as another.",
      },
      {
        question: "Does compressing a PDF reduce text quality?",
        answer:
          "PDF compression primarily reduces the size of embedded images. Text and vector graphics are not affected by compression, so text remains sharp. Only image-heavy PDFs see significant size reduction.",
      },
      {
        question: "Can I rotate individual pages in a PDF?",
        answer:
          "Yes. The Rotate PDF tool lets you rotate individual pages or all pages by 90, 180, or 270 degrees. This is useful for correcting pages that were scanned in the wrong orientation.",
      },
    ],
  },
  "Security": {
    description:
      "Free online PDF security tools. Protect PDF files with a password, or remove password protection from a PDF you own. All processing is client-side.",
    intro:
      "Add or remove password protection from PDF files entirely in your browser. The security tools use standard PDF encryption so the protection works in any PDF reader.",
    faqs: [
      {
        question: "What type of encryption does Protect PDF use?",
        answer:
          "The Protect PDF tool applies AES-128 or AES-256 encryption depending on the option selected. This is standard PDF password protection recognised by Adobe Acrobat and all major PDF readers.",
      },
      {
        question: "Can I remove the password from a PDF I own?",
        answer:
          "Yes. The Unlock PDF tool removes the password from a PDF if you supply the correct password. It cannot bypass encryption without the password - it is a decryption tool, not a cracker.",
      },
      {
        question: "Does the password get sent to your server?",
        answer:
          "No. All encryption and decryption happens in your browser using the pdf-lib library. Your password and file content never leave your device.",
      },
      {
        question: "Can I set different permissions (print, copy) on a protected PDF?",
        answer:
          "Permission restrictions (preventing printing, copying, or editing) are part of the PDF security standard. The Protect PDF tool supports setting a user password for opening and an owner password for full access.",
      },
    ],
  },
  "Extract & Analyze": {
    description:
      "Free online PDF extraction and analysis tools. Extract text, images, and metadata from PDF files. Analyse page count, file info, and document properties.",
    intro:
      "These tools look inside PDF files and pull out the data you need, whether that is the raw text, embedded images, document metadata, or structural information.",
    faqs: [
      {
        question: "What metadata can be extracted from a PDF?",
        answer:
          "PDF metadata includes the title, author, subject, keywords, creation date, modification date, PDF version, page count, and the application used to create or modify the file. The PDF Metadata Viewer displays all of this.",
      },
      {
        question: "Can I extract all images embedded in a PDF?",
        answer:
          "Yes. The PDF image extractor identifies and saves all images embedded in the PDF as separate files. Images are extracted at their original resolution and format.",
      },
      {
        question: "How accurate is PDF text extraction?",
        answer:
          "Text extraction accuracy depends on how the PDF was created. PDFs with real text content (not scanned images) extract perfectly. Scanned PDFs are images and do not contain machine-readable text without OCR processing.",
      },
      {
        question: "What does the PDF page count tool show?",
        answer:
          "It displays the total number of pages, the page dimensions, the PDF version, and whether the file is encrypted. This is useful for quickly inspecting a PDF before processing it.",
      },
    ],
  },
  "Repair & Compare": {
    description:
      "Free online PDF repair and comparison tools. Repair corrupted or broken PDF files, and compare two PDF documents to find differences.",
    intro:
      "When a PDF is corrupted or you need to find what changed between two versions of a document, these tools help you recover and audit your files without any software.",
    faqs: [
      {
        question: "What types of PDF corruption can be repaired?",
        answer:
          "The PDF Repair tool can fix common issues such as missing cross-reference tables, incorrect object offsets, and truncated files. Severely corrupted files where the content itself is damaged may not be fully recoverable.",
      },
      {
        question: "How does PDF Compare work?",
        answer:
          "PDF Compare renders both documents and highlights visual differences between matching pages. Added content, removed content, and changed text are shown in distinct colours so you can quickly review what changed.",
      },
      {
        question: "Can I compare PDFs with different page counts?",
        answer:
          "Yes. The comparison tool matches pages by position (page 1 vs page 1, page 2 vs page 2) and flags pages that exist in one document but not the other.",
      },
      {
        question: "Will repaired PDFs be identical to the originals?",
        answer:
          "The repair tool rebuilds the PDF structure around the content that is still readable. In most cases the output is visually identical to the original, but metadata or embedded elements that were in the corrupted sections may be lost.",
      },
    ],
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) return {};
  const m = CAT_META[cat];
  const catTools = pdfToolsByCategory(cat);

  return {
    title: `PDF ${cat} Tools - Free Online PDF ${cat} | BeYourTools`,
    description: m.description,
    keywords: catTools
      .map((t) => t.name)
      .concat(["PDF tools", cat, "free online", "browser-based"])
      .join(", "),
    alternates: { canonical: `${SITE.url}/pdf-tools/category/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE.url}/pdf-tools/category/${slug}`,
      title: `PDF ${cat} Tools | BeYourTools`,
      description: m.description,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: `PDF ${cat} Tools` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `PDF ${cat} Tools | BeYourTools`,
      description: m.description,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PdfCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) notFound();

  const catTools = pdfToolsByCategory(cat);
  const catIdx = pdfToolCategories.indexOf(cat);
  const c = COLORS[catIdx % COLORS.length];
  const m = CAT_META[cat];
  const pageUrl = canonical(`/pdf-tools/category/${slug}`);
  const siblings = pdfToolCategories.filter((p) => p !== cat);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "PDF Tools", url: canonical("/pdf-tools") },
      { name: cat, url: pageUrl },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools PDF ${cat} Tools`,
      description: m.description,
      url: pageUrl,
      category: "UtilitiesApplication",
    }),
    itemListSchema(
      catTools.map((t) => ({
        name: t.name,
        url: canonical(`/pdf-tools/${t.slug}`),
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
            <li><Link href="/pdf-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>PDF Tools</Link></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{cat}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
              aria-hidden="true"
            >
              {CAT_ICONS[cat]}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.color }}>PDF Tools</p>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            PDF {cat}
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
            All PDF {cat} Tools
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {catTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/pdf-tools/${tool.slug}`}
                className="focus-ring group flex flex-col justify-between rounded-lg border p-4 transition hover-card"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">{tool.icon}</span>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
                </div>
                <span className="mt-3 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: c.color }} aria-hidden="true">
                  Open tool →
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
        <section className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Other PDF Tool Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((sib) => (
              <Btn variant="pill" key={sib} href={`/pdf-tools/category/${toSlug(sib)}`}>
                <span aria-hidden="true">{CAT_ICONS[sib]}</span>
                {sib}
              </Btn>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/pdf-tools" className="focus-ring text-xs font-medium hover:underline" style={{ color: "var(--teal)" }}>
              ← All PDF Tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
