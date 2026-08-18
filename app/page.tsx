import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/lib/tools-config";
import { pdfTools } from "@/lib/pdf-tools-config";
import { conversionRoutes } from "@/lib/image-tools-config";
import { getRecentPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "BeYourTools — Free Online Tools for Developers",
  description:
    "JSON tools, image converters, PDF utilities and more — all running privately in your browser. No upload, no sign-up, always free.",
};

// ─── Section data ─────────────────────────────────────────────────────────────

const JSON_FEATURED = [
  "json-formatter", "json-validator", "json-diff", "json-to-csv",
  "json-to-typescript", "json-schema-generator", "jwt-decoder", "json-repair",
];

const IMAGE_FEATURED = [
  "jpg-to-png", "jpg-to-webp", "jpg-to-pdf",
  "png-to-jpg", "png-to-webp", "png-to-svg",
  "webp-to-jpg", "svg-to-png", "pdf-to-jpg",
];

const PDF_FEATURED = [
  "pdf-to-jpg", "jpg-to-pdf", "merge-pdf",
  "split-pdf", "pdf-compressor", "protect-pdf",
  "pdf-to-text", "rotate-pdf", "pdf-metadata-viewer",
];

// ─── Stat helpers ─────────────────────────────────────────────────────────────

const jsonCount = tools.length;
const imageCount = conversionRoutes.length;
const pdfCount = pdfTools.length;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div>
      <Hero />
      <ToolSections />
      <BottomCta />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-grid-fade" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            100% client-side — nothing leaves your browser
          </div>

          {/* Headline */}
          <h1
            className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "var(--text-primary)" }}
          >
            Every tool you need,{" "}
            <span style={{ color: "var(--accent)" }}>right here.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            BeYourTools is a fast, free toolbox for developers and designers — JSON utilities,
            image converters, PDF tools and more. No installs, no accounts, no limits.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/json-tools"
              className="focus-ring rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Explore JSON Tools
            </Link>
            <Link
              href="/image-converter"
              className="focus-ring rounded-md border px-5 py-2.5 text-sm font-semibold transition"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)", backgroundColor: "var(--bg-elevated)" }}
            >
              Image Converter
            </Link>
            <Link
              href="/pdf-tools"
              className="focus-ring rounded-md border px-5 py-2.5 text-sm font-semibold transition"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)", backgroundColor: "var(--bg-elevated)" }}
            >
              PDF Tools
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {[
              { count: jsonCount,  label: "JSON tools"    },
              { count: imageCount, label: "Image converters" },
              { count: pdfCount,   label: "PDF tools"      },
            ].map(({ count, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-2xl font-semibold" style={{ color: "var(--accent)" }}>
                  {count}+
                </div>
                <div className="mt-0.5 text-xs" style={{ color: "var(--text-subtle)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tool Sections ────────────────────────────────────────────────────────────

function ToolSections() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6">
      <ToolSection
        id="json-tools"
        icon="{ }"
        iconColor="var(--teal)"
        title="JSON Tools"
        description={`${jsonCount} tools for formatting, validating, converting and inspecting JSON — all in your browser.`}
        href="/json-tools"
        ctaLabel="All JSON Tools →"
        featured={JSON_FEATURED.map((slug) => tools.find((t) => t.slug === slug)).filter(Boolean) as typeof tools}
        cardHref={(slug) => `/${slug}`}
        cardIcon="{ }"
        cardIconColor="var(--teal)"
      />

      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      <ToolSection
        id="image-converter"
        icon="🖼"
        iconColor="var(--accent)"
        title="Image Converter"
        description={`${imageCount} conversion pairs — JPG, PNG, WebP, AVIF, SVG, ICO, PDF and more. Instant, private, free.`}
        href="/image-converter"
        ctaLabel="All Image Converters →"
        featured={IMAGE_FEATURED.map((slug) => {
          const [from, , to] = slug.split("-");
          return { slug, name: `${from.toUpperCase()} → ${to.toUpperCase()}`, description: `Convert ${from.toUpperCase()} to ${to.toUpperCase()} instantly.` };
        })}
        cardHref={(slug) => `/image-converter/${slug}`}
        cardIcon="→"
        cardIconColor="var(--accent)"
      />

      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      <ToolSection
        id="pdf-tools"
        icon="📄"
        iconColor="var(--coral)"
        title="PDF Tools"
        description={`${pdfCount} tools — merge, split, compress, convert, protect, watermark and more.`}
        href="/pdf-tools"
        ctaLabel="All PDF Tools →"
        featured={PDF_FEATURED.map((slug) => pdfTools.find((t) => t.slug === slug)).filter(Boolean) as typeof pdfTools}
        cardHref={(slug) => `/pdf-tools/${slug}`}
        cardIcon="📄"
        cardIconColor="var(--coral)"
      />

      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      <BlogSection />
    </div>
  );
}

function ToolSection({
  id, icon, iconColor, title, description, href, ctaLabel,
  featured, cardHref, cardIcon, cardIconColor,
}: {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  featured: { slug: string; name: string; description: string }[];
  cardHref: (slug: string) => string;
  cardIcon: string;
  cardIconColor: string;
}) {
  return (
    <section id={id}>
      {/* Section header */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold"
            style={{ backgroundColor: `color-mix(in srgb, ${iconColor} 15%, transparent)`, color: iconColor }}
            aria-hidden="true"
          >
            {icon}
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {title}
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{description}</p>
          </div>
        </div>
        <Link
          href={href}
          className="focus-ring text-sm font-medium transition hover:opacity-80"
          style={{ color: iconColor }}
        >
          {ctaLabel}
        </Link>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((tool) => (
          <Link
            key={tool.slug}
            href={cardHref(tool.slug)}
            className="focus-ring group flex flex-col justify-between rounded-lg border p-4 transition hover-card-accent"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold" style={{ color: cardIconColor }}>
                  {cardIcon}
                </span>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {tool.name}
                </h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {tool.description}
              </p>
            </div>
            <span className="mt-3 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: cardIconColor }}>
              Open →
            </span>
          </Link>
        ))}

        {/* "View all" card */}
        <Link
          href={href}
          className="focus-ring group flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition hover:-translate-y-0.5"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
        >
          <span className="text-2xl" aria-hidden="true">→</span>
          <span className="text-xs font-medium">View all {title}</span>
        </Link>
      </div>
    </section>
  );
}

// ─── Blog Section ────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  JSON:  "var(--teal)",
  Image: "var(--accent)",
  PDF:   "var(--coral)",
};

function BlogSection() {
  const posts = getRecentPosts(3);

  return (
    <section id="blog">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}
            aria-hidden="true"
          >
            ✍️
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Blog
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              Practical guides on JSON, images, PDFs and developer productivity.
            </p>
          </div>
        </div>
        <Link
          href="/blog"
          className="focus-ring text-sm font-medium transition hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          All articles →
        </Link>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const catColor = CATEGORY_COLORS[post.category] ?? "var(--teal)";
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="focus-ring group flex flex-col overflow-hidden rounded-xl border transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              {/* Plain header strip — no colour */}
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
              >
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${catColor} 15%, transparent)`,
                    color: catColor,
                  }}
                >
                  {post.category}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  {post.readingTime} min read
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                {/* Category + reading time */}
                <div className="mb-2 flex items-center gap-2 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                <h3
                  className="font-display text-sm font-semibold leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  {post.title}
                </h3>

                <p
                  className="mt-1.5 flex-1 text-xs leading-relaxed line-clamp-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {post.excerpt}
                </p>

                <div
                  className="mt-3 flex items-center justify-between text-[11px]"
                  style={{ color: "var(--text-subtle)" }}
                >
                  <span>{formatDate(post.publishedAt)}</span>
                  <span
                    className="font-medium transition group-hover:translate-x-0.5"
                    style={{ color: "var(--accent)" }}
                  >
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

function BottomCta() {
  return (
    <section className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          Everything runs in your browser
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          No data leaves your device. No accounts. No rate limits. BeYourTools is free forever.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
          {[
            { icon: "🔒", title: "Private",  body: "Files and text stay in your browser tab." },
            { icon: "⚡", title: "Instant",  body: "No server round-trips — results are immediate." },
            { icon: "🆓", title: "Free",     body: "No paywalls, no sign-ups, no limits." },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border p-5 text-left"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="mb-2 text-2xl">{icon}</div>
              <div className="mb-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
