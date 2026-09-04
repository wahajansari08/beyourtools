import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SimpleInterestClient from "./SimpleInterestClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Simple Interest Calculator - I = PRT Formula | BeYourTools",
  description:
    "Calculate simple interest earned or owed using the I = PRT formula. Supports years, months, or days. Shows interest amount and total value. Free, browser-based.",
  keywords: "simple interest calculator, I=PRT calculator, simple interest formula, principal rate time, interest calculation",
  alternates: { canonical: `${SITE.url}/simple-interest-calculator` },
  robots: { index: true, follow: true },
};

export default function SimpleInterestPage() {
  return (
    <FinanceToolPage
      slug="simple-interest-calculator"
      title="Simple Interest Calculator"
      cluster="Savings & Interest"
      tagline="Calculate simple interest on any principal using I = PRT, enter the amount, annual rate, and time period in years, months, or days."
      description="Free simple interest calculator using the I = PRT formula. Enter principal, annual rate, and time period (years, months, or days) to calculate interest earned or owed."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Simple Interest (I)</strong> = P × R × T</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total Amount (A)</strong> = P + I = P × (1 + R × T)</p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Where P = Principal, R = Annual Rate (decimal), T = Time in years
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-subtle)" }}>
            Time conversions: months → divide by 12 · days → divide by 365
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $10,000 at 5% for 3 years → I = $10,000 × 0.05 × 3 = <strong>$1,500</strong> · Total = $11,500
          </p>
        </>
      }
      faqs={[
        { question: "What is the difference between simple and compound interest?", answer: "Simple interest accrues only on the original principal, the interest never earns additional interest. Compound interest earns interest on both principal and accumulated interest, growing exponentially. For the same principal and rate, compound interest always produces a higher total." },
        { question: "When is simple interest used in practice?", answer: "Short-term personal loans, some auto loans, US Treasury Bills, certain savings bonds, and some mortgages (especially simple-interest mortgages). It's most common for short durations where compounding has minimal practical effect." },
        { question: "What is a simple interest mortgage?", answer: "A mortgage where interest accrues daily on the remaining principal balance rather than being calculated monthly. If you pay early in the month, less interest accrues; if you pay late, more accrues. Paying consistently on time or early saves money." },
        { question: "How do I calculate daily simple interest?", answer: "Use T = number of days ÷ 365 in the formula. For a $5,000 loan at 8% APR over 90 days: I = $5,000 × 0.08 × (90/365) = $98.63." },
        { question: "Why does compound interest grow faster than simple interest?", answer: "With compound interest, each interest payment is added to the principal, so future interest is calculated on a larger base. Over decades, this snowball effect creates a huge difference. A $10,000 at 5% for 30 years: simple = $15,000; compound monthly = $44,677." },
      ]}
    >
      <SimpleInterestClient />
    </FinanceToolPage>
  );
}
