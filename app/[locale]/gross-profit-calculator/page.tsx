import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import GrossProfitClient from "./GrossProfitClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Gross Profit Calculator: Gross Profit & Margin from Revenue & COGS | BeYourTools",
  description: "Free gross profit calculator. Find gross profit in dollars and gross margin percentage from revenue and cost of goods sold, with COGS explained.",
  keywords: "gross profit calculator, gross margin calculator, cogs, revenue, gross profit formula, gross profit vs gross margin",
  path: "/gross-profit-calculator",
});

export default function GrossProfitPage() {
  return (
    <FinanceToolPage
      slug="gross-profit-calculator"
      title="Gross Profit Calculator"
      cluster="Business Finance"
      tagline="Calculate gross profit and gross margin percentage from revenue and cost of goods sold in seconds, and see what the result says about your pricing and direct costs."
      description="Free gross profit calculator. Enter total revenue and COGS to instantly calculate gross profit in dollars and gross profit margin as a percentage, with a worked example and guidance on what belongs in COGS."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Profit</strong> = Revenue − Cost of Goods Sold (COGS)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Margin %</strong> = (Gross Profit ÷ Revenue) × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Revenue $200,000 · COGS $120,000<br />
            Gross Profit = $80,000 · Gross Margin = 80,000 ÷ 200,000 = <strong>40%</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What does gross profit tell you?", answer: "Gross profit shows how much revenue remains after covering the direct costs of producing your product or service. It funds all your other expenses, salaries, marketing, rent, and eventually profit." },
        { question: "What is included in COGS?", answer: "COGS includes direct production costs: raw materials, direct labour, manufacturing overhead, and inbound freight. It excludes operating expenses like marketing, office rent, and management salaries." },
        { question: "What is a healthy gross margin by industry?", answer: "Software and SaaS: 60–80%. Retail: 25–50%. Manufacturing: 25–35%. Restaurants: 60–70% (on food cost alone). Always compare against your industry peers." },
        { question: "How is gross profit different from net profit?", answer: "Gross profit only deducts COGS from revenue. Net profit deducts everything, operating expenses, interest, and taxes. A business can have strong gross profit but poor net profit if overhead is high." },
        { question: "Can gross profit be negative?", answer: "Yes, if COGS exceeds revenue, gross profit is negative. This means each unit sold costs more to make than it earns, which is unsustainable and signals a pricing or cost problem." },
        { question: "What is the difference between gross profit and gross margin?", answer: "Gross profit is dollars; gross margin is the same profit as a percentage of revenue. In the example above, gross profit is $80,000 and gross margin is $80,000 ÷ $200,000 = 40%. Use dollars to see how much money production leaves behind, and use the percentage to compare products, months, or competitors of different sizes." },
        { question: "What belongs in COGS for a service business?", answer: "Direct delivery costs: the labour of the people doing the work, subcontractors hired for that job, and materials or tools used only for it. Rent, marketing, admin salaries, and software subscriptions are operating expenses, not COGS. Putting them in COGS understates gross profit and hides how the core service itself performs." },
        { question: "Why would gross margin fall while revenue rises?", answer: "Three usual causes: input costs rising faster than prices, heavier discounting to win the extra sales, or a shift in mix toward lower-margin products. Compare margin product by product rather than only in total; a rising total can hide a falling margin on your best sellers." },
      ]}
    >
      <GrossProfitClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "gross-profit-calculator", __enMetadata);
}
