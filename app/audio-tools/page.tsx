import type { Metadata } from "next";
import Link from "next/link";
import { audioTools, audioCategories, audioByCategory, type AudioTool } from "@/lib/audio-tools-config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Audio Tools - Free Online MP3 Converter, Cutter & Compressor | BeYourTools",
  description: "20 free browser-based audio tools - convert, cut, trim, compress, merge, boost volume, normalize and record audio. No upload, all processing in your browser.",
  keywords: "audio tools, mp3 converter, audio converter, mp3 cutter, audio compressor, mp3 merger, audio recorder, online audio editor, free audio tools",
  alternates: { canonical: `${SITE.url}/audio-tools` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/audio-tools`,
    title: "Audio Tools - Free Online MP3 Converter, Cutter & More | BeYourTools",
    description: "20 free browser-based audio tools. Convert, cut, compress, merge and record audio privately in your browser.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Audio Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Tools - Free MP3 Converter, Cutter & Compressor | BeYourTools",
    description: "20 free audio tools - convert, cut, compress, merge, record. No upload needed.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "Audio Tools", url: canonical("/audio-tools") },
  ]),
  softwareApplicationSchema({
    name: "BeYourTools Audio Tools",
    description: `${audioTools.length} free browser-based audio tools including MP3 converter, cutter, compressor, merger, volume booster and recorder.`,
    url: canonical("/audio-tools"),
    category: "MultimediaApplication",
  }),
  faqSchema([
    { question: "Are these audio tools really free?", answer: "Yes - all 20 tools are completely free with no sign-up, no watermarks and no usage limits." },
    { question: "Are my audio files uploaded to a server?", answer: "No. All audio processing happens entirely in your browser. Your files never leave your device." },
    { question: "Which formats are supported?", answer: "MP3, WAV, M4A, AAC, FLAC, OGG, Opus, WebM and MP4 (for audio extraction). Supported formats depend on the specific tool." },
    { question: "Do I need to install anything?", answer: "No installation required. The tools run directly in your browser on desktop and mobile." },
  ]),
];

const CATEGORY_COLORS: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  "Converters":           { dot: "var(--teal)",   bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)",   text: "var(--teal)"   },
  "Cutters & Trimmers":   { dot: "var(--accent)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent)" },
  "Compressors":          { dot: "var(--coral)",   bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"  },
  "Mergers":              { dot: "var(--teal)",    bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)",   text: "var(--teal)"   },
  "Effects & Processing": { dot: "var(--accent)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent)" },
  "Recorder":             { dot: "var(--coral)",   bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"  },
};

function ToolCard({ tool }: { tool: AudioTool }) {
  const c = CATEGORY_COLORS[tool.category] ?? CATEGORY_COLORS["Converters"];
  return (
    <Link
      href={`/${tool.slug}`}
      className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
            style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
            aria-hidden="true"
          >
            {tool.icon}
          </span>
          <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {tool.name}
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {tool.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: c.bg, color: c.text }}>
          {tool.category}
        </span>
        <span className="text-xs font-medium opacity-0 transition group-hover:opacity-100"
          style={{ color: "var(--accent)" }}>
          Use tool →
        </span>
      </div>
    </Link>
  );
}

const POPULAR = ["mp3-converter", "mp3-cutter", "mp4-to-mp3", "mp3-compressor", "audio-recorder", "audio-converter"];

export default function AudioToolsPage() {
  const popularTools = POPULAR.map((s) => audioTools.find((t) => t.slug === s)).filter(Boolean) as AudioTool[];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Audio Tools</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            Audio Tools
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Convert, cut, compress, merge, and process audio files - entirely in your browser.
            No file uploads, no account, no limits. Supports MP3, WAV, FLAC, M4A, OGG and more.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${audioTools.length} tools`, "100% browser-based", "Files never uploaded", "Fast & private"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--teal)" }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Popular quick links */}
        <div className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>Popular</h2>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((t) => (
              <Link key={t.slug} href={`/${t.slug}`}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                <span aria-hidden="true">{t.icon}</span>{t.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Browse by Category */}
        <div className="mb-12">
          <h2 className="mb-4 font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Browse by Category
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {audioCategories.map((cat) => {
              const c = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["Converters"];
              const catTools = audioByCategory(cat);
              const CAT_ICONS: Record<string, string> = {
                "Converters":           "🔄",
                "Cutters & Trimmers":   "✂️",
                "Compressors":          "🗜️",
                "Mergers":              "🔗",
                "Effects & Processing": "🎚️",
                "Recorder":             "🎙️",
              };
              const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              return (
                <Link
                  key={cat}
                  href={`/audio-tools/${catSlug}`}
                  className="focus-ring group rounded-xl border p-4 transition hover-card"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
                      aria-hidden="true"
                    >
                      {CAT_ICONS[cat]}
                    </span>
                    <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{cat}</h3>
                  </div>
                  <p className="mt-3 text-[11px] font-medium" style={{ color: c.text }}>
                    {catTools.length} {catTools.length === 1 ? "tool" : "tools"} →
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tools by category */}
        <div className="space-y-12">
          {audioCategories.map((cat) => {
            const tools = audioByCategory(cat);
            const c = CATEGORY_COLORS[cat];
            return (
              <section key={cat}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dot }} aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>{cat}</h2>
                  <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}>
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
                </div>
              </section>
            );
          })}
        </div>

        {/* Privacy note */}
        <div className="mt-12 rounded-lg border p-4 text-xs leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Privacy: </span>
          All audio processing happens locally in your browser.
          Your audio files are never uploaded to any server and never leave your device.
        </div>
      </div>
    </>
  );
}
