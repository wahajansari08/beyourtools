import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DiscountClient from "./DiscountClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Discount Calculator - Final Price After Discount % | BeYourTools",
  description:
    "Calculate the final price after applying a percentage discount. See exactly how much you save and what the discounted amount is. Free, instant, no sign-up.",
  keywords: "discount calculator, price after discount, percent off calculator, sale price calculator, savings calculator",
  alternates: { canonical: `${SITE.url}/discount-calculator` },
  robots: { index: true, follow: true },
};

export default function DiscountPage() {
  return (
    <FinanceToolPage
      slug="discount-calculator"
      title="Discount Calculator"
      cluster="Business Finance"
      tagline="Enter an original price and discount percentage to instantly see the final price, discount amount, and total savings."
      description="Free discount calculator. Enter the original price and discount percentage to get the final discounted price and savings amount instantly."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Discount Amount</strong> = Original Price × (Discount% ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Final Price</strong> = Original Price − Discount Amount</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Original price $120 · Discount 25%<br />
            Discount amount = $120 × 0.25 = $30 · Final price = <strong>$90</strong> · You save <strong>$30</strong>
          </p>
        </>
      }
      faqs={[
        { question: "How do I calculate 20% off a price?", answer: "Multiply the original price by 0.20 to get the discount amount, then subtract from the original. Example: 20% off $80 = $80 × 0.20 = $16 discount → $64 final price." },
        { question: "What is the difference between a discount and a markdown?", answer: "A discount is a temporary price reduction from the listed price, often for promotions. A markdown is a permanent price reduction, often when clearing old stock. Both use the same calculation." },
        { question: "How do I find the original price if I only know the discounted price?", answer: "Divide the discounted price by (1 − discount rate). Example: discounted price $75 at 25% off → $75 ÷ 0.75 = $100 original price." },
        { question: "Can I stack multiple discounts?", answer: "Yes, but they're not additive. Two 10% discounts equals 1 − (0.9 × 0.9) = 19% total, not 20%. Apply each discount sequentially to the price after the previous discount." },
        { question: "What does 'buy one get one 50% off' equal as a single discount?", answer: "If both items are the same price, the total discount across both items is 25% (you pay 75% of the combined price). On a single-item basis it's harder to express as a clean percentage." },
      ]}
    >
      <DiscountClient />
    </FinanceToolPage>
  );
}
