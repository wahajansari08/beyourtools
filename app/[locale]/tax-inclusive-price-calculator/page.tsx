import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import TaxInclusiveClient from "./TaxInclusiveClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Tax-Inclusive Price Calculator - Add VAT | BeYourTools",
  description: "Calculate gross price by adding VAT, GST, or sales tax to a net price. Includes presets for UK, AU, and EU rates in your browser.",
  keywords: "tax inclusive price calculator, VAT calculator, GST calculator, add VAT to price, gross price calculator, tax on price",
  path: "/tax-inclusive-price-calculator",
});

export default function TaxInclusivePage() {
  return (
    <FinanceToolPage
      slug="tax-inclusive-price-calculator"
      title="Tax-Inclusive Price Calculator"
      cluster="Tax & Pricing"
      tagline="Add VAT, GST, or any tax rate to a net price to get the gross tax-inclusive price, with quick presets for UK VAT, Australian GST, and common EU rates."
      description="Free tax-inclusive price calculator. Enter the net (pre-tax) price and tax rate to calculate the gross price with tax included and the tax amount."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Price (tax-inclusive)</strong> = Net Price × (1 + Tax Rate ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Tax Amount</strong> = Gross Price − Net Price</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Net $100 + 20% VAT → Gross = $100 × 1.20 = <strong>$120</strong> (tax: $20)
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Tax-inclusive (gross) pricing is standard in most countries outside the US, the displayed price already contains the tax.
          </p>
        </>
      }
      faqs={[
        { question: "What is a tax-inclusive price?", answer: "A price that already includes the tax within it. In most of Europe, Australia, and many other countries, shelf prices are tax-inclusive, the price shown is what you pay. In the US, sales tax is typically added at the register (tax-exclusive)." },
        { question: "What is the UK VAT rate?", answer: "The standard UK VAT rate is 20%. A reduced rate of 5% applies to some goods (domestic fuel, children's car seats). Zero-rated goods (food, children's clothing, books) have 0% VAT charged." },
        { question: "What is Australia's GST rate?", answer: "Australia's Goods and Services Tax (GST) is 10%. Most goods and services are taxable, though some fresh food, medical services, and education are GST-free." },
        { question: "How do I display tax-inclusive vs. tax-exclusive prices on my invoices?", answer: "Business-to-business (B2B) invoices often show both: the net amount, the VAT/tax amount, and the gross total. Consumer-facing prices in tax-inclusive jurisdictions must show the gross price prominently. Check your local tax authority guidance." },
        { question: "How do I remove VAT from a price that already includes it?", answer: "Divide the gross price by 1 plus the rate as a decimal. A $120 price that includes 20% VAT has a net price of $120 / 1.20 = $100.00, so the VAT inside it is $20.00. Do not subtract 20% of the gross price, that gives $96.00, which is wrong because the tax was charged on the smaller net price. Use the Sales Tax Calculator in Remove tax mode for this reverse calculation." },
        { question: "What is the tax on a $250 net price at 10% GST?", answer: "The tax is $250 x 0.10 = $25.00, so the gross tax-inclusive price is $275.00. The same pattern works for any rate: multiply the net price by the rate to get the tax, then add it to the net price for the gross total." },
        { question: "Which countries use tax-inclusive pricing?", answer: "Most countries outside the US show tax-inclusive shelf prices: the UK, the EU, Australia, India, and New Zealand, among others. The US is the main exception, where sales tax is added at the register. Standard VAT rates in the EU range from 17% in Luxembourg to 27% in Hungary, so always check the rate for the country you are pricing in." },
      ]}
    >
      <TaxInclusiveClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "tax-inclusive-price-calculator", __enMetadata);
}
