import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { contentLocale, getTranslatedToolContentAny } from "@/lib/i18n-content";
import { LockIcon } from "@/components/icons";
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

export default async function FinanceToolPage({
  slug,
  title,
  cluster,
  tagline,
  description,
  formulaExplanation,
  faqs,
  children,
}: FinanceToolPageProps) {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const tc = await getTranslatedToolContentAny(locale, slug);
  const tTitle = tc?.name ?? title;
  const tTagline = (tc as { tagline?: string } | undefined)?.tagline ?? tagline;
  const tDescription = tc?.description ?? description;
  const tFaqs = (tc?.faqs as FinanceFaq[] | undefined) ?? faqs;
  const toolUrl = canonical(`/${slug}`);
  const clusterSlug = clusterSlugs[cluster];
  const clusterUrl = canonical(`/finance-tools/${clusterSlug}`);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools",    url: SITE.url },
      { name: "Finance Tools",  url: canonical("/finance-tools") },
      { name: cluster,          url: clusterUrl },
      { name: tTitle,            url: toolUrl },
    ]),
    financeCalculatorSchema({
      name: tTitle,
      description: tDescription,
      url: toolUrl,
    }),
    faqSchema(tFaqs),
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
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{tTitle}</li>
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
            {tTitle}
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {tTagline}
          </p>
        </header>

        {/* Tool UI (client component) */}
        <section aria-label="Calculator">
          {children}
        </section>

        {/* Privacy note */}
        <p className="mt-4 flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          <LockIcon className="h-3.5 w-3.5 shrink-0" />All calculations happen instantly in your browser. No data is sent to any server.
        </p>

        {/* Formula & explanation */}
        <section className="mt-10 space-y-3" aria-labelledby="formula-heading">
          <h2
            id="formula-heading"
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {t("howItWorks", { title: tTitle })}
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
            {tTitle} {t("insightsTitle")}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Good estimates help you plan your money with confidence. Use the numbers from the{" "}
            <strong style={{ color: "var(--text-primary)" }}>{tTitle}</strong> to set realistic goals,
            cut extra costs, and make smart financial decisions.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Planning Ahead</h3>
              <p>
                Small changes add up fast over time. Checking your numbers often helps you stay on track and build strong savings habits.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Smart Budgeting</h3>
              <p>
                Always pair your calculations with real daily spending needs. Keeping an emergency fund gives you peace of mind and flexibility.
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
            {tTitle} {t("faqs")}
          </h2>
          <div className="space-y-5">
            {tFaqs.map(({ question, answer }) => (
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
                No. Every calculation runs right inside your browser using local code. Your salary, debts, and loan numbers stay completely private. Nothing is ever saved or sent to any server.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                How should I account for taxes, inflation, and unexpected fees?
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Most formulas show baseline estimates. In real life, keep local taxes, inflation, and bank fees in mind so your budget matches your actual costs.
              </p>
            </div>
          </div>
        </section>

        {/* Financial & Legal Disclaimer (YMYL Compliance) */}
        <section
          className="mt-10 rounded-xl border p-5 text-xs leading-relaxed"
          style={{
            borderColor: "var(--border-strong)",
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-muted)",
          }}
          aria-label="Financial Disclaimer"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg" aria-hidden="true">⚖️</span>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Financial Calculation Disclaimer
              </h3>
              <p>
                The results from the <strong style={{ color: "var(--text-primary)" }}>{title}</strong> are for general informational and educational use only. They are based on standard mathematical formulas and the numbers you enter.
              </p>
              <p>
                BeYourTools is not a bank, lender, or financial advisor. This tool does not provide official tax or legal advice. Real rates and fees depend on your lender and local rules. For major financial decisions, please speak with a qualified professional. Read our complete{" "}
                <Link href="/disclaimer" className="underline hover-text-primary" style={{ color: "var(--accent-text)" }}>
                  Financial &amp; Legal Disclaimer
                </Link>.
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
