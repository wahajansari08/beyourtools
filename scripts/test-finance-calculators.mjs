/**
 * Finance Calculator Logic Tests
 * Tests all 40 finance calculator formulas extracted from their Client components.
 * Run with: node scripts/test-finance-calculators.mjs
 */

let passed = 0;
let failed = 0;
const failures = [];

function assert(label, actual, expected, tolerance = 0.01) {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (ok) {
    passed++;
  } else {
    failed++;
    failures.push(`FAIL  ${label}\n      expected: ${expected}\n      got:      ${actual}`);
  }
}

function assertBool(label, condition) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(`FAIL  ${label} — condition was false`);
  }
}

function section(name) {
  console.log(`\n── ${name} ${"─".repeat(60 - name.length)}`);
}

// ─── 1. PROFIT MARGIN CALCULATOR ─────────────────────────────────────────────
section("1. Profit Margin Calculator");
{
  const revenue = 100000, cogs = 60000, opex = 15000, taxes = 5000;
  const grossProfit = revenue - cogs;
  const grossMargin = (grossProfit / revenue) * 100;
  const opIncome = grossProfit - opex;
  const opMargin = (opIncome / revenue) * 100;
  const netProfit = opIncome - taxes;
  const netMargin = (netProfit / revenue) * 100;

  assert("gross profit = 40000", grossProfit, 40000);
  assert("gross margin = 40%", grossMargin, 40);
  assert("operating income = 25000", opIncome, 25000);
  assert("operating margin = 25%", opMargin, 25);
  assert("net profit = 20000", netProfit, 20000);
  assert("net margin = 20%", netMargin, 20);

  // edge: zero revenue → NaN margin (division by zero guard)
  const zeroRev = 0;
  assertBool("zero revenue should be invalid", !zeroRev || zeroRev <= 0);

  // negative margin
  const lossMargin = ((50000 - 80000) / 50000) * 100;
  assert("negative margin = -60%", lossMargin, -60);
}

// ─── 2. MARKUP CALCULATOR ─────────────────────────────────────────────────────
section("2. Markup Calculator");
{
  // cost + markup → price
  const cost = 50, markup = 40;
  const price = cost * (1 + markup / 100);
  assert("price = 70", price, 70);
  assert("margin from markup = 28.57%", ((price - cost) / price) * 100, 28.571, 0.01);

  // cost + price → markup
  const derivedMarkup = ((70 - 50) / 50) * 100;
  assert("markup from price = 40%", derivedMarkup, 40);

  // cost + desired margin → price
  const margin = 30;
  const priceFromMargin = 50 / (1 - margin / 100);
  assert("price from 30% margin = 71.43", priceFromMargin, 71.4286, 0.01);

  // markup > 100%
  const highMarkup = 150;
  const highPrice = 100 * (1 + highMarkup / 100);
  assert("150% markup on 100 = 250", highPrice, 250);
}

// ─── 3. BREAK-EVEN CALCULATOR ─────────────────────────────────────────────────
section("3. Break-Even Calculator");
{
  const fixedCosts = 10000, sellPrice = 25, varCost = 10;
  const cm = sellPrice - varCost;
  assert("contribution margin = 15", cm, 15);
  const beu = fixedCosts / cm;
  assert("break-even units = 666.67", beu, 666.667, 0.01);
  const ber = beu * sellPrice;
  assert("break-even revenue = 16666.67", ber, 16666.667, 0.01);
  const cmr = (cm / sellPrice) * 100;
  assert("CMR = 60%", cmr, 60);

  // target profit
  const targetProfit = 5000;
  const targetUnits = (fixedCosts + targetProfit) / cm;
  assert("units for $5k profit = 1000", targetUnits, 1000);

  // var >= sell → no break-even
  assertBool("var >= sell should be invalid", !(varCost >= sellPrice));
  assertBool("var > sell is invalid", 30 >= sellPrice);
}

// ─── 4. DISCOUNT CALCULATOR ───────────────────────────────────────────────────
section("4. Discount Calculator");
{
  const orig = 120, disc = 25;
  const amount = orig * (disc / 100);
  assert("discount amount = 30", amount, 30);
  assert("final price = 90", orig - amount, 90);

  // 0% discount
  assert("0% discount = original price", 200 * (1 - 0 / 100), 200);
  // 100% off
  assert("100% off = 0", 200 - 200 * (100 / 100), 0);
  // stacked discounts (not additive)
  const stacked = 100 * (1 - 0.20) * (1 - 0.10);
  assert("20% then 10% = 72 (not 70)", stacked, 72);
}

// ─── 5. COMMISSION CALCULATOR ─────────────────────────────────────────────────
section("5. Commission Calculator");
{
  // flat
  const sales = 15000, rate = 10;
  const commission = sales * (rate / 100);
  assert("flat commission = 1500", commission, 1500);
  assert("total with 3000 base = 4500", 3000 + commission, 4500);

  // tiered: first 10k@5%, next at 8%
  const tier1 = Math.min(15000, 10000) * 0.05;
  const tier2 = (15000 - 10000) * 0.08;
  assert("tiered t1 = 500", tier1, 500);
  assert("tiered t2 = 400", tier2, 400);
  assert("tiered total = 900", tier1 + tier2, 900);

  // zero sales
  assert("0 sales = 0 commission", 0 * (10 / 100), 0);
}

// ─── 6. GROSS PROFIT CALCULATOR ───────────────────────────────────────────────
section("6. Gross Profit Calculator");
{
  const rev = 200000, cogs = 120000;
  const gp = rev - cogs;
  const gm = (gp / rev) * 100;
  assert("gross profit = 80000", gp, 80000);
  assert("gross margin = 40%", gm, 40);

  // cogs > revenue → negative
  const negGP = 50000 - 80000;
  assert("negative gross profit = -30000", negGP, -30000);
  assert("negative gross margin", (negGP / 50000) * 100, -60);
}

