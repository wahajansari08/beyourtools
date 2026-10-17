/**
 * Locale-aware content lookup for the multilingual site.
 *
 * Design: English content stays hardcoded in pages/configs (the English URLs
 * are byte-identical to before). Translated strings live in
 * content/<locale>/*.json. Server shells (ToolLayout, category templates,
 * etc.) call these helpers with the request locale and override the English
 * props when a translation exists. Missing keys fall back to English, so a
 * partially-translated locale never renders blank content.
 */
import { getLocale } from "next-intl/server";
import { isLocale, type Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { SITE } from "./seo";

const cache = new Map<string, unknown>();

async function loadJson<T>(locale: string, file: string): Promise<T | undefined> {
  const key = `${locale}/${file}`;
  if (cache.has(key)) return cache.get(key) as T | undefined;
  try {
    const mod = await import(`../content/${locale}/${file}`);
    const data = (mod.default ?? mod) as T;
    cache.set(key, data);
    return data;
  } catch {
    cache.set(key, undefined);
    return undefined;
  }
}

/** Best-effort request locale; falls back to "en" outside a request scope. */
export async function contentLocale(): Promise<Locale> {
  try {
    const l = await getLocale();
    return isLocale(l) ? l : "en";
  } catch {
    return "en";
  }
}

export type ToolContentEntry = {
  name?: string;
  title?: string;
  description?: string;
  metaDescription?: string;
  tagline?: string;
  keywords?: string | string[];
  inputLabel?: string;
  acceptLabel?: string;
  processLabel?: string;
  howTo?: { title: string; text: string }[] | { name: string; description: string; steps: { name: string; text: string }[] };
  features?: { title: string; desc: string }[] | string[];
  faqs?: { question: string; answer: string }[];
  insight?: string[];
  category?: string;
  cluster?: string;
};

/** Look up translated tool content by key (e.g. "json:json-formatter"). */
export async function getTranslatedToolContent(
  locale: string,
  key: string
): Promise<ToolContentEntry | undefined> {
  if (locale === "en") return undefined;
  const all = await loadJson<Record<string, ToolContentEntry>>(locale, "tools.json");
  return all?.[key];
}

const TOOL_PREFIXES = ["json", "pdf", "video", "audio", "qr", "finance", "design", "imagetool", "image", "general", "format", "tool"];

/** Prefix-agnostic tool lookup: tries every known prefix for a bare slug. */
export async function getTranslatedToolContentAny(
  locale: string,
  slug: string
): Promise<ToolContentEntry | undefined> {
  if (locale === "en") return undefined;
  const all = await loadJson<Record<string, ToolContentEntry>>(locale, "tools.json");
  if (!all) return undefined;
  for (const prefix of TOOL_PREFIXES) {
    const entry = all[`${prefix}:${slug}`];
    if (entry) return entry;
  }
  return undefined;
}

/** Translated blog post (full), or undefined when untranslated. */
export async function getTranslatedBlogPost(
  locale: string,
  slug: string
): Promise<
  | { title: string; seoTitle?: string; excerpt: string; category: string; tags: string[]; content: string }
  | undefined
> {
  if (locale === "en") return undefined;
  const all = await loadJson<Record<string, { title: string; seoTitle?: string; excerpt: string; category: string; tags: string[]; content: string }>>(
    locale,
    "blog.json"
  );
  return all?.[slug];
}

/** Translated static-page copy (about/contact/policy/category hubs). */
export async function getTranslatedPageCopy(
  locale: string,
  page: string
): Promise<Record<string, unknown> | undefined> {
  if (locale === "en") return undefined;
  const all = await loadJson<Record<string, Record<string, unknown>>>(locale, "pages.json");
  return all?.[page];
}

export type MetaEntry = { title?: string; description?: string; keywords?: string };

/**
 * Build locale-aware metadata from a page's English metadata object:
 * translated title/description/keywords when available, locale-correct
 * canonical + Open Graph URL. Falls back to the English metadata untouched.
 */
import { locales as allLocales } from "@/i18n/routing";

/** hreflang alternates for a locale + path (x-default -> English). */
export function hreflangAlternates(locale: string, path: string): Record<string, string> {
  const languages: Record<string, string> = { "x-default": localeCanonical("en", path) };
  for (const l of allLocales) languages[l] = localeCanonical(l, path);
  return languages;
}

export async function localizeMetadata(
  locale: string,
  slug: string,
  enMetadata: Metadata
): Promise<Metadata> {
  const path = slug === "home" ? "/" : `/${slug}`;
  const canonical = localeCanonical(locale, path);

  const out: Metadata = { ...enMetadata };
  // Every page owns its absolute self-referencing canonical + hreflang
  // alternates (computed statically from the slug, no headers() needed,
  // so pages stay statically prerenderable).
  (out as { alternates?: unknown }).alternates = {
    canonical,
    languages: hreflangAlternates(locale, path),
  };
  if (out.openGraph && typeof out.openGraph === "object") {
    out.openGraph = { ...out.openGraph, url: canonical };
  }
  if (locale === "en") return out;

  // 1) Explicit per-page overrides (hubs, policies, home, blog index, …)
  const all = await loadJson<Record<string, MetaEntry>>(locale, "meta.json");
  const metaEntry = all?.[slug];
  let title = metaEntry?.title;
  let description = metaEntry?.description;
  let keywords = metaEntry?.keywords;

  // 2) Tool pages: fall back to the translated tool entry in tools.json so
  //    translators don't have to duplicate all ~300 tool titles/descriptions
  //    in meta.json.
  if (!title && !description) {
    const tc = await getTranslatedToolContentAny(locale, slug);
    if (tc) {
      title = tc.title ?? (tc.name ? `${tc.name} | BeYourTools` : undefined);
      const tcd = tc as { metaDescription?: string; tagline?: string };
      description = tcd.metaDescription ?? tc.description ?? tcd.tagline;
      if (tc.keywords) keywords = Array.isArray(tc.keywords) ? tc.keywords.join(", ") : tc.keywords;
    }
  }
  if (!title && !description) return out;

  const apply = (t?: string, d?: string) => {
    if (t) {
      out.title = t;
      if (out.openGraph && typeof out.openGraph === "object") {
        out.openGraph = { ...out.openGraph, title: t, url: canonical };
      }
      if (out.twitter && typeof out.twitter === "object") {
        out.twitter = { ...out.twitter, title: t };
      }
    }
    if (d) {
      out.description = d;
      if (out.openGraph && typeof out.openGraph === "object") {
        out.openGraph = { ...out.openGraph, description: d };
      }
      if (out.twitter && typeof out.twitter === "object") {
        out.twitter = { ...out.twitter, description: d };
      }
    }
  };
  apply(title, description);
  if (keywords) out.keywords = keywords;
  return out;
}

export type HubCopy = {
  title: string;
  intro: string;
  faqs: { question: string; answer: string }[];
};

/**
 * Hub page copy: English source from content/en/pages.json, overridden by
 * content/<locale>/pages.json when translated. Never blank.
 */
export async function getHubCopy(locale: string, slug: string): Promise<HubCopy> {
  const enPages = await loadJson<Record<string, Record<string, unknown>>>("en", "pages.json");
  const en = enPages?.[slug] ?? {};
  const tp = locale === "en" ? undefined : await getTranslatedPageCopy(locale, slug);
  return {
    title: (tp?.title as string | undefined) ?? (en.title as string | undefined) ?? "",
    intro: (tp?.intro as string | undefined) ?? (en.intro as string | undefined) ?? "",
    faqs: (tp?.faqs as HubCopy["faqs"] | undefined) ?? (en.faqs as HubCopy["faqs"] | undefined) ?? [],
  };
}

/**
 * Merge a hardcoded English object with its translated page copy.
 * Used for hub defs, policy sections, etc.
 */
export async function withPageCopy<T extends object>(
  locale: string,
  page: string,
  en: T
): Promise<T> {
  if (locale === "en") return en;
  const tp = await getTranslatedPageCopy(locale, page);
  if (!tp) return en;
  const out = { ...en } as Record<string, unknown>;
  for (const key of Object.keys(en)) {
    if (tp[key] !== undefined) out[key] = tp[key];
  }
  return out as T;
}

export type ResolvedToolCopy = {
  name?: string;
  title?: string;
  description?: string;
  tagline?: string;
  howTo: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  features: string[];
};

/**
 * Tool copy with English fallback: merges content/en/tools.json with the
 * translated entry so translated pages never render blank sections.
 */
export async function getToolCopy(locale: string, slug: string): Promise<ResolvedToolCopy> {
  const enAll = await loadJson<Record<string, ToolContentEntry>>("en", "tools.json");
  let en: ToolContentEntry | undefined;
  if (enAll) {
    for (const prefix of TOOL_PREFIXES) {
      if (enAll[`${prefix}:${slug}`]) { en = enAll[`${prefix}:${slug}`]; break; }
    }
  }
  const tc = await getTranslatedToolContentAny(locale, slug);
  const pick = <K extends keyof ToolContentEntry>(k: K): ToolContentEntry[K] | undefined =>
    (tc?.[k] as ToolContentEntry[K] | undefined) ?? (en?.[k] as ToolContentEntry[K] | undefined);
  const asPairs = (v: unknown): { title: string; text: string }[] =>
    Array.isArray(v) ? (v as { title: string; text: string }[]) : [];
  const asFaqs = (v: unknown): { question: string; answer: string }[] =>
    Array.isArray(v) ? (v as { question: string; answer: string }[]) : [];
  const asStrs = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
  return {
    name: (pick("name") as string | undefined) ?? (pick("title") as string | undefined),
    title: pick("title") as string | undefined,
    description: (pick("description") as string | undefined) ?? (pick("tagline") as string | undefined),
    tagline: (pick("tagline") as string | undefined) ?? (pick("description") as string | undefined),
    howTo: asPairs(pick("howTo")),
    faqs: asFaqs(pick("faqs")),
    features: asStrs(pick("features")),
  };
}

/** Absolute canonical URL for a locale + path (used by templates). */
export function localeCanonical(locale: string, path: string): string {
  const clean = path === "/" ? "/" : path;
  return locale === "en" ? `${SITE.url}${clean}` : `${SITE.url}/${locale}${clean}`;
}
