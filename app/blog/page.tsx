import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, formatDate } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, SITE, canonical } from "@/lib/seo";
import BlogPagination from "./BlogPagination";

const PER_PAGE = 12; // 1 featured + 11 in grid on page 1; 12 per page from page 2

export const metadata: Metadata = {
  title: "Blog — Free Guides on JSON, Images, Audio, Video & PDF | BeYourTools",
  description: "Practical guides on JSON tools, image conversion, PDF utilities, audio tools, video editing, QR codes, and developer productivity.",
  keywords: "JSON tutorial, image converter guide, PDF tools guide, audio tools guide, developer blog, web development tips",
  alternates: { canonical: `${SITE.url}/blog` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/blog`,
    title: "BeYourTools Blog — Free Guides on JSON, Images, Audio & More",
    description: "Practical guides on JSON, image formats, PDF tools, audio, video and developer productivity.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeYourTools Blog — Free Developer Guides",
    description: "Practical guides on JSON, images, audio, video, PDF and more.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  JSON: "var(--teal)", Image: "var(--accent)", PDF: "var(--coral)",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const totalPosts = sorted.length;
  const totalPages = Math.ceil((totalPosts - 1) / PER_PAGE); // -1 because featured is always shown

  // Page 1: featured post + first PER_PAGE from the rest
  // Page N>1: next PER_PAGE posts from rest
  const featured = sorted[0];
  const rest = sorted.slice(1);
  const pageStart = (currentPage - 1) * PER_PAGE;
  const pagePosts = rest.slice(pageStart, pageStart + PER_PAGE);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Blog", url: canonical("/blog") },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      url: canonical("/blog"),
      name: "BeYourTools Blog",
      description: "Practical guides on JSON, image formats, PDF tools, and developer productivity.",
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      blogPost: sorted.slice(0, 10).map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: canonical(`/blog/${p.slug}`),
        datePublished: p.publishedAt,
        author: { "@type": "Organization", name: p.author },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Blog</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            Blog
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {totalPosts} articles on JSON, images, PDFs, and developer productivity.
            {totalPages > 1 && (
              <span> Page {currentPage} of {totalPages}.</span>
            )}
          </p>
        </div>

        {/* Featured - only on page 1 */}
        {currentPage === 1 && (
          <Link
            href={`/blog/${featured.slug}`}
            className="focus-ring group mb-10 block overflow-hidden rounded-2xl border transition hover:-translate-y-0.5"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{ backgroundColor: `color-mix(in srgb, ${CATEGORY_COLORS[featured.category] ?? "var(--teal)"} 15%, transparent)`, color: CATEGORY_COLORS[featured.category] ?? "var(--teal)" }}
                >
                  {featured.category}
                </span>
                <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{formatDate(featured.publishedAt)}</span>
                <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>Featured</span>
              </div>
              <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{featured.readingTime} min read</span>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold sm:text-2xl" style={{ color: "var(--text-primary)" }}>{featured.title}</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{featured.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {featured.tags.map((tag) => (
                  <span key={tag} className="rounded border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>{tag}</span>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition group-hover:gap-2.5" style={{ color: "var(--accent)" }}>
                Read article
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </Link>
        )}

        {/* Post grid */}
        {pagePosts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pagePosts.map((post) => {
              const catColor = CATEGORY_COLORS[post.category] ?? "var(--teal)";
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="focus-ring group flex flex-col overflow-hidden rounded-xl border transition hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `color-mix(in srgb, ${catColor} 15%, transparent)`, color: catColor }}>{post.category}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{post.readingTime} min read</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="font-display text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{post.title}</h2>
                    <p className="mt-2 flex-1 text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>{post.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: "var(--text-subtle)" }}>
                      <span>{formatDate(post.publishedAt)}</span>
                      <span className="font-medium transition group-hover:translate-x-0.5" style={{ color: "var(--accent)" }}>Read →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No more posts on this page.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <BlogPagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </>
  );
}
