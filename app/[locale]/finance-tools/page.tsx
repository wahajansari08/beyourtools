import { localizeMetadata, contentLocale, getHubCopy } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  softwareApplicationSchema,
  SITE,
  canonical,
} from "@/lib/seo";
import {
  financeTools,
  financeClusters,
  toolsByCluster,
  clusterSlugs,
  clusterDescriptions,
  clusterIcons,
  type FinanceCluster,
  type FinanceTool,
} from "@/lib/finance-tools-config";
import Btn from "@/components/Btn";

const __enMetadata: Metadata = {
  title: "Finance Calculators - 40 Free Online Tools | BeYourTools",
  description:
    "40 free browser-based finance calculators for profit margins, loan payments, debt payoff, savings, and taxes. 100% private, no sign-up.",
  keywords:
    "finance calculators, loan calculator, profit margin calculator, ROI calculator, savings calculator, debt payoff calculator, salary calculator, tax calculator",
  alternates: { canonical: `${SITE.url}/finance-tools` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/finance-tools`,
    title: "Finance Calculators - Free Online Tools | BeYourTools",
    description:
      "40 free browser-based finance calculators for business, loans, debt, savings, tax, and more. Everything runs privately in your browser.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Finance Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Calculators - Free Online Tools | BeYourTools",
    description: "40 free finance calculators - loans, margins, savings, debt, ROI, taxes and more.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};



const CLUSTER_COLORS: Record<
  FinanceCluster,
  { dot: string; bg: string; border: string; text: string }
> = {
  "Business Finance":    { dot: "var(--accent-text)",   bg: "color-mix(in srgb,var(--accent-text) 10%,transparent)",   border: "color-mix(in srgb,var(--accent-text) 30%,transparent)",   text: "var(--accent-text)"   },
  "Salary & Income":     { dot: "var(--accent)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent-text)" },
  "Loans":               { dot: "var(--coral)",   bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"  },
  "Debt & Credit":       { dot: "var(--accent-text)",    bg: "color-mix(in srgb,var(--accent-text) 10%,transparent)",   border: "color-mix(in srgb,var(--accent-text) 30%,transparent)",   text: "var(--accent-text)"   },
  "Savings & Interest":  { dot: "var(--accent)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent-text)" },
  "Tax & Pricing":       { dot: "var(--coral)",   bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"  },
  "Marketing & ROI":     { dot: "var(--accent-text)",    bg: "color-mix(in srgb,var(--accent-text) 10%,transparent)",   border: "color-mix(in srgb,var(--accent-text) 30%,transparent)",   text: "var(--accent-text)"   },
};

const POPULAR_SLUGS = [
  "loan-payment-calculator",
  "profit-margin-calculator",
  "savings-calculator",
  "roi-calculator",
  "credit-card-payoff-calculator",
  "hourly-to-salary-calculator",
  "sales-tax-calculator",
  "debt-snowball-calculator",
];

function ToolCard({ tool }: { tool: FinanceTool }) {
  const c = CLUSTER_COLORS[tool.cluster];
  return (
    <Link
      href={`/${tool.slug}`}
      className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
            style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
            aria-hidden="true"
          >
            {tool.icon}
          </span>
          <h3
            className="text-sm font-semibold leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            {tool.name}
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {tool.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: c.bg, color: c.text }}
        >
          {tool.cluster}
        </span>
        <span
          className="text-xs font-medium opacity-0 transition group-hover:opacity-100"
          style={{ color: "var(--accent-text)" }}
        >
          Calculate →
        </span>
      </div>
    </Link>
  );
}

export default async function FinanceToolsPage() {
  const locale = await contentLocale();
  const hub = await getHubCopy(locale, "finance-tools");
  const hubIntro = hub.intro.replace("{count}", String(financeTools.length));
const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools",   url: SITE.url },
    { name: "Finance Tools", url: canonical("/finance-tools") },
  ]),
  softwareApplicationSchema({
    name: "BeYourTools Finance Tools",
    description: `${financeTools.length} free browser-based finance calculators covering loans, debt, savings, margins, ROI, taxes, and salary.`,
    url: canonical("/finance-tools"),
    category: "FinanceApplication",
  }),
  itemListSchema(
    financeTools.map((t) => ({
      name: t.name,
      url: canonical(`/${t.slug}`),
      description: t.description,
    }))
  ),
  faqSchema(hub.faqs),
];
  const popularTools = POPULAR_SLUGS
    .map((s) => financeTools.find((t) => t.slug === s))
    .filter(Boolean) as FinanceTool[];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
            <li>
              <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
                BeYourTools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }}>Finance Tools</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1
            className="font-display text-3xl font-semibold sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >{hub.title}</h1>
          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >{hubIntro}</p>
          <div
            className="mt-5 flex flex-wrap gap-4 text-xs"
            style={{ color: "var(--text-subtle)" }}
          >
            {[
              `${financeTools.length} calculators`,
              "100% browser-based",
              "No data stored",
              "Free forever",
            ].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-text)" }}
                />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Popular quick links */}
        <div className="mb-10">
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-subtle)" }}
          >
            Most Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((t) => (
              <Btn variant="pill" key={t.slug} href={`/${t.slug}`}>
                <span aria-hidden="true">{t.icon}</span>
                {t.name}
              </Btn>
            ))}
          </div>
        </div>

        {/* Cluster overview cards */}
        <div className="mb-12">
          <h2
            className="mb-4 font-display text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Browse Finance Tools by Category
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {financeClusters.map((cluster) => {
              const c = CLUSTER_COLORS[cluster];
              const tools = toolsByCluster(cluster);
              const slug = clusterSlugs[cluster];
              return (
                <Link
                  key={cluster}
                  href={`/finance-tools/${slug}`}
                  className="focus-ring group rounded-xl border p-4 transition hover-card"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
                      aria-hidden="true"
                    >
                      {clusterIcons[cluster]}
                    </span>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {cluster}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {clusterDescriptions[cluster]}
                  </p>
                  <p
                    className="mt-3 text-[11px] font-medium"
                    style={{ color: c.text }}
                  >
                    {tools.length} tools →
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tools by cluster */}
        <div className="space-y-14">
          {financeClusters.map((cluster) => {
            const tools = toolsByCluster(cluster);
            const c = CLUSTER_COLORS[cluster];
            const slug = clusterSlugs[cluster];
            return (
              <section key={cluster} aria-labelledby={`cluster-${slug}`}>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: c.dot }}
                    aria-hidden="true"
                  />
                  <h2
                    id={`cluster-${slug}`}
                    className="font-display text-base font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cluster}
                  </h2>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      borderColor: "var(--border-strong)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-subtle)",
                    }}
                  >
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </span>
                  <Link
                    href={`/finance-tools/${slug}`}
                    className="focus-ring ml-auto text-xs font-medium hover:underline"
                    style={{ color: "var(--accent-text)" }}
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tools.map((t) => (
                    <ToolCard key={t.slug} tool={t} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Privacy note */}
        <div
          className="mt-14 rounded-lg border p-4 text-xs leading-relaxed"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-muted)",
          }}
        >
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
            Privacy:{" "}
          </span>
          Every calculation on BeYourTools Finance runs entirely in your browser using JavaScript.
          No numbers, salaries, loan amounts, or financial details are ever transmitted to a server
          or stored anywhere.
        </div>
      </div>
    </>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "finance-tools", __enMetadata);
}
