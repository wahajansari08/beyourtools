import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, canonical, faqSchema, SITE, softwareApplicationSchema } from "@/lib/seo";
import type { VideoTool } from "@/lib/video-tools-config";
import VideoRelatedTools from "./VideoRelatedTools";
import VideoToolClient from "./VideoToolClient";

export default function VideoToolPage({ tool }: { tool: VideoTool }) {
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
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>{tool.category}</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.tagline}</p>
        </div>

        <VideoToolClient tool={tool} />

        <p className="mt-6 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          Your video is processed locally in your browser and is not uploaded to our servers.
          {tool.engine === "browser" ? " This lightweight tool captures frames directly from the video in your browser." : " Processing starts only when you click the button - nothing happens until then."}
        </p>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Use {tool.name}</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {tool.howTo.map((step, index) => (
              <li key={step.title} className="flex gap-2">
                <span className="shrink-0 font-semibold" style={{ color: "var(--teal)" }}>{index + 1}.</span>
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
                <span style={{ color: "var(--teal)" }} aria-hidden="true">✓</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-2 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Supported {tool.name} Formats</h2>
          <div className="flex flex-wrap gap-2">
            {tool.formats.map((format) => (
              <span key={format} className="rounded border px-2 py-0.5 font-mono text-xs" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                {format}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Privacy</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Files are handled as local browser objects. BeYourTools does not upload video or audio contents, does not store filenames, and does not send media to third-party processing APIs.
          </p>
        </section>

        {/* Video Standards & Performance Guide */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Video Standards &amp; Simple Playback Guide
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Working with video requires balancing file size with clear playback. Using <strong style={{ color: "var(--text-primary)" }}>{tool.name}</strong> helps you prepare clean video clips that play smoothly on any phone, tablet, or computer. Whether you need smaller clips for email or fast-loading videos for your website, our tool gets the job done quickly.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Fast Browser Processing</h3>
              <p>
                All video slicing, frame capture, and encoding run directly inside your browser. Your computer or phone handles the work locally, so your large video files never upload over the web.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Everyday Compatibility</h3>
              <p>
                Your saved clips keep standard screen shapes, true colors, and clean sound. They open immediately in Apple QuickTime, Windows Media Player, Chrome, and Safari without extra plugins.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{tool.name} Frequently Asked Questions</h2>
          {tool.faqs.map((faq) => (
            <div key={faq.question}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{faq.question}</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{faq.answer}</p>
            </div>
          ))}
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Does processing reduce the quality or resolution of my original video?</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Trimming, cutting, and frame extraction keep your original video resolution and picture clarity. Our compressor tool lets you choose how much file size to shave off while keeping your picture sharp.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Are my personal videos uploaded to or viewable by anyone else?</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              No. All video editing happens right in your browser memory. Your files are never sent to our servers or saved anywhere online. Everything stays safe on your own device.
            </p>
          </div>
        </section>

        <VideoRelatedTools currentSlug={tool.slug} />
      </div>
    </>
  );
}
