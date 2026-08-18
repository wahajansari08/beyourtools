import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getRecentPosts, formatDate, blogPosts } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — BeYourTools Blog`,
    description: post.excerpt,
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  JSON:  "var(--teal)",
  Image: "var(--accent)",
  PDF:   "var(--coral)",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRecentPosts(3, post.slug);
  const catColor = CATEGORY_COLORS[post.category] ?? "var(--teal)";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>
          BeYourTools
        </Link>
        <span>/</span>
        <Link href="/blog" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>
          Blog
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px]" style={{ color: "var(--text-secondary)" }}>{post.title}</span>
      </div>

      {/* Article header — no cover image, clean card */}
      <div
        className="mb-8 overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        {/* Top strip */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${catColor} 15%, transparent)`,
                color: catColor,
              }}
            >
              {post.category}
            </span>
            <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
            {post.readingTime} min read · {post.author}
          </span>
        </div>

        {/* Title area */}
        <div className="px-6 py-6">
          <h1
            className="font-display text-2xl font-semibold leading-tight sm:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            {post.title}
          </h1>

          <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border px-2 py-0.5 text-[11px]"
                style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Article body */}
      <article
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Divider */}
      <div className="my-10 h-px" style={{ backgroundColor: "var(--border)" }} />

      {/* Author card */}
      <div
        className="mb-10 flex items-center gap-4 rounded-xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          aria-hidden="true"
        >
          B
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {post.author}
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            We build free browser-based tools for developers. Nothing you paste here ever leaves your device.
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section>
          <h2
            className="mb-4 font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            More articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((rel) => {
              const relColor = CATEGORY_COLORS[rel.category] ?? "var(--teal)";
              return (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="focus-ring group overflow-hidden rounded-xl border transition hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  {/* Plain header strip */}
                  <div
                    className="flex items-center justify-between border-b px-3 py-2.5"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                  >
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${relColor} 15%, transparent)`,
                        color: relColor,
                      }}
                    >
                      {rel.category}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                      {rel.readingTime} min
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
                      {rel.title}
                    </h3>
                    <span
                      className="mt-2 block text-[11px] font-medium transition group-hover:translate-x-0.5"
                      style={{ color: "var(--accent)" }}
                    >
                      Read →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
