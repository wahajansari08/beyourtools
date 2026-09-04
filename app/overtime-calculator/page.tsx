import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import OvertimeClient from "./OvertimeClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Overtime Calculator - Overtime Pay at 1.5×, 2×, or Custom Rate | BeYourTools",
  description:
    "Calculate overtime pay for any number of overtime hours at time-and-a-half (1.5×), double time, or a custom multiplier. See regular pay, overtime pay, and total pay.",
  keywords: "overtime calculator, overtime pay calculator, time and a half calculator, double time pay, overtime wages",
  alternates: { canonical: `${SITE.url}/overtime-calculator` },
  robots: { index: true, follow: true },
};

export default function OvertimePage() {
  return (
    <FinanceToolPage
      slug="overtime-calculator"
      title="Overtime Calculator"
      cluster="Salary & Income"
      tagline="Calculate regular pay, overtime pay at 1.5×, 2×, or a custom multiplier, and total pay for any pay period."
      description="Free overtime pay calculator. Enter your hourly rate, regular hours, overtime hours, and multiplier to calculate regular pay, overtime pay, and total gross pay."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Overtime Rate</strong> = Regular Rate × Multiplier</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Regular Pay</strong> = Regular Hourly Rate × Regular Hours</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Overtime Pay</strong> = Overtime Rate × Overtime Hours</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total Pay</strong> = Regular Pay + Overtime Pay</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $20/hr · 40 regular hours · 8 overtime hours at 1.5×<br />
            Regular = $800 · Overtime = $20 × 1.5 × 8 = $240 · <strong>Total = $1,040</strong>
          </p>
        </>
      }
      faqs={[
        { question: "When does overtime pay kick in?", answer: "In the US under the FLSA, non-exempt employees must receive 1.5× for hours over 40 in a workweek. Some states (California, Alaska) also require daily overtime for hours over 8. Always verify your local laws." },
        { question: "What is time and a half?", answer: "Time and a half means your overtime pay rate is 1.5 times your regular hourly rate. At $20/hr regular, your overtime rate is $30/hr. This is the US federal minimum for overtime." },
        { question: "What is double time?", answer: "Double time is 2× the regular rate. Some employers offer double time for holidays or for hours beyond a daily/weekly threshold. In California, double time applies to hours over 12 in a single day." },
        { question: "Are all employees entitled to overtime?", answer: "No. 'Exempt' employees (typically salaried workers in executive, administrative, or professional roles earning above the FLSA threshold, currently $684/week) are not entitled to overtime under federal law." },
        { question: "How do shift differentials affect overtime?", answer: "Shift differentials (extra pay for nights or weekends) are generally included in the regular rate of pay for overtime calculation purposes, raising the base from which the 1.5× is calculated." },
        { question: "Does overtime compound? (overtime on overtime)", answer: "No, overtime is always calculated on your regular base rate, not on previous overtime. The multiplier applies once to your regular hourly rate regardless of how many overtime hours you've worked." },
      ]}
    >
      <OvertimeClient />
    </FinanceToolPage>
  );
}
