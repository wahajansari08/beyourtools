import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import TaxExclusiveClient from "./TaxExclusiveClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Tax-Exclusive Price Calculator - Net Cost | BeYourTools",
  description: "Extract the net price from a tax-inclusive total. Remove VAT, GST, or sales tax to find pre-tax amounts in your browser.",
  keywords: "tax exclusive price calculator, remove VAT, extract tax, net price calculator, reverse VAT calculator, price without tax",
  path: "/tax-exclusive-price-calculator",
});

export default function TaxExclusivePage() {
  return (
    <FinanceToolPage
      slug="tax-exclusive-price-calculator"
      title="Tax-Exclusive Price Calculator"
      cluster="Tax & Pricing"
      tagline="Remove VAT, GST, or sales tax from a gross price to find the original net (tax-exclusive) amount, useful for reclaiming VAT or comparing prices across tax jurisdictions."
      description="Free tax-exclusive price calculator. Enter a gross (tax-inclusive) price and tax rate to extract the net pre-tax price and the tax amount contained within it."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Price (tax-exclusive)</strong> = Gross Price ÷ (1 + Tax Rate ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Tax Amount</strong> = Gross Price − Net Price</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Gross $120 at 20% VAT → Net = $120 ÷ 1.20 = <strong>$100</strong> · Tax extracted = $20<br />
            <em>Note: the tax rate is applied to the net, not the gross, so 20% of $100 = $20, not 20% of $120 = $24</em>
          </p>
        </>
      }
      faqs={[
        { question: "Why can't I just multiply the gross by the tax rate to get the tax?", answer: "Because tax is calculated on the net price, not the gross. At 20% VAT, $120 gross contains $20 tax ($100 net × 20%). If you multiply $120 × 20% = $24, that's wrong, you're calculating 20% of a price that already includes the tax." },
        { question: "When would I need to extract tax from a gross price?", answer: "VAT-registered businesses reclaim input VAT they paid on purchases. To reclaim, they need the net and VAT amounts from gross invoices. This calculator performs that extraction instantly." },
        { question: "Is this the same as a reverse VAT calculation?", answer: "Yes, reverse VAT (or de-VAT) is the process of extracting the net price from a VAT-inclusive gross price. The formula is Net = Gross ÷ (1 + rate). This calculator does exactly that." },
        { question: "What is the difference between tax-inclusive and tax-exclusive pricing?", answer: "Tax-inclusive (gross) pricing shows the final price the customer pays, with tax embedded. Tax-exclusive (net) pricing shows the price before tax is added, common in B2B invoicing where the buyer reclaims VAT." },
        { question: "How much VAT is inside a gross price?", answer: "At 20% VAT, the tax is one sixth of the gross price, because VAT = Gross x 20 / 120. On a $180 gross price that is $30 of VAT and a $150 net price. On a $300 gross price it is $50 of VAT and a $250 net price. In general, the tax share of a gross price is rate / (100 + rate), so at 20% the tax is 16.67% of the gross." },
        { question: "What are the standard VAT and GST rates by country?", answer: "The UK standard rate is 20%, so $120 gross is $100 net plus $20 VAT. Germany charges 19%: $59.50 gross is $50 net plus $9.50 VAT. Ireland charges 23%: $123 gross is $100 net plus $23 VAT. EU standard rates generally run from 15% to 27%. Outside Europe, Australia charges 10% GST, so $110 gross is $100 net plus $10 GST, and India commonly charges 18% GST, so $118 gross is $100 net plus $18 GST. Enter the rate for your country above to extract the exact net." },
        { question: "How do I remove tax from a price that already has a discount?", answer: "Discount the gross price first, then divide by 1 plus the rate. A $120 gross price at 20% VAT with a 10% discount becomes a $108 discounted gross, which gives a $90 net price and $18 of tax. If you extract the tax first and then discount the net, you still get a $90 net, but the tax on the invoice must be $18 on the discounted price, not $20 on the original." },
      ]}
    >
      <TaxExclusiveClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "tax-exclusive-price-calculator", __enMetadata);
}
