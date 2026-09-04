import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import ProfitMarginClient from "./ProfitMarginClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Profit Margin Calculator - Gross, Operating & Net Margin | BeYourTools",
  description:
    "Calculate gross, operating, or net profit margin instantly. Enter revenue and costs to see your margin percentage and profit amount. Free, browser-based, no sign-up.",
  keywords: "profit margin calculator, gross margin calculator, net margin calculator, operating margin, profit percentage",
  alternates: { canonical: `${SITE.url}/profit-margin-calculator` },
  robots: { index: true, follow: true },
};

export default function ProfitMarginPage() {
  return (
    <FinanceToolPage
      slug="profit-margin-calculator"
      title="Profit Margin Calculator"
      cluster="Business Finance"
      tagline="Calculate gross, operating, or net profit margin as a percentage of revenue, switch between margin types and see your profit figure instantly."
      description="Free online profit margin calculator. Enter revenue and costs to calculate gross margin, operating margin (EBIT), or net margin with the profit amount shown alongside."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Margin</strong> = (Revenue − COGS) ÷ Revenue × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Margin</strong> = (Revenue − COGS − Operating Expenses) ÷ Revenue × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Margin</strong> = (Revenue − COGS − Operating Expenses − Taxes &amp; Interest) ÷ Revenue × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Revenue $100,000 · COGS $60,000 · Operating Expenses $15,000 · Taxes $5,000<br />
            Gross Margin = ($100k − $60k) ÷ $100k = <strong>40%</strong> · Operating Margin = $25k ÷ $100k = <strong>25%</strong> · Net Margin = $20k ÷ $100k = <strong>20%</strong>
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a good profit margin?",
          answer: "It varies by industry. Retail typically runs 2–5% net margin; SaaS companies often exceed 20%. Gross margins above 50% are common in software. Compare against industry benchmarks rather than a universal target.",
        },
        {
          question: "What is the difference between gross and net margin?",
          answer: "Gross margin only deducts the direct cost of goods sold (COGS). Net margin deducts everything, COGS, operating expenses, interest, and taxes. Net margin shows what you truly keep from each dollar of revenue.",
        },
        {
          question: "Can a company have a positive gross margin but negative net margin?",
          answer: "Yes. If operating expenses, debt interest, or taxes exceed the gross profit, net margin turns negative even though the product itself is profitable to produce. This is common in early-stage companies with high overhead.",
        },
        {
          question: "What is included in COGS?",
          answer: "COGS (Cost of Goods Sold) includes direct costs: raw materials, direct labour, manufacturing overhead, and freight-in. It excludes indirect costs like marketing, admin salaries, and rent, those go in operating expenses.",
        },
        {
          question: "How do I improve my profit margin?",
          answer: "Three levers: increase prices (most impactful), reduce COGS through better supplier deals or process efficiency, or cut operating expenses. Gross margin improvement is often faster than cutting overheads.",
        },
        {
          question: "Is margin the same as markup?",
          answer: "No. Margin is profit ÷ selling price. Markup is profit ÷ cost. A 50% markup on a $10 cost gives a $15 price, but the margin is only 33%. Always clarify which measure you're using when comparing figures.",
        },
      ]}
    >
      <ProfitMarginClient />
    </FinanceToolPage>
  );
}
