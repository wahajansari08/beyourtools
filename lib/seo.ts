/**
 * SEO utility library for BeYourTools.
 * Provides metadata factories, structured data builders, and canonical URL helpers.
 */

export const SITE = {
  name:        "BeYourTools",
  url:         "https://beyourtools.com",
  description: "Free online tools for developers - JSON utilities, image converters, PDF tools and more. All run privately in your browser.",
  twitter:     "@beyourtools",
  locale:      "en_US",
  logo:        "https://beyourtools.com/icon-512.png",
};

// ─── Canonical URL helper ────────────────────────────────────────────────────

export function canonical(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

// ─── Base metadata factory ───────────────────────────────────────────────────

export interface PageSEO {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  keywords?: string[];
}

export function buildMetadata(opts: PageSEO) {
  const url = canonical(opts.path);
  const image = opts.image ?? `${SITE.url}/og-default.png`;

  return {
    metadataBase: new URL(SITE.url),
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords?.join(", "),
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type:        "website" as const,
      url,
      title:       opts.title,
      description: opts.description,
      siteName:    SITE.name,
      locale:      SITE.locale,
      images:      [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card:        "summary_large_image" as const,
      title:       opts.title,
      description: opts.description,
      site:        SITE.twitter,
      images:      [image],
    },
  };
}

export function buildArticleMetadata(opts: PageSEO & { publishedAt: string; author: string }) {
  const base = buildMetadata(opts);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type:            "article" as const,
      publishedTime:   opts.publishedAt,
      authors:         [opts.author],
    },
  };
}

// ─── JSON-LD structured data builders ───────────────────────────────────────

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: SITE.logo,
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: SITE.logo,
    },
    sameAs: [],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  author: string;
  image?: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${opts.url}#article`,
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.publishedAt,
    dateModified: opts.publishedAt,
    author: {
      "@type": "Organization",
      name: opts.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      logo: { "@type": "ImageObject", url: SITE.logo },
    },
    image: opts.image ?? `${SITE.url}/og-default.png`,
    keywords: opts.tags?.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    inLanguage: "en",
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    totalTime: opts.totalTime,
    step: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function softwareApplicationSchema(opts: {
  name: string;
  description: string;
  url: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: opts.category,
    operatingSystem: "Any (browser-based)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
    },
  };
}

export function siteNavigationSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SiteLinksSearchBox",
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Tool metadata factory ────────────────────────────────────────────────────

export interface ToolMetadataOpts {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  category?: string;
}

/**
 * Creates complete Next.js Metadata for any tool page.
 * Includes title, description, canonical, OG, Twitter, robots.
 */
export function createToolMetadata(opts: ToolMetadataOpts) {
  const url   = canonical(opts.path);
  const image = `${SITE.url}/og-default.png`;
  return {
    metadataBase: new URL(SITE.url),
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords?.join(", "),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type:        "website" as const,
      url,
      title:       opts.title,
      description: opts.description,
      siteName:    SITE.name,
      locale:      SITE.locale,
      images:      [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card:        "summary_large_image" as const,
      title:       opts.title,
      description: opts.description,
      site:        SITE.twitter,
      images:      [image],
    },
  };
}

/**
 * WebApplication schema for tool pages.
 * Lighter than SoftwareApplication -no fake ratings.
 */
export function webAppSchema(opts: {
  name: string;
  description: string;
  url: string;
  keywords?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
    },
    ...(opts.keywords ? { keywords: opts.keywords } : {}),
  };
}
