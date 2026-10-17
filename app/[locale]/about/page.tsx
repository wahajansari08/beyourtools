import { localizeMetadata, contentLocale, withPageCopy } from "@/lib/i18n-content";
import pagesEn from "@/content/en/pages.json";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema, organizationSchema } from "@/lib/seo";

const __enMetadata: Metadata = {
  title: "About BeYourTools - Free Browser-Based Online Tools",
  description: "Learn about BeYourTools: our mission, client-side technology, and 320+ free browser tools for JSON, images, PDFs, audio, video, and finance.",
  alternates: { canonical: `${SITE.url}/about` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/about`,
    title: "About BeYourTools - Free Browser-Based Online Tools",
    description: "Our mission: free, private, browser-based tools for everyone. No sign-up, no uploads, no paywalls.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "About BeYourTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BeYourTools",
    description: "Free, private, browser-based tools - no sign-up, no uploads.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

type CategoryCard = {
  label: string;
  href: string;
  count: string;
  desc: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  wide: boolean;
};

type AboutCopy = {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  intro: string;
  who: { heading: string; name: string; bio: string };
  why: { heading: string; html: string };
  what: { heading: string; introHtml: string; categories: CategoryCard[] };
  tech: { heading: string; html: string };
  principles: { heading: string; items: { icon: string; title: string; body: string }[] };
  advertising: { heading: string; html: string };
  engineering: { heading: string; html: string };
  editorial: { heading: string; intro: string; items: { title: string; body: string }[] };
  contactSection: { heading: string; html: string };
};

const EN_COPY = (pagesEn as unknown as Record<string, AboutCopy>)["about"];

export default async function AboutPage() {
  const locale = await contentLocale();
  const copy = await withPageCopy(locale, "about", EN_COPY);
  const schemas = [
    organizationSchema(),
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: copy.title, url: `${SITE.url}/about` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{copy.breadcrumb}</span>
        </nav>

        <header className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-text)" }}>
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {copy.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-muted)" }}>
            {copy.intro}
          </p>
        </header>

        <div className="policy-content space-y-10">

          <section>
            <h2>{copy.who.heading}</h2>
            <div className="flex items-start gap-4 rounded-xl border p-5 not-prose" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }} aria-hidden="true">B</div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{copy.who.name}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {copy.who.bio}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>{copy.why.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: copy.why.html }} />
          </section>

          <section>
            <h2>{copy.what.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: copy.what.introHtml }} />
            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              {copy.what.categories.map((cat) => (
                <div key={cat.label} className={`rounded-xl border p-5 transition hover-card${cat.wide ? " sm:col-span-2" : ""}`} style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}>
                      {cat.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                        <Link href={cat.href} className="hover:underline">{cat.label}</Link>
                      </h3>
                      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{cat.count}</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>{copy.tech.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: copy.tech.html }} />
          </section>

          <section>
            <h2>{copy.principles.heading}</h2>
            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              {copy.principles.items.map(({ icon, title, body }) => (
                <div key={title} className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">{icon}</span>
                    <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{title}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>{copy.advertising.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: copy.advertising.html }} />
          </section>

          <section>
            <h2>{copy.engineering.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: copy.engineering.html }} />
          </section>

          <section>
            <h2>{copy.editorial.heading}</h2>
            <p>{copy.editorial.intro}</p>
            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              {copy.editorial.items.map(({ title, body }) => (
                <div key={title} className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>{copy.contactSection.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: copy.contactSection.html }} />
          </section>

        </div>
      </div>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "about", __enMetadata);
}
