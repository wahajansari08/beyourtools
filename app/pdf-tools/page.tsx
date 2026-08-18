import type { Metadata } from "next";
import Link from "next/link";
import { pdfTools, pdfToolCategories, pdfToolsByCategory } from "@/lib/pdf-tools-config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "PDF Tools - Free Online PDF Editor, Converter & Compressor",
  description: "Free browser-based PDF tools. Merge, split, compress, rotate, watermark, protect, convert PDF to JPG/PNG/text - no upload, no sign-up, 100% private.",
  keywords: "merge PDF, split PDF, compress PDF, PDF to JPG, PDF to text, PDF watermark, protect PDF, free PDF tools, online PDF editor",
  alternates: { canonical: `${SITE.url}/pdf-tools` },
  openGraph: {
    type: "website", url: `${SITE.url}/pdf-tools`,
    title: "Free Online PDF Tools - BeYourTools",
    description: "30 PDF tools in your browser - merge, split, compress, convert and more. No upload required.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "PDF Tools" }],
  },
};

const ENGINE_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  "pdf-lib": { label: "Browser", bg: "rgba(79,209,197,0.10)", text: "var(--teal)"   },
  "canvas":  { label: "Browser", bg: "rgba(79,209,197,0.10)", text: "var(--teal)"   },
  "jspdf":   { label: "Browser", bg: "rgba(79,209,197,0.10)", text: "var(--teal)"   },
  "limited": { label: "Limited", bg: "rgba(242,184,75,0.10)", text: "var(--accent)" },
};

export default function PdfToolsHub() {
  const total = pdfTools.length;
  const browserCount = pdfTools.filter((t) => t.engine !== "limited").length;

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "PDF Tools", url: canonical("/pdf-tools") },
    ]),
    softwareApplicationSchema({
      name: "BeYourTools PDF Tools",
      description: `${total} free browser-based PDF tools. Merge, split, compress, protect, watermark, and convert PDFs.`,
      url: canonical("/pdf-tools"),
      category: "DeveloperApplication",
    }),
    faqSchema([
      { question: "How do I merge PDF files for free?", answer: "Use our free PDF Merge tool - upload multiple PDFs, reorder them, and download the merged file. No account needed and files never leave your browser." },
      { question: "How do I compress a PDF?", answer: "Our PDF Compressor re-serialises the PDF's internal object streams, typically reducing size by 10–40% for standard PDFs without quality loss." },
      { question: "How do I password-protect a PDF?", answer: "Our PDF Protect tool adds AES-256 encryption. Enter a user password, upload your PDF, and download the protected version instantly." },
      { question: "Is it safe to use online PDF tools?", answer: "With BeYourTools, your PDF files never leave your device. All processing happens locally in JavaScript - nothing is uploaded to any server." },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>PDF Tools</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          PDF Tools
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Everything you need to work with PDFs - convert, edit, compress, protect and more.
          Most tools run entirely in your browser with no file upload required.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            {total} tools total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            {browserCount} run fully in browser
          </span>
        </div>
      </div>

      {/* Popular */}
      <div className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Popular</h2>
        <div className="flex flex-wrap gap-2">
          {["pdf-to-jpg","jpg-to-pdf","merge-pdf","split-pdf","pdf-compressor","protect-pdf","pdf-to-text","rotate-pdf"].map((slug) => {
            const tool = pdfTools.find((t) => t.slug === slug);
            if (!tool) return null;
            return (
              <Link
                key={slug}
                href={`/pdf-tools/${slug}`}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
              >
                <span>{tool.icon}</span>
                {tool.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tools grouped by category */}
      <div className="space-y-10">
        {pdfToolCategories.map((cat) => {
          const tools = pdfToolsByCategory(cat);
          return (
            <section key={cat}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>{cat}</h2>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}
                >
                  {tools.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => {
                  const badge = ENGINE_BADGE[tool.engine];
                  return (
                    <Link
                      key={tool.slug}
                      href={`/pdf-tools/${tool.slug}`}
                      className="focus-ring group flex flex-col justify-between rounded-lg border p-4 transition hover:-translate-y-0.5"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                    >
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base" aria-hidden="true">{tool.icon}</span>
                            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
                          </div>
                          <span
                            className="shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium"
                            style={{ backgroundColor: badge.bg, color: badge.text, borderColor: `color-mix(in srgb, ${badge.text} 30%, transparent)` }}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
                      </div>
                      <span className="mt-3 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                        Open tool →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Note */}
      <div
        className="mt-12 rounded-lg border p-4 text-xs leading-relaxed"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
      >
        <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>About &quot;Limited&quot; tools: </span>
        PDF ↔ Word, Excel, and PowerPoint conversions and OCR require server-side processing that browsers cannot provide.
        Those tools display a clear explanation and suggest free desktop alternatives.
      </div>
    </div>
    </>
  );
}
