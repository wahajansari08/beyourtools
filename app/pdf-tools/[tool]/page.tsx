import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPdfTool, pdfTools, pdfToolsByCategory } from "@/lib/pdf-tools-config";
import PdfToolClient from "./PdfToolClient";
import Btn from "@/components/Btn";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, webAppSchema, faqSchema, SITE, canonical } from "@/lib/seo";

interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateStaticParams() {
  return pdfTools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const def = getPdfTool(tool);
  if (!def) return { title: "Not Found" };
  const url = canonical(`/pdf-tools/${def.slug}`);
  const title = `${def.name} - Free Online PDF Tool | BeYourTools`;
  const description = `${def.description} Free, browser-based, no file upload required.`;
  const image = `${SITE.url}/og-default.png`;

  return {
    title,
    description,
    keywords: `${def.name}, free online ${def.name.toLowerCase()}, pdf tool, browser pdf editor, client side pdf`,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: `${def.name} - BeYourTools` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: SITE.twitter,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { tool } = await params;
  const def = getPdfTool(tool);
  if (!def) notFound();

  const related = pdfToolsByCategory(def.category)
    .filter((t) => t.slug !== def.slug)
    .slice(0, 8);

  const url = canonical(`/pdf-tools/${def.slug}`);

  const faqs = [
    {
      question: `How does the ${def.name} tool work?`,
      answer: def.engine === "limited"
        ? `${def.name} evaluates your document format and explains the best local conversion approach or recommends free desktop software for high-fidelity conversion.`
        : `Select or drop your ${def.inputLabel.toLowerCase()} into the tool. Processing takes place directly inside your browser using client-side JavaScript, and your processed file is ready for download immediately.`,
    },
    {
      question: "Are my PDF files uploaded to any server?",
      answer: "No. All PDF processing happens locally in your browser memory. Your documents and sensitive data never leave your device.",
    },
    {
      question: `Is ${def.name} free with no limits?`,
      answer: "Yes, every tool on BeYourTools is 100% free with no account registration, no paywall, and no watermarks added.",
    },
    {
      question: "Can I use this tool on my phone or tablet?",
      answer: "Yes. BeYourTools is fully responsive and functions on modern mobile and desktop browsers including Chrome, Safari, Firefox, and Edge.",
    },
  ];

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "PDF Tools",   url: canonical("/pdf-tools") },
      { name: def.name,      url },
    ]),
    webAppSchema({
      name: def.name,
      description: def.description,
      url,
    }),
    faqSchema(faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/pdf-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>PDF Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{def.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">{def.icon}</span>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{def.name}</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{def.description}</p>
        </div>

        {/* Tool UI */}
        <PdfToolClient slug={def.slug} />

        {/* Privacy Note */}
        <p className="mt-4 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          🔒 Client-side security: Your PDF documents remain in your browser memory and are never uploaded to any remote server.
        </p>

        {/* How to use */}
        <section className="mt-10 space-y-3" aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            How to use {def.name}
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2">
              <span className="shrink-0 font-semibold" style={{ color: "var(--teal)" }}>1.</span>
              <span>Upload or drag-and-drop your <strong>{def.inputLabel}</strong> into the workspace above.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-semibold" style={{ color: "var(--teal)" }}>2.</span>
              <span>Configure any required options and click the action button to process your document.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-semibold" style={{ color: "var(--teal)" }}>3.</span>
              <span>Download your finished document directly to your device.</span>
            </li>
          </ol>
        </section>

        {/* PDF Architecture & Privacy Standards */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Document Security &amp; Client-Side PDF Architecture
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Standard cloud-based PDF web services require uploading your private files to remote servers, exposing confidential business contracts, financial statements, and personal records to potential transit interception or third-party retention. 
            The <strong style={{ color: "var(--text-primary)" }}>{def.name}</strong> on BeYourTools operates on a strict zero-upload architecture: your documents are parsed, processed, and re-serialized directly within your browser&apos;s sandboxed memory using high-performance WebAssembly and client-side JavaScript.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>ISO 32000 Standard Compliance</h3>
              <p>
                All output PDF streams generated by our tools strictly comply with international ISO 32000 specifications. 
                This ensures guaranteed font embedding, vector line precision, and visual fidelity across all desktop and mobile PDF readers including Adobe Acrobat, Apple Preview, Foxit, and web browsers.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Zero-Latency Execution</h3>
              <p>
                Because no gigabytes of data travel over the internet, your documents process at full hardware speed without waiting in cloud queues or suffering upload throttling. 
                Whether organizing 100-page manuscripts or single invoices, the tool runs offline without internet dependency once the page is loaded.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-10 space-y-3" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ question, answer }) => (
              <div key={question}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{question}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{answer}</p>
              </div>
            ))}
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Does using {def.name} alter my original document formatting?</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                No. Our engine preserves all embedded typography, vector graphics, hyperlinked metadata, and color spaces without applying destructive re-compression unless explicitly requested.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Is there any document page or file size limit?</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                There are no arbitrary software limits imposed by BeYourTools. The only practical boundary is your local system&apos;s available RAM. Modern devices easily handle multi-hundred page PDF documents without issues.
              </p>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              More {def.category} tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((t) => (
                <Btn key={t.slug} variant="pill" href={`/pdf-tools/${t.slug}`}>
                  <span aria-hidden="true">{t.icon}</span> {t.name}
                </Btn>
              ))}
            </div>
            <div className="mt-4">
              <Btn variant="ghost" size="sm" href="/pdf-tools">
                ← All PDF Tools
              </Btn>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
