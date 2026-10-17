/**
 * Extract English page copy for hubs + general hubs into content/en/pages.json.
 * (Policies/about/contact are converted manually to sections arrays.)
 * Run: node scripts/extract-pages-en.mjs
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(join(root, "content", "en"), { recursive: true });

const HAND_HUBS = [
  "json-tools", "image-converter", "pdf-tools", "video-tools",
  "audio-tools", "qr-barcode-tools", "finance-tools", "design-tools",
];
const GEN_HUBS = ["text-tools", "developer-tools", "calculators"];

// decode a few HTML entities used in JSX text
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&apos;/g, "'")
   .replace(/&#39;/g, "'").replace(/&ldquo;/g, "\u201c").replace(/&rdquo;/g, "\u201d")
   .replace(/&mdash;/g, "\u2014").replace(/&ndash;/g, "\u2013").replace(/\s+/g, " ").trim();

// extract {question, answer} pairs from the faqSchema([...]) block
function extractFaqs(src) {
  const m = src.match(/faqSchema\(\[([\s\S]*?)\]\)/);
  if (!m) return [];
  const block = m[1];
  const faqs = [];
  const re = /\{[\s\S]*?question:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?answer:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?\}/g;
  let mm;
  while ((mm = re.exec(block))) {
    faqs.push({ question: decode(mm[1]), answer: decode(mm[2]) });
  }
  return faqs;
}

// merge with existing pages.json (policies/about/contact added manually)
let out = {};
try {
  out = JSON.parse(readFileSync(join(root, "content", "en", "pages.json"), "utf8"));
} catch { /* first run */ }

for (const hub of HAND_HUBS) {
  const src = readFileSync(join(root, "app", "[locale]", hub, "page.tsx"), "utf8");
  const h1 = src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  // first <p> after the h1 = intro
  let intro = "";
  if (h1) {
    const after = src.slice(src.indexOf(h1[0]) + h1[0].length);
    const pm = after.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    if (pm) intro = decode(pm[1].replace(/<[^>]+>/g, ""));
  }
  out[hub] = {
    title: h1 ? decode(h1[1].replace(/<[^>]+>/g, "")) : hub,
    intro,
    faqs: extractFaqs(src),
  };
  console.log(hub, "faqs:", out[hub].faqs.length, "intro:", intro.slice(0, 50));
}

for (const hub of GEN_HUBS) {
  const src = readFileSync(join(root, "app", "[locale]", hub, "page.tsx"), "utf8");
  const hubDef = src.match(/const hub: HubDef = \{([\s\S]*?)\n\};/);
  const entry = { faqs: [] };
  if (hubDef) {
    const b = hubDef[1];
    const str = (k) => {
      const mm = b.match(new RegExp(k + ':\\s*"((?:[^"\\\\]|\\\\.)*)"'));
      return mm ? decode(mm[1]) : "";
    };
    entry.name = str("name");
    entry.tagline = str("tagline");
    entry.description = str("description");
    const re = /\{\s*question:\s*"((?:[^"\\]|\\.)*)"\s*,\s*answer:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
    let mm;
    while ((mm = re.exec(b))) entry.faqs.push({ question: decode(mm[1]), answer: decode(mm[2]) });
  }
  out[hub] = entry;
  console.log(hub, "faqs:", entry.faqs.length);
}

writeFileSync(join(root, "content", "en", "pages.json"), JSON.stringify(out, null, 2) + "\n");
console.log("wrote pages.json with", Object.keys(out).length, "pages");
