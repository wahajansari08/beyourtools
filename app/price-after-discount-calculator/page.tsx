import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import PriceAfterDiscountClient from "./PriceAfterDiscountClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Price After Discount Calculator - Final Price with Discount & Tax | BeYourTools",
  description:
    "Find the final price after applying a percentage discount, with optional sales tax added after the discount. Quick preset buttons for common discount percentages.",
  keywords: "price after discount calculator, final price calculator, discount and tax calculator, sale price calculator, percent off calculator",
  alternates: { canonical: `${SITE.url}/price-after-discount-calculator` },
  robots: { index: true, follow: true },
};

export default function PriceAfterDiscountPage() {
  return (
    <FinanceToolPage
      slug="price-after-discount-calculator"
      title="Price After Discount Calculator"
      cluster="Tax & Pricing"
      tagline="Enter an original price and discount percentage, with optional sales tax, to instantly see the sale price, discount amount, tax, and final price to pay."
      description="Free price after discount calculator. Enter original price, discount %, and optional tax rate to calculate discount amount, sale price, and final price with tax."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Discount Amount</strong> = Original Price × (Discount% ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Sale Price</strong> = Original Price − Discount Amount</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Tax Amount</strong> = Sale Price × (Tax Rate ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Final Price</strong> = Sale Price + Tax Amount</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            Tax is applied to the <em>discounted</em> price, not the original, this is the legally correct treatment for promotional discounts in most jurisdictions.
          </p>
        </>
      }
      faqs={[
        { question: "Is tax applied before or after the discount?", answer: "After. Sales tax is applied to the actual selling price, the price after the discount is taken. If an item is $100 with 25% off, the taxable amount is $75 (the sale price), not $100." },
        { question: "What is 30% off $85?", answer: "Discount = $85 × 0.30 = $25.50. Sale price = $85 − $25.50 = $59.50. At 8% tax: $59.50 × 1.08 = $64.26 final. Use the quick-select buttons to try common discount percentages instantly." },
        { question: "How do stacked discounts work?", answer: "Stacked discounts are applied sequentially, not added. A 20% off then 10% off deal: $100 → $80 → $72 (not $70). Use the calculator twice, enter $80 as the original price for the second discount." },
        { question: "What is the difference between this and the Discount Calculator?", answer: "The Discount Calculator is a simpler tool that just applies a percentage off. This calculator adds sales tax after the discount, making it more useful for seeing the true final amount you'd pay at checkout." },
      ]}
    >
      <PriceAfterDiscountClient />
    </FinanceToolPage>
  );
}
