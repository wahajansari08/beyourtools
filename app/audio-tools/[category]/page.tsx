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
  audioTools,
  audioCategories,
  audioByCategory,
  type AudioCategory,
} from "@/lib/audio-tools-config";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fromSlug(slug: string): AudioCategory | undefined {
  return audioCategories.find((c) => toSlug(c) === slug);
}

export function generateStaticParams() {
  return audioCategories.map((c) => ({ category: toSlug(c) }));
}

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<
  AudioCategory,
  { dot: string; bg: string; border: string; text: string }
> = {
  "Converters":           { dot: "var(--teal)",        bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)",   text: "var(--teal)"        },
  "Cutters & Trimmers":   { dot: "var(--accent-text)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent-text)" },
  "Compressors":          { dot: "var(--coral)",        bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"       },
  "Mergers":              { dot: "var(--teal)",         bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)",   text: "var(--teal)"        },
  "Effects & Processing": { dot: "var(--accent-text)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent-text)" },
  "Recorder":             { dot: "var(--coral)",        bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"       },
};

const CAT_ICONS: Record<AudioCategory, string> = {
  "Converters":           "🔄",
  "Cutters & Trimmers":   "✂️",
  "Compressors":          "🗜️",
  "Mergers":              "🔗",
  "Effects & Processing": "🎚️",
  "Recorder":             "🎙️",
};

const CAT_META: Record<
  AudioCategory,
  { description: string; intro: string; faqs: { question: string; answer: string }[] }
> = {
  "Converters": {
    description:
      "Free online audio converters. Convert MP3, WAV, FLAC, M4A, OGG, and AAC files between formats. Extract MP3 audio from MP4 video. All processing happens in your browser.",
    intro:
      "These converters let you change audio file formats without any upload or installation. Whether you need a WAV for editing, an MP3 for compatibility, or audio extracted from a video, these tools handle it in seconds.",
    faqs: [
      {
        question: "Which audio formats are supported?",
        answer:
          "Our converters support MP3, WAV, M4A, AAC, FLAC, OGG, Opus, and WebM as input formats. Output format support varies by tool but covers all the widely used formats. Check the individual tool page for the specific input/output combinations.",
      },
      {
        question: "Does audio conversion affect quality?",
        answer:
          "Converting between lossy formats (e.g. MP3 to OGG) always involves some quality loss since you are re-encoding already compressed audio. Converting from a lossless format (FLAC, WAV) to a lossy one (MP3) loses some detail but the result is comparable to the original source. You can select a higher bitrate to minimise quality reduction.",
      },
      {
        question: "How do I extract audio from an MP4 video?",
        answer:
          "Use the MP4 to MP3 converter. Upload your MP4 file, and the tool strips the video track and saves just the audio as an MP3. No re-encoding happens for the audio stream, so quality is preserved.",
      },
      {
        question: "What is the difference between MP3 and WAV?",
        answer:
          "WAV is an uncompressed format that preserves full audio quality but produces large files. MP3 is a lossy compressed format that is much smaller but sacrifices some high-frequency detail. WAV is preferred for editing and archiving; MP3 for distribution and streaming.",
      },
    ],
  },
  "Cutters & Trimmers": {
    description:
      "Free online audio cutter and trimmer tools. Cut MP3 and audio files to any length, trim silence or unwanted sections from the start or end. No upload needed.",
    intro:
      "These tools let you cut, trim, and clip audio files directly in your browser. Select a precise start and end point, trim dead air from your recordings, or extract a specific segment without any software.",
    faqs: [
      {
        question: "What is the difference between cutting and trimming audio?",
        answer:
          "Cutting extracts a specific section from somewhere in the middle of a file by setting a start and end point. Trimming removes content from the beginning or end of a file. Both operations are non-destructive here since they work on a copy.",
      },
      {
        question: "How precisely can I cut an audio file?",
        answer:
          "The audio cutter lets you set start and end times down to the second, and you can scrub the waveform to find the exact position you need. Precision depends on the tool but is typically accurate to within a fraction of a second.",
      },
      {
        question: "Will cutting an MP3 re-encode the audio?",
        answer:
          "It depends on the tool. Some cutters re-encode to ensure the output is a valid file, which may cause a minor quality reduction. The cut point is usually aligned to the nearest MP3 frame boundary to minimise artefacts.",
      },
      {
        question: "Can I trim silence from a recording?",
        answer:
          "Yes. The MP3 Trimmer is designed specifically for removing silence or unwanted content from the start and end of a recording. You set the trim points and the output contains only the content between them.",
      },
    ],
  },
  "Compressors": {
    description:
      "Free online audio compressors. Reduce MP3 and audio file size with quality, bitrate, and format controls. All compression runs client-side with no upload.",
    intro:
      "Audio compression reduces file size by lowering the bitrate, which makes files faster to share and easier to store. These tools let you choose the compression level and output format so you stay in control of the quality trade-off.",
    faqs: [
      {
        question: "How does audio compression work?",
        answer:
          "Audio compression (in the context of file size) re-encodes the audio at a lower bitrate. A lower bitrate means less data is stored per second of audio, which reduces file size but also reduces audio quality. A 128 kbps MP3 is roughly half the size of a 256 kbps one.",
      },
      {
        question: "What bitrate should I use for music vs speech?",
        answer:
          "For music, 128 kbps is acceptable for casual listening; 192 kbps or 256 kbps is better for high-quality playback. Speech recordings (podcasts, voice memos) are often fine at 64-96 kbps since speech has a narrower frequency range than music.",
      },
      {
        question: "Can I compress a FLAC or WAV file to MP3?",
        answer:
          "Yes. The Audio Compressor accepts lossless formats like FLAC and WAV as input and can output to MP3, OGG, or AAC. This is a common workflow for archiving originals in lossless format while distributing smaller compressed versions.",
      },
      {
        question: "What is the difference between MP3 Compressor and Audio Compressor?",
        answer:
          "The MP3 Compressor is optimised for MP3 input and output. The Audio Compressor supports multiple input formats and multiple output formats (MP3, OGG, AAC). Use the Audio Compressor if your source is not an MP3.",
      },
    ],
  },
  "Mergers": {
    description:
      "Free online audio merger and joiner tools. Merge multiple MP3 files into one, join audio files of any format. All merging runs in your browser with no upload.",
    intro:
      "Combine multiple audio files into a single output without any software. Useful for joining podcast segments, stitching music tracks, or combining voice recordings.",
    faqs: [
      {
        question: "Can I merge audio files of different formats?",
        answer:
          "The Audio Joiner supports multiple input formats and handles format differences by converting them to a common intermediate before joining. The MP3 Merger is specifically for MP3 input. If you have mixed formats, use the Audio Joiner.",
      },
      {
        question: "Is there a limit to how many files I can merge?",
        answer:
          "There is no hard limit enforced by the tool, but browser memory limits apply. For very large files or many files at once, you may encounter slowdowns. For best results, merge up to 10 reasonably-sized files at a time.",
      },
      {
        question: "Does merging files add silence between tracks?",
        answer:
          "By default, the merger joins files seamlessly with no gap. If you need a pause between segments (e.g. between podcast sections), some tools offer a configurable gap duration.",
      },
      {
        question: "What output format does the merger produce?",
        answer:
          "The MP3 Merger produces an MP3 file. The Audio Joiner produces output in the format you select. The merged audio quality matches the input quality since no re-encoding occurs for the audio content itself.",
      },
    ],
  },
  "Effects & Processing": {
    description:
      "Free online audio effects and processing tools. Boost MP3 volume, normalise audio levels, change playback speed, and remove silence. All processing is client-side.",
    intro:
      "Enhance, correct, and transform audio files with these processing tools. All operations run entirely in your browser, so your audio never leaves your device.",
    faqs: [
      {
        question: "What is audio normalisation?",
        answer:
          "Normalisation adjusts the overall volume of an audio file so that the loudest peak reaches a target level (typically 0 dBFS for peak normalisation, or a target LUFS for loudness normalisation). It makes audio consistently loud without clipping.",
      },
      {
        question: "What is the difference between volume boost and normalisation?",
        answer:
          "Volume boost (gain) simply multiplies the audio signal by a fixed factor, making everything louder. Normalisation analyses the file and applies the exact gain needed to bring the loudest peak to a target level. Normalisation is smarter but requires analysing the whole file first.",
      },
      {
        question: "Does changing audio speed affect the pitch?",
        answer:
          "Our Change Audio Speed tool uses time-stretching algorithms to change speed while preserving pitch, so speeding up a recording does not make voices sound like chipmunks. Some simpler tools do change pitch proportionally to speed, so check the tool description.",
      },
      {
        question: "How does silence removal work?",
        answer:
          "The Remove Silence tool detects sections where the audio volume drops below a threshold for a configurable minimum duration, then removes those sections. This is useful for tightening up recordings, removing pauses between sentences, or cleaning up raw interview audio.",
      },
    ],
  },
  "Recorder": {
    description:
      "Free online audio recorder. Record audio directly from your microphone and download the result. No upload, no account, runs entirely in your browser.",
    intro:
      "Record audio straight from your microphone using your browser. Useful for voice memos, quick recordings, podcast drafts, and any time you need audio without installing software.",
    faqs: [
      {
        question: "What format does the Audio Recorder save in?",
        answer:
          "The recorder saves your recording as a WebM or WAV file depending on your browser's MediaRecorder API support. Most modern browsers produce WebM with Opus audio. You can then convert the file to MP3 or another format using our Audio Converter.",
      },
      {
        question: "Does the recorder upload my audio anywhere?",
        answer:
          "No. The recording is captured locally using your browser's MediaRecorder API and saved directly to your device. BeYourTools does not receive, store, or process your audio.",
      },
      {
        question: "What microphone does the recorder use?",
        answer:
          "The tool uses whichever microphone your browser and operating system have selected as the default input device. You can change the input device in your system sound settings or, on some browsers, directly in the browser's permission prompt.",
      },
      {
        question: "How long can I record for?",
        answer:
          "There is no hard time limit imposed by the tool. The practical limit is your device's available memory since the recording accumulates in browser memory. For very long recordings (over an hour), consider pausing and saving in segments.",
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
  const catTools = audioByCategory(cat);

  return {
    title: `${cat} - Free Online Audio ${cat} | BeYourTools`,
    description: m.description,
    keywords: catTools
      .map((t) => t.name)
      .concat(["audio tools", cat, "free online", "browser-based", "no upload"])
      .join(", "),
    alternates: { canonical: `${SITE.url}/audio-tools/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE.url}/audio-tools/${slug}`,
      title: `${cat} - Free Online Audio ${cat} | BeYourTools`,
      description: m.description,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: `Audio ${cat}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat} - Free Online Audio ${cat} | BeYourTools`,
      description: m.description,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AudioCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) notFound();

  const catTools = audioByCategory(cat);
  const c = CATEGORY_COLORS[cat];
  const m = CAT_META[cat];
  const pageUrl = canonical(`/audio-tools/${slug}`);
  const siblings = audioCategories.filter((a) => a !== cat);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Audio Tools", url: canonical("/audio-tools") },
      { name: cat, url: pageUrl },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools Audio ${cat}`,
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
            <li><Link href="/audio-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>Audio Tools</Link></li>
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
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.text }}>
              Audio Tools
            </p>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {cat}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {m.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${catTools.length} tools`, "100% browser-based", "Files never uploaded", "Free forever"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tool grid */}
        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="mb-4 font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            All {cat}
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
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
                </div>
                <span className="mt-4 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: c.text }} aria-hidden="true">
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
            Other Audio Tool Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((sib) => (
              <Link
                key={sib}
                href={`/audio-tools/${toSlug(sib)}`}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition hover-card"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                <span aria-hidden="true">{CAT_ICONS[sib]}</span>
                {sib}
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/audio-tools" className="focus-ring text-xs font-medium hover:underline" style={{ color: "var(--teal)" }}>
              ← All Audio Tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
