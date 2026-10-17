/**
 * Extract per-page English content (tagline, description, howTo, faqs, features)
 * from hand-written tool pages (audio, finance, QR) into content/en/tools.json.
 * These pages pass content as JSX props; the shells will be wired to prefer
 * translated entries from content/<locale>/tools.json.
 * Run: node scripts/extract-page-props.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "app", "[locale]");

const toolsPath = join(root, "content", "en", "tools.json");
const tools = JSON.parse(readFileSync(toolsPath, "utf8"));

// prefix -> shell component marker (null = hand-written page, match by faqSchema)
const SHELLS = {
  audio: "AudioToolPage",
  finance: "FinanceToolPage",
  qr: null,
};

const decode = (s) =>
  s.replace(/\\"/g, '"').replace(/&quot;/g, '"').replace(/&amp;/g, "&")
   .replace(/&apos;/g, "'").replace(/&#39;/g, "'").replace(/&ldquo;/g, "\u201c")
   .replace(/&rdquo;/g, "\u201d").replace(/&mdash;/g, "\u2014").replace(/&ndash;/g, "\u2013");

// match a JS string literal (double-quoted, may contain escaped quotes)
const STR = '"((?:[^"\\\\]|\\\\.)*)"';

function extractPairArray(src, prop, k1, k2) {
  // prop={[...]} or fn([...])
  let m = src.match(new RegExp(prop + "=\\{\\[([\\s\\S]*?)\\]\\}"));
  if (!m) m = src.match(new RegExp(prop + "\\(\\[([\\s\\S]*?)\\]\\)"));
  if (!m) return undefined;
  const block = m[1] ?? m[2];
  const items = [];
  const re = new RegExp(
    "\\{[\\s\\S]*?" + k1 + ":\\s*" + STR + "[\\s\\S]*?" + k2 + ":\\s*" + STR + "[\\s\\S]*?\\}",
    "g"
  );
  let mm;
  while ((mm = re.exec(block))) {
    items.push({ [k1]: decode(mm[1]), [k2]: decode(mm[2]) });
  }
  return items.length ? items : undefined;
}

function extractStrArray(src, prop) {
  const m = src.match(new RegExp(prop + "=\\{\\[([\\s\\S]*?)\\]\\}"));
  if (!m) return undefined;
  const items = [];
  const re = new RegExp(STR, "g");
  let mm;
  while ((mm = re.exec(m[1]))) items.push(decode(mm[1]));
  return items.length ? items : undefined;
}

function extractProp(src, prop) {
  // tagline="..." or tagline={"..."}
  let m = src.match(new RegExp(prop + '="' + "((?:[^\"\\\\]|\\\\.)*)" + '"'));
  if (m) return decode(m[1]);
  m = src.match(new RegExp(prop + "=\\{" + STR + "\\}"));
  if (m) return decode(m[1]);
  return undefined;
}

// slugs that belong to the QR tools (for the hand-written null-marker pass)
const QR_SLUGS = new Set(
  Object.keys(tools).filter((k) => k.startsWith("qr:")).map((k) => k.slice(3))
);

let updated = 0;
for (const [prefix, marker] of Object.entries(SHELLS)) {
  const dirs = readdirSync(appDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const dir of dirs) {
    const pageFile = join(appDir, dir, "page.tsx");
    let src;
    try {
      src = readFileSync(pageFile, "utf8");
    } catch { continue; }
    if (marker && !src.includes(`<${marker}`)) continue;
    if (!marker && !src.includes("faqSchema(")) continue;
    if (!marker && prefix === "qr" && !QR_SLUGS.has(dir)) continue;
    const slugMatch = src.match(/slug="([^"]+)"/);
    // hand-written pages: slug = directory name
    const slug = slugMatch ? slugMatch[1] : dir;
    const key = `${prefix}:${slug}`;
    if (!tools[key]) {
      console.warn("no tools.json entry for", key);
      continue;
    }
    const entry = tools[key];
    const tagline = extractProp(src, "tagline");
    const description = extractProp(src, "description");
    let howTo = extractPairArray(src, "howTo", "title", "text");
    let faqs = extractPairArray(src, "faqs", "question", "answer");
    const features = extractStrArray(src, "features");
    if (!marker) {
      // hand-written page: faqs live in faqSchema([...]) or const FAQS=[...]
      if (!faqs) faqs = extractPairArray(src, "faqSchema", "question", "answer");
      if (!faqs) {
        const fm = src.match(/const FAQS = \[([\s\S]*?)\];/);
        if (fm) {
          const items = [];
          const re = new RegExp("\\{[\\s\\S]*?question:\\s*" + STR + "[\\s\\S]*?answer:\\s*" + STR + "[\\s\\S]*?\\}", "g");
          let mm;
          while ((mm = re.exec(fm[1]))) items.push({ question: decode(mm[1]), answer: decode(mm[2]) });
          if (items.length) faqs = items;
        }
      }
      if (!howTo) {
        const hm = src.match(/steps:\s*\[([\s\S]*?)\]/);
        if (hm) {
          const items = [];
          const re = new RegExp("\\{[\\s\\S]*?name:\\s*" + STR + "[\\s\\S]*?text:\\s*" + STR + "[\\s\\S]*?\\}", "g");
          let mm;
          while ((mm = re.exec(hm[1]))) items.push({ title: decode(mm[1]), text: decode(mm[2]) });
          if (items.length) howTo = items.map(({ title, text }) => ({ title, text }));
        }
      }
    }
    let changed = false;
    if (tagline && !entry.tagline) { entry.tagline = tagline; changed = true; }
    if (description && !entry.description) { entry.description = description; changed = true; }
    if (howTo && !entry.howTo) { entry.howTo = howTo; changed = true; }
    if (faqs && !entry.faqs) { entry.faqs = faqs; changed = true; }
    if (features && !entry.features) { entry.features = features; changed = true; }
    if (changed) updated++;
  }
}

writeFileSync(toolsPath, JSON.stringify(tools, null, 2) + "\n");
console.log("updated", updated, "entries");
