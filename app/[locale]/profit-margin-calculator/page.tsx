import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import ProfitMarginClient from "./ProfitMarginClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Profit Margin Calculator: Gross, Operating & Net Margin | BeYourTools",
  description: "Free profit margin calculator. Find gross, operating, and net margin from revenue and costs, with a worked example and margin vs markup explained.",
  keywords: "profit margin calculator, gross margin calculator, net margin calculator, operating margin, profit percentage, margin vs markup, price from margin",
  path: "/profit-margin-calculator",
});

export default function ProfitMarginPage() {
  return (
    <FinanceToolPage
      slug="profit-margin-calculator"
      title="Profit Margin Calculator"
      cluster="Business Finance"
      tagline="Calculate gross, operating, or net profit margin as a percentage of revenue, switch between margin types, see your profit figure instantly, and work backwards from a target margin to the price you need."
      description="Free online profit margin calculator. Enter revenue and costs to calculate gross margin, operating margin (EBIT), or net margin with the profit amount shown alongside, plus a worked example that walks through all three margins."
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
        {
          question: "How do I set a price from a target profit margin?",
          answer: "Work backwards from the margin you want: Price = Cost ÷ (1 − Target Margin). For a 40% margin on a $60 cost, Price = $60 ÷ 0.60 = $100. Check it: profit is $40, and $40 ÷ $100 = 40% margin. Pricing from margin (rather than adding a markup) keeps your reported margin on target.",
        },
        {
          question: "Why is my net margin so much lower than my gross margin?",
          answer: "Each margin strips away another layer of cost. In the example above, gross margin is 40%, operating margin falls to 25% once $15,000 of operating expenses are deducted, and net margin falls to 20% after $5,000 of taxes and interest. When the gap between gross and net is wide, overhead, debt, or tax is where profit is leaking, not production.",
        },
        {
          question: "Should I compare my margin to competitors or to my own history?",
          answer: "Do both. Competitor benchmarks in your own industry tell you whether your margin is normal; your own trend tells you whether it is improving. A margin that falls while revenue rises is a warning sign: costs are growing faster than sales, even though the top line looks healthy.",
        },
      ]}
    >
      <ProfitMarginClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "profit-margin-calculator", __enMetadata);
}
