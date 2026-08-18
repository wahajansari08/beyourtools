import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getRecentPosts, formatDate, blogPosts, getPostsByCategory } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema, SITE, canonical } from "@/lib/seo";

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  const url = canonical(`/blog/${post.slug}`);
  const image = `${SITE.url}/og-default.png`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  JSON: "var(--teal)", Image: "var(--accent)", PDF: "var(--coral)",
};

function extractFaqs(html: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const dtRegex = /<dt>(.*?)<\/dt>\s*<dd>(.*?)<\/dd>/gs;
  let m;
  while ((m = dtRegex.exec(html)) !== null) {
    faqs.push({
      question: m[1].replace(/<[^>]+>/g, "").trim(),
      answer: m[2].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return faqs;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRecentPosts(3, post.slug);
  const sameCat = getPostsByCategory(post.category, 4, post.slug);
  const catColor = CATEGORY_COLORS[post.category] ?? "var(--teal)";
  const url = canonical(`/blog/${post.slug}`);

  const faqs = extractFaqs(post.content);

  const schemas = [
    articleSchema({
      title: post.title,
      description: post.excerpt,
      url,
      publishedAt: post.publishedAt,
      author: post.author,
      tags: post.tags,
    }),
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Blog", url: `${SITE.url}/blog` },
      { name: post.title, url },
    ]),
    ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/blog" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>Blog</Link>
          <span>/</span>
          <span className="truncate max-w-[200px]" style={{ color: "var(--text-secondary)" }}>{post.title}</span>
        </nav>

        {/* Header card */}
        <div className="mb-8 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
            <div className="flex items-center gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `color-mix(in srgb, ${catColor} 15%, transparent)`, color: catColor }}>{post.category}</span>
              <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{formatDate(post.publishedAt)}</span>
            </div>
            <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{post.readingTime} min read · {post.author}</span>
          </div>
          <div className="px-6 py-6">
            <h1 className="font-display text-2xl font-semibold leading-tight sm:text-3xl" style={{ color: "var(--text-primary)" }}>{post.title}</h1>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Article body */}
        <article className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="my-10 h-px" style={{ backgroundColor: "var(--border)" }} />

        {/* Author */}
        <div className="mb-10 flex items-center gap-4 rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }} aria-hidden="true">B</div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{post.author}</div>
            <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>We build free browser-based tools for developers. Nothing you paste here ever leaves your device.</div>
          </div>
        </div>

        {/* Same-category posts */}
        {sameCat.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>More {post.category} articles</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {sameCat.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className="focus-ring group flex gap-3 rounded-xl border p-4 transition hover:-translate-y-0.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold" style={{ color: catColor }}>{rel.category}</p>
                    <h3 className="mt-0.5 text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{rel.title}</h3>
                    <p className="mt-1 text-[11px] line-clamp-2" style={{ color: "var(--text-muted)" }}>{rel.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent posts */}
        {related.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Latest articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((rel) => {
                const relColor = CATEGORY_COLORS[rel.category] ?? "var(--teal)";
                return (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="focus-ring group overflow-hidden rounded-xl border transition hover:-translate-y-0.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                    <div className="flex items-center justify-between border-b px-3 py-2.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `color-mix(in srgb, ${relColor} 15%, transparent)`, color: relColor }}>{rel.category}</span>
                      <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>{rel.readingTime} min</span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{rel.title}</h3>
                      <span className="mt-2 block text-[11px] font-medium transition group-hover:translate-x-0.5" style={{ color: "var(--accent)" }}>Read →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
