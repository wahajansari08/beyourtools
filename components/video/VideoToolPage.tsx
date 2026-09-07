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
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
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
          <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Features</h2>
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
          <h2 className="mb-2 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Supported formats</h2>
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
            Video Encoding Standards &amp; Web Optimization Guide
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Video processing efficiency relies heavily on balancing compression bitrates, container standards, and decoding speed. 
            When preparing clips using <strong style={{ color: "var(--text-primary)" }}>{tool.name}</strong>, choosing modern encoding presets (such as H.264 for universal cross-platform playback or WebM/VP9 for lightweight web streaming) significantly improves user experience, lowers CDN delivery costs, and prevents mobile playback buffering.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>WebAssembly Acceleration</h3>
              <p>
                Our video engine utilizes optimized FFmpeg WebAssembly modules running directly inside your browser. 
                Video decoding, frame scaling, slicing, and re-encoding leverage your computer&apos;s local CPU cores without transmitting large video files across the internet.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Universal Compatibility</h3>
              <p>
                Processed clips maintain standard pixel aspect ratios, consistent chroma subsampling (YUV420p), and universally supported audio codecs (AAC/MP3/Opus), guaranteeing immediate playback on iOS Safari, Android Chrome, and desktop platforms.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          {tool.faqs.map((faq) => (
            <div key={faq.question}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{faq.question}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{faq.answer}</p>
            </div>
          ))}
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Does processing reduce the quality or resolution of my original video?</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              By default, operations like cutting, trimming, and extraction maintain the original video stream resolution and color accuracy. Compression tools allow you to balance smaller file sizes with high visual fidelity according to your bandwidth goals.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Are my personal videos uploaded to or viewable by anyone else?</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              No. All operations run in your device&apos;s local memory space. Zero bytes of your media are ever sent to BeYourTools servers or third-party cloud providers, making it 100% private and compliant with personal data protection policies.
            </p>
          </div>
        </section>

        <VideoRelatedTools currentSlug={tool.slug} />
      </div>
    </>
  );
}
