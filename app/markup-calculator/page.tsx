import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import MarkupClient from "./MarkupClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Markup Calculator - Find Selling Price or Markup % | BeYourTools",
  description:
    "Calculate the selling price from cost and markup %, find the markup % from cost and price, or convert a desired margin into the right markup. Free online markup calculator.",
  keywords: "markup calculator, selling price calculator, markup percentage, cost to price, margin vs markup",
  alternates: { canonical: `${SITE.url}/markup-calculator` },
  robots: { index: true, follow: true },
};

export default function MarkupPage() {
  return (
    <FinanceToolPage
      slug="markup-calculator"
      title="Markup Calculator"
      cluster="Business Finance"
      tagline="Convert between cost, markup percentage, selling price, and profit margin, in any direction you need."
      description="Free online markup calculator. Calculate selling price from cost and markup, find markup percentage from cost and price, or work backwards from a desired profit margin."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Selling Price</strong> = Cost × (1 + Markup% ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Markup %</strong> = (Selling Price − Cost) ÷ Cost × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Margin %</strong> = (Selling Price − Cost) ÷ Selling Price × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Price from Margin</strong> = Cost ÷ (1 − Margin% ÷ 100)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Cost $50 · Markup 40% → Selling Price = $50 × 1.40 = <strong>$70</strong> · Profit = $20 · Margin = 20 ÷ 70 = <strong>28.6%</strong>
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the difference between markup and margin?",
          answer: "Markup is calculated on cost: (Price − Cost) ÷ Cost. Margin is calculated on the selling price: (Price − Cost) ÷ Price. A 40% markup equals a 28.6% margin, they are not the same number.",
        },
        {
          question: "How do I set a price to achieve a specific margin?",
          answer: "Use the 'Cost + Margin → Price' mode. Enter your cost and desired margin percentage. The formula is Price = Cost ÷ (1 − Margin%). For a 40% margin on a $50 cost: $50 ÷ 0.60 = $83.33.",
        },
        {
          question: "Why do retailers use markup instead of margin?",
          answer: "Markup is simpler to apply at point of purchase, you know your cost and want to add a percentage on top. Finance teams prefer margin because it directly expresses the percentage of revenue you keep.",
        },
        {
          question: "Can markup exceed 100%?",
          answer: "Yes. A 100% markup means you double the cost (e.g. cost $50, price $100). Luxury goods, pharmaceuticals, and some software products regularly see markups of 200–500%. Margin, however, is always below 100%.",
        },
        {
          question: "What markup do I need for a 50% margin?",
          answer: "Using Price = Cost ÷ (1 − 0.50) = Cost × 2. So a 50% margin requires a 100% markup. The relationship is: Required Markup = Desired Margin ÷ (1 − Desired Margin).",
        },
      ]}
    >
      <MarkupClient />
    </FinanceToolPage>
  );
}
