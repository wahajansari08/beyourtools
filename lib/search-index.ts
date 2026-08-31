/**
 * Unified search index for all tools across JSON, Image Converter, PDF, Video, and Finance sections.
 * Used by the full-page search overlay.
 */

import { tools } from "./tools-config";
import { pdfTools } from "./pdf-tools-config";
import { conversionRoutes, getFormat } from "./image-tools-config";
import { videoTools } from "./video-tools-config";
import { financeTools } from "./finance-tools-config";

export interface SearchResult {
  slug: string;
  name: string;
  description: string;
  href: string;
  category: string;
  section: "json" | "image" | "pdf" | "video" | "finance";
  icon: string;
  keywords: string[];
}

function buildIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  // ── JSON tools ─────────────────────────────────────────────────────────────
  for (const t of tools) {
    index.push({
      slug: t.slug,
      name: t.name,
      description: t.description,
      href: `/${t.slug}`,
      category: t.category,
      section: "json",
      icon: "{ }",
      keywords: [t.name, t.short, t.description, t.category, t.slug]
        .join(" ")
        .toLowerCase()
        .split(/\s+/),
    });
  }

  // ── PDF tools ──────────────────────────────────────────────────────────────
  for (const t of pdfTools) {
    index.push({
      slug: t.slug,
      name: t.name,
      description: t.description,
      href: `/pdf-tools/${t.slug}`,
      category: `PDF · ${t.category}`,
      section: "pdf",
      icon: t.icon,
      keywords: [t.name, t.description, t.category, t.slug]
        .join(" ")
        .toLowerCase()
        .split(/\s+/),
    });
  }

  // ── Image conversions ──────────────────────────────────────────────────────
  for (const r of conversionRoutes) {
    const from = getFormat(r.from)!;
    const to   = getFormat(r.to)!;
    const name = `${from.label} to ${to.label}`;
    index.push({
      slug: r.slug,
      name,
      description: `Convert ${from.label} images to ${to.label} format in your browser.`,
      href: `/image-converter/${r.slug}`,
      category: `Image · ${from.label}`,
      section: "image",
      icon: "🖼",
      keywords: [
        name, from.label, to.label, r.slug,
        "convert", "image", "converter",
        ...from.extensions, ...to.extensions,
      ]
        .join(" ")
        .toLowerCase()
        .split(/\s+/),
    });
  }

  // Video tools
  for (const t of videoTools) {
    index.push({
      slug: t.slug,
      name: t.name,
      description: t.description,
      href: `/${t.slug}`,
      category: `Video · ${t.category}`,
      section: "video",
      icon: t.icon,
      keywords: [t.name, t.description, t.category, t.slug, ...t.formats, "video", "tools"]
        .join(" ")
        .toLowerCase()
        .split(/\s+/),
    });
  }

  // ── Finance tools ──────────────────────────────────────────────────────────
  for (const t of financeTools) {
    index.push({
      slug: t.slug,
      name: t.name,
      description: t.description,
      href: `/${t.slug}`,
      category: `Finance · ${t.cluster}`,
      section: "finance",
      icon: t.icon,
      keywords: [t.name, t.description, t.cluster, t.slug, ...t.keywords, "finance", "calculator"]
        .join(" ")
        .toLowerCase()
        .split(/\s+/),
    });
  }

  return index;
}

export const searchIndex = buildIndex();

/** Score a result against a query string. Returns 0 if no match. */
export function scoreResult(result: SearchResult, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const terms = q.split(/\s+/);
  let score = 0;

  for (const term of terms) {
    const nameLower = result.name.toLowerCase();
    const descLower = result.description.toLowerCase();

    if (nameLower === term)                  score += 100; // exact name match
    else if (nameLower.startsWith(term))     score += 60;  // name prefix
    else if (nameLower.includes(term))       score += 40;  // name contains
    else if (descLower.includes(term))       score += 20;  // description
    else if (result.category.toLowerCase().includes(term)) score += 10;
    else if (result.keywords.some((k) => k.startsWith(term))) score += 5;
    else if (result.slug.includes(term))     score += 5;
    else return 0; // all terms must match something
  }

  return score;
}

export function search(query: string, limit = 20): SearchResult[] {
  if (!query.trim()) return [];
  return searchIndex
    .map((r) => ({ result: r, score: scoreResult(r, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ result }) => result);
}