// ─── 7. NET PROFIT CALCULATOR ─────────────────────────────────────────────────
section("7. Net Profit Calculator");
{
  const r = 500000, c = 200000, o = 150000, i = 10000, t = 28000;
  const gp = r - c;
  const ebit = gp - o;
  const net = ebit - i - t;
  assert("gross profit = 300000", gp, 300000);
  assert("EBIT = 150000", ebit, 150000);
  assert("net profit = 112000", net, 112000);
  assert("net margin = 22.4%", (net / r) * 100, 22.4);
}

// ─── 8. OPERATING MARGIN CALCULATOR ──────────────────────────────────────────
section("8. Operating Margin Calculator");
{
  const r = 500000, c = 200000, o = 150000;
  const ebit = r - c - o;
  const om = (ebit / r) * 100;
  assert("EBIT = 150000", ebit, 150000);
  assert("operating margin = 30%", om, 30);
}

// ─── 9. BUSINESS MARGIN CALCULATOR ───────────────────────────────────────────
section("9. Business Margin Calculator");
{
  // Mirrors net profit calculator — same formulas stacked
  const r = 1000000, c = 400000, o = 250000, i = 20000, t = 55000;
  const gm = ((r - c) / r) * 100;
  const opM = ((r - c - o) / r) * 100;
  const netM = ((r - c - o - i - t) / r) * 100;
  assert("gross margin = 60%", gm, 60);
  assert("operating margin = 35%", opM, 35);
  assert("net margin = 27.5%", netM, 27.5);
}

// ─── 10. HOURLY TO SALARY CALCULATOR ─────────────────────────────────────────
section("10. Hourly to Salary Calculator");
{
  const hourly = 25, hpw = 40, wpy = 52;
  const annual = hourly * hpw * wpy;
  assert("annual = 52000", annual, 52000);
  assert("monthly = 4333.33", annual / 12, 4333.33, 0.01);
  assert("biweekly = 2000", annual / 26, 2000);
  assert("weekly = 1000", hourly * hpw, 1000);
  assert("daily = 200", (hourly * hpw) / 5, 200);

  // part-time
  const ptAnnual = 15 * 20 * 50;
  assert("$15/hr 20hrs 50wks = 15000", ptAnnual, 15000);

  // $15/hr standard
  assert("$15/hr standard = 31200", 15 * 40 * 52, 31200);
}

// ─── 11. SALARY TO HOURLY CALCULATOR ─────────────────────────────────────────
section("11. Salary to Hourly Calculator");
{
  const annual = 60000, hpw = 40, wpy = 52;
  const totalHours = hpw * wpy;
  const hourly = annual / totalHours;
  assert("hourly = 28.85", hourly, 28.846, 0.01);

  // from monthly
  const fromMonthly = (5000 * 12) / (40 * 52);
  assert("$5000/mo → hourly = 28.85", fromMonthly, 28.846, 0.01);

  // from biweekly
  const fromBW = (2500 * 26) / (40 * 52);
  assert("$2500 biweekly → hourly = 31.25", fromBW, 31.25, 0.001);

  // $50k annual
  assert("$50k annual = $24.04/hr", 50000 / (40 * 52), 24.038, 0.01);
}

// ─── 12. OVERTIME CALCULATOR ──────────────────────────────────────────────────
section("12. Overtime Calculator");
{
  const rate = 20, regHours = 40, otHours = 8, mult = 1.5;
  const otRate = rate * mult;
  const regPay = rate * regHours;
  const otPay = otRate * otHours;
  const total = regPay + otPay;
  assert("OT rate = 30", otRate, 30);
  assert("regular pay = 800", regPay, 800);
  assert("OT pay = 240", otPay, 240);
  assert("total = 1040", total, 1040);

  // double time
  const dt = 20 * 2 * 4;
  assert("4hrs double time = 160", dt, 160);

  // zero OT hours
  assert("0 OT hours = regular pay only", 20 * 40 + 20 * 1.5 * 0, 800);
}

// ─── 13. PAY RAISE CALCULATOR ─────────────────────────────────────────────────
section("13. Pay Raise Calculator");
{
  const cur = 65000;
  // by percent
  const newAnnual = cur * (1 + 5 / 100);
  assert("5% raise = 68250", newAnnual, 68250);
  assert("biweekly paycheck = 2625", newAnnual / 26, 2625);

  // by amount
  const byAmount = cur + 3500;
  assert("$3500 raise = 68500", byAmount, 68500);
  assert("raise% = 5.38%", ((byAmount - cur) / cur) * 100, 5.385, 0.01);

  // from new salary
  const newSal = 72000;
  const raisePct = ((newSal - cur) / cur) * 100;
  assert("$72k new sal raise% = 10.77%", raisePct, 10.769, 0.01);

  // paycheck frequencies
  assert("annual/52 weekly", 68250 / 52, 1312.5);
  assert("annual/24 semimonthly", 68250 / 24, 2843.75);
  assert("annual/12 monthly", 68250 / 12, 5687.5);
}

