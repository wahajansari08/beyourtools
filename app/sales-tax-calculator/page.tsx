import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SalesTaxClient from "./SalesTaxClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Sales Tax Calculator - Add or Remove Sales Tax from Any Price | BeYourTools",
  description: "Add sales tax to a pre-tax price or remove tax from a tax-inclusive total. Supports any tax rate. Includes quick presets for US states and VAT rates. Free, instant.",
  keywords: "sales tax calculator, add sales tax, remove sales tax, tax inclusive price, VAT calculator, price with tax",
  path: "/sales-tax-calculator",
});

export default function SalesTaxPage() {
  return (
    <FinanceToolPage
      slug="sales-tax-calculator"
      title="Sales Tax Calculator"
      cluster="Tax & Pricing"
      tagline="Add sales tax to a pre-tax price, or extract the original pre-tax amount from a tax-inclusive total, with quick presets for common US and international rates."
      description="Free sales tax calculator. Add any tax rate to a price or reverse-calculate to remove tax from a gross amount. Includes preset buttons for common US state and VAT rates."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Adding Tax:</strong></p>
          <p>Tax Amount = Pre-Tax Price × (Tax Rate ÷ 100)</p>
          <p>Total = Pre-Tax Price + Tax Amount</p>
          <p className="mt-2"><strong style={{ color: "var(--text-secondary)" }}>Removing Tax:</strong></p>
          <p>Pre-Tax Price = Gross Price ÷ (1 + Tax Rate ÷ 100)</p>
          <p>Tax Amount = Gross Price − Pre-Tax Price</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example (add):</strong> $49.99 + 8.5% = $49.99 × 1.085 = <strong>$54.24</strong> (tax: $4.25)<br />
            <strong>Example (remove):</strong> $54.24 ÷ 1.085 = <strong>$49.99</strong> pre-tax (tax extracted: $4.25)
          </p>
        </>
      }
      faqs={[
        { question: "What is the average US sales tax rate?", answer: "The US average combined state + local sales tax rate is approximately 7.12%. It ranges from 0% (Oregon, Montana, New Hampshire, Delaware, Alaska) to over 10% in some Louisiana and Tennessee jurisdictions." },
        { question: "How do I back-calculate the pre-tax price from a receipt?", answer: "Switch to 'Remove tax from price', enter the receipt total, and enter the tax rate. The formula is: Pre-tax = Total ÷ (1 + rate). For a $54.24 total at 8.5%: $54.24 ÷ 1.085 = $49.99." },
        { question: "Is VAT the same as sales tax?", answer: "Functionally similar to the consumer, but structurally different. Sales tax is collected only at the final sale. VAT is collected at each stage of production but businesses reclaim what they paid, end consumers pay the full rate. Use the same formula for final-price calculations." },
        { question: "Which US states have no sales tax?", answer: "Oregon, Montana, New Hampshire, Delaware, and Alaska have no statewide sales tax. Alaska allows local jurisdictions to levy sales tax, so some Alaskan municipalities do charge it." },
        { question: "Do online purchases require sales tax?", answer: "Since the 2018 South Dakota v. Wayfair Supreme Court ruling, online sellers can be required to collect sales tax in states where they have economic nexus, even without a physical presence. Most major online retailers now collect state sales tax." },
      ]}
    >
      <SalesTaxClient />
    </FinanceToolPage>
  );
}
