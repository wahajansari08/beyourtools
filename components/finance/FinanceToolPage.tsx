import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import FinanceRelatedTools from "./FinanceRelatedTools";
import {
  breadcrumbSchema,
  financeCalculatorSchema,
  faqSchema,
  SITE,
  canonical,
} from "@/lib/seo";
import { clusterSlugs, type FinanceCluster } from "@/lib/finance-tools-config";

export interface FinanceFaq {
  question: string;
  answer: string;
}

export interface FinanceToolPageProps {
  /** URL slug for this tool, e.g. "profit-margin-calculator" */
  slug: string;
  /** Exact H1 text */
  title: string;
  /** Cluster this tool belongs to */
  cluster: FinanceCluster;
  /** One-line tagline shown below the H1 */
  tagline: string;
  /** Longer description used in schema and "About this calculator" section */
  description: string;
  /** The formula explanation shown below the tool UI */
  formulaExplanation: React.ReactNode;
  /** 4–8 FAQs */
  faqs: FinanceFaq[];
  /** The interactive client component */
  children: React.ReactNode;
}

export default function FinanceToolPage({
  slug,
  title,
  cluster,
  tagline,
  description,
  formulaExplanation,
  faqs,
  children,
}: FinanceToolPageProps) {
  const toolUrl = canonical(`/${slug}`);
  const clusterSlug = clusterSlugs[cluster];
  const clusterUrl = canonical(`/finance-tools/${clusterSlug}`);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools",    url: SITE.url },
      { name: "Finance Tools",  url: canonical("/finance-tools") },
      { name: cluster,          url: clusterUrl },
      { name: title,            url: toolUrl },
    ]),
    financeCalculatorSchema({
      name: title,
      description,
      url: toolUrl,
    }),
    faqSchema(faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
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
            <li>
              <Link href={`/finance-tools/${clusterSlug}`} className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
                {cluster}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--accent-text)" }}
          >
            {cluster}
          </p>
          <h1
            className="font-display text-2xl font-semibold sm:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {tagline}
          </p>
        </header>

        {/* Tool UI (client component) */}
        <section aria-label="Calculator">
          {children}
        </section>

        {/* Privacy note */}
        <p className="mt-4 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          🔒 All calculations happen instantly in your browser. No data is sent to any server.
        </p>

        {/* Formula & explanation */}
        <section className="mt-10 space-y-3" aria-labelledby="formula-heading">
          <h2
            id="formula-heading"
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            How the calculation works
          </h2>
          <div
            className="rounded-lg border p-4 text-sm leading-relaxed space-y-3"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-muted)",
            }}
          >
            {formulaExplanation}
          </div>
        </section>

        {/* Financial Decision-Making & Planning Framework */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Financial Planning Insights &amp; Strategic Decision-Making
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Accurate financial estimates provide the foundation for sound personal budgeting, profitable business ventures, and long-term capital preservation. 
            When evaluating figures generated by the <strong style={{ color: "var(--text-primary)" }}>{title}</strong>, factoring in compounding cycles, opportunity costs, and cash flow elasticity allows you to make informed, data-driven decisions.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Compounding &amp; Time Horizon</h3>
              <p>
                Small percentage differentials in interest rates, margins, or annual yields create exponentially large financial divergences over multi-year horizons. 
                Regularly stress-testing your repayment timelines or profit targets against variable rates builds resilient financial buffers.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Cash Flow Prioritization</h3>
              <p>
                Calculations should be paired with practical liquidity considerations. 
                Whether accelerating debt amortization or budgeting business operating expenses, maintaining accessible emergency reserves prevents forced liquidation of high-performing assets.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="mb-4 font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
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
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Are the numbers I enter into this calculator saved or tracked?
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                No. All calculation logic runs strictly in your client browser session using local JavaScript. Your salary, debt amounts, profit margins, and loan balances are completely private and never logged, recorded, or transmitted to any server.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                How should I account for taxes, inflation, and unexpected fees?
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Baseline mathematical models reflect nominal values. In practice, factor in local tax brackets, regional inflation indices, and institutional origination costs to arrive at an effective net figure for realistic forecasting.
              </p>
            </div>
          </div>
        </section>

        {/* Related tools */}
        <FinanceRelatedTools currentSlug={slug} />
      </div>
    </>
  );
}