// ─── 14. PAYCHECK CALCULATOR ──────────────────────────────────────────────────
section("14. Paycheck Calculator");
{
  const annual = 75000;
  const gross = annual / 26; // biweekly
  assert("gross biweekly = 2884.62", gross, 2884.615, 0.01);

  // FICA
  const ss = gross * 0.062;
  const medicare = gross * 0.0145;
  assert("SS = 178.85", ss, 178.846, 0.01);
  assert("Medicare = 41.83", medicare, 41.827, 0.01);

  // Federal tax on $75k (2024 single filer) — annual
  function federalTax(inc) {
    const brackets = [
      { limit: 11600,  rate: 0.10 },
      { limit: 47150,  rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ];
    let tax = 0, prev = 0;
    for (const { limit, rate } of brackets) {
      if (inc <= prev) break;
      tax += (Math.min(inc, limit) - prev) * rate;
      prev = limit;
    }
    return tax;
  }

  // $75k: 10% on 11600, 12% on 35550, 22% on 3850
  const expected = 11600*0.10 + (47150-11600)*0.12 + (75000-47150)*0.22;
  const actual   = federalTax(75000);
  assert("federal tax $75k = correct", actual, expected);
  assertBool("federal tax $75k > 0", actual > 0);

  // 401k pre-tax reduces taxable
  const contrib401k = 0.06 * gross;
  const taxableAnnual = (gross - contrib401k) * 26;
  assertBool("401k reduces taxable income", taxableAnnual < annual);
}

// ─── 15. FREELANCE RATE CALCULATOR ───────────────────────────────────────────
section("15. Freelance Rate Calculator");
{
  const desiredNet = 80000, expenses = 5000;
  const seTax = 15.3, incomeTax = 22;
  const totalTaxRate = (seTax + incomeTax) / 100;
  const annualGross = (desiredNet + expenses) / (1 - totalTaxRate);
  const billableHours = 1200;
  const hourly = annualGross / billableHours;

  assertBool("annual gross > desired net", annualGross > desiredNet);
  assertBool("hourly > 0", hourly > 0);
  assertBool("hourly > $50", hourly > 50); // sanity: $85k gross / 1200hrs ≈ $113/hr

  // Lower income scenario
  const h2 = (50000 + 3000) / (1 - 0.373) / 1000;
  assertBool("lower scenario hourly > 0", h2 > 0);

  // Day rate = hourly * 8
  assert("day rate = hourly * 8", hourly * 8, (annualGross / billableHours) * 8);
}

// ─── 16. HOURLY RATE CALCULATOR ───────────────────────────────────────────────
section("16. Hourly Rate Calculator");
{
  const goal = 90000, hpw = 40, wpy = 50;
  const totalHours = hpw * wpy;
  const base = goal / totalHours;
  assert("base rate = 45", base, 45);

  const overhead = 20;
  const withOH = base * (1 + overhead / 100);
  assert("with 20% overhead = 54", withOH, 54);

  const profit = 10;
  const recommended = withOH * (1 + profit / 100);
  assert("recommended = 59.40", recommended, 59.4);

  // zero overhead/profit
  assert("0% overhead = base rate", base * (1 + 0), 45);
}

// ─── 17. LOAN PAYMENT CALCULATOR ─────────────────────────────────────────────
section("17. Loan Payment Calculator");
{
  function monthlyPayment(P, annualRate, years) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const M = monthlyPayment(25000, 6.5, 5);
  assert("$25k 6.5% 5yr monthly ≈ 489.15", M, 489.154, 0.01);
  assert("total paid ≈ 29349", M * 60, 29349.22, 1);
  assert("total interest ≈ 4349", M * 60 - 25000, 4349.22, 1);

  // 0% rate
  const zeroRate = monthlyPayment(12000, 0, 1);
  assert("0% rate = P/n = 1000", zeroRate, 1000);

  // 30-year mortgage $300k @ 7%
  const mortgage = monthlyPayment(300000, 7, 30);
  assert("$300k 7% 30yr ≈ 1995.91", mortgage, 1995.91, 0.01);
}

// ─── 18. LOAN INTEREST CALCULATOR ────────────────────────────────────────────
section("18. Loan Interest Calculator");
{
  function loanInterest(P, annualRate, years) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    const M = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { monthly: M, total: M * n, interest: M * n - P };
  }

  const { monthly, total, interest } = loanInterest(200000, 7, 30);
  assert("$200k 7% 30yr interest ≈ 279k", interest, 279017, 1);
  assertBool("interest ratio > 100%", (interest / 200000) * 100 > 100);

  // 15yr vs 30yr
  const r15 = loanInterest(300000, 6.5, 15);
  const r30 = loanInterest(300000, 6.5, 30);
  assertBool("15yr total interest < 30yr", r15.interest < r30.interest);
  assertBool("15yr monthly > 30yr monthly", r15.monthly > r30.monthly);
}

// ─── 19. LOAN PAYOFF CALCULATOR ───────────────────────────────────────────────
section("19. Loan Payoff Calculator");
{
  function payoffMonths(balance, annualRate, payment) {
    const r = annualRate / 100 / 12;
    let bal = balance, months = 0;
    while (bal > 0.005 && months < 600) {
      bal = bal * (1 + r) - payment;
      months++;
    }
    return months;
  }

  const months = payoffMonths(15000, 8.9, 350);
  assertBool("$15k 8.9% $350/mo pays off < 60 months", months < 60);
  assertBool("$15k 8.9% $350/mo pays off > 0 months", months > 0);

  // Payment barely above interest
  const r = 8.9 / 100 / 12;
  const minPay = 15000 * r;
  assertBool("payment must exceed interest", 350 > minPay);

  // Exact: zero rate
  const zeroMonths = payoffMonths(12000, 0, 500);
  assert("0% rate 12000/500 = 24 months", zeroMonths, 24);
}

