/**
 * Finance Tools configuration - all 40 tools, 7 clusters.
 * Used by the hub page, cluster pages, sitemap, search index, and related-tools components.
 */

export type FinanceCluster =
  | "Business Finance"
  | "Salary & Income"
  | "Loans"
  | "Debt & Credit"
  | "Savings & Interest"
  | "Tax & Pricing"
  | "Marketing & ROI";

export interface FinanceTool {
  slug: string;
  name: string;
  description: string;
  cluster: FinanceCluster;
  icon: string;
  keywords: string[];
}

export const financeTools: FinanceTool[] = [
  // ── Business Finance ──────────────────────────────────────────────────────
  {
    slug: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    description: "Calculate gross, operating, or net profit margin as a percentage of revenue.",
    cluster: "Business Finance",
    icon: "📈",
    keywords: ["profit margin", "gross margin", "net margin", "profitability", "revenue"],
  },
  {
    slug: "markup-calculator",
    name: "Markup Calculator",
    description: "Find the markup percentage or selling price needed to achieve your target margin.",
    cluster: "Business Finance",
    icon: "🏷️",
    keywords: ["markup", "selling price", "cost", "margin", "pricing"],
  },
  {
    slug: "break-even-calculator",
    name: "Break-Even Calculator",
    description: "Determine how many units you must sell to cover fixed and variable costs.",
    cluster: "Business Finance",
    icon: "⚖️",
    keywords: ["break even", "fixed costs", "variable costs", "units", "contribution margin"],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    description: "Calculate the discounted price, savings amount, and discount percentage for any item.",
    cluster: "Business Finance",
    icon: "🎟️",
    keywords: ["discount", "sale price", "savings", "percent off", "original price"],
  },
  {
    slug: "commission-calculator",
    name: "Commission Calculator",
    description: "Compute sales commission earnings based on rate, sales amount, or tiered structures.",
    cluster: "Business Finance",
    icon: "💼",
    keywords: ["commission", "sales", "earnings", "rate", "tiered"],
  },
  {
    slug: "gross-profit-calculator",
    name: "Gross Profit Calculator",
    description: "Calculate gross profit and gross margin from revenue and cost of goods sold.",
    cluster: "Business Finance",
    icon: "💰",
    keywords: ["gross profit", "cogs", "cost of goods", "revenue", "gross margin"],
  },
  {
    slug: "net-profit-calculator",
    name: "Net Profit Calculator",
    description: "Find net profit after subtracting all costs, expenses, and taxes from total revenue.",
    cluster: "Business Finance",
    icon: "🧾",
    keywords: ["net profit", "net income", "expenses", "taxes", "bottom line"],
  },
  {
    slug: "operating-margin-calculator",
    name: "Operating Margin Calculator",
    description: "Calculate operating margin (EBIT margin) from revenue and operating expenses.",
    cluster: "Business Finance",
    icon: "📊",
    keywords: ["operating margin", "ebit", "operating income", "revenue", "expenses"],
  },
  {
    slug: "business-margin-calculator",
    name: "Business Margin Calculator",
    description: "Compare gross, operating, and net margins side-by-side for a complete profitability picture.",
    cluster: "Business Finance",
    icon: "🗂️",
    keywords: ["business margin", "profitability", "gross", "operating", "net"],
  },

  // ── Salary & Income ───────────────────────────────────────────────────────
  {
    slug: "hourly-to-salary-calculator",
    name: "Hourly to Salary Calculator",
    description: "Convert an hourly wage to annual, monthly, bi-weekly, and weekly salary equivalents.",
    cluster: "Salary & Income",
    icon: "🕐",
    keywords: ["hourly to salary", "annual salary", "hourly wage", "income", "convert"],
  },
  {
    slug: "salary-to-hourly-calculator",
    name: "Salary to Hourly Calculator",
    description: "Convert an annual salary to an equivalent hourly rate based on hours worked per week.",
    cluster: "Salary & Income",
    icon: "💵",
    keywords: ["salary to hourly", "hourly rate", "annual salary", "income", "convert"],
  },
  {
    slug: "overtime-calculator",
    name: "Overtime Calculator",
    description: "Calculate overtime pay for regular and overtime hours at 1.5× or custom multipliers.",
    cluster: "Salary & Income",
    icon: "⏱️",
    keywords: ["overtime", "overtime pay", "time and a half", "hourly", "payroll"],
  },
  {
    slug: "pay-raise-calculator",
    name: "Pay Raise Calculator",
    description: "Find out how much a pay raise is worth annually, monthly, or per paycheck.",
    cluster: "Salary & Income",
    icon: "📤",
    keywords: ["pay raise", "salary increase", "raise percentage", "income", "annual"],
  },
  {
    slug: "paycheck-calculator",
    name: "Paycheck Calculator",
    description: "Estimate your take-home pay after federal and state taxes, FICA, and deductions.",
    cluster: "Salary & Income",
    icon: "📋",
    keywords: ["paycheck", "take home pay", "net pay", "taxes", "deductions"],
  },
  {
    slug: "freelance-rate-calculator",
    name: "Freelance Rate Calculator",
    description: "Calculate a sustainable hourly freelance rate based on desired income, hours, and expenses.",
    cluster: "Salary & Income",
    icon: "🧑‍💻",
    keywords: ["freelance rate", "hourly rate", "self employed", "income", "expenses"],
  },
  {
    slug: "hourly-rate-calculator",
    name: "Hourly Rate Calculator",
    description: "Determine the minimum hourly rate needed to meet your income goals and cover all costs.",
    cluster: "Salary & Income",
    icon: "⌚",
    keywords: ["hourly rate", "minimum rate", "income goal", "cost", "self employed"],
  },

  // ── Loans ─────────────────────────────────────────────────────────────────
  {
    slug: "loan-payment-calculator",
    name: "Loan Payment Calculator",
    description: "Calculate monthly loan payments for any principal, interest rate, and loan term.",
    cluster: "Loans",
    icon: "🏦",
    keywords: ["loan payment", "monthly payment", "principal", "interest rate", "term"],
  },
  {
    slug: "loan-interest-calculator",
    name: "Loan Interest Calculator",
    description: "Find out the total interest paid over the life of a loan with full amortization detail.",
    cluster: "Loans",
    icon: "💹",
    keywords: ["loan interest", "total interest", "amortization", "principal", "rate"],
  },
  {
    slug: "loan-payoff-calculator",
    name: "Loan Payoff Calculator",
    description: "See how long it takes to pay off a loan and the total cost at your current payment.",
    cluster: "Loans",
    icon: "🔓",
    keywords: ["loan payoff", "payoff date", "remaining balance", "payment", "total cost"],
  },
  {
    slug: "extra-payment-loan-calculator",
    name: "Extra Payment Loan Calculator",
    description: "Calculate how extra monthly or lump-sum payments reduce your loan term and total interest.",
    cluster: "Loans",
    icon: "➕",
    keywords: ["extra payment", "loan", "overpayment", "interest saved", "early payoff"],
  },
  {
    slug: "loan-amortization-calculator",
    name: "Loan Amortization Calculator",
    description: "Generate a full month-by-month amortization schedule for any loan.",
    cluster: "Loans",
    icon: "📅",
    keywords: ["amortization", "schedule", "loan", "principal", "interest breakdown"],
  },

  // ── Debt & Credit ─────────────────────────────────────────────────────────
  {
    slug: "debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    description: "Calculate how long it takes to pay off multiple debts and the total interest cost.",
    cluster: "Debt & Credit",
    icon: "🗑️",
    keywords: ["debt payoff", "multiple debts", "payoff time", "interest", "minimum payment"],
  },
  {
    slug: "debt-snowball-calculator",
    name: "Debt Snowball Calculator",
    description: "Use the debt snowball method - pay smallest balances first to build momentum.",
    cluster: "Debt & Credit",
    icon: "⛄",
    keywords: ["debt snowball", "smallest balance", "payoff order", "debt free", "method"],
  },
  {
    slug: "debt-avalanche-calculator",
    name: "Debt Avalanche Calculator",
    description: "Use the debt avalanche method - target highest-interest debts first to minimize total cost.",
    cluster: "Debt & Credit",
    icon: "🏔️",
    keywords: ["debt avalanche", "highest interest", "payoff order", "save money", "method"],
  },
  {
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    description: "Find out how long it takes to pay off your credit card balance and total interest paid.",
    cluster: "Debt & Credit",
    icon: "💳",
    keywords: ["credit card payoff", "balance", "interest", "minimum payment", "payoff time"],
  },
  {
    slug: "credit-card-minimum-payment-calculator",
    name: "Credit Card Minimum Payment Calculator",
    description: "See the true cost of only making minimum payments on your credit card over time.",
    cluster: "Debt & Credit",
    icon: "📉",
    keywords: ["minimum payment", "credit card", "interest", "payoff years", "cost"],
  },
  {
    slug: "debt-to-income-calculator",
    name: "Debt-to-Income Calculator",
    description: "Calculate your debt-to-income (DTI) ratio to understand your borrowing capacity.",
    cluster: "Debt & Credit",
    icon: "📐",
    keywords: ["debt to income", "dti", "ratio", "monthly debt", "gross income"],
  },

  // ── Savings & Interest ────────────────────────────────────────────────────
  {
    slug: "savings-calculator",
    name: "Savings Calculator",
    description: "Project how your savings grow with regular contributions and compound interest over time.",
    cluster: "Savings & Interest",
    icon: "🐷",
    keywords: ["savings", "compound interest", "contributions", "balance", "growth"],
  },
  {
    slug: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    description: "Find out how much to save each month to reach a specific financial goal by a target date.",
    cluster: "Savings & Interest",
    icon: "🎯",
    keywords: ["savings goal", "monthly savings", "target", "future value", "deadline"],
  },
  {
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    description: "Calculate simple interest earned or owed on any principal, rate, and time period.",
    cluster: "Savings & Interest",
    icon: "🧮",
    keywords: ["simple interest", "principal", "rate", "time", "interest formula"],
  },
  {
    slug: "apy-calculator",
    name: "APY Calculator",
    description: "Convert an annual percentage rate (APR) to annual percentage yield (APY) with compounding.",
    cluster: "Savings & Interest",
    icon: "📆",
    keywords: ["apy", "annual percentage yield", "compounding", "apr", "effective rate"],
  },
  {
    slug: "apr-calculator",
    name: "APR Calculator",
    description: "Calculate the true annual percentage rate (APR) of a loan including fees and charges.",
    cluster: "Savings & Interest",
    icon: "🔢",
    keywords: ["apr", "annual percentage rate", "loan", "fees", "true cost"],
  },

  // ── Tax & Pricing ─────────────────────────────────────────────────────────
  {
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    description: "Add or remove sales tax from any price and find the pre-tax or post-tax amount.",
    cluster: "Tax & Pricing",
    icon: "🧾",
    keywords: ["sales tax", "tax rate", "pre-tax", "post-tax", "price"],
  },
  {
    slug: "price-after-discount-calculator",
    name: "Price After Discount Calculator",
    description: "Quickly find the final price after applying a percentage or fixed-amount discount.",
    cluster: "Tax & Pricing",
    icon: "🏷️",
    keywords: ["price after discount", "final price", "discount", "sale", "savings"],
  },
  {
    slug: "tax-inclusive-price-calculator",
    name: "Tax-Inclusive Price Calculator",
    description: "Calculate the price with tax already included (tax-inclusive / gross price) from a net price.",
    cluster: "Tax & Pricing",
    icon: "➕",
    keywords: ["tax inclusive", "gross price", "vat included", "price with tax", "tax"],
  },
  {
    slug: "tax-exclusive-price-calculator",
    name: "Tax-Exclusive Price Calculator",
    description: "Remove tax from a tax-inclusive price to find the original net (tax-exclusive) price.",
    cluster: "Tax & Pricing",
    icon: "➖",
    keywords: ["tax exclusive", "net price", "remove tax", "vat exclusive", "pre-tax price"],
  },

  // ── Marketing & ROI ───────────────────────────────────────────────────────
  {
    slug: "roi-calculator",
    name: "ROI Calculator",
    description: "Calculate return on investment (ROI) percentage and net gain for any investment.",
    cluster: "Marketing & ROI",
    icon: "💡",
    keywords: ["roi", "return on investment", "gain", "cost", "percentage"],
  },
  {
    slug: "roas-calculator",
    name: "ROAS Calculator",
    description: "Calculate return on ad spend (ROAS) to measure advertising campaign efficiency.",
    cluster: "Marketing & ROI",
    icon: "📣",
    keywords: ["roas", "return on ad spend", "advertising", "revenue", "ad cost"],
  },
  {
    slug: "cash-flow-calculator",
    name: "Cash Flow Calculator",
    description: "Calculate net cash flow from operating, investing, and financing activity totals.",
    cluster: "Marketing & ROI",
    icon: "💸",
    keywords: ["cash flow", "net cash flow", "operating", "investing", "financing"],
  },
  {
    slug: "revenue-growth-calculator",
    name: "Revenue Growth Calculator",
    description: "Calculate year-over-year or period-over-period revenue growth rate as a percentage.",
    cluster: "Marketing & ROI",
    icon: "🚀",
    keywords: ["revenue growth", "growth rate", "yoy", "period", "percentage"],
  },
];

