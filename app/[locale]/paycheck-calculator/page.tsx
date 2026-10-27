import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import PaycheckClient from "./PaycheckClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Paycheck Calculator - Take-Home Pay After Tax | BeYourTools",
  description: "Estimate take-home pay after federal and state taxes, Social Security, Medicare, and deductions, with per-paycheck and annual figures. Free paycheck calculator.",
  keywords: "paycheck calculator, take home pay calculator, net pay calculator, after tax pay, FICA calculator, salary after tax, paycheck breakdown",
  path: "/paycheck-calculator",
});

export default function PaycheckPage() {
  return (
    <FinanceToolPage
      slug="paycheck-calculator"
      title="Paycheck Calculator"
      cluster="Salary & Income"
      tagline="Estimate your take-home pay after federal and state taxes, FICA (Social Security + Medicare), 401(k) contributions, and other deductions, line by line."
      description="Free US paycheck calculator. Enter annual salary, pay period, state tax rate, and deductions to estimate net take-home pay per paycheck. Uses 2024 federal tax brackets. Results show gross pay, each tax line, and net pay per paycheck and per year."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Paycheck</strong> = Annual Salary ÷ Pay Periods per Year</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Federal Income Tax</strong>, applied using 2024 progressive brackets (10% – 37%) on taxable annual income</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Social Security</strong> = Gross × 6.2% (up to $160,200 wage base)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Medicare</strong> = Gross × 1.45%</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Pay</strong> = Gross − Federal Tax − State Tax − FICA − Pre-tax Deductions − Other</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            Pre-tax deductions (401k, health insurance) reduce taxable income before federal and state tax is applied. Results are estimates, actual withholding depends on your W-4 and filing status.
          </p>
        </>
      }
      faqs={[
        { question: "What is FICA?", answer: "FICA (Federal Insurance Contributions Act) covers Social Security (6.2% up to the wage base) and Medicare (1.45%). Your employer matches these amounts. Together the employee share is 7.65% of gross wages." },
        { question: "How does a 401(k) contribution reduce taxes?", answer: "Traditional 401(k) contributions are made pre-tax, reducing your federally taxable income. A 6% contribution on a $70,000 salary reduces taxable income by $4,200, saving roughly $924 in federal tax at the 22% bracket." },
        { question: "Why are state taxes not calculated automatically?", answer: "State tax rates, brackets, and rules vary enormously, from 0% in states like Texas and Florida to over 13% in California. Enter your effective or marginal state rate for a reasonable estimate." },
        { question: "What is the difference between bi-weekly and semi-monthly pay?", answer: "Bi-weekly = paid every two weeks, 26 paychecks per year. Semi-monthly = paid twice a month on fixed dates (e.g. 1st and 15th), 24 paychecks per year. Annual gross is the same; per-paycheck amounts differ." },
        { question: "Why is this an estimate?", answer: "Actual withholding depends on your W-4 allowances, filing status, additional income, itemised deductions, and credits. This calculator uses standard 2024 single-filer brackets as a planning approximation." },
        { question: "How do I increase my take-home pay?", answer: "Increase pre-tax deductions (higher 401k contribution, HSA, FSA), adjust W-4 withholding if you consistently get large refunds, or reduce state tax liability through deductions available in your state." },
        { question: "How much of my paycheck goes to FICA?", answer: "The employee share is 7.65% of gross wages: 6.2% Social Security plus 1.45% Medicare. On a $60,000 salary that is $3,720 Social Security and $870 Medicare, $4,590 in total, before any income tax." },
        { question: "Why is my take-home pay only 70 to 85% of my gross pay?", answer: "Federal income tax, state tax, and FICA are withheld before the money reaches you, and pre-tax deductions like health premiums come out too. The exact share depends on income, state, and filing status, which is why two people on the same salary can take home different amounts." },
        { question: "Does a 401(k) contribution reduce Social Security and Medicare tax?", answer: "No. Traditional 401(k) contributions lower federal and state income tax, but Social Security and Medicare are still charged on your full gross wages. Health, HSA, and FSA premiums are different: they lower both income tax and FICA." },
      ]}
    >
      <PaycheckClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "paycheck-calculator", __enMetadata);
}