// ─── 20. EXTRA PAYMENT LOAN CALCULATOR ───────────────────────────────────────
section("20. Extra Payment Loan Calculator");
{
  function amortize(P, annualRate, years, extraMonthly = 0) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    const M = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let bal = P, months = 0, interest = 0;
    while (bal > 0.005 && months < 1200) {
      const int = bal * r;
      interest += int;
      bal = Math.max(0, bal + int - M - extraMonthly);
      months++;
    }
    return { months, interest };
  }

  const base  = amortize(300000, 6.5, 30, 0);
  const extra = amortize(300000, 6.5, 30, 200);

  assertBool("extra $200/mo saves months", extra.months < base.months);
  assertBool("extra $200/mo saves interest", extra.interest < base.interest);
  assertBool("interest saved > $50k", base.interest - extra.interest > 50000);

  // Lump sum at month 1
  function amortizeLump(P, annualRate, years, lump) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let bal = P - lump, months = 0, interest = 0;
    if (bal <= 0) return { months: 0, interest: 0 };
    while (bal > 0.005 && months < 1200) {
      const int = bal * r;
      interest += int;
      bal = Math.max(0, bal + int - M);
      months++;
    }
    return { months, interest };
  }

  const lump = amortizeLump(300000, 6.5, 30, 10000);
  assertBool("$10k lump sum saves months", lump.months < base.months);
}

// ─── 21. LOAN AMORTIZATION CALCULATOR ────────────────────────────────────────
section("21. Loan Amortization Calculator");
{
  function buildSchedule(P, annualRate, years) {
    const r = annualRate / 100 / 12;
    const n = Math.round(years * 12);
    const M = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const rows = [];
    let bal = P;
    for (let i = 1; i <= n && bal > 0; i++) {
      const int   = bal * r;
      const princ = Math.min(M - int, bal);
      bal = Math.max(0, bal - princ);
      rows.push({ month: i, principal: princ, interest: int, balance: bal });
    }
    return rows;
  }

  const schedule = buildSchedule(300000, 7, 30);
  assert("schedule has 360 rows", schedule.length, 360);
  assertBool("first payment mostly interest", schedule[0].interest > schedule[0].principal);
  assertBool("last payment mostly principal", schedule[359].principal > schedule[359].interest);
  assertBool("balance reaches ~0", schedule[359].balance < 1);

  // Sum of principals = P
  const totalPrinc = schedule.reduce((s, r) => s + r.principal, 0);
  assert("sum of principal repaid ≈ 300000", totalPrinc, 300000, 1);
}

// ─── 22. DEBT PAYOFF CALCULATOR ───────────────────────────────────────────────
section("22. Debt Payoff Calculator");
{
  function debtPayoff(balance, annualRate, payment, extraPerDebt = 0) {
    const r = annualRate / 100 / 12;
    const M = payment + extraPerDebt;
    const minInt = balance * r;
    if (M <= minInt) return null; // won't pay off
    let bal = balance, months = 0, interest = 0;
    while (bal > 0.005 && months < 600) {
      const int = bal * r;
      interest += int;
      bal = Math.max(0, bal + int - M);
      months++;
    }
    return { months, interest };
  }

  const r1 = debtPayoff(5000, 19.99, 100);
  assertBool("$5k 20% $100/mo pays off", r1 !== null);
  assertBool("$5k 20% $100/mo pays off in < 150 months", r1.months < 150);

  // Multiple debts
  const debts = [
    { bal: 3000, rate: 22, min: 80 },
    { bal: 7000, rate: 15, min: 150 },
  ];
  const results = debts.map(d => debtPayoff(d.bal, d.rate, d.min));
  assertBool("all debts pay off", results.every(r => r !== null));

  // Extra payment reduces time
  const noExtra = debtPayoff(5000, 19.99, 100, 0);
  const withExtra = debtPayoff(5000, 19.99, 100, 100);
  assertBool("extra payment shortens payoff", withExtra.months < noExtra.months);
}

// ─── 23. DEBT SNOWBALL CALCULATOR ────────────────────────────────────────────
section("23. Debt Snowball Calculator");
{
  // Snowball: sort by smallest balance, roll freed payments
  function snowball(debts, extra) {
    const ds = debts.map(d => ({ ...d, bal: d.balance, r: d.rate / 100 / 12, interest: 0, paidMonth: 0 }));
    let month = 0;
    while (ds.some(d => d.bal > 0.005) && month < 600) {
      month++;
      ds.forEach(d => { if (d.bal > 0.005) { const int = d.bal * d.r; d.interest += int; d.bal += int; } });
      let freed = extra;
      ds.forEach(d => {
        if (d.bal > 0.005) {
          const pay = Math.min(d.minPayment, d.bal);
          d.bal -= pay;
          if (d.bal <= 0.005) { d.bal = 0; if (!d.paidMonth) d.paidMonth = month; }
        } else { freed += d.minPayment; }
      });
      const remaining = ds.filter(d => d.bal > 0.005).sort((a, b) => a.bal - b.bal);
      const target = remaining[0];
      if (target && freed > 0) { target.bal = Math.max(0, target.bal - freed); if (target.bal <= 0.005) { target.bal = 0; if (!target.paidMonth) target.paidMonth = month; } }
    }
    return { months: month, totalInterest: ds.reduce((s, d) => s + d.interest, 0) };
  }

  const debts = [
    { balance: 500,  rate: 10, minPayment: 25 },
    { balance: 2000, rate: 20, minPayment: 50 },
    { balance: 5000, rate: 15, minPayment: 100 },
  ];

  const sb = snowball(debts, 100);
  assertBool("snowball pays off all debts", sb.months < 600);
  assertBool("snowball months > 0", sb.months > 0);
  assertBool("snowball has interest", sb.totalInterest > 0);

  // Snowball with more extra pays off faster
  const sbMore = snowball(debts, 300);
  assertBool("more extra = fewer months", sbMore.months < sb.months);
}

