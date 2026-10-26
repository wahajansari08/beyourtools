import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DiscountClient from "./DiscountClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Discount Calculator: Percent Off, Sale Price & Savings | BeYourTools",
  description: "Free discount calculator. Find the sale price and savings from any percent off, work out the discount percentage from two prices, or stack discounts and add tax.",
  keywords: "discount calculator, price after discount, percent off calculator, sale price calculator, savings calculator, stacked discounts, discount percentage",
  path: "/discount-calculator",
});

export default function DiscountPage() {
  return (
    <FinanceToolPage
      slug="discount-calculator"
      title="Discount Calculator"
      cluster="Business Finance"
      tagline="Enter an original price and discount percentage to instantly see the final price, discount amount, and total savings — with stacked discounts, sales tax, and per-item prices."
      description="Free discount calculator. Enter the original price and discount percentage to get the final discounted price and savings amount instantly. Stack a second discount, add sales tax, and split the result across multiple items."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Discount Amount</strong> = Original Price × (Discount% ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Final Price</strong> = Original Price − Discount Amount</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Stacked discounts</strong> = Original × (1 − D1% ÷ 100) × (1 − D2% ÷ 100) — each discount applies to the price left by the previous one</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>With tax</strong> = Discounted Price × (1 + Tax% ÷ 100)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Original price $120 · Discount 25%<br />
            Discount amount = $120 × 0.25 = $30 · Final price = <strong>$90</strong> · You save <strong>$30</strong>
            <br /><strong>Stacked example:</strong> $100 with 20% then 10% off = $100 × 0.80 × 0.90 = <strong>$72</strong> · You save <strong>$28</strong> (28% effective, not 30%)
          </p>
        </>
      }
      faqs={[
        { question: "How do I calculate 20% off a price?", answer: "Multiply the original price by 0.20 to get the discount amount, then subtract from the original. Example: 20% off $80 = $80 × 0.20 = $16 discount → $64 final price." },
        { question: "What is the difference between a discount and a markdown?", answer: "A discount is a temporary price reduction from the listed price, often for promotions. A markdown is a permanent price reduction, often when clearing old stock. Both use the same calculation." },
        { question: "How do I find the original price if I only know the discounted price?", answer: "Divide the discounted price by (1 − discount rate). Example: discounted price $75 at 25% off → $75 ÷ 0.75 = $100 original price." },
        { question: "Can I stack multiple discounts?", answer: "Yes, but they're not additive. Two 10% discounts equals 1 − (0.9 × 0.9) = 19% total, not 20%. Apply each discount sequentially to the price after the previous discount." },
        { question: "What does 'buy one get one 50% off' equal as a single discount?", answer: "If both items are the same price, the total discount across both items is 25% (you pay 75% of the combined price). On a single-item basis it's harder to express as a clean percentage." },
        { question: "Is sales tax added before or after the discount?", answer: "In most shops, tax is charged on the discounted price, not the original sticker price. That is how this calculator works: discounts are applied first, then the tax rate is applied to the discounted subtotal. Example: $100 with 20% off and 8% tax = $80 × 1.08 = $86.40 at the till." },
        { question: "How does the per-item price work?", answer: "Enter a quantity greater than 1 and the calculator divides the final price and the total savings by that quantity, so you can compare multi-packs and bulk deals item by item." },
        { question: "How do I work out a discount in my head while shopping?", answer: "Start from 10%: move the decimal point one place left. 10% of $80 is $8. Then build up: 20% is double that ($16), 15% is 10% plus half of 10% ($8 + $4 = $12), and 25% is a quarter of the price ($80 ÷ 4 = $20). To get the price you pay, subtract from the original: $80 at 15% off costs $68." },
        { question: "How do I find the discount percentage from two prices?", answer: "Divide the saving by the original price: Discount% = (Original − Sale) ÷ Original × 100. A jacket cut from $200 to $160 is ($200 − $160) ÷ $200 = 20% off. Always divide by the original price, never by the sale price." },
        { question: "What does 50% off plus an extra 10% off really save?", answer: "Not 60%. Discounts stack multiplicatively: $100 at 50% off is $50, then 10% off $50 is $45. You pay $45 and save $55, which is a 55% effective discount. Whenever a second discount is offered, apply it to the already reduced price." },
      ]}
    >
      <DiscountClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "discount-calculator", __enMetadata);
}
