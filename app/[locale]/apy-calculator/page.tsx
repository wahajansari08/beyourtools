import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import ApyClient from "./ApyClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "APY Calculator - Convert APR to APY Yield | BeYourTools",
  description: "Convert APR to APY for any compounding frequency. Calculate effective annual percentage yield and interest earned in your browser.",
  keywords: "APY calculator, APR to APY, annual percentage yield, compound interest rate, effective annual rate, savings account APY",
  path: "/apy-calculator",
});

export default function ApyPage() {
  return (
    <FinanceToolPage
      slug="apy-calculator"
      title="APY Calculator"
      cluster="Savings & Interest"
      tagline="Convert any APR to its true Annual Percentage Yield (APY) by selecting the compounding frequency, and see actual interest earned on your principal."
      description="Free APY calculator. Enter an APR and compounding frequency (daily, monthly, quarterly, etc.) to find the effective APY and project interest earned on any balance."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>APY</strong> = (1 + APR/n)ⁿ − 1</p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Where n = number of compounding periods per year (365 for daily, 12 for monthly, etc.)
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> 5% APR compounded monthly → APY = (1 + 0.05/12)¹² − 1 = <strong>5.1162%</strong><br />
            5% APR compounded daily → APY = (1 + 0.05/365)³⁶⁵ − 1 = <strong>5.1267%</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is the difference between APR and APY?", answer: "APR is the stated annual rate without compounding, and it is the number used to compare loans because it includes the fees. APY accounts for compounding, interest earned on interest, and it is the number used to compare savings accounts. APY is always equal to or higher than the APR for the same stated rate. Never compare a loan APR against a savings APY: one is a cost and the other is a return." },
        { question: "Why do banks advertise APY for savings and APR for loans?", answer: "Because APY > APR when compounding occurs, banks advertise APY on savings accounts to show a higher number, and APR on loans to show a lower number. Both are legally required disclosures, but always convert to the same metric when comparing." },
        { question: "How much does compounding frequency matter in practice?", answer: "For most savings products, the difference between daily and monthly compounding is small. At 5% APR: monthly APY = 5.1162%; daily APY = 5.1267%. The difference grows with higher rates and longer time periods but is rarely the deciding factor." },
        { question: "What is the effective annual rate (EAR)?", answer: "EAR is another name for APY, the true annual return accounting for compounding. The formula is identical: EAR = (1 + r/n)ⁿ − 1. Finance textbooks use EAR; banking regulators in the US use APY." },
        { question: "How do I compare two savings accounts with different APYs?", answer: "Simply compare APYs directly, the higher APY account earns more, regardless of how the rate is compounded. APY is standardised for comparison. For identical APYs, check for fees, minimum balance requirements, and withdrawal restrictions." },
        { question: "How much interest will I earn on $10,000 at 5% APR compounded monthly?", answer: "In one year you earn $511.62, so the balance grows to $10,511.62. That is the 5.1162% APY at work: $10,000 x 1.051162 = $10,511.62. Left untouched for 5 years at the same rate, the same $10,000 earns $2,833.59 and reaches $12,833.59." },
        { question: "What is continuous compounding?", answer: "Continuous compounding is the theoretical limit where interest is added constantly rather than daily or monthly. Its APY is e to the power of the rate, minus 1. At 5% APR that gives 5.1271%, only a fraction above the 5.1267% you get from daily compounding, so no real account can beat it by much." },
        { question: "How do I work out APY from interest I actually earned?", answer: "For a full year, divide the interest earned by the starting balance and multiply by 100. If $5,000 earned $204.04 in a year, the APY is $204.04 / $5,000 x 100 = 4.0808%. That matches a 4% APR compounded daily. For a shorter term, annualise the result by the number of days the money was invested." },
        { question: "Where can I read more about APR vs APY?", answer: "See the guide APR vs APY: What's the Difference and Which One Should You Compare? at beyourtools.com/blog/apr-vs-apy. It works through both formulas with real numbers, including the full $10,000 at 5% compounding table and a credit card example at the current average APR." },
      ]}
    >
      <ApyClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "apy-calculator", __enMetadata);
}
