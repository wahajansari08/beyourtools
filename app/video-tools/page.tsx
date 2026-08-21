import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, canonical, faqSchema, SITE, softwareApplicationSchema } from "@/lib/seo";
import { videoByCategory, videoCategories, videoTools, type VideoTool } from "@/lib/video-tools-config";

export const metadata: Metadata = {
  title: "Video Tools - Free Online Browser Video Tools | BeYourTools",
  description: "20 free browser-based video tools to compress, cut, trim, convert, resize, crop, merge, create GIFs, extract frames, and edit audio locally.",
  keywords: "video tools, video compressor, video converter, video cutter, video trimmer, mp4 to mp3, video to gif, online video tools",
  alternates: { canonical: `${SITE.url}/video-tools` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/video-tools`,
    title: "Video Tools - Free Online Browser Video Tools | BeYourTools",
    description: "Compress, convert, cut, resize, crop, merge, and process videos locally in your browser.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Video Tools" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "Video Tools", url: canonical("/video-tools") },
  ]),
  softwareApplicationSchema({
    name: "BeYourTools Video Tools",
    description: `${videoTools.length} free browser-based video tools for compression, conversion, editing, GIFs, frames, and audio tracks.`,
    url: canonical("/video-tools"),
    category: "MultimediaApplication",
  }),
  faqSchema([
    { question: "Are these video tools free?", answer: "Yes. The video tools are free to use in your browser with no sign-up." },
    { question: "Are videos uploaded?", answer: "No. All video processing happens locally in your browser. Your files never leave your device." },
    { question: "Which tools are the fastest?", answer: "The thumbnail generator and frame extractor capture frames directly from the video preview — they are nearly instant. Conversion, compression, and editing tools take a little longer depending on file size." },
  ]),
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  "Compress & Convert": { bg: "color-mix(in srgb,var(--teal) 10%,transparent)", border: "color-mix(in srgb,var(--teal) 30%,transparent)", text: "var(--teal)", dot: "var(--teal)" },
  "Cut & Edit": { bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent)", dot: "var(--accent)" },
  "Resize & Crop": { bg: "color-mix(in srgb,var(--coral) 10%,transparent)", border: "color-mix(in srgb,var(--coral) 30%,transparent)", text: "var(--coral)", dot: "var(--coral)" },
  "GIF & Frames": { bg: "color-mix(in srgb,var(--teal) 10%,transparent)", border: "color-mix(in srgb,var(--teal) 30%,transparent)", text: "var(--teal)", dot: "var(--teal)" },
  Audio: { bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent)", dot: "var(--accent)" },
};

function ToolCard({ tool }: { tool: VideoTool }) {
  const c = CATEGORY_COLORS[tool.category];
  return (
    <Link href={`/${tool.slug}`} className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-mono text-[10px] font-semibold" style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }} aria-hidden="true">
            {tool.icon}
          </span>
          <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: c.bg, color: c.text }}>{tool.category}</span>
        <span className="text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>Use Tool</span>
      </div>
    </Link>
  );
}

const popular = ["video-compressor", "video-cutter", "video-converter", "mp4-to-mp3", "video-to-gif", "video-thumbnail-generator"];

export default function VideoToolsPage() {
  const popularTools = popular.map((slug) => videoTools.find((tool) => tool.slug === slug)).filter(Boolean) as VideoTool[];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Video Tools</span>
        </div>

        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>Video Tools</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Compress, cut, trim, convert, resize, crop, merge, create GIFs, extract frames, and edit video audio locally in your browser.
            Files are not uploaded or stored.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${videoTools.length} tools`, "Browser-based processing", "Files never uploaded", "Fast & private"].map((item) => (
              <span key={item} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--teal)" }} />{item}</span>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Popular</h2>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((tool) => (
              <Link key={tool.slug} href={`/${tool.slug}`} className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                <span className="font-mono text-[10px]" aria-hidden="true">{tool.icon}</span>{tool.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {videoCategories.map((category) => {
            const tools = videoByCategory(category);
            const c = CATEGORY_COLORS[category];
            return (
              <section key={category}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dot }} aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>{category}</h2>
                  <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}>
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 rounded-lg border p-4 text-xs leading-relaxed" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Privacy: </span>
          All video processing happens locally in your browser.
          No videos are uploaded to any server.
        </div>
      </div>
    </>
  );
}
