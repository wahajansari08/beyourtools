import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SalesTaxClient from "./SalesTaxClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Sales Tax Calculator - Add or Remove Tax | BeYourTools",
  description: "Add sales tax to a price or remove tax from a total. Includes presets for US states and VAT rates. Free tool in your browser.",
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
        { question: "What is the average US sales tax rate?", answer: "The US average combined state + local sales tax rate is approximately 7.52% (Tax Foundation, midyear 2025). It ranges from 0% (Oregon, Montana, New Hampshire, Delaware, Alaska) to 12% in some Louisiana jurisdictions. Louisiana has the highest average combined rate in the country at 10.11%, followed by Tennessee at 9.61%." },
        { question: "How do I back-calculate the pre-tax price from a receipt?", answer: "Switch to 'Remove tax from price', enter the receipt total, and enter the tax rate. The formula is: Pre-tax = Total ÷ (1 + rate). For a $54.24 total at 8.5%: $54.24 ÷ 1.085 = $49.99." },
        { question: "Is VAT the same as sales tax?", answer: "Functionally similar to the consumer, but structurally different. Sales tax is collected only at the final sale. VAT is collected at each stage of production but businesses reclaim what they paid, end consumers pay the full rate. Use the same formula for final-price calculations." },
        { question: "Which US states have no sales tax?", answer: "Oregon, Montana, New Hampshire, Delaware, and Alaska have no statewide sales tax. Alaska allows local jurisdictions to levy sales tax, so some Alaskan municipalities do charge it." },
        { question: "Do online purchases require sales tax?", answer: "Since the 2018 South Dakota v. Wayfair Supreme Court ruling, online sellers can be required to collect sales tax in states where they have economic nexus, even without a physical presence. Most major online retailers now collect state sales tax." },
        { question: "How do I find the tax rate from a receipt?", answer: "Subtract the pre-tax price from the total, divide by the pre-tax price, and multiply by 100. If an item cost $84.50 before tax and $90.84 after tax, the rate is ($90.84 - $84.50) / $84.50 x 100 = 7.5%. If you only have the total and the rate, use the Remove tax mode to work back to the pre-tax price." },
        { question: "Why can't I just subtract the tax percentage from a total to remove tax?", answer: "Because the tax was charged on the smaller pre-tax price, not on the total. At 8%, a $108 total comes from a $100 pre-tax price: $108 / 1.08 = $100.00. Subtracting 8% of the total instead gives $99.36, which is wrong. The tax inside a total is rate / (100 + rate) of it, so at 8% only 7.41% of the $108 is tax." },
        { question: "How is sales tax rounded?", answer: "Tax is rounded to the nearest cent. For example, $84.50 at 7.5% gives $6.3375 of tax, which rounds to $6.34, for a total of $90.84. Rounding can make a remove-tax calculation land a cent off the original price, which is normal and not an error in the calculator." },
      ]}
    >
      <SalesTaxClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "sales-tax-calculator", __enMetadata);
}
