import type { Metadata } from "next";
import Link from "next/link";
import { pdfTools, pdfToolCategories, pdfToolsByCategory } from "@/lib/pdf-tools-config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";
import Btn from "@/components/Btn";

export const metadata: Metadata = {
  title: "PDF Tools - Free Online PDF Editor, Converter & Compressor | BeYourTools",
  description: "Free browser-based PDF tools. Merge, split, compress, rotate, watermark, protect, convert PDF to JPG/PNG/text - no upload, no sign-up, 100% private.",
  keywords: "merge PDF, split PDF, compress PDF, PDF to JPG, PDF to text, PDF watermark, protect PDF, free PDF tools, online PDF editor",
  alternates: { canonical: `${SITE.url}/pdf-tools` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", url: `${SITE.url}/pdf-tools`,
    title: "PDF Tools - Free Online PDF Editor, Converter & Compressor",
    description: "30 PDF tools in your browser - merge, split, compress, convert and more. No upload required.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "PDF Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools - Free Online PDF Editor & Converter | BeYourTools",
    description: "30 free PDF tools - merge, split, compress, protect and more. No upload needed.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
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
      { question: "Is it safe to use online PDF tools?", answer: "With BeYourTools, your PDF files never leave your device. All processing happens locally in your browser - nothing is uploaded to any server." },
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
              <Btn variant="pill" key={slug} href={`/pdf-tools/${slug}`}>
                <span>{tool.icon}</span>
                {tool.name}
              </Btn>
            );
          })}
        </div>
      </div>

      {/* Browse by Category */}
      <div className="mb-12">
        <h2 className="mb-4 font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Browse by Category
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {pdfToolCategories.map((cat) => {
            const catTools = pdfToolsByCategory(cat);
            const META: Record<string, { icon: string; desc: string; color: string; bg: string; border: string }> = {
              "Convert":             { icon: "⇄", desc: "PDF to JPG, PNG, text, and more. JPG, PNG to PDF.", color: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
              "Edit & Organize":     { icon: "✏️", desc: "Merge, split, rotate, reorder, and watermark PDFs.", color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
              "Security":            { icon: "🔒", desc: "Protect with passwords or remove existing encryption.", color: "var(--coral)",    bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)"  },
              "Extract & Analyze":   { icon: "🔍", desc: "Extract text, images, metadata, and page details.",    color: "var(--teal)",       bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
              "Repair & Compare":    { icon: "⚙️", desc: "Repair corrupted PDFs and compare document versions.", color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
            };
            const m = META[cat] ?? META["Convert"];
            const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            return (
              <Link
                key={cat}
                href={`/pdf-tools/category/${catSlug}`}
                className="focus-ring group rounded-xl border p-4 transition hover-card"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ backgroundColor: m.bg, border: `1px solid ${m.border}` }}
                    aria-hidden="true"
                  >
                    {m.icon}
                  </span>
                  <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{cat}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{m.desc}</p>
                <p className="mt-3 text-[11px] font-medium" style={{ color: m.color }}>
                  {catTools.length} tools →
                </p>
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
