import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import PaycheckClient from "./PaycheckClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Paycheck Calculator - Estimate Take-Home Pay After Tax | BeYourTools",
  description:
    "Estimate your take-home pay after federal and state income tax, Social Security, Medicare, 401(k), and health insurance deductions. Free US paycheck calculator.",
  keywords: "paycheck calculator, take home pay calculator, net pay calculator, after tax pay, FICA calculator, salary after tax",
  alternates: { canonical: `${SITE.url}/paycheck-calculator` },
  robots: { index: true, follow: true },
};

export default function PaycheckPage() {
  return (
    <FinanceToolPage
      slug="paycheck-calculator"
      title="Paycheck Calculator"
      cluster="Salary & Income"
      tagline="Estimate your take-home pay after federal and state taxes, FICA (Social Security + Medicare), 401(k) contributions, and other deductions."
      description="Free US paycheck calculator. Enter annual salary, pay period, state tax rate, and deductions to estimate net take-home pay per paycheck. Uses 2024 federal tax brackets."
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
      ]}
    >
      <PaycheckClient />
    </FinanceToolPage>
  );
}
