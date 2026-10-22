import type { Metadata } from "next";
import { localizeMetadata, localeCanonical, getTranslatedBlogPost } from "@/lib/i18n-content";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { blogPosts, formatDate, SITE_AUTHOR } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, SITE, canonical } from "@/lib/seo";
import BlogPagination from "./BlogPagination";

const PER_PAGE = 12; // 1 featured + 11 in grid on page 1; 12 per page from page 2

const BLOG_TITLE = "BeYourTools Blog - Free Guides on JSON, Images, Audio & More";
const BLOG_DESCRIPTION = "Practical guides on JSON, image formats, PDF tools, audio, video and developer productivity.";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

const __enMetadata: Metadata = {
  title: "Blog - Free Developer Guides & Tutorials | BeYourTools",
  description: "Practical guides on JSON, image formats, PDF tools, audio, video and developer productivity.",
  keywords: "JSON tutorial, image converter guide, PDF tools guide, audio tools guide, developer blog, web development tips",
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const requestedPage = Number.parseInt(sp.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 1 ? requestedPage : 1;
  const base = localeCanonical(locale, "/blog");
  const url = currentPage === 1 ? base : `${base}?page=${currentPage}`;
  const title =
    currentPage > 1
      ? `Blog (Page ${currentPage}) - Developer Guides | BeYourTools`
      : "Blog - Free Developer Guides & Tutorials | BeYourTools";
  const ogTitle = currentPage > 1 ? `${BLOG_TITLE} - Page ${currentPage}` : BLOG_TITLE;

  const description =
    currentPage > 1 ? `${BLOG_DESCRIPTION} Page ${currentPage}.` : BLOG_DESCRIPTION;

  const localized = await localizeMetadata(locale, "blog", {
    ...__enMetadata,
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title: ogTitle,
      description,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  });
  return localized;
}

const CATEGORY_COLORS: Record<string, string> = {
  JSON: "var(--accent-text)", Image: "var(--accent)", PDF: "var(--coral)",
};

export default async function BlogPage({ params: routeParams, searchParams }: Props) {
  const { locale } = await routeParams;
  const t = await getTranslations({ locale, namespace: "blogIndex" });
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const totalPosts = sorted.length;
  const totalPages = Math.ceil((totalPosts - 1) / PER_PAGE); // -1 because featured is always shown

  // Page 1: featured post + first PER_PAGE from the rest
  // Page N>1: next PER_PAGE posts from rest
  const localizePost = async (p: (typeof sorted)[number]) => {
    const tp = await getTranslatedBlogPost(locale, p.slug);
    return { ...p, title: tp?.title ?? p.title, excerpt: tp?.excerpt ?? p.excerpt };
  };
  const featured = await localizePost(sorted[0]);
  const rest = sorted.slice(1);
  const pageStart = (currentPage - 1) * PER_PAGE;
  const pagePosts = await Promise.all(rest.slice(pageStart, pageStart + PER_PAGE).map(localizePost));

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
        author: { "@type": "Person", name: p.author, jobTitle: SITE_AUTHOR.role, url: SITE_AUTHOR.url },
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
          <span style={{ color: "var(--text-secondary)" }}>{t("title")}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {currentPage > 1 ? t("page", { n: currentPage }) : t("title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {t("subtitle")}
            {totalPages > 1 && (
              <span> {t("showing", { a: pageStart + 1, b: Math.min(pageStart + PER_PAGE, totalPosts - 1), count: totalPosts })}</span>
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
                  style={{ backgroundColor: `color-mix(in srgb, ${CATEGORY_COLORS[featured.category] ?? "var(--accent-text)"} 15%, transparent)`, color: CATEGORY_COLORS[featured.category] ?? "var(--accent-text)" }}
                >
                  {featured.category}
                </span>
                <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{formatDate(featured.publishedAt)}</span>
                <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{t("byAuthor", { name: SITE_AUTHOR.name })} · {SITE_AUTHOR.role}</span>
                <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>{t("featured")}</span>
              </div>
              <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{t("minRead", { count: featured.readingTime })}</span>
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
                {t("readArticle")}
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
              const catColor = CATEGORY_COLORS[post.category] ?? "var(--accent-text)";
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="focus-ring group flex flex-col overflow-hidden rounded-xl border transition hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `color-mix(in srgb, ${catColor} 15%, transparent)`, color: catColor }}>{post.category}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{t("minRead", { count: post.readingTime })}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="font-display text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{post.title}</h2>
                    <p className="mt-2 flex-1 text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>{post.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: "var(--text-subtle)" }}>
                      <span>{formatDate(post.publishedAt)} · {t("byAuthor", { name: SITE_AUTHOR.name })}</span>
                      <span className="font-medium transition group-hover:translate-x-0.5" style={{ color: "var(--accent)" }}>{t("readMore")}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("noMore")}</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <BlogPagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </>
  );
}
