import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, canonical, faqSchema, SITE, softwareApplicationSchema } from "@/lib/seo";
import type { VideoTool } from "@/lib/video-tools-config";
import VideoRelatedTools from "@/components/video/VideoRelatedTools";

/**
 * Page shell for the Social Video Resizer. Mirrors VideoToolPage structure
 * (breadcrumb, header, How-to, Features, FAQ, related) around the dedicated
 * SocialVideoResizerClient instead of the generic VideoToolClient.
 */
export default function SocialVideoResizerPage({ tool, client }: { tool: VideoTool; client: ReactNode }) {
  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Video Tools", url: canonical("/video-tools") },
      { name: tool.name, url: canonical(`/${tool.slug}`) },
    ]),
    softwareApplicationSchema({
      name: tool.name,
      description: tool.metaDescription,
      url: canonical(`/${tool.slug}`),
      category: "MultimediaApplication",
    }),
    faqSchema(tool.faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/video-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>Video Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{tool.name}</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>{tool.category}</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.tagline}</p>
        </div>

        {client}

        <p className="mt-6 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          Your video is processed locally in your browser and is not uploaded to our servers.
          Processing starts only when you click the button - nothing happens until then.
        </p>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Use {tool.name}</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {tool.howTo.map((step, index) => (
              <li key={step.title} className="flex gap-2">
                <span className="shrink-0 font-semibold" style={{ color: "var(--accent-text)" }}>{index + 1}.</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{step.title}</strong> - {step.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{tool.name} Features</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {tool.features.map((feature) => (
              <div key={feature} className="flex items-start gap-2 rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <span style={{ color: "var(--accent-text)" }} aria-hidden="true">✓</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {tool.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <summary className="cursor-pointer text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <VideoRelatedTools currentSlug={tool.slug} />
      </div>
    </>
  );
}
