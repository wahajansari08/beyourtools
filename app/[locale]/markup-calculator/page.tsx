import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import MarkupClient from "./MarkupClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Markup Calculator: Markup, Margin & Selling Price | BeYourTools",
  description: "Free markup calculator. Find markup percentage, selling price from cost, or price from a target margin, with markup to margin conversion explained.",
  keywords: "markup calculator, selling price calculator, markup percentage, cost to price, margin vs markup, markup to margin conversion",
  path: "/markup-calculator",
});

export default function MarkupPage() {
  return (
    <FinanceToolPage
      slug="markup-calculator"
      title="Markup Calculator"
      cluster="Business Finance"
      tagline="Convert between cost, markup percentage, selling price, and profit margin, in any direction you need, and see why a markup and a margin with the same number are not the same result."
      description="Free online markup calculator. Calculate selling price from cost and markup, find markup percentage from cost and price, work backwards from a desired profit margin, or convert any markup into its equivalent margin."
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
        {
          question: "How do I convert a markup into a margin?",
          answer: "Margin = Markup ÷ (1 + Markup), using decimals. A 25% markup gives 0.25 ÷ 1.25 = 20% margin. A 50% markup gives 0.50 ÷ 1.50 = 33.3% margin. A 100% markup gives 1 ÷ 2 = 50% margin. As a rule, markup is always the larger number for the same sale, because it divides by the smaller figure (cost).",
        },
        {
          question: "What markup covers my overhead and still hits my target margin?",
          answer: "Add overhead to the margin you need to keep. If overhead runs 15% of revenue and you want 10% net profit, you need a 25% gross margin. That requires a markup of 0.25 ÷ 0.75 = 33.3%, not 25%. Setting a 25% markup in that case would leave you short.",
        },
        {
          question: "Should I price with markup or with margin?",
          answer: "Use markup to set prices from cost, it is the quickest way to build a price list. Use margin to report results and compare products or competitors, because margin shows what share of each sales dollar you actually keep. The costly mistake is quoting one and meaning the other.",
        },
      ]}
    >
      <MarkupClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "markup-calculator", __enMetadata);
}
