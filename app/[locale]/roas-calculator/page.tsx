import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import RoasClient from "./RoasClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "ROAS Calculator - Return on Ad Spend | BeYourTools",
  description: "Calculate ROAS for any advertising campaign. Enter revenue and ad spend to see profitability and break-even ROAS in your browser.",
  keywords: "ROAS calculator, return on ad spend, advertising ROI, Facebook ads ROAS, Google ads ROAS, marketing profitability, break-even ROAS",
  path: "/roas-calculator",
});

export default function RoasPage() {
  return (
    <FinanceToolPage
      slug="roas-calculator"
      title="ROAS Calculator"
      cluster="Marketing & ROI"
      tagline="Calculate return on ad spend for any campaign, and add your gross margin to instantly see profitability and the break-even ROAS you need to target."
      description="Free ROAS calculator. Enter ad revenue and spend to calculate ROAS ratio. Add gross margin to find campaign profit and the break-even ROAS threshold."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>ROAS</strong> = Revenue from Ads ÷ Ad Spend</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Break-Even ROAS</strong> = 1 ÷ Gross Margin (as decimal) = 100 ÷ Margin%</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Profit</strong> = Revenue × Gross Margin% − Ad Spend</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Revenue $20,000 · Ad Spend $5,000 · Gross Margin 30%<br />
            ROAS = 20,000 ÷ 5,000 = <strong>4.0</strong> · Break-even = 100 ÷ 30 = <strong>3.33</strong> · Profit = $6,000 − $5,000 = <strong>$1,000</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is a good ROAS?", answer: "Break-even ROAS depends on your gross margin. At 25% margin: break-even = 4.0. At 33% margin: break-even = 3.0. At 50% margin: break-even = 2.0. A 'good' ROAS is anything comfortably above your break-even, typically 4:1 to 8:1 for e-commerce." },
        { question: "What is the difference between ROAS and ROI?", answer: "ROAS measures gross revenue per ad dollar spent, it ignores all other costs. ROI measures net profit relative to total investment. A 4:1 ROAS sounds impressive but may be unprofitable if COGS is 70%. Always check ROAS against your break-even before judging campaign performance." },
        { question: "How do I calculate break-even ROAS?", answer: "Break-even ROAS = 1 ÷ Gross Margin. At 25% gross margin: 1 ÷ 0.25 = 4.0. This means you need $4 in revenue for every $1 in ad spend just to cover the cost of goods and ads. Any ROAS above this is profitable." },
        { question: "Why is my ROAS high but I'm still losing money?", answer: "ROAS only accounts for ad spend versus revenue. It ignores COGS, fulfilment, customer service, returns, overheads, and other expenses. A 5:1 ROAS at 15% gross margin only returns $0.75 revenue after COGS per $1 of ad spend, still a loss after factoring in other costs." },
        { question: "How do platforms like Meta and Google report ROAS?", answer: "Ad platforms report 'Purchase ROAS' = Purchase conversion value ÷ Amount spent, measured by their pixel/conversion tracking. Attribution window differences (1-day vs. 7-day click) and data discrepancies between platforms and your actual revenue data are common, so always reconcile with backend sales." },
        { question: "What is target ROAS, and how is it different from break-even ROAS?", answer: "Break-even ROAS covers your costs exactly. Target ROAS also leaves a chosen profit margin: Target ROAS = 1 / (Gross margin - Target profit margin), both as decimals. At a 40% gross margin with a 10% target profit margin, target ROAS is 1 / (0.40 - 0.10) = 3.33, while break-even is 1 / 0.40 = 2.50. Anything between 2.50 and 3.33 covers costs but misses the profit target." },
        { question: "How do I express ROAS as a percentage, and what is ACoS?", answer: "ROAS as a percentage is the ROAS ratio x 100. ACoS, advertising cost of sales, is the inverse view: Ad spend / Revenue x 100. On $15,000 of revenue from $4,000 of ad spend, ROAS is 15,000 / 4,000 = 3.75x, or 375%, and ACoS is 4,000 / 15,000 = 26.67%. At a 40% gross margin that campaign makes 15,000 x 0.40 - 4,000 = $2,000 profit." },
        { question: "How much ad spend do I need to hit a revenue goal?", answer: "Rearrange the formula: Ad spend needed = Revenue goal / Target ROAS. For a $30,000 revenue goal at a 3.00 target ROAS, spend is 30,000 / 3 = $10,000. At a 45% gross margin that leaves 30,000 x 0.45 - 10,000 = $3,500 profit after ad spend." },
      ]}
    >
      <RoasClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "roas-calculator", __enMetadata);
}
