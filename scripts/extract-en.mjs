/**
 * Extract English source strings for translation.
 * Run: node scripts/extract-en.mjs
 * Outputs content/en/*.json
 */
import { mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "content", "en");
mkdirSync(outDir, { recursive: true });

const write = (name, data) => {
  writeFileSync(join(outDir, name), JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, Array.isArray(data) ? data.length : Object.keys(data).length, "entries");
};

// ── Tool content from configs ─────────────────────────────────────────────
const tools = {};

const jsonContentMod = await import("../lib/json-tools-content.ts");
const jsonContent = jsonContentMod.default;
for (const [slug, c] of Object.entries(jsonContent)) {
  tools[`json:${slug}`] = { tagline: c.tagline, keywords: c.keywords, howTo: c.howTo, faqs: c.faqs };
}
// tools-config holds the display names for the same 30 JSON tools: merge into
// the json: entries so translators see one entry per tool.
const toolsConfig = await import("../lib/tools-config.ts");
for (const t of toolsConfig.tools) {
  const key = `json:${t.slug}`;
  tools[key] = { name: t.name, description: t.description, category: t.category, ...(tools[key] ?? {}) };
}

const pdfConfig = await import("../lib/pdf-tools-config.ts");
for (const t of pdfConfig.pdfTools) {
  tools[`pdf:${t.slug}`] = { name: t.name, description: t.description, inputLabel: t.inputLabel, category: t.category };
}

const videoConfig = await import("../lib/video-tools-config.ts");
for (const t of videoConfig.videoTools) {
  tools[`video:${t.slug}`] = {
    name: t.name, description: t.description, title: t.title, metaDescription: t.metaDescription,
    tagline: t.tagline, acceptLabel: t.acceptLabel, processLabel: t.processLabel,
    howTo: t.howTo, features: t.features, faqs: t.faqs,
  };
}

const audioConfig = await import("../lib/audio-tools-config.ts");
for (const t of audioConfig.audioTools) {
  tools[`audio:${t.slug}`] = { name: t.name, description: t.description, category: t.category };
}

const qrConfig = await import("../lib/qr-barcode-config.ts");
for (const t of qrConfig.qrBarcodeTools) {
  tools[`qr:${t.slug}`] = { name: t.name, description: t.description, category: t.category };
}

const finConfig = await import("../lib/finance-tools-config.ts");
for (const t of finConfig.financeTools) {
  tools[`finance:${t.slug}`] = { name: t.name, description: t.description, cluster: t.cluster, keywords: t.keywords };
}
tools["_financeClusters"] = finConfig.clusterDescriptions;

const designConfig = await import("../lib/design-tools-config.ts");
for (const t of designConfig.designTools) {
  tools[`design:${t.slug}`] = {
    name: t.name, description: t.description, title: t.title, metaDescription: t.metaDescription,
    tagline: t.tagline, keywords: t.keywords, howTo: t.howTo, features: t.features, faqs: t.faqs,
  };
}

const genConfig = await import("../lib/general-tools-config.ts");
for (const t of genConfig.generalTools) {
  tools[`general:${t.slug}`] = {
    name: t.name, description: t.description, category: t.category, hub: t.hub,
    title: t.title, metaDescription: t.metaDescription, tagline: t.tagline,
    keywords: t.keywords, howTo: t.howTo, features: t.features, faqs: t.faqs,
  };
}

const imgConfig = await import("../lib/image-tools-config.ts");
for (const t of imgConfig.imageTools ?? []) {
  tools[`imagetool:${t.slug}`] = {
    name: t.name, description: t.description, title: t.title, metaDescription: t.metaDescription,
    tagline: t.tagline, keywords: t.keywords, howTo: t.howTo, features: t.features, faqs: t.faqs,
  };
}
for (const f of imgConfig.formats) {
  tools[`format:${f.id}`] = { label: f.label, description: f.description };
}
for (const r of imgConfig.conversionRoutes) {
  let insight;
  try { insight = imgConfig.pairInsight(r.from, r.to); } catch { insight = []; }
  const rf = imgConfig.getFormat(r.from);
  const rt = imgConfig.getFormat(r.to);
  tools[`image:${r.slug}`] = {
    title: imgConfig.conversionTitle(r),
    description: rf && rt ? `Convert ${rf.label} images to ${rt.label} online for free. No upload, no sign-up - conversion runs directly in your browser and your files never leave your device.` : undefined,
    insight,
  };
}

write("tools.json", tools);

// ── Blog posts ────────────────────────────────────────────────────────────
// (import batch files directly: lib/blog.ts uses extensionless imports)
const blog = { blogPosts: [] };
for (let i = 1; i <= 11; i++) {
  const mod = await import(`../lib/blog-posts/batch${i}.ts`);
  blog.blogPosts.push(...mod[`batch${i}`]);
}
const posts = {};
for (const p of blog.blogPosts) {
  posts[p.slug] = {
    title: p.title, seoTitle: p.seoTitle, excerpt: p.excerpt, category: p.category,
    tags: p.tags, content: p.content,
  };
}
write("blog.json", posts);
console.log("blog posts:", Object.keys(posts).length);
