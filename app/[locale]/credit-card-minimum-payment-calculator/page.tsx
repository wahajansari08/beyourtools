import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import MinPaymentClient from "./MinPaymentClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Credit Card Minimum Payment Calculator | BeYourTools",
  description: "See the true cost of making minimum payments on your credit card. Calculate payoff time and total interest in your browser.",
  keywords: "credit card minimum payment calculator, minimum payment interest, how long to pay off credit card minimums, credit card cost",
  path: "/credit-card-minimum-payment-calculator",
});

export default function MinPaymentPage() {
  return (
    <FinanceToolPage
      slug="credit-card-minimum-payment-calculator"
      title="Credit Card Minimum Payment Calculator"
      cluster="Debt & Credit"
      tagline="Discover the true cost of only making minimum payments, how many years you'll be paying and how much total interest you'll hand to the credit card company."
      description="Free credit card minimum payment calculator. Enter balance and APR to see how long minimum-only payments take to clear the card and the total interest cost."
      formulaExplanation={
        <>
          <p>Most credit card minimum payments = <strong style={{ color: "var(--text-secondary)" }}>Max(% of Balance, Floor Amount)</strong></p>
          <p>Each month: Monthly Interest = Balance × (APR ÷ 12); New Balance = Balance + Interest − Minimum Payment</p>
          <p>Because minimum payments shrink as the balance shrinks, the payoff period is very long, the balance declines slowly and interest consumes most of each payment.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $5,000 at 18% APR · 2% minimum (floor $25)<br />
            First min = $101.50 → as balance drops, minimums shrink → <strong>payoff takes 29.5 years</strong>, total interest about $11,689
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-subtle)" }}>
            At a higher APR the same 2% minimum barely covers the monthly interest: $5,000 at 22.99% shrinks so slowly that the calculator runs past its 100 year simulation and reports the balance never decreases.
          </p>
        </>
      }
      faqs={[
        { question: "Why do minimum payments take so long to pay off a balance?", answer: "Minimum payments are calculated as a small percentage of the current balance. As the balance shrinks, so does the minimum, but because the balance shrinks slowly (most of each payment goes to interest), it can take decades to reach zero." },
        { question: "What is the typical credit card minimum payment?", answer: "Most issuers charge the greater of: 1–3% of the current balance, or a flat minimum (usually $25–$35), or the interest charge plus $1. The exact formula varies by card, check your cardmember agreement." },
        { question: "How much do I need to pay to clear my card in 3 years?", answer: "Use the Credit Card Payoff Calculator with your balance and APR, then trial different payment amounts until payoff time = 36 months. For a $5,000 balance at 21% APR, about $189/month pays it off in 3 years. Paying $180/month instead takes 39 months, so a small change in the payment moves the payoff date by months." },
        { question: "Is making minimum payments ever acceptable?", answer: "Temporarily, during genuine financial hardship where cash flow is critical. Long-term, minimums are extremely costly and should be increased as soon as possible. Even an extra $25–50/month makes a significant difference." },
        { question: "How do balance transfers affect minimum payments?", answer: "A 0% promotional balance transfer eliminates the interest component, so minimum payments go almost entirely to principal, dramatically accelerating payoff during the promo period. Always pay enough to clear the balance before the promo ends." },
        { question: "Why does the calculator say my balance never decreases?", answer: "At a high APR, a small percentage minimum barely exceeds the monthly interest, so almost nothing goes to principal. On $5,000 at 22.99% APR, the first month's interest is $95.79 and the first 2% minimum is $101.92, so only about $6 of that payment reduces the balance. The calculator simulates up to 100 years and reports the balance never decreases when it cannot finish in that time. Raise the minimum percentage or the floor amount and the payoff appears." },
        { question: "How much faster is a fixed payment than minimum-only?", answer: "Dramatically faster. On $5,000 at 22.99% APR, a fixed $200/month clears the card in 35 months with $1,871 of interest, and a fixed $150/month takes 54 months with $3,045 of interest. The same balance on 2% minimums never pays off within the calculator's 100 year simulation, because the minimum shrinks as the balance shrinks. Use the fixed amount mode on this page to compare the two for your own balance." },
        { question: "What minimum payment formula do card issuers actually use?", answer: "The most common US formula is the monthly interest charge plus 1% of the balance, with a floor of about $25 to $40. Other issuers charge 2 to 3% of the balance, or the interest charge plus $1. This calculator models a percentage of the balance with a floor, or a fixed monthly amount, so it cannot reproduce the interest plus 1% formula exactly. Treat the result as an estimate and check your cardmember agreement for your card's exact formula." },
      ]}
    >
      <MinPaymentClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "credit-card-minimum-payment-calculator", __enMetadata);
}
