import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — BeYourTools",
  description:
    "Practical guides on JSON, image conversion, PDF tools, web performance and developer productivity. Free tips from the BeYourTools team.",
};

const CATEGORY_COLORS: Record<string, string> = {
  JSON:  "var(--teal)",
  Image: "var(--accent)",
  PDF:   "var(--coral)",
};

// Category icons shown in the card header strip
const CATEGORY_ICONS: Record<string, string> = {
  JSON:  "{ }",
  Image: "🖼",
  PDF:   "📄",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>
          BeYourTools
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>Blog</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          Blog
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Practical guides on JSON, images, PDFs and developer productivity.
        </p>
      </div>

      {/* Featured post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="focus-ring group mb-10 block overflow-hidden rounded-2xl border transition hover:-translate-y-0.5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        {/* Plain header strip — no colour */}
        <div
          className="flex items-center justify-between border-b px-6 py-4 sm:px-8"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold"
              style={{
                backgroundColor: `color-mix(in srgb, ${CATEGORY_COLORS[featured.category] ?? "var(--teal)"} 15%, transparent)`,
                color: CATEGORY_COLORS[featured.category] ?? "var(--teal)",
              }}
            >
              {CATEGORY_ICONS[featured.category] ?? "✍️"}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Featured
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
            {featured.readingTime} min read
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--text-subtle)" }}>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${CATEGORY_COLORS[featured.category] ?? "var(--teal)"} 15%, transparent)`,
                color: CATEGORY_COLORS[featured.category] ?? "var(--teal)",
              }}
            >
              {featured.category}
            </span>
            <span>{formatDate(featured.publishedAt)}</span>
          </div>

          <h2 className="font-display text-xl font-semibold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
            {featured.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {featured.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {featured.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border px-2 py-0.5 text-[11px]"
                style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <span
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition group-hover:gap-2.5"
            style={{ color: "var(--accent)" }}
          >
            Read article
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </Link>

      {/* Rest of posts grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => {
          const catColor = CATEGORY_COLORS[post.category] ?? "var(--teal)";
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="focus-ring group flex flex-col overflow-hidden rounded-xl border transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              {/* Plain header strip */}
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
                <h3
                  className="font-display text-sm font-semibold leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  {post.title}
                </h3>

                <p
                  className="mt-2 flex-1 text-xs leading-relaxed line-clamp-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {post.excerpt}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="font-medium transition group-hover:translate-x-0.5" style={{ color: "var(--accent)" }}>
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
