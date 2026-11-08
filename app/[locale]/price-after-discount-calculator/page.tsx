import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import PriceAfterDiscountClient from "./PriceAfterDiscountClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Price After Discount Calculator - Deals | BeYourTools",
  description: "Find the final price after applying a discount percentage, with optional sales tax. Free sale price calculator in your browser.",
  keywords: "price after discount calculator, final price calculator, discount and tax calculator, sale price calculator, percent off calculator",
  path: "/price-after-discount-calculator",
});

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
        { question: "How do I find the original price from a sale price?", answer: "Divide the sale price by 1 minus the discount as a decimal. If an item sells for $60 after 25% off, the original price was $60 / (1 - 0.25) = $60 / 0.75 = $80.00. The same trick works for any single discount, just use the discount that was applied." },
        { question: "How much do I really save when discounts stack?", answer: "Less than the two percentages added together, because the second discount applies to the already reduced price. An $80 item with 20% off, then an extra 15% off, costs $80 x 0.80 x 0.85 = $54.40. You save $25.60, which is 32% off in total, not 35%." },
        { question: "Does a discount also lower the sales tax I pay?", answer: "Yes, because tax is charged on the discounted price. A $100 item with 25% off and 8% tax costs $75 + $6.00 tax = $81.00 out the door. Without the discount you would pay $100 + $8.00 tax = $108.00, so the discount saves you $2.00 of tax on top of the $25.00 price cut." },
      ]}
    >
      <PriceAfterDiscountClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "price-after-discount-calculator", __enMetadata);
}
