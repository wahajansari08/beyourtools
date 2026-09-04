import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  softwareApplicationSchema,
  SITE,
  canonical,
} from "@/lib/seo";
import {
  videoTools,
  videoCategories,
  videoByCategory,
  type VideoCategory,
} from "@/lib/video-tools-config";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fromSlug(slug: string): VideoCategory | undefined {
  return videoCategories.find((c) => toSlug(c) === slug);
}

export function generateStaticParams() {
  return videoCategories.map((c) => ({ category: toSlug(c) }));
}

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<
  VideoCategory,
  { color: string; bg: string; border: string }
> = {
  "Compress & Convert": { color: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
  "Cut & Edit":         { color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
  "Resize & Crop":      { color: "var(--coral)",       bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)"  },
  "GIF & Frames":       { color: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)"   },
  "Audio":              { color: "var(--accent-text)", bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)" },
};

const CAT_ICONS: Record<VideoCategory, string> = {
  "Compress & Convert": "🎬",
  "Cut & Edit":         "✂️",
  "Resize & Crop":      "⬚",
  "GIF & Frames":       "🎞️",
  "Audio":              "🔊",
};

const CAT_META: Record<
  VideoCategory,
  { description: string; intro: string; faqs: { question: string; answer: string }[] }
> = {
  "Compress & Convert": {
    description:
      "Free online video compressors and converters. Reduce video file size, convert between MP4, WebM, MKV, MOV, and AVI formats. All processing runs in your browser.",
    intro:
      "These tools shrink and reformat video files. Use the compressor to reduce file size before uploading or sharing, and the converters to change formats for compatibility with different devices and platforms.",
    faqs: [
      {
        question: "How much can I reduce a video file size?",
        answer:
          "Compression ratios depend on the source video and the quality setting you choose. A typical 1080p MP4 can often be reduced by 40-70% with minimal visible quality loss at medium compression. Lower quality settings give smaller files but more visible artefacts.",
      },
      {
        question: "Which video formats are supported for conversion?",
        answer:
          "Our converters support MP4, WebM, MKV, MOV, and AVI as input formats, with MP4 and WebM as the primary output formats. MP4 (H.264) offers the widest compatibility across devices and platforms.",
      },
      {
        question: "Does video compression re-encode the video?",
        answer:
          "Yes. The video compressor re-encodes the video at a lower bitrate using FFmpeg running in your browser. Re-encoding is necessary to reduce file size but does involve some quality trade-off depending on the settings.",
      },
      {
        question: "Why does my video take a long time to compress?",
        answer:
          "Video processing is computationally intensive. The compressor runs FFmpeg via WebAssembly in your browser, which is slower than native desktop software. Long videos or high-resolution footage will take proportionally longer.",
      },
    ],
  },
  "Cut & Edit": {
    description:
      "Free online video cutter, trimmer, and editor tools. Cut video clips, trim start and end, split videos, and adjust playback speed. No upload, no install.",
    intro:
      "Cut, trim, and adjust video clips entirely in your browser. Whether you need to remove an intro, extract a specific scene, or create a short clip for sharing, these tools handle it without any software installation.",
    faqs: [
      {
        question: "Can I cut a video without re-encoding it?",
        answer:
          "When cut points align with keyframes in the video, re-encoding is not needed. Our video cutter attempts keyframe-aligned cuts where possible. For cuts at non-keyframe positions, a brief re-encode of the surrounding frames is required.",
      },
      {
        question: "How precisely can I trim a video?",
        answer:
          "The video trimmer lets you set start and end times in seconds. For frame-precise editing, you can scrub through the video to find the exact point. Precision is typically to within one video frame.",
      },
      {
        question: "Can I extract a short clip from the middle of a video?",
        answer:
          "Yes. The Video Cutter lets you set a start and end time anywhere in the video and saves just that segment as a new file. This is useful for extracting highlights, clips for social media, or specific scenes.",
      },
      {
        question: "What does changing video speed do to audio?",
        answer:
          "When you change video speed, the audio is sped up or slowed down proportionally. At 2x speed, audio plays at double pitch unless pitch correction is applied. The speed changer maintains pitch when available.",
      },
    ],
  },
  "Resize & Crop": {
    description:
      "Free online video resizer and cropper. Change video resolution, resize for social media aspect ratios, and crop to remove unwanted areas. Browser-based, no upload.",
    intro:
      "Resize video dimensions and crop to the exact frame you need. These tools are useful for reformatting videos for different platforms, removing black bars, or producing square clips for Instagram.",
    faqs: [
      {
        question: "What aspect ratios can I resize video to?",
        answer:
          "The Video Resizer supports any custom resolution as well as presets for common formats: 16:9 (widescreen), 9:16 (vertical/Reels), 1:1 (square), and 4:3 (standard). The output dimensions determine the aspect ratio.",
      },
      {
        question: "Does resizing a video to a larger size increase quality?",
        answer:
          "No. Upscaling a video to a larger resolution does not add detail that was not in the original. The tool stretches existing pixels, which can make the video appear blurry. Upscaling is useful for format compatibility, not quality improvement.",
      },
      {
        question: "Can I crop a portrait video to landscape?",
        answer:
          "Yes. The Video Cropper lets you define the crop region freely. You can take a 9:16 portrait video, crop it to a 16:9 window around the main subject, and output a landscape clip.",
      },
      {
        question: "What output format do resized videos use?",
        answer:
          "Resized videos are exported as MP4 (H.264) by default, which offers the best compatibility across browsers, devices, and video platforms.",
      },
    ],
  },
  "GIF & Frames": {
    description:
      "Free online video to GIF converter and frame extractor. Convert video clips to animated GIFs, extract frames as images, and convert GIFs to MP4. No upload needed.",
    intro:
      "Turn video clips into shareable animated GIFs, extract individual frames as still images, or convert a GIF into a proper video file. All processing runs client-side in your browser.",
    faqs: [
      {
        question: "How do I make an animated GIF from a video?",
        answer:
          "Use the Video to GIF tool. Upload your video, set the start time, duration, frame rate, and dimensions, and the tool generates an animated GIF. Keep GIFs under 10 seconds for reasonable file sizes.",
      },
      {
        question: "Why are my GIFs so large?",
        answer:
          "GIFs use a 256-colour palette per frame and lossless compression, so they are inherently large compared to video. Reduce file size by lowering the frame rate (10-15 fps is usually enough for motion), reducing dimensions, or shortening the duration.",
      },
      {
        question: "What image format are extracted video frames saved as?",
        answer:
          "Extracted frames are saved as JPG or PNG depending on the tool. JPG gives smaller files for photographic content; PNG is better for graphics with flat colours or text.",
      },
      {
        question: "Why would I convert a GIF to MP4?",
        answer:
          "MP4 video files are typically 5-10x smaller than equivalent GIFs while looking visually identical. Many platforms (Twitter, Slack, Discord) automatically convert GIFs to video internally. Converting manually gives you a smaller file to upload.",
      },
    ],
  },
  "Audio": {
    description:
      "Free online video audio tools. Extract MP3 audio from MP4 video, remove audio from video, and add an audio track to a video. All processing runs in your browser.",
    intro:
      "Manage the audio track in your video files. Extract the soundtrack as an MP3, remove audio entirely for a silent video, or replace the audio with a different track.",
    faqs: [
      {
        question: "How do I extract audio from a video as MP3?",
        answer:
          "Use the MP4 to MP3 tool. Upload your MP4 video and the tool extracts the audio track and saves it as an MP3 file. The audio quality matches the original since no re-encoding of the audio is necessary.",
      },
      {
        question: "Can I remove audio from a video to make it silent?",
        answer:
          "Yes. The Remove Audio from Video tool strips the audio track from your video and outputs a silent MP4. This is useful for adding music separately, avoiding copyright issues, or creating B-roll footage.",
      },
      {
        question: "Can I replace the audio in a video with a different file?",
        answer:
          "Yes. The Add Audio to Video tool takes a video file and an audio file and combines them. The original audio track is replaced by your chosen audio. If the audio is shorter than the video, the video will be silent from the point the audio ends unless looped.",
      },
      {
        question: "What audio formats can I add to a video?",
        answer:
          "The Add Audio to Video tool accepts MP3, WAV, AAC, OGG, and M4A as audio input. The output is an MP4 file with the new audio track embedded.",
      },
    ],
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) return {};
  const m = CAT_META[cat];
  const catTools = videoByCategory(cat);

  return {
    title: `${cat} Video Tools - Free Online Video ${cat} | BeYourTools`,
    description: m.description,
    keywords: catTools
      .map((t) => t.name)
      .concat(["video tools", cat, "free online", "browser-based", "no upload"])
      .join(", "),
    alternates: { canonical: `${SITE.url}/video-tools/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE.url}/video-tools/${slug}`,
      title: `${cat} Video Tools | BeYourTools`,
      description: m.description,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: `Video ${cat}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat} Video Tools | BeYourTools`,
      description: m.description,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function VideoCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) notFound();

  const catTools = videoByCategory(cat);
  const c = CATEGORY_COLORS[cat];
  const m = CAT_META[cat];
  const pageUrl = canonical(`/video-tools/${slug}`);
  const siblings = videoCategories.filter((v) => v !== cat);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Video Tools", url: canonical("/video-tools") },
      { name: cat, url: pageUrl },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools Video Tools - ${cat}`,
      description: m.description,
      url: pageUrl,
      category: "MultimediaApplication",
    }),
    itemListSchema(
      catTools.map((t) => ({
        name: t.name,
        url: canonical(`/${t.slug}`),
        description: t.description,
      }))
    ),
    faqSchema(m.faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
            <li><Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/video-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>Video Tools</Link></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{cat}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
              aria-hidden="true"
            >
              {CAT_ICONS[cat]}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.color }}>Video Tools</p>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {cat}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{m.intro}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${catTools.length} tools`, "100% browser-based", "Files never uploaded", "Free forever"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tool grid */}
        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="mb-4 font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            All {cat} Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold"
                      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.color }}
                      aria-hidden="true"
                    >
                      {tool.icon}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
                </div>
                <span className="mt-4 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: c.color }} aria-hidden="true">
                  Use tool →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {m.faqs.map(({ question, answer }) => (
              <div key={question}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{question}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other categories */}
        <section className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Other Video Tool Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((sib) => (
              <Link
                key={sib}
                href={`/video-tools/${toSlug(sib)}`}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition hover-card"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                <span aria-hidden="true">{CAT_ICONS[sib]}</span>
                {sib}
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/video-tools" className="focus-ring text-xs font-medium hover:underline" style={{ color: "var(--teal)" }}>
              ← All Video Tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
