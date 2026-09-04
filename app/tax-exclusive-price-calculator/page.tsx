import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import TaxExclusiveClient from "./TaxExclusiveClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tax-Exclusive Price Calculator - Remove VAT/Tax from Gross Price | BeYourTools",
  description:
    "Extract the net (tax-exclusive) price from a tax-inclusive gross price. Remove VAT, GST, or any sales tax to find the original pre-tax amount. Free, browser-based.",
  keywords: "tax exclusive price calculator, remove VAT, extract tax, net price calculator, reverse VAT calculator, price without tax",
  alternates: { canonical: `${SITE.url}/tax-exclusive-price-calculator` },
  robots: { index: true, follow: true },
};

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
      ]}
    >
      <TaxExclusiveClient />
    </FinanceToolPage>
  );
}