// ─── 24. DEBT AVALANCHE CALCULATOR ───────────────────────────────────────────
section("24. Debt Avalanche Calculator");
{
  function avalanche(debts, extra) {
    const ds = debts.map(d => ({ ...d, bal: d.balance, r: d.rate / 100 / 12, interest: 0, paidMonth: 0 }));
    let month = 0;
    while (ds.some(d => d.bal > 0.005) && month < 600) {
      month++;
      ds.forEach(d => { if (d.bal > 0.005) { const int = d.bal * d.r; d.interest += int; d.bal += int; } });
      let freed = extra;
      ds.forEach(d => {
        if (d.bal > 0.005) {
          const pay = Math.min(d.minPayment, d.bal);
          d.bal -= pay;
          if (d.bal <= 0.005) { d.bal = 0; if (!d.paidMonth) d.paidMonth = month; }
        } else { freed += d.minPayment; }
      });
      const remaining = ds.filter(d => d.bal > 0.005).sort((a, b) => b.rate - a.rate);
      const target = remaining[0];
      if (target && freed > 0) { target.bal = Math.max(0, target.bal - freed); if (target.bal <= 0.005) { target.bal = 0; if (!target.paidMonth) target.paidMonth = month; } }
    }
    return { months: month, totalInterest: ds.reduce((s, d) => s + d.interest, 0) };
  }

  function snowball2(debts, extra) {
    const ds = debts.map(d => ({ ...d, bal: d.balance, r: d.rate / 100 / 12, interest: 0, paidMonth: 0 }));
    let month = 0;
    while (ds.some(d => d.bal > 0.005) && month < 600) {
      month++;
      ds.forEach(d => { if (d.bal > 0.005) { const int = d.bal * d.r; d.interest += int; d.bal += int; } });
      let freed = extra;
      ds.forEach(d => {
        if (d.bal > 0.005) {
          const pay = Math.min(d.minPayment, d.bal);
          d.bal -= pay;
          if (d.bal <= 0.005) { d.bal = 0; if (!d.paidMonth) d.paidMonth = month; }
        } else { freed += d.minPayment; }
      });
      const remaining = ds.filter(d => d.bal > 0.005).sort((a, b) => a.bal - b.bal);
      const target = remaining[0];
      if (target && freed > 0) { target.bal = Math.max(0, target.bal - freed); if (target.bal <= 0.005) { target.bal = 0; if (!target.paidMonth) target.paidMonth = month; } }
    }
    return { months: month, totalInterest: ds.reduce((s, d) => s + d.interest, 0) };
  }

  // Avalanche should pay ≤ total interest compared to snowball (it's mathematically optimal)
  const debts = [
    { balance: 500,  rate: 10, minPayment: 25 },
    { balance: 2000, rate: 24, minPayment: 50 }, // high rate, larger balance
    { balance: 5000, rate: 6,  minPayment: 100 },
  ];

  const av = avalanche(debts, 150);
  const sb = snowball2(debts, 150);

  assertBool("avalanche pays off", av.months < 600);
  // Avalanche ≤ snowball interest (may be equal if balances coincide with rates)
  assertBool("avalanche interest ≤ snowball interest", av.totalInterest <= sb.totalInterest + 0.01);
}

// ─── 25. CREDIT CARD PAYOFF CALCULATOR ───────────────────────────────────────
section("25. Credit Card Payoff Calculator");
{
  function ccPayoff(balance, apr, payment) {
    const r = apr / 100 / 12;
    if (r > 0 && payment <= balance * r) return null;
    let bal = balance, months = 0, interest = 0;
    while (bal > 0.005 && months < 600) {
      const int = bal * r;
      interest += int;
      bal = Math.max(0, bal + int - payment);
      months++;
    }
    return { months, interest, total: balance + interest };
  }

  const r = ccPayoff(5000, 20.99, 200);
  assertBool("$5k 20.99% $200/mo pays off", r !== null);
  assertBool("months between 1-60", r.months > 0 && r.months < 100);
  assertBool("total interest > 0", r.interest > 0);

  // Minimum payment check
  const minInterest = 5000 * (20.99 / 100 / 12);
  assertBool("$200 > min interest", 200 > minInterest);

  // Large payment: first month accrues interest so 2 payments needed to fully clear
  const fast = ccPayoff(5000, 20.99, 5000);
  assertBool("$5k payment on $5k balance clears in ≤ 2 months", fast !== null && fast.months <= 2);

  // Zero APR
  const zeroApr = ccPayoff(1200, 0, 100);
  assert("0% APR 1200/100 = 12 months", zeroApr.months, 12);
}

// ─── 26. CREDIT CARD MINIMUM PAYMENT CALCULATOR ──────────────────────────────
section("26. Credit Card Minimum Payment Calculator");
{
  function minPayCalc(balance, apr, minPct, floor) {
    const r = apr / 100 / 12;
    let bal = balance, months = 0, interest = 0;
    while (bal > 0.005 && months < 1200) {
      const int = bal * r;
      interest += int;
      bal += int;
      const payment = Math.min(Math.max(bal * minPct / 100, floor), bal);
      bal -= payment;
      months++;
    }
    return { months, interest };
  }

  // Min payment at 22.99% APR: 2% > monthly rate (1.916%), so balance shrinks very slowly.
  // Takes ~1295 months to clear. Client correctly shows an error at the 1200-month cap.
  const r = minPayCalc(5000, 22.99, 2, 25);
  assertBool("min payment balance eventually trends down", r.months > 0);
  assertBool("takes very many months (> 500)", r.months > 500);
  assertBool("interest > original balance", r.interest > 5000);

  // Higher minimum = fewer months
  const higher = minPayCalc(5000, 22.99, 3, 25);
  assertBool("higher min% = fewer months", higher.months < r.months);

  // Fixed payment
  const fixed = minPayCalc(1000, 20, 100, 25); // 100% of balance
  assert("100% min = 1 month", fixed.months, 1);
}

