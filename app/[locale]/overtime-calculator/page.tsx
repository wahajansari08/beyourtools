import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import OvertimeClient from "./OvertimeClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Overtime Calculator - Time and a Half Pay | BeYourTools",
  description: "Calculate overtime pay at 1.5x, double time, or custom rates, with regular pay and total gross pay. Free overtime calculator in your browser.",
  keywords: "overtime calculator, overtime pay calculator, time and a half calculator, double time pay, overtime wages, how to calculate overtime pay",
  path: "/overtime-calculator",
});

export default function OvertimePage() {
  return (
    <FinanceToolPage
      slug="overtime-calculator"
      title="Overtime Calculator"
      cluster="Salary & Income"
      tagline="Calculate regular pay, overtime pay at 1.5×, 2×, or a custom multiplier, and total pay for any pay period, with the overtime premium shown separately."
      description="Free overtime pay calculator. Enter your hourly rate, regular hours, overtime hours, and multiplier to calculate regular pay, overtime pay, and total gross pay. The premium, the extra half above straight time, is the part that rewards the extra hours."
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
        { question: "Do overtime hours reset every week?", answer: "Yes. Each workweek stands alone, and hours do not average across weeks. Someone working 35 hours one week and 45 the next earns overtime only in the second week, for the 5 hours above 40." },
        { question: "Is overtime pay the full 1.5x rate, or only the extra half?", answer: "The overtime hours themselves are paid at the full 1.5x rate. At $20 an hour, 8 overtime hours pay $240 in total, of which $160 is straight-time value and $80 is the extra half premium. This calculator shows the full overtime pay, not just the premium." },
        { question: "How do I calculate overtime from a salary?", answer: "Convert the salary to an hourly rate first: divide by hours per week and weeks per year. A $52,000 salary on a 40-hour week is $25 an hour, so the time-and-a-half rate is $37.50. Use the Salary to Hourly Calculator for the conversion, then enter the rate here." },
      ]}
    >
      <OvertimeClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "overtime-calculator", __enMetadata);
}
