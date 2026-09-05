import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
  relatedFinanceTools,
  type FinanceCluster,
  type FinanceTool,
} from "@/lib/finance-tools-config";
import Btn from "@/components/Btn";

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return financeClusters.map((c) => ({ cluster: clusterSlugs[c] }));
}

// ── Reverse-lookup: slug → cluster ────────────────────────────────────────────

function clusterFromSlug(slug: string): FinanceCluster | undefined {
  return financeClusters.find((c) => clusterSlugs[c] === slug);
}

// ── Cluster-specific FAQ content ──────────────────────────────────────────────

const CLUSTER_FAQS: Record<FinanceCluster, { question: string; answer: string }[]> = {
  "Business Finance": [
    { question: "What is a profit margin and how is it calculated?", answer: "Profit margin is net profit divided by revenue, expressed as a percentage. A 20% net margin means you keep $0.20 of every $1.00 in revenue after all costs." },
    { question: "What is the difference between markup and margin?", answer: "Margin is profit divided by the selling price. Markup is profit divided by the cost. A 50% markup on a $10 item gives a $15 selling price but only a 33% margin." },
    { question: "How do I calculate my break-even point?", answer: "Divide your total fixed costs by the contribution margin per unit (selling price minus variable cost per unit). The result is the number of units you must sell to cover all costs." },
    { question: "Why do gross, operating, and net margins differ?", answer: "Gross margin only deducts cost of goods sold. Operating margin also deducts operating expenses like rent and salaries. Net margin deducts everything including interest and taxes." },
  ],
  "Salary & Income": [
    { question: "How do I convert an hourly wage to an annual salary?", answer: "Multiply your hourly rate by the number of hours you work per week, then multiply by 52 (weeks per year). For a standard 40-hour week: hourly × 40 × 52." },
    { question: "How is overtime pay calculated?", answer: "In most US jurisdictions, overtime applies to hours over 40 per week at 1.5× the regular rate. Some states use daily overtime rules. Always check your local labour laws." },
    { question: "What should a freelancer charge per hour?", answer: "Start with your desired annual income, add business expenses and taxes (typically 25–30% for self-employed), then divide by billable hours (usually 1,000–1,500 per year). The freelance rate calculator does this automatically." },
    { question: "What deductions reduce my paycheck?", answer: "Federal and state income tax (withheld based on your W-4 allowances), FICA (6.2% Social Security + 1.45% Medicare), health insurance premiums, and any 401(k) or HSA contributions." },
  ],
  "Loans": [
    { question: "How is a monthly loan payment calculated?", answer: "Using the standard amortization formula: M = P × [r(1+r)^n] / [(1+r)^n - 1], where P is principal, r is monthly interest rate, and n is number of payments." },
    { question: "What is an amortization schedule?", answer: "A month-by-month table showing each payment split between principal and interest, plus the remaining balance. Early payments are mostly interest; later payments shift toward principal." },
    { question: "How much interest do extra payments save?", answer: "Even small extra payments reduce the principal faster, shortening the loan term and cutting total interest significantly. The extra payment calculator shows the exact savings." },
    { question: "What is the difference between APR and interest rate?", answer: "The interest rate is the cost of borrowing the principal. APR (Annual Percentage Rate) includes the interest rate plus fees (origination, points, etc.), giving the true annual cost of the loan." },
  ],
  "Debt & Credit": [
    { question: "What is the debt snowball method?", answer: "You pay minimum payments on all debts, then put any extra money toward the smallest balance. Once it's paid off, roll that payment to the next smallest. The quick wins build motivation." },
    { question: "What is the debt avalanche method?", answer: "You pay minimum payments on all debts, then direct extra money toward the highest-interest debt. This minimises total interest paid, making it mathematically optimal." },
    { question: "What is a good debt-to-income ratio?", answer: "Lenders generally prefer a DTI below 36%. A DTI above 43% makes it difficult to qualify for most loans. Below 20% is considered excellent." },
    { question: "What happens if I only pay credit card minimums?", answer: "Minimum payments are typically 1–2% of the balance plus interest. On a $5,000 balance at 20% APR, paying only minimums can take over 20 years and cost more than $6,000 in interest." },
  ],
  "Savings & Interest": [
    { question: "What is the difference between APR and APY?", answer: "APR is the annual rate without compounding. APY (Annual Percentage Yield) accounts for compounding frequency, so APY is always ≥ APR. The more frequent the compounding, the higher the APY." },
    { question: "How does compound interest work?", answer: "Interest is calculated on both the original principal and the accumulated interest from previous periods. Over time this exponential growth significantly outpaces simple interest." },
    { question: "How much should I save each month to reach my goal?", answer: "Use the savings goal calculator: enter your target amount, current savings, expected interest rate, and target date. It calculates the exact monthly contribution needed." },
    { question: "What is simple interest and when is it used?", answer: "Simple interest accrues only on the original principal (I = P × r × t). It's used for short-term loans, savings bonds, and some auto loans - situations where compounding isn't applied." },
  ],
  "Tax & Pricing": [
    { question: "How do I calculate sales tax on a price?", answer: "Multiply the pre-tax price by the decimal tax rate. For 8% tax on a $50 item: $50 × 0.08 = $4 tax, giving a total of $54. The sales tax calculator handles both directions." },
    { question: "What is the difference between tax-inclusive and tax-exclusive pricing?", answer: "Tax-exclusive (net) price is before tax is added. Tax-inclusive (gross) price already contains the tax. To find the net price from a gross price: Net = Gross ÷ (1 + rate)." },
    { question: "How do I apply a percentage discount and then add tax?", answer: "First apply the discount to get the sale price, then calculate tax on the discounted amount. Tax should be applied to the final sale price, not the original." },
    { question: "What does 'price after discount' mean for a business?", answer: "It's the effective selling price after any promotional reduction. Tracking this versus your cost determines whether a sale is still profitable." },
  ],
  "Marketing & ROI": [
    { question: "How is ROI calculated?", answer: "ROI = (Net Gain ÷ Cost of Investment) × 100. If you invested $1,000 and earned $1,300, the net gain is $300 and ROI is 30%." },
    { question: "What is ROAS and how does it differ from ROI?", answer: "ROAS (Return on Ad Spend) = Revenue ÷ Ad Spend. It measures gross revenue per advertising dollar, ignoring other costs. ROI accounts for all costs and shows net profitability." },
    { question: "What is a good ROAS for paid advertising?", answer: "A ROAS of 4:1 ($4 revenue per $1 spent) is often cited as a break-even benchmark for e-commerce with 25% margins. Higher-margin businesses can be profitable at lower ROAS." },
    { question: "How do I calculate revenue growth rate?", answer: "Revenue Growth Rate = ((Current Period Revenue - Prior Period Revenue) ÷ Prior Period Revenue) × 100. A result of 15% means revenue grew 15% year-over-year." },
  ],
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster: clusterParam } = await params;
  const cluster = clusterFromSlug(clusterParam);
  if (!cluster) return {};

  const tools = toolsByCluster(cluster);
  const toolNames = tools
    .slice(0, 4)
    .map((t) => t.name)
    .join(", ");

  const titles: Record<FinanceCluster, string> = {
    "Business Finance":    "Business Finance Calculators - Margins, Markup & Break-Even",
    "Salary & Income":     "Salary & Income Calculators - Hourly, Paycheck & Freelance Rate",
    "Loans":               "Loan Calculators - Payment, Amortization & Payoff",
    "Debt & Credit":       "Debt & Credit Calculators - Snowball, Avalanche & Credit Card Payoff",
    "Savings & Interest":  "Savings & Interest Calculators - APY, APR & Compound Growth",
    "Tax & Pricing":       "Tax & Pricing Calculators - Sales Tax, Discounts & Price Tools",
    "Marketing & ROI":     "Marketing & ROI Calculators - ROI, ROAS & Revenue Growth",
  };

  const descriptions: Record<FinanceCluster, string> = {
    "Business Finance":    `${tools.length} free business finance calculators for profit margin, markup, break-even analysis, gross profit, net profit, and operating margin.`,
    "Salary & Income":     `${tools.length} free salary and income calculators - convert hourly to salary, calculate overtime, estimate your paycheck, and set a fair freelance rate.`,
    "Loans":               `${tools.length} free loan calculators - monthly payments, total interest, full amortization schedule, and the savings from extra payments.`,
    "Debt & Credit":       `${tools.length} free debt calculators - debt snowball, debt avalanche, credit card payoff, minimum payment cost, and debt-to-income ratio.`,
    "Savings & Interest":  `${tools.length} free savings calculators - project compound savings growth, find your required monthly contribution, and convert APR to APY.`,
    "Tax & Pricing":       `${tools.length} free tax and pricing calculators - add or remove sales tax, calculate discounted prices, and work with tax-inclusive or exclusive amounts.`,
    "Marketing & ROI":     `${tools.length} free marketing calculators - ROI, ROAS, net cash flow, and revenue growth rate for campaigns and business performance.`,
  };

  return {
    title: `${titles[cluster]} | BeYourTools`,
    description: descriptions[cluster],
    keywords: tools.flatMap((t) => t.keywords).join(", "),
    alternates: { canonical: `${SITE.url}/finance-tools/${clusterParam}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE.url}/finance-tools/${clusterParam}`,
      title: `${titles[cluster]} | BeYourTools`,
      description: descriptions[cluster],
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: titles[cluster] }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titles[cluster]} | BeYourTools`,
      description: descriptions[cluster],
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CLUSTER_COLORS = {
  "Business Finance":    { dot: "var(--teal)",   bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)",   text: "var(--teal)"        },
  "Salary & Income":     { dot: "var(--accent)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent-text)"  },
  "Loans":               { dot: "var(--coral)",   bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"        },
  "Debt & Credit":       { dot: "var(--teal)",    bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)",   text: "var(--teal)"         },
  "Savings & Interest":  { dot: "var(--accent)",  bg: "color-mix(in srgb,var(--accent) 10%,transparent)", border: "color-mix(in srgb,var(--accent) 30%,transparent)", text: "var(--accent-text)"  },
  "Tax & Pricing":       { dot: "var(--coral)",   bg: "color-mix(in srgb,var(--coral) 10%,transparent)",  border: "color-mix(in srgb,var(--coral) 30%,transparent)",  text: "var(--coral)"        },
  "Marketing & ROI":     { dot: "var(--teal)",    bg: "color-mix(in srgb,var(--teal) 10%,transparent)",   border: "color-mix(in srgb,var(--teal) 30%,transparent)",   text: "var(--teal)"         },
};

function ToolCard({ tool }: { tool: FinanceTool }) {
  const cluster = tool.cluster;
  const c = CLUSTER_COLORS[cluster];
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
          <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {tool.name}
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {tool.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-end">
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

export default async function ClusterPage({
  params,
}: {
  params: Promise<{ cluster: string }>;
}) {
  const { cluster: clusterParam } = await params;
  const cluster = clusterFromSlug(clusterParam);
  if (!cluster) notFound();

  const tools = toolsByCluster(cluster);
  const c = CLUSTER_COLORS[cluster];
  const faqs = CLUSTER_FAQS[cluster];
  const clusterUrl = canonical(`/finance-tools/${clusterParam}`);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools",   url: SITE.url },
      { name: "Finance Tools", url: canonical("/finance-tools") },
      { name: cluster,         url: clusterUrl },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools ${cluster} Calculators`,
      description: clusterDescriptions[cluster],
      url: clusterUrl,
      category: "FinanceApplication",
    }),
    itemListSchema(
      tools.map((t) => ({
        name: t.name,
        url: canonical(`/${t.slug}`),
        description: t.description,
      }))
    ),
    faqSchema(faqs),
  ];

  // Sibling clusters for cross-linking
  const siblingClusters = financeClusters.filter((cl) => cl !== cluster);

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
            <li>
              <Link href="/finance-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
                Finance Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{cluster}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
              aria-hidden="true"
            >
              {clusterIcons[cluster]}
            </span>
          </div>
          <h1
            className="font-display text-3xl font-semibold sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            {cluster} Calculators
          </h1>
          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {clusterDescriptions[cluster]} All {tools.length} tools run entirely in your browser -
            no sign-up, no data stored.
          </p>
          <div
            className="mt-5 flex flex-wrap gap-4 text-xs"
            style={{ color: "var(--text-subtle)" }}
          >
            {[`${tools.length} calculators`, "100% browser-based", "Free forever"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tool grid */}
        <section aria-labelledby="tools-heading">
          <h2
            id="tools-heading"
            className="mb-4 font-display text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            All {cluster} Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-12 space-y-4" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ question, answer }) => (
              <div key={question}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {question}
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Other clusters */}
        <section className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <h2
            className="mb-4 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-subtle)" }}
          >
            Other Finance Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblingClusters.map((cl) => (
              <Btn variant="pill" key={cl} href={`/finance-tools/${clusterSlugs[cl]}`}>
                <span aria-hidden="true">{clusterIcons[cl]}</span>
                {cl}
              </Btn>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/finance-tools"
              className="focus-ring text-xs font-medium hover:underline"
              style={{ color: "var(--accent-text)" }}
            >
              ← All Finance Tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