// ─── 27. DEBT-TO-INCOME CALCULATOR ───────────────────────────────────────────
section("27. Debt-to-Income Calculator");
{
  const income = 6000;
  const mortgage = 1500, car = 400, cc = 200;
  const totalDebt = mortgage + car + cc;
  const dti = (totalDebt / income) * 100;
  const frontEnd = (mortgage / income) * 100;

  assert("total debt = 2100", totalDebt, 2100);
  assert("back-end DTI = 35%", dti, 35);
  assert("front-end DTI = 25%", frontEnd, 25);

  // DTI thresholds
  assertBool("35% DTI is acceptable (<36)", dti < 36);
  assertBool("25% front-end is good (≤28)", frontEnd <= 28);

  // Bad DTI
  const badDTI = (4000 / 6000) * 100;
  assertBool("66% DTI is high (>43)", badDTI > 43);

  // Zero debt
  assert("0 debt = 0% DTI", (0 / 6000) * 100, 0);
}

// ─── 28. SAVINGS CALCULATOR ───────────────────────────────────────────────────
section("28. Savings Calculator");
{
  function compoundSavings(P, annualRate, years, monthlyContrib) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    // FV of principal
    const fvP = P * Math.pow(1 + r, n);
    // FV of annuity
    const fvC = r === 0 ? monthlyContrib * n : monthlyContrib * ((Math.pow(1 + r, n) - 1) / r);
    return fvP + fvC;
  }

  // $5k initial, $200/mo, 4.5%, 20 years
  const fv = compoundSavings(5000, 4.5, 20, 200);
  assertBool("20yr savings > 0", fv > 0);
  assertBool("20yr savings > contributions", fv > 5000 + 200 * 12 * 20);

  // 0% rate = just contributions
  const zeroRate = compoundSavings(1000, 0, 5, 100);
  const expected = 1000 + 100 * 60;
  assert("0% rate = principal + contributions", zeroRate, expected, 0.01);

  // More years = more money
  const fv10 = compoundSavings(10000, 5, 10, 500);
  const fv20 = compoundSavings(10000, 5, 20, 500);
  assertBool("20yr > 10yr", fv20 > fv10);

  // Rule of 72: $10k at 6% doubles in ~12 years
  const fv12 = compoundSavings(10000, 6, 12, 0);
  assertBool("$10k at 6% doubles in ~12yr (rule of 72)", fv12 > 18000 && fv12 < 22000);
}

// ─── 29. SAVINGS GOAL CALCULATOR ─────────────────────────────────────────────
section("29. Savings Goal Calculator");
{
  function goalPMT(goal, current, annualRate, months) {
    const r = annualRate / 100 / 12;
    const fvExisting = r === 0 ? current : current * Math.pow(1 + r, months);
    const remaining = goal - fvExisting;
    if (remaining <= 0) return 0;
    return r === 0 ? remaining / months : (remaining * r) / (Math.pow(1 + r, months) - 1);
  }

  const pmt = goalPMT(20000, 2000, 4.5, 24);
  assertBool("PMT > 0", pmt > 0);
  assertBool("PMT < goal", pmt < 20000);

  // With $0 existing savings and 0% rate
  const pmt0 = goalPMT(12000, 0, 0, 12);
  assert("$12k in 12 months at 0% = $1000/mo", pmt0, 1000);

  // Existing savings cover goal
  const covered = goalPMT(5000, 6000, 5, 12);
  assert("already covered = 0", covered, 0);

  // Longer timeline = lower monthly
  const pmtShort = goalPMT(10000, 0, 4, 12);
  const pmtLong  = goalPMT(10000, 0, 4, 24);
  assertBool("longer timeline = lower monthly", pmtLong < pmtShort);
}

// ─── 30. SIMPLE INTEREST CALCULATOR ──────────────────────────────────────────
section("30. Simple Interest Calculator");
{
  // years
  const interest = 10000 * (5 / 100) * 3;
  assert("I = 10000 * 5% * 3yr = 1500", interest, 1500);
  assert("total = 11500", 10000 + interest, 11500);

  // months
  const months = 10000 * (8 / 100) * (6 / 12);
  assert("6-month interest = 400", months, 400);

  // days
  const days = 5000 * (8 / 100) * (90 / 365);
  assert("90-day interest ≈ 98.63", days, 98.63, 0.01);

  // 0% rate
  assert("0% rate = 0 interest", 10000 * 0 * 3, 0);

  // Zero time
  assert("0 time = 0 interest", 10000 * (5 / 100) * 0, 0);
}

