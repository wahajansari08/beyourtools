import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPdfTool, pdfTools, pdfToolsByCategory } from "@/lib/pdf-tools-config";
import PdfToolClient from "./PdfToolClient";

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
  return {
    title: `${def.name} — Free Online PDF Tool — Jsonifyr`,
    description: `${def.description} No upload required, runs entirely in your browser.`,
  };
}

export default async function Page({ params }: Props) {
  const { tool } = await params;
  const def = getPdfTool(tool);
  if (!def) notFound();

  const related = pdfToolsByCategory(def.category)
    .filter((t) => t.slug !== def.slug)
    .slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-1.5 text-xs text-mist-400">
        <Link href="/" className="focus-ring rounded hover:text-mist-100">Jsonifyr</Link>
        <span>/</span>
        <Link href="/pdf-tools" className="focus-ring rounded hover:text-mist-100">PDF Tools</Link>
        <span>/</span>
        <span className="text-mist-300">{def.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{def.icon}</span>
          <h1 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">{def.name}</h1>
        </div>
        <p className="text-sm text-mist-300">{def.description}</p>
      </div>

      {/* Tool UI */}
      <PdfToolClient slug={def.slug} />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10 border-t border-ink-700 pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist-400">
            More {def.category} tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/pdf-tools/${t.slug}`}
                className="focus-ring rounded-md border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs text-mist-300 transition hover:border-ink-500 hover:text-mist-50"
              >
                {t.icon} {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
