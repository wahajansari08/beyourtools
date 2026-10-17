/**
 * Extract English title/description for non-tool pages (hubs, policies, home,
 * blog index, about, contact) into content/en/meta.json.
 * Tool pages are NOT included: localizeMetadata falls back to the translated
 * tools.json entries for those, so translators don't duplicate ~300 entries.
 * Run: node scripts/extract-meta-en.mjs
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(join(root, "content", "en"), { recursive: true });

// slug -> page file (relative to app/[locale])
const PAGES = {
  "home": "page.tsx",
  "blog": "blog/page.tsx",
  "about": "about/page.tsx",
  "contact": "contact/page.tsx",
  "privacy-policy": "privacy-policy/page.tsx",
  "terms": "terms/page.tsx",
  "cookie-policy": "cookie-policy/page.tsx",
  "disclaimer": "disclaimer/page.tsx",
  "json-tools": "json-tools/page.tsx",
  "image-converter": "image-converter/page.tsx",
  "pdf-tools": "pdf-tools/page.tsx",
  "video-tools": "video-tools/page.tsx",
  "audio-tools": "audio-tools/page.tsx",
  "qr-barcode-tools": "qr-barcode-tools/page.tsx",
  "finance-tools": "finance-tools/page.tsx",
  "design-tools": "design-tools/page.tsx",
  "text-tools": "text-tools/page.tsx",
  "developer-tools": "developer-tools/page.tsx",
  "calculators": "calculators/page.tsx",
};

const out = {};
for (const [slug, rel] of Object.entries(PAGES)) {
  const file = join(root, "app", "[locale]", rel);
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    console.warn("missing file for", slug);
    continue;
  }
  // title: prefer a plain string literal
  const titleMatch = src.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
  // description: literal, or `X ?? "literal"` fallback
  let desc = null;
  const descLit = src.match(/description:\s*"((?:[^"\\]|\\.)*)"/);
  if (descLit) {
    desc = descLit[1];
  } else {
    const descFb = src.match(/description:\s*[^,]*\?\?\s*"((?:[^"\\]|\\.)*)"/);
    if (descFb) desc = descFb[1];
  }
  if (!titleMatch) {
    console.warn("no literal title for", slug);
    continue;
  }
  out[slug] = { title: titleMatch[1] };
  if (desc) out[slug].description = desc;
}

writeFileSync(join(root, "content", "en", "meta.json"), JSON.stringify(out, null, 2) + "\n");
console.log("wrote meta.json with", Object.keys(out).length, "entries");