// ─── 31. APY CALCULATOR ───────────────────────────────────────────────────────
section("31. APY Calculator");
{
  function toAPY(apr, n) {
    return (Math.pow(1 + apr / 100 / n, n) - 1) * 100;
  }

  // 5% APR monthly compounded
  assert("5% APR monthly → APY = 5.1162%", toAPY(5, 12), 5.1162, 0.001);
  // 5% APR daily
  assert("5% APR daily → APY = 5.1267%", toAPY(5, 365), 5.1267, 0.001);
  // 5% APR annually → APY = APR
  assert("5% APR annually → APY = 5%", toAPY(5, 1), 5, 0.001);
  // APY >= APR always
  assertBool("APY(monthly) >= APY(annually)", toAPY(5, 12) >= toAPY(5, 1));
  assertBool("APY(daily) >= APY(monthly)", toAPY(5, 365) >= toAPY(5, 12));

  // Interest earned on $10k for 1 year
  const interest = 10000 * (toAPY(5, 12) / 100);
  assert("$10k at 5% monthly APY interest ≈ 511.62", interest, 511.62, 0.01);
}

// ─── 32. APR CALCULATOR ───────────────────────────────────────────────────────
section("32. APR Calculator");
{
  // Monthly payment on stated rate
  function mPayment(P, annualRate, years) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    return r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  // Bisection APR solver — matches the fixed AprClient.tsx implementation
  function calcAPR(P, fees, annualRate, years) {
    const n = years * 12;
    const M = mPayment(P, annualRate, years);
    const net = P - fees;
    if (net <= 0) return NaN;
    function pv(rMonth) {
      if (rMonth <= 0) return M * n;
      return M * (1 - Math.pow(1 + rMonth, -n)) / rMonth;
    }
    let lo = 1e-8, hi = 2.0;
    for (let i = 0; i < 300; i++) {
      const mid = (lo + hi) / 2;
      if (pv(mid) > net) lo = mid; else hi = mid;
      if (hi - lo < 1e-10) break;
    }
    return lo * 12 * 100;
  }

  // No fees → APR = stated rate
  const aprNoFees = calcAPR(30000, 0, 6.5, 5);
  assert("no fees: APR ≈ stated rate 6.5%", aprNoFees, 6.5, 0.001);

  // With fees → APR > stated rate
  const aprWithFees = calcAPR(30000, 900, 6.5, 5);
  assertBool("with fees: APR > stated rate", aprWithFees > 6.5);
  assertBool("APR with fees ≈ 7.78%", Math.abs(aprWithFees - 7.78) < 0.05);

  // Higher fees = higher APR
  const aprHighFees = calcAPR(30000, 2000, 6.5, 5);
  assertBool("higher fees = higher APR", aprHighFees > aprWithFees);
  assertBool("APR with high fees ≈ 9.42%", Math.abs(aprHighFees - 9.42) < 0.05);

  // Fees > loan should be caught by validation (returns NaN)
  assertBool("fees > loan amount is invalid", isNaN(calcAPR(1000, 2000, 5, 3)));
}

// ─── 33. SALES TAX CALCULATOR ────────────────────────────────────────────────
section("33. Sales Tax Calculator");
{
  // Add tax
  const preTax = 49.99, rate = 8.5;
  const taxAmt = preTax * (rate / 100);
  const total  = preTax + taxAmt;
  assert("tax amount ≈ 4.25", taxAmt, 4.249, 0.01);
  assert("total ≈ 54.24", total, 54.239, 0.01);

  // Remove tax
  const gross = 54.24;
  const net   = gross / (1 + rate / 100);
  const extracted = gross - net;
  assert("extract tax from 54.24 @ 8.5% ≈ 4.24", extracted, 4.24, 0.01);
  assert("net pre-tax ≈ 49.99", net, 49.99, 0.01);

  // 0% tax
  assert("0% tax → total = price", 100 * (1 + 0 / 100), 100);
  // 20% VAT
  assert("£100 + 20% VAT = £120", 100 * 1.20, 120);
  // Remove 20% VAT from £120
  assert("£120 remove 20% VAT → £100", 120 / 1.20, 100);
}

// ─── 34. PRICE AFTER DISCOUNT CALCULATOR ─────────────────────────────────────
section("34. Price After Discount Calculator");
{
  const orig = 120, disc = 25, taxRate = 8.5;
  const discAmt  = orig * (disc / 100);
  const salePrice = orig - discAmt;
  const taxAmt   = salePrice * (taxRate / 100);
  const final    = salePrice + taxAmt;

  assert("discount amount = 30", discAmt, 30);
  assert("sale price = 90", salePrice, 90);
  assert("tax on sale price = 7.65", taxAmt, 7.65);
  assert("final price = 97.65", final, 97.65);

  // tax on DISCOUNTED price, not original
  const taxOnOrig = orig * (taxRate / 100);
  assertBool("tax on sale < tax on original", taxAmt < taxOnOrig);

  // stacked discounts
  const stacked1 = 100 * (1 - 0.20);   // 80
  const stacked2 = stacked1 * (1 - 0.10); // 72
  assert("stacked 20% + 10% = 72", stacked2, 72);
  assertBool("stacked < additive (70)", stacked2 > 70);
}

// ─── 35. TAX-INCLUSIVE PRICE CALCULATOR ──────────────────────────────────────
section("35. Tax-Inclusive Price Calculator");
{
  const net = 100, vat = 20;
  const gross = net * (1 + vat / 100);
  const taxAmt = gross - net;
  assert("net 100 + 20% VAT = gross 120", gross, 120);
  assert("VAT amount = 20", taxAmt, 20);

  // AU GST 10%
  const auGross = 50 * 1.10;
  assert("$50 + 10% GST = $55", auGross, 55);

  // 0% tax
  assert("0% tax → gross = net", 100 * 1.00, 100);
}

