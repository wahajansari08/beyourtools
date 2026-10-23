import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SipCalculatorClient from "./SipCalculatorClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "SIP Calculator - Estimate Your Investment Growth | BeYourTools",
  description:
    "Free SIP calculator: estimate the future value of monthly investments with compound growth, annual step-up SIP mode, USD/EUR/GBP/INR/PKR currencies, a growth chart and a yearly breakdown. All in your browser.",
  keywords: "sip calculator, sip returns, mutual fund sip, systematic investment plan, monthly investment calculator, sip growth, step up sip calculator, sip calculator india",
  path: "/sip-calculator",
});

export default function SipCalculatorPage() {
  return (
    <FinanceToolPage
      slug="sip-calculator"
      title="SIP Calculator"
      cluster="Savings & Interest"
      tagline="See what your monthly investments could become. Enter your monthly amount, expected return and time horizon, and watch compounding do the heavy lifting."
      description="Free online SIP calculator. Enter your monthly investment, expected annual return, investment period and optional annual step-up to estimate the future value of a Systematic Investment Plan - in USD, EUR, GBP, INR or PKR - with the total invested, the growth and a year-by-year breakdown."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>FV</strong> = M × [((1+r)<sup>n</sup> − 1) ÷ r] × (1+r)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            M = monthly investment · r = expected annual return ÷ 12 ÷ 100 · n = years × 12
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $500/month at 12% annual return for 10 years<br />
            r = 0.01, n = 120. FV = 500 × [((1.01)<sup>120</sup> − 1) ÷ 0.01] × 1.01 ≈ <strong>$116,169</strong>
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Step-up:</strong> with a 10% annual step-up, year y invests M × 1.10<sup>y−1</sup> per month.
            Example: ₹5,000/month at 12% for 10 years grows to ≈ <strong>₹11.6 lakh</strong>; with a 10% yearly step-up it reaches ≈ <strong>₹17.4 lakh</strong>.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a SIP?",
          answer: "A Systematic Investment Plan is a way to invest a fixed amount every month, usually into mutual funds. Instead of timing the market, you invest steadily and let compounding and rupee-cost averaging work over time.",
        },
        {
          question: "What return rate should I assume?",
          answer: "Be conservative. Equity funds have historically returned 10 to 12% annually over long periods, but there is no guarantee. Run the calculator at a few rates, say 8%, 10% and 12%, to see a realistic range of outcomes.",
        },
        {
          question: "Does this include taxes or fees?",
          answer: "No. The projection ignores expense ratios, exit loads and capital gains tax, which all reduce real returns. Treat the figure as a best-case before costs, and knock a couple of percent off for a more honest estimate.",
        },
        {
          question: "Is compounding really that powerful?",
          answer: "Yes, over long periods. In the example above, $60,000 invested over 10 years grows to about $116,000, so nearly half the final value is growth. Stretch it to 20 years and the same monthly amount reaches roughly $499,000.",
        },
        {
          question: "What is a step-up SIP?",
          answer: "A step-up SIP raises your monthly investment by a fixed percentage each year, usually 5 to 10%, as your income grows. Enter the annual step-up % in the calculator to model it. Example: ₹5,000/month at 12% for 10 years reaches about ₹11.6 lakh flat, but about ₹17.4 lakh with a 10% yearly step-up.",
        },
        {
          question: "Can I calculate in rupees (INR)?",
          answer: "Yes. Use the currency selector to switch between USD, EUR, GBP, INR and PKR. Amounts are formatted in the local style, so Indian users see lakh and crore notation on the chart and tables.",
        },
        {
          question: "Is this financial advice?",
          answer: "No. This is an educational estimate based on a fixed return assumption. Real investments fluctuate, and past performance does not guarantee future results. Speak to a licensed advisor before investing.",
        },
      ]}
    >
      <SipCalculatorClient />
    </FinanceToolPage>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "sip-calculator", __enMetadata);
}
