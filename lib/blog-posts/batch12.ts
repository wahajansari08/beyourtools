import type { BlogPost } from "@/lib/blog";

export const batch12: BlogPost[] = [
  {
    slug: "how-to-calculate-percentage-guide",
    title: "How to Calculate Percentage: The Complete Guide with Real Examples",
    seoTitle: "How to Calculate Percentage — Formulas & Examples",
    excerpt:
      "Percentages run your wallet, your grades, and your salary slips — yet most of us google the formula every single time. Here are the only three formulas you'll ever need, with examples that actually happen in real life.",
    author: "Be",
    publishedAt: "2026-10-18",
    readingTime: 7,
    category: "Finance",
    tags: ["Percentage", "Calculator", "Math", "Finance"],
    content: `<p>Let's be honest: almost everyone looks up the percentage formula more than once. A shop shows "30% off", your exam result says 425 out of 500, your boss mentions a "12% raise" — and for a split second your brain stalls.</p>
<p>This guide fixes that. There are really only three percentage calculations you'll ever meet in daily life. Learn them once, with examples that actually happen to you, and you'll never need to search again. And if you're in a hurry, our <a href="/percentage-calculator">Percentage Calculator</a> does all of this instantly.</p>

<h2>The one master formula</h2>
<p>Every percentage problem is a version of this:</p>
<p><strong>Percentage = (Part ÷ Whole) × 100</strong></p>
<p>That's it. The "part" is the piece you care about, the "whole" is the total it comes from. Multiply by 100 to turn the decimal into a percentage. All three cases below are just this formula rearranged.</p>

<h2>Case 1: Finding a percentage of a number</h2>
<p><strong>Formula:</strong> (Percentage ÷ 100) × Number</p>
<p>This is the discount question. A jacket costs $80 and there's a 25% sale. How much do you save?</p>
<p>(25 ÷ 100) × 80 = 0.25 × 80 = <strong>$20 off</strong>, so you pay $60.</p>
<p>Quick mental trick: find 10% first (move the decimal one place left — 10% of $80 is $8), then scale. 25% is two-and-a-half 10%s: $8 + $8 + $4 = $20. Works for tips too: 10% of a $46 bill is $4.60, so a 20% tip is $9.20.</p>

<h2>Case 2: What percent is one number of another?</h2>
<p><strong>Formula:</strong> (Part ÷ Whole) × 100</p>
<p>This is the exam-marks question. You scored 425 out of 500. What percentage is that?</p>
<p>(425 ÷ 500) × 100 = 0.85 × 100 = <strong>85%</strong>.</p>
<p>Same pattern for battery levels, project completion, or savings goals: $1,200 saved toward a $5,000 target is (1200 ÷ 5000) × 100 = <strong>24%</strong> of the way there.</p>

<h2>Case 3: Percentage increase or decrease</h2>
<p><strong>Formula:</strong> ((New − Old) ÷ Old) × 100</p>
<p>This is the salary-hike and price-change question. Your salary goes from $50,000 to $56,000. What's the raise?</p>
<p>((56000 − 50000) ÷ 50000) × 100 = (6000 ÷ 50000) × 100 = <strong>12% raise</strong>.</p>
<p>The result is negative for decreases, which is exactly what you want: a stock dropping from $40 to $32 is ((32 − 40) ÷ 40) × 100 = <strong>−20%</strong>. The minus sign tells you the direction.</p>

<h2>Working backwards: finding the whole</h2>
<p>Sometimes you know the part and the percent but not the total. "30 is 15% of what number?"</p>
<p><strong>Formula:</strong> Whole = Part ÷ (Percentage ÷ 100)</p>
<p>30 ÷ 0.15 = <strong>200</strong>. Check: 15% of 200 is indeed 30. This one comes up with taxes ("I paid $45 in tax at a 9% rate — what was the pre-tax price?": 45 ÷ 0.09 = $500) and with grades ("I need 80% overall and this test is worth…").</p>

<h2>The trap everyone falls into: percentage points vs percent</h2>
<p>If interest rates move from 5% to 7%, that's a <strong>2 percentage point</strong> increase — but a <strong>40% increase</strong> in the rate itself ((7−5) ÷ 5 × 100). News headlines mix these up constantly. When someone says "up 20%", always ask: 20% of what?</p>
<p>Related mistake: adding percentages that don't share a base. A 20% discount followed by another 20% discount is not 40% off — it's 36% off (0.8 × 0.8 = 0.64, so you pay 64%). Each discount applies to a smaller number.</p>

<h2>When to just use the calculator</h2>
<p>No shame in it — that's what tools are for. If the numbers are ugly (a 17.5% service charge on $1,348.90), or you need several of these in a row (comparing three loan offers, splitting a bill six ways), open our <a href="/percentage-calculator">Percentage Calculator</a> and let it do the arithmetic. It handles all three cases above plus percentage change, in your browser, free, no signup.</p>
<p>Knowing the formulas still matters, though: it tells you which button to press, and it lets you smell-check the answer. If the calculator says your 10% discount saved you more than the item cost, the formula in your head catches the typo.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>What is the basic percentage formula?</dt>
<dd>Percentage = (Part ÷ Whole) × 100. For example, to find what percent 30 is of 150: (30 ÷ 150) × 100 = 20%.</dd>
<dt>How do I calculate percentage increase?</dt>
<dd>Use ((New − Old) ÷ Old) × 100. A price rising from $40 to $50 is ((50 − 40) ÷ 40) × 100 = 25% increase. Try it on our <a href="/percentage-calculator">Percentage Calculator</a>.</dd>
<dt>How do I find a percentage of a number quickly?</dt>
<dd>Convert the percent to a decimal and multiply. 20% of 500 = 0.20 × 500 = 100. For mental math, find 10% first (move the decimal one place) and scale from there.</dd>
<dt>What is the difference between percent and percentage points?</dt>
<dd>A move from 5% to 7% is 2 percentage points, but a 40% relative increase in the rate. "Percentage points" measures the absolute gap; "percent" measures the relative change.</dd>
<dt>Can I calculate percentages without a calculator?</dt>
<dd>Yes, for round numbers — the 10% trick handles most everyday cases (discounts, tips, rough grades). For exact figures with messy decimals, use the <a href="/percentage-calculator">Percentage Calculator</a> to avoid arithmetic slips.</dd>
</dl>
</section>`,
  },
];