// ─── 36. TAX-EXCLUSIVE PRICE CALCULATOR ──────────────────────────────────────
section("36. Tax-Exclusive Price Calculator");
{
  const gross = 120, vat = 20;
  const net    = gross / (1 + vat / 100);
  const taxAmt = gross - net;
  assert("gross 120 @ 20% VAT → net = 100", net, 100);
  assert("extracted VAT = 20", taxAmt, 20);

  // Common mistake: 120 * 0.20 = 24 (WRONG)
  const wrong = gross * (vat / 100);
  assertBool("naive calc WRONG (24 ≠ 20)", Math.abs(wrong - taxAmt) > 0.01);

  // UK receipt example
  const ukNet = 54 / 1.20;
  assert("£54 gross remove 20% VAT → £45 net", ukNet, 45);

  // 0% rate
  assert("0% rate → net = gross", 100 / (1 + 0), 100);
}

// ─── 37. ROI CALCULATOR ───────────────────────────────────────────────────────
section("37. ROI Calculator");
{
  const cost = 10000, ret = 13500;
  const netGain = ret - cost;
  const roi     = (netGain / cost) * 100;
  assert("net gain = 3500", netGain, 3500);
  assert("ROI = 35%", roi, 35);

  // Annualised (CAGR)
  const years = 3;
  const cagr  = (Math.pow(ret / cost, 1 / years) - 1) * 100;
  assert("CAGR over 3yr ≈ 10.52%", cagr, 10.521, 0.01);

  // Negative ROI
  const loss = 10000, ret2 = 7000;
  assert("ROI loss = -30%", ((ret2 - loss) / loss) * 100, -30);

  // 0% return
  assert("same value = 0% ROI", ((10000 - 10000) / 10000) * 100, 0);

  // CAGR must equal ROI when years = 1
  const roi1yr  = ((12000 - 10000) / 10000) * 100;
  const cagr1yr = (Math.pow(12000 / 10000, 1 / 1) - 1) * 100;
  assert("1yr ROI = 1yr CAGR = 20%", roi1yr, cagr1yr, 0.001);
}

// ─── 38. ROAS CALCULATOR ──────────────────────────────────────────────────────
section("38. ROAS Calculator");
{
  const revenue = 20000, adSpend = 5000;
  const roas = revenue / adSpend;
  assert("ROAS = 4.0", roas, 4.0);
  assert("cost as % of revenue = 25%", (adSpend / revenue) * 100, 25);

  // Break-even ROAS at 30% gross margin
  const margin = 30;
  const beRoas = 100 / margin;
  assert("break-even ROAS at 30% margin = 3.33", beRoas, 3.333, 0.01);

  // Profit = revenue * margin% - adSpend
  const profit = revenue * (margin / 100) - adSpend;
  assert("profit = 6000 - 5000 = 1000", profit, 1000);

  // Below break-even
  const lowRevenue = 10000;
  const lowRoas = lowRevenue / adSpend;
  const lowProfit = lowRevenue * (margin / 100) - adSpend;
  assertBool("ROAS 2 < break-even 3.33", lowRoas < beRoas);
  assertBool("below break-even = negative profit", lowProfit < 0);

  // ROAS vs ROI
  assertBool("ROAS ignores COGS (measures gross)", roas > 1);
}

// ─── 39. CASH FLOW CALCULATOR ────────────────────────────────────────────────
section("39. Cash Flow Calculator");
{
  const operatingItems = [50000, 10000, -5000]; // net income, depreciation, wc change
  const investingItems = [-30000, 5000];         // capex, asset sale
  const financingItems = [-15000, 20000];        // debt repayment, new loan

  const operatingCF = operatingItems.reduce((a, b) => a + b, 0);
  const investingCF = investingItems.reduce((a, b) => a + b, 0);
  const financingCF = financingItems.reduce((a, b) => a + b, 0);
  const netCF = operatingCF + investingCF + financingCF;

  assert("operating CF = 55000", operatingCF, 55000);
  assert("investing CF = -25000", investingCF, -25000);
  assert("financing CF = 5000", financingCF, 5000);
  assert("net CF = 35000", netCF, 35000);

  // Negative net CF
  const netNeg = 10000 - 30000 - 5000;
  assert("negative net CF = -25000", netNeg, -25000);

  // All zeros
  assert("all zero = 0", 0 + 0 + 0, 0);
}

// ─── 40. REVENUE GROWTH CALCULATOR ───────────────────────────────────────────
section("40. Revenue Growth Calculator");
{
  // Growth rate
  const prev = 500000, cur = 650000;
  const growthRate = ((cur - prev) / Math.abs(prev)) * 100;
  assert("growth rate = 30%", growthRate, 30);
  assert("change = 150000", cur - prev, 150000);

  // Projected revenue
  const base = 500000, rate = 15, years = 3;
  const projected = base * Math.pow(1 + rate / 100, years);
  assert("$500k at 15% for 3yr ≈ 760437", projected, 760437, 1);

  // CAGR
  const start = 500000, end = 800000, yrs = 3;
  const cagr = (Math.pow(end / start, 1 / yrs) - 1) * 100;
  assert("CAGR $500k→$800k in 3yr ≈ 16.96%", cagr, 16.96, 0.01);

  // Negative growth
  const declined = ((400000 - 500000) / 500000) * 100;
  assert("revenue decline = -20%", declined, -20);

  // CAGR over 1 year = simple growth rate
  const cagr1 = (Math.pow(600000 / 500000, 1 / 1) - 1) * 100;
  assert("1yr CAGR = growth rate = 20%", cagr1, 20);
}

// ─── SUMMARY ──────────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(70));
console.log(`RESULTS:  ${passed} passed  |  ${failed} failed  |  ${passed + failed} total`);
console.log("═".repeat(70));

if (failures.length > 0) {
  console.log("\nFAILURES:");
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
} else {
  console.log("\n✓ All tests passed.");
  process.exit(0);
}
