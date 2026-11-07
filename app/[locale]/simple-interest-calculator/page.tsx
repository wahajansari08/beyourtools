import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SimpleInterestClient from "./SimpleInterestClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Simple Interest Calculator - Interest | BeYourTools",
  description: "Calculate simple interest earned or owed using the I = PRT formula for years, months, or days. Free tool in your browser.",
  keywords: "simple interest calculator, I=PRT calculator, simple interest formula, principal rate time, interest calculation",
  path: "/simple-interest-calculator",
});

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
        { question: "Why does compound interest grow faster than simple interest?", answer: "With compound interest, each interest payment is added to the principal, so future interest is calculated on a larger base. Over decades, this snowball effect creates a huge difference. A $10,000 balance at 5% for 30 years: simple interest is $15,000, for a $25,000 total, while monthly compounding grows it to $44,677 in total ($34,677 of it interest)." },
        { question: "Can this calculator solve for the principal, rate, or time?", answer: "No, it solves for the interest only. Rearrange the formula to find the missing value: P = I ÷ (R × T), R = I ÷ (P × T), and T = I ÷ (P × R). For example, to earn $1,500 of interest at 5% over 3 years, you need a principal of $1,500 ÷ (0.05 × 3) = $10,000. Enter that principal here to check the result." },
        { question: "How are days counted in the time period?", answer: "Days are converted with actual/365: the number of days divided by 365. There is no 360-day bank-year convention and no leap-year adjustment in this calculator. A loan quoted on a 360-day year would charge slightly more interest for the same number of days, so check the lender's day-count basis before comparing figures." },
        { question: "How does the balance grow year by year with simple interest?", answer: "In a straight line: the interest is the same every year because it is always calculated on the original principal. On $10,000 at 5%, you earn $500 in year 1, another $500 in year 2, and another $500 in year 3, so the balance goes $10,500, $11,000, $11,500. With compound interest the yearly amount would grow instead, which is why the gap between the two widens over long terms." },
      ]}
    >
      <SimpleInterestClient />
    </FinanceToolPage>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "simple-interest-calculator", __enMetadata);
}
