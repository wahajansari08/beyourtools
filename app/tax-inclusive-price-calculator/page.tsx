import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import TaxInclusiveClient from "./TaxInclusiveClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tax-Inclusive Price Calculator — Add VAT/GST to Net Price | BeYourTools",
  description:
    "Calculate the gross (tax-inclusive) price by adding VAT, GST, or sales tax to a net price. Includes presets for UK VAT (20%), AU GST (10%), and EU VAT rates.",
  keywords: "tax inclusive price calculator, VAT calculator, GST calculator, add VAT to price, gross price calculator, tax on price",
  alternates: { canonical: `${SITE.url}/tax-inclusive-price-calculator` },
  robots: { index: true, follow: true },
};

export default function TaxInclusivePage() {
  return (
    <FinanceToolPage
      slug="tax-inclusive-price-calculator"
      title="Tax-Inclusive Price Calculator"
      cluster="Tax & Pricing"
      tagline="Add VAT, GST, or any tax rate to a net price to get the gross tax-inclusive price — with quick presets for UK VAT, Australian GST, and common EU rates."
      description="Free tax-inclusive price calculator. Enter the net (pre-tax) price and tax rate to calculate the gross price with tax included and the tax amount."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Price (tax-inclusive)</strong> = Net Price × (1 + Tax Rate ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Tax Amount</strong> = Gross Price − Net Price</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Net $100 + 20% VAT → Gross = $100 × 1.20 = <strong>$120</strong> (tax: $20)
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Tax-inclusive (gross) pricing is standard in most countries outside the US — the displayed price already contains the tax.
          </p>
        </>
      }
      faqs={[
        { question: "What is a tax-inclusive price?", answer: "A price that already includes the tax within it. In most of Europe, Australia, and many other countries, shelf prices are tax-inclusive — the price shown is what you pay. In the US, sales tax is typically added at the register (tax-exclusive)." },
        { question: "What is the UK VAT rate?", answer: "The standard UK VAT rate is 20%. A reduced rate of 5% applies to some goods (domestic fuel, children's car seats). Zero-rated goods (food, children's clothing, books) have 0% VAT charged." },
        { question: "What is Australia's GST rate?", answer: "Australia's Goods and Services Tax (GST) is 10%. Most goods and services are taxable, though some fresh food, medical services, and education are GST-free." },
        { question: "How do I display tax-inclusive vs. tax-exclusive prices on my invoices?", answer: "Business-to-business (B2B) invoices often show both: the net amount, the VAT/tax amount, and the gross total. Consumer-facing prices in tax-inclusive jurisdictions must show the gross price prominently. Check your local tax authority guidance." },
      ]}
    >
      <TaxInclusiveClient />
    </FinanceToolPage>
  );
}
