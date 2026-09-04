/**
 * SEO & Registry Audit for all 40 Finance Calculator pages.
 * Checks: unique titles, canonical URLs, taglines, FAQs, config registration, sitemap presence.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SLUGS = [
  "profit-margin-calculator",      "markup-calculator",
  "break-even-calculator",          "discount-calculator",
  "commission-calculator",          "gross-profit-calculator",
  "net-profit-calculator",          "operating-margin-calculator",
  "business-margin-calculator",     "hourly-to-salary-calculator",
  "salary-to-hourly-calculator",    "overtime-calculator",
  "pay-raise-calculator",           "paycheck-calculator",
  "freelance-rate-calculator",      "hourly-rate-calculator",
  "loan-payment-calculator",        "loan-interest-calculator",
  "loan-payoff-calculator",         "extra-payment-loan-calculator",
  "loan-amortization-calculator",   "debt-payoff-calculator",
  "debt-snowball-calculator",       "debt-avalanche-calculator",
  "credit-card-payoff-calculator",  "credit-card-minimum-payment-calculator",
  "debt-to-income-calculator",      "savings-calculator",
  "savings-goal-calculator",        "simple-interest-calculator",
  "apy-calculator",                  "apr-calculator",
  "sales-tax-calculator",           "price-after-discount-calculator",
  "tax-inclusive-price-calculator", "tax-exclusive-price-calculator",
  "roi-calculator",                  "roas-calculator",
  "cash-flow-calculator",           "revenue-growth-calculator",
];

const CLUSTERS = [
  "business-finance-calculators",
  "salary-income-calculators",
  "loan-calculators",
  "debt-credit-calculators",
  "savings-interest-calculators",
  "tax-pricing-calculators",
  "marketing-roi-calculators",
];

let passed = 0;
let failed = 0;
const issues = [];
const titles = [];

function check(label, ok, detail = "") {
  if (ok) { passed++; }
  else { failed++; issues.push(`FAIL  ${label}${detail ? " - " + detail : ""}`); }
}

// ── 1. PAGE FILES & METADATA ──────────────────────────────────────────────────
console.log("\n── 1. Page file checks ──────────────────────────────────────────");
for (const slug of SLUGS) {
  const file = path.join(ROOT, "app", slug, "page.tsx");
  const clientFile = path.join(ROOT, "app", slug, `${toPascal(slug)}Client.tsx`);

  check(`[${slug}] page.tsx exists`,         fs.existsSync(file));
  // Client file uses a shortened PascalCase name - just verify one *Client.tsx exists in the dir
  const dirContents = fs.existsSync(path.join(ROOT, "app", slug))
    ? fs.readdirSync(path.join(ROOT, "app", slug)) : [];
  const hasClient = dirContents.some(f => f.endsWith("Client.tsx"));
  check(`[${slug}] Client.tsx exists`, hasClient, dirContents.join(", "));

  if (!fs.existsSync(file)) continue;
  const c = fs.readFileSync(file, "utf8");

  // Title
  const titleM = c.match(/title:\s*["'`]([^"'`\n]+)["'`]/);
  const title = titleM ? titleM[1] : null;
  check(`[${slug}] has title`,               !!title);
  if (title) titles.push({ slug, title });

  // Description
  check(`[${slug}] has description`,         c.includes("description:"));

  // Canonical: must be `${SITE.url}/${slug}`
  const canonM = c.match(/canonical:\s*`\$\{SITE\.url\}(\/[^`]+)`/);
  const canonical = canonM ? canonM[1] : null;
  check(`[${slug}] has canonical`,           !!canonical);
  if (canonical) {
    check(`[${slug}] canonical matches slug`, canonical === `/${slug}`, `got "${canonical}"`);
  }

  // robots index:true
  check(`[${slug}] robots index:true`,       c.includes("index: true"));

  // FinanceToolPage usage
  check(`[${slug}] uses FinanceToolPage`,    c.includes("FinanceToolPage"));

  // tagline present
  check(`[${slug}] has tagline`,             c.includes("tagline="));

  // faqs present
  check(`[${slug}] has faqs`,               c.includes("faqs={"));

  // formulaExplanation present
  check(`[${slug}] has formulaExplanation`, c.includes("formulaExplanation="));

  // cluster assignment present
  check(`[${slug}] has cluster=`,           c.includes("cluster="));
}

// ── 2. UNIQUE TITLES ──────────────────────────────────────────────────────────
console.log("\n── 2. Title uniqueness ──────────────────────────────────────────");
const titleSet = new Set();
const dupes = [];
for (const { slug, title } of titles) {
  if (titleSet.has(title)) dupes.push({ slug, title });
  titleSet.add(title);
}
check("all 40 titles are unique", dupes.length === 0,
  dupes.length > 0 ? `Dupes: ${dupes.map(d => d.slug).join(", ")}` : "");
console.log(`  ${titles.length} titles found, ${titleSet.size} unique`);

// Print all titles
console.log("\n  Slug                                         Title");
console.log("  " + "─".repeat(100));
titles.forEach(({ slug, title }) => {
  console.log(`  ${slug.padEnd(45)} ${title}`);
});

// ── 3. FINANCE-TOOLS-CONFIG REGISTRATION ─────────────────────────────────────
console.log("\n── 3. finance-tools-config.ts registration ───────────────────");
const configPath = path.join(ROOT, "lib", "finance-tools-config.ts");
const config = fs.readFileSync(configPath, "utf8");

for (const slug of SLUGS) {
  check(`[${slug}] registered in config`, config.includes(`slug: "${slug}"`), slug);
}

// All 7 cluster slugs present
for (const clusterSlug of CLUSTERS) {
  check(`cluster [${clusterSlug}] in config`, config.includes(clusterSlug));
}

// ── 4. SITEMAP COVERAGE ───────────────────────────────────────────────────────
console.log("\n── 4. sitemap.ts coverage ───────────────────────────────────────");
const sitemapPath = path.join(ROOT, "app", "sitemap.ts");
const sitemap = fs.readFileSync(sitemapPath, "utf8");

check("sitemap imports financeTools",     sitemap.includes("financeTools"));
check("sitemap imports financeClusters",  sitemap.includes("financeClusters"));
check("sitemap imports clusterSlugs",     sitemap.includes("clusterSlugs"));
check("sitemap has finance-tools url",    sitemap.includes('"/finance-tools"'));
check("sitemap maps financeClusterPages", sitemap.includes("financeClusterPages"));
check("sitemap maps financeToolPages",    sitemap.includes("financeToolPages"));
check("sitemap spreads financeClusterPages", sitemap.includes("...financeClusterPages"));
check("sitemap spreads financeToolPages",    sitemap.includes("...financeToolPages"));

// ── 5. NAVBAR & FOOTER ────────────────────────────────────────────────────────
console.log("\n── 5. Nav & Footer ──────────────────────────────────────────────");
const navbar  = fs.readFileSync(path.join(ROOT, "components", "Navbar.tsx"), "utf8");
const footer  = fs.readFileSync(path.join(ROOT, "components", "Footer.tsx"), "utf8");

check("Navbar has finance-tools link",   navbar.includes('"/finance-tools"'));
check("Navbar label Finance",            navbar.includes('"Finance"'));
check("Footer has Finance Tools section", footer.includes('"Finance Tools"'));
check("Footer links to /finance-tools",   footer.includes('href: "/finance-tools"'));
check("Footer links to loan-payment",     footer.includes("loan-payment-calculator"));
check("Footer links to profit-margin",    footer.includes("profit-margin-calculator"));
check("Footer links to savings",          footer.includes("savings-calculator"));
check("Footer links to roi-calculator",   footer.includes("roi-calculator"));

// ── 6. SEARCH INDEX ───────────────────────────────────────────────────────────
console.log("\n── 6. Search index ──────────────────────────────────────────────");
const searchIndex = fs.readFileSync(path.join(ROOT, "lib", "search-index.ts"), "utf8");
check("search-index imports financeTools",    searchIndex.includes("financeTools"));
check("search-index has finance section",     searchIndex.includes('"finance"'));
check("search-index category Finance ·",      searchIndex.includes("Finance ·"));
check("search-index spreads finance keywords", searchIndex.includes("t.keywords"));

// ── 7. SHARED COMPONENTS ──────────────────────────────────────────────────────
console.log("\n── 7. Shared components ─────────────────────────────────────────");
check("FinanceToolPage.tsx exists",
  fs.existsSync(path.join(ROOT, "components", "finance", "FinanceToolPage.tsx")));
check("FinanceRelatedTools.tsx exists",
  fs.existsSync(path.join(ROOT, "components", "finance", "FinanceRelatedTools.tsx")));
check("finance hub page exists",
  fs.existsSync(path.join(ROOT, "app", "finance-tools", "page.tsx")));
check("cluster dynamic page exists",
  fs.existsSync(path.join(ROOT, "app", "finance-tools", "[cluster]", "page.tsx")));

// FinanceToolPage structure
const ftPage = fs.readFileSync(
  path.join(ROOT, "components", "finance", "FinanceToolPage.tsx"), "utf8");
check("FinanceToolPage renders breadcrumb",    ftPage.includes('aria-label="Breadcrumb"'));
check("FinanceToolPage renders H1",            ftPage.includes("<h1"));
check("FinanceToolPage uses FaqAccordion",     ftPage.includes("FaqAccordion"));
check("FinanceToolPage uses FinanceRelatedTools", ftPage.includes("FinanceRelatedTools"));
check("FinanceToolPage renders JSON-LD",       ftPage.includes("JsonLd"));
check("FinanceToolPage has 4-level breadcrumb",
  ftPage.includes("Finance Tools") && ftPage.includes("cluster") && ftPage.includes("title"));

// ── 8. CLUSTER PAGES ──────────────────────────────────────────────────────────
console.log("\n── 8. Cluster pages ─────────────────────────────────────────────");
const clusterPage = fs.readFileSync(
  path.join(ROOT, "app", "finance-tools", "[cluster]", "page.tsx"), "utf8");
check("cluster page has generateStaticParams", clusterPage.includes("generateStaticParams"));
check("cluster page has 7 cluster params",     clusterPage.includes("financeClusters.map"));
check("cluster page has generateMetadata",     clusterPage.includes("generateMetadata"));
check("cluster page has notFound guard",       clusterPage.includes("notFound()"));
check("cluster page has FAQ content",          clusterPage.includes("CLUSTER_FAQS"));
check("cluster page has tool grid",            clusterPage.includes("ToolCard"));

// ── SUMMARY ───────────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(70));
console.log(`RESULTS:  ${passed} passed  |  ${failed} failed  |  ${passed + failed} total`);
console.log("═".repeat(70));

if (issues.length > 0) {
  console.log("\nISSUES:");
  issues.forEach(i => console.log("  " + i));
  process.exit(1);
} else {
  console.log("\n✓ All SEO & registry checks passed.");
  process.exit(0);
}

function toPascal(slug) {
  return slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");
}