// ── Clusters ──────────────────────────────────────────────────────────────────

export const financeClusters: FinanceCluster[] = [
  "Business Finance",
  "Salary & Income",
  "Loans",
  "Debt & Credit",
  "Savings & Interest",
  "Tax & Pricing",
  "Marketing & ROI",
];

/** Slug for each cluster's dedicated page */
export const clusterSlugs: Record<FinanceCluster, string> = {
  "Business Finance":    "business-finance-calculators",
  "Salary & Income":     "salary-income-calculators",
  "Loans":               "loan-calculators",
  "Debt & Credit":       "debt-credit-calculators",
  "Savings & Interest":  "savings-interest-calculators",
  "Tax & Pricing":       "tax-pricing-calculators",
  "Marketing & ROI":     "marketing-roi-calculators",
};

/** Short description for each cluster's card on the hub page */
export const clusterDescriptions: Record<FinanceCluster, string> = {
  "Business Finance":    "Profit margins, markup, break-even, and business cost analysis.",
  "Salary & Income":     "Hourly/salary conversions, overtime, paycheck, and freelance rate tools.",
  "Loans":               "Monthly payments, amortization schedules, interest costs, and payoff timelines.",
  "Debt & Credit":       "Debt snowball, avalanche, credit card payoff, and debt-to-income ratio.",
  "Savings & Interest":  "Compound savings projections, savings goals, APY, APR, and simple interest.",
  "Tax & Pricing":       "Sales tax, discounts, tax-inclusive/exclusive prices, and pricing tools.",
  "Marketing & ROI":     "ROI, ROAS, cash flow, revenue growth, and profitability metrics.",
};

export const clusterIcons: Record<FinanceCluster, string> = {
  "Business Finance":   "📈",
  "Salary & Income":    "💵",
  "Loans":              "🏦",
  "Debt & Credit":      "💳",
  "Savings & Interest": "🐷",
  "Tax & Pricing":      "🧾",
  "Marketing & ROI":    "🚀",
};

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export function getFinanceTool(slug: string): FinanceTool | undefined {
  return financeTools.find((t) => t.slug === slug);
}

export function toolsByCluster(cluster: FinanceCluster): FinanceTool[] {
  return financeTools.filter((t) => t.cluster === cluster);
}

export function relatedFinanceTools(slug: string, max = 6): FinanceTool[] {
  const tool = getFinanceTool(slug);
  if (!tool) return [];
  // Same cluster first, then other clusters
  const sameCluster = financeTools.filter(
    (t) => t.cluster === tool.cluster && t.slug !== slug
  );
  if (sameCluster.length >= max) return sameCluster.slice(0, max);
  const others = financeTools.filter(
    (t) => t.cluster !== tool.cluster && t.slug !== slug
  );
  return [...sameCluster, ...others].slice(0, max);
}
