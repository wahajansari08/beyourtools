import Link from "next/link";
import AudioRelatedTools from "./AudioRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

interface FAQ { question: string; answer: string }
interface HowToStep { title: string; text: string }

interface AudioToolPageProps {
  slug: string;
  title: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  faqs: FAQ[];
  howTo: HowToStep[];
  features?: string[];
  formats?: string[];
  children: React.ReactNode;
}

export default function AudioToolPage({
  slug,
  title,
  categoryLabel,
  tagline,
  description,
  faqs,
  howTo,
  features,
  formats,
  children,
}: AudioToolPageProps) {
  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Audio Tools",  url: canonical("/audio-tools") },
      { name: title,          url: canonical(`/${slug}`) },
    ]),
    softwareApplicationSchema({
      name: title,
      description,
      url: canonical(`/${slug}`),
      category: "MultimediaApplication",
    }),
    faqSchema(faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/audio-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>Audio Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>
            {categoryLabel}
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {tagline}
          </p>
        </div>

        {/* Tool UI */}
        {children}

        {/* Privacy */}
        <p className="mt-6 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          🔒 Your audio files are processed locally in your browser and are never uploaded to any server.
        </p>

        {/* How to use */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {howTo.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold shrink-0" style={{ color: "var(--teal)" }}>{i + 1}.</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{step.title}</strong> — {step.text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        {features && features.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Features</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2 rounded-lg border p-3"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                  <span style={{ color: "var(--teal)" }} aria-hidden="true">✓</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{f}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Supported formats */}
        {formats && formats.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-2 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Supported formats</h2>
            <div className="flex flex-wrap gap-2">
              {formats.map((f) => (
                <span key={f} className="rounded border px-2 py-0.5 font-mono text-xs"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          {faqs.map(({ question, answer }) => (
            <div key={question}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{question}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{answer}</p>
            </div>
          ))}
        </section>

        <AudioRelatedTools currentSlug={slug} />
      </div>
    </>
  );
}
