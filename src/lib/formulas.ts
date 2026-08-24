// HundiAI Financial Formula Engine
// Every model the AI agents are allowed to use is defined here, deterministically.
// The agents never invent maths — they pick a model from this library, feed it ledger
// data, and explain the inputs they used.

export type FormulaCategory =
  | "Valuation"
  | "Cash & Liquidity"
  | "Profitability"
  | "Working Capital"
  | "Cost Optimisation"
  | "Transfer Pricing"
  | "Unit Economics"
  | "Risk & Solvency"
  | "Tax & Compliance";

export interface FormulaDef {
  id: string;
  name: string;
  category: FormulaCategory;
  expression: string;
  inputs: string[];
  purpose: string;
  usedBy: string;
  worked: string;
}

/* ------------------------------------------------------------------ */
/* Core time-value maths                                               */
/* ------------------------------------------------------------------ */

/** Net Present Value: NPV = Σ CFt / (1+r)^t − C0 */
export const npv = (rate: number, cashflows: number[], initial = 0) =>
  cashflows.reduce((s, cf, i) => s + cf / Math.pow(1 + rate, i + 1), 0) - initial;

/** IRR via bisection — the discount rate where NPV = 0. */
export function irr(cashflows: number[], initial: number) {
  let lo = -0.9;
  let hi = 3;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid, cashflows, initial) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** CAPM cost of equity: Re = Rf + β(Rm − Rf) */
export const costOfEquity = (rf: number, beta: number, marketReturn: number) =>
  rf + beta * (marketReturn - rf);

/** WACC = E/V·Re + D/V·Rd·(1−t) */
export function wacc(input: {
  equity: number;
  debt: number;
  costEquity: number;
  costDebt: number;
  taxRate: number;
}) {
  const v = input.equity + input.debt || 1;
  return (
    (input.equity / v) * input.costEquity +
    (input.debt / v) * input.costDebt * (1 - input.taxRate)
  );
}

export interface DcfInput {
  baseFcf: number; // year-1 free cash flow
  growth: number; // explicit-period growth
  years: number;
  discountRate: number; // WACC
  terminalGrowth: number;
  netDebt: number;
}

export interface DcfResult {
  rows: { year: number; fcf: number; discountFactor: number; pv: number }[];
  pvExplicit: number;
  terminalValue: number;
  pvTerminal: number;
  enterpriseValue: number;
  equityValue: number;
}

/**
 * Discounted Cash Flow.
 *  FCFt = FCF0 · (1+g)^t
 *  PV   = FCFt / (1+WACC)^t
 *  TV   = FCFn·(1+gt) / (WACC − gt)      [Gordon Growth]
 *  EV   = ΣPV + PV(TV);  Equity = EV − Net Debt
 */
export function dcf(i: DcfInput): DcfResult {
  const rows = [];
  let pvExplicit = 0;
  let lastFcf = i.baseFcf;
  for (let t = 1; t <= i.years; t++) {
    lastFcf = t === 1 ? i.baseFcf : lastFcf * (1 + i.growth);
    const df = 1 / Math.pow(1 + i.discountRate, t);
    const pv = lastFcf * df;
    pvExplicit += pv;
    rows.push({ year: t, fcf: lastFcf, discountFactor: df, pv });
  }
  const spread = Math.max(i.discountRate - i.terminalGrowth, 0.01);
  const terminalValue = (lastFcf * (1 + i.terminalGrowth)) / spread;
  const pvTerminal = terminalValue / Math.pow(1 + i.discountRate, i.years);
  const enterpriseValue = pvExplicit + pvTerminal;
  return {
    rows,
    pvExplicit,
    terminalValue,
    pvTerminal,
    enterpriseValue,
    equityValue: enterpriseValue - i.netDebt,
  };
}

/** Free Cash Flow to Firm = EBIT(1−t) + D&A − ΔWC − CapEx */
export const fcff = (i: { ebit: number; taxRate: number; da: number; deltaWc: number; capex: number }) =>
  i.ebit * (1 - i.taxRate) + i.da - i.deltaWc - i.capex;

/* ------------------------------------------------------------------ */
/* Profitability & unit economics                                      */
/* ------------------------------------------------------------------ */

export const grossMargin = (revenue: number, cogs: number) => (revenue ? (revenue - cogs) / revenue : 0);
export const ebitda = (revenue: number, opex: number) => revenue - opex;
export const ebitdaMargin = (revenue: number, opex: number) => (revenue ? (revenue - opex) / revenue : 0);
export const contributionMargin = (price: number, variableCost: number) => price - variableCost;
export const breakEvenUnits = (fixedCost: number, price: number, variableCost: number) =>
  price - variableCost > 0 ? fixedCost / (price - variableCost) : Infinity;
export const breakEvenRevenue = (fixedCost: number, cmRatio: number) => (cmRatio > 0 ? fixedCost / cmRatio : Infinity);
export const operatingLeverage = (contribution: number, ebit: number) => (ebit ? contribution / ebit : 0);
/** DuPont: ROE = Net Margin × Asset Turnover × Equity Multiplier */
export const dupontRoe = (netMargin: number, assetTurnover: number, equityMultiplier: number) =>
  netMargin * assetTurnover * equityMultiplier;
export const roce = (ebit: number, capitalEmployed: number) => (capitalEmployed ? ebit / capitalEmployed : 0);
/** EVA = NOPAT − (Capital × WACC) */
export const eva = (nopat: number, capital: number, waccRate: number) => nopat - capital * waccRate;
export const ruleOf40 = (growthPct: number, ebitdaMarginPct: number) => growthPct + ebitdaMarginPct;
export const ltv = (arpu: number, grossMarginPct: number, churn: number) =>
  churn > 0 ? (arpu * grossMarginPct) / churn : 0;
export const cac = (salesMarketingSpend: number, newCustomers: number) =>
  newCustomers ? salesMarketingSpend / newCustomers : 0;
export const cacPaybackMonths = (cacValue: number, monthlyGrossProfitPerCustomer: number) =>
  monthlyGrossProfitPerCustomer ? cacValue / monthlyGrossProfitPerCustomer : Infinity;

/* ------------------------------------------------------------------ */
/* Working capital & liquidity                                         */
/* ------------------------------------------------------------------ */

export const dso = (receivables: number, revenue: number, days = 365) => (revenue ? (receivables / revenue) * days : 0);
export const dpo = (payables: number, cogs: number, days = 365) => (cogs ? (payables / cogs) * days : 0);
export const dio = (inventory: number, cogs: number, days = 365) => (cogs ? (inventory / cogs) * days : 0);
export const cashConversionCycle = (dsoV: number, dioV: number, dpoV: number) => dsoV + dioV - dpoV;
export const currentRatio = (currentAssets: number, currentLiabilities: number) =>
  currentLiabilities ? currentAssets / currentLiabilities : 0;
export const quickRatio = (cash: number, receivables: number, currentLiabilities: number) =>
  currentLiabilities ? (cash + receivables) / currentLiabilities : 0;
export const burnRate = (outflow: number, inflow: number) => Math.max(outflow - inflow, 0);
export const runway = (cash: number, netBurn: number) => (netBurn > 0 ? cash / netBurn : Infinity);
export const workingCapital = (currentAssets: number, currentLiabilities: number) => currentAssets - currentLiabilities;
/** Economic Order Quantity = √(2DS/H) */
export const eoq = (demand: number, orderCost: number, holdingCost: number) =>
  holdingCost > 0 ? Math.sqrt((2 * demand * orderCost) / holdingCost) : 0;

/* ------------------------------------------------------------------ */
/* Risk & solvency                                                     */
/* ------------------------------------------------------------------ */

/** Altman Z''-score for private / non-manufacturing firms. */
export function altmanZ(i: {
  workingCapital: number;
  retainedEarnings: number;
  ebit: number;
  equityBook: number;
  totalAssets: number;
  totalLiabilities: number;
}) {
  const a = i.totalAssets || 1;
  const x1 = i.workingCapital / a;
  const x2 = i.retainedEarnings / a;
  const x3 = i.ebit / a;
  const x4 = i.equityBook / (i.totalLiabilities || 1);
  const z = 6.56 * x1 + 3.26 * x2 + 6.72 * x3 + 1.05 * x4;
  return { z, zone: z > 2.6 ? "Safe" : z > 1.1 ? "Grey" : "Distress" };
}

export const dscr = (netOperatingIncome: number, debtService: number) =>
  debtService ? netOperatingIncome / debtService : Infinity;
export const interestCoverage = (ebitV: number, interest: number) => (interest ? ebitV / interest : Infinity);
/** Herfindahl index of concentration (0 = diverse, 1 = single vendor/customer). */
export const herfindahl = (shares: number[]) => shares.reduce((s, x) => s + x * x, 0);

/* ------------------------------------------------------------------ */
/* Transfer pricing (Indian TP rules, Sec 92C methods)                 */
/* ------------------------------------------------------------------ */

export type TpMethod = "CUP" | "Cost Plus" | "Resale Price" | "TNMM" | "PSM";

/** Cost Plus Method: arm's length price = cost × (1 + gross mark-up) */
export const costPlusPrice = (cost: number, markup: number) => cost * (1 + markup);
/** Resale Price Method: price = resale price × (1 − gross margin) */
export const resalePrice = (resale: number, grossMarginPct: number) => resale * (1 - grossMarginPct);
/** TNMM: tested-party net margin (OP/Sales, OP/Cost or Berry ratio). */
export const tnmmOpMargin = (operatingProfit: number, sales: number) => (sales ? operatingProfit / sales : 0);
export const berryRatio = (grossProfit: number, operatingExpenses: number) =>
  operatingExpenses ? grossProfit / operatingExpenses : 0;

/** Arm's length range: 35th–65th percentile of comparables (Indian rules). */
export function armsLengthRange(comparables: number[]) {
  const s = [...comparables].sort((a, b) => a - b);
  const pct = (p: number) => {
    if (!s.length) return 0;
    const idx = (s.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return s[lo] + (s[hi] - s[lo]) * (idx - lo);
  };
  return { p35: pct(0.35), median: pct(0.5), p65: pct(0.65) };
}

export function transferPricingCheck(input: {
  method: TpMethod;
  testedMargin: number;
  comparables: number[];
  relatedPartyRevenue: number;
}) {
  const range = armsLengthRange(input.comparables);
  const compliant = input.testedMargin >= range.p35 && input.testedMargin <= range.p65;
  const adjustmentMargin = compliant ? 0 : range.median - input.testedMargin;
  return {
    ...range,
    compliant,
    adjustmentMargin,
    /** Primary TP adjustment = (median margin − tested margin) × related-party revenue */
    adjustment: Math.max(adjustmentMargin, 0) * input.relatedPartyRevenue,
  };
}

/* ------------------------------------------------------------------ */
/* Cost optimisation techniques                                        */
/* ------------------------------------------------------------------ */

/** Pareto (80/20): returns the vendors/categories driving `threshold` of spend. */
export function pareto<T extends { amount: number }>(rows: T[], threshold = 0.8) {
  const total = rows.reduce((s, r) => s + r.amount, 0) || 1;
  const sorted = [...rows].sort((a, b) => b.amount - a.amount);
  let cum = 0;
  const vital: (T & { cumShare: number })[] = [];
  for (const r of sorted) {
    cum += r.amount / total;
    vital.push({ ...r, cumShare: cum });
    if (cum >= threshold) break;
  }
  return { total, vital };
}

/** Zero-based budgeting: rebuild each line from justified need, not last year's spend. */
export const zeroBasedTarget = (justifiedNeed: number) => justifiedNeed;
export const zeroBasedSaving = (currentSpend: number, justifiedNeed: number) =>
  Math.max(currentSpend - justifiedNeed, 0);

/** Seat / licence rationalisation saving = (paid seats − active seats) × price × 12 */
export const seatRationalisation = (paidSeats: number, activeSeats: number, pricePerSeat: number) =>
  Math.max(paidSeats - activeSeats, 0) * pricePerSeat * 12;

/** Vendor consolidation saving = spend × volume discount achievable */
export const vendorConsolidation = (spend: number, discount: number) => spend * discount;

/** Should-cost / target costing: target cost = target price − required margin */
export const targetCost = (targetPrice: number, requiredMargin: number) => targetPrice * (1 - requiredMargin);

/** Activity-Based Costing rate = activity cost pool / cost driver volume */
export const abcRate = (costPool: number, driverVolume: number) => (driverVolume ? costPool / driverVolume : 0);

/** Make-or-buy: positive result favours buying (outsourcing). */
export const makeOrBuy = (makeCost: number, buyCost: number) => makeCost - buyCost;

/** Early-payment discount effective annual rate = (d/(1−d)) × (365/(N − D)) */
export const earlyPaymentApr = (discount: number, netDays: number, discountDays: number) =>
  netDays > discountDays ? (discount / (1 - discount)) * (365 / (netDays - discountDays)) : 0;

/** Sensitivity of runway to a % cut in a cost line. */
export const runwayAfterCut = (cash: number, netBurn: number, monthlySaving: number) =>
  netBurn - monthlySaving > 0 ? cash / (netBurn - monthlySaving) : Infinity;

/* ------------------------------------------------------------------ */
/* Tax & compliance (India)                                            */
/* ------------------------------------------------------------------ */

export const gstOutput = (taxableSales: number, rate = 0.18) => taxableSales * rate;
export const gstNetPayable = (outputTax: number, inputCredit: number) => Math.max(outputTax - inputCredit, 0);
export const advanceTaxInstalment = (annualTaxLiability: number, cumulativePct: number, alreadyPaid: number) =>
  Math.max(annualTaxLiability * cumulativePct - alreadyPaid, 0);
export const tdsAmount = (payment: number, rate: number) => payment * rate;
export const effectiveTaxRate = (taxExpense: number, pbt: number) => (pbt ? taxExpense / pbt : 0);

/* ------------------------------------------------------------------ */
/* The teaching library the agents are grounded on                     */
/* ------------------------------------------------------------------ */

export const FORMULAS: FormulaDef[] = [
  {
    id: "dcf",
    name: "Discounted Cash Flow (DCF)",
    category: "Valuation",
    expression: "EV = Σ FCFt/(1+WACC)^t + [FCFn(1+g)/(WACC−g)]/(1+WACC)^n",
    inputs: ["Free cash flow", "WACC", "Explicit growth", "Terminal growth", "Net debt"],
    purpose: "Values the business on the cash it will actually generate, not on revenue multiples.",
    usedBy: "FP&A Agent · Valuation Agent",
    worked: "FCF ₹1.2Cr growing 12% for 5 years, WACC 14%, terminal growth 5% → EV ≈ ₹13.4Cr.",
  },
  {
    id: "wacc",
    name: "Weighted Average Cost of Capital",
    category: "Valuation",
    expression: "WACC = (E/V)·Re + (D/V)·Rd·(1−t)",
    inputs: ["Equity", "Debt", "Cost of equity (CAPM)", "Cost of debt", "Tax rate"],
    purpose: "The hurdle rate every project, hire and acquisition must clear.",
    usedBy: "Valuation Agent",
    worked: "70% equity at 18%, 30% debt at 11% with 25% tax → WACC = 15.1%.",
  },
  {
    id: "capm",
    name: "Cost of Equity (CAPM)",
    category: "Valuation",
    expression: "Re = Rf + β(Rm − Rf)",
    inputs: ["Risk-free rate (G-Sec)", "Beta", "Market return"],
    purpose: "Prices the return an equity investor should demand for your risk.",
    usedBy: "Valuation Agent",
    worked: "Rf 7%, β 1.3, Rm 14% → Re = 16.1%.",
  },
  {
    id: "npv",
    name: "Net Present Value",
    category: "Valuation",
    expression: "NPV = Σ CFt/(1+r)^t − C0",
    inputs: ["Project cash flows", "Discount rate", "Initial outlay"],
    purpose: "Accept a project only when NPV > 0 at your WACC.",
    usedBy: "FP&A Agent",
    worked: "₹40L outlay returning ₹14L/yr for 5 years at 15% → NPV ≈ ₹6.9L, accept.",
  },
  {
    id: "irr",
    name: "Internal Rate of Return & Payback",
    category: "Valuation",
    expression: "NPV(IRR) = 0 ; Payback = Outlay / Annual cash inflow",
    inputs: ["Project cash flows", "Initial outlay"],
    purpose: "Ranks capex and expansion options on return and speed of recovery.",
    usedBy: "FP&A Agent",
    worked: "Same project → IRR ≈ 21.8%, payback 2.9 years.",
  },
  {
    id: "fcff",
    name: "Free Cash Flow to Firm",
    category: "Cash & Liquidity",
    expression: "FCFF = EBIT(1−t) + D&A − ΔWorking Capital − CapEx",
    inputs: ["EBIT", "Tax rate", "Depreciation", "Working-capital change", "CapEx"],
    purpose: "The cash the business truly throws off — the DCF input.",
    usedBy: "Cash Flow Agent",
    worked: "EBIT ₹2Cr, tax 25%, D&A ₹18L, ΔWC ₹22L, CapEx ₹30L → FCFF ₹1.16Cr.",
  },
  {
    id: "runway",
    name: "Burn Rate & Runway",
    category: "Cash & Liquidity",
    expression: "Net burn = Outflow − Inflow ; Runway = Cash / Net burn",
    inputs: ["Cash balances", "Monthly inflow", "Monthly outflow"],
    purpose: "How many months the business survives with no new funding.",
    usedBy: "Cash Flow Agent",
    worked: "Cash ₹60.7L with net burn ₹6.4L → 9.5 months of runway.",
  },
  {
    id: "ccc",
    name: "Cash Conversion Cycle",
    category: "Working Capital",
    expression: "CCC = DSO + DIO − DPO ; DSO = (AR/Revenue)×365",
    inputs: ["Receivables", "Inventory", "Payables", "Revenue", "COGS"],
    purpose: "Days your cash is trapped in operations — the cheapest source of funding.",
    usedBy: "Working Capital Agent",
    worked: "DSO 52 + DIO 0 − DPO 34 → CCC 18 days.",
  },
  {
    id: "ratios",
    name: "Liquidity Ratios",
    category: "Working Capital",
    expression: "Current = CA/CL ; Quick = (Cash+AR)/CL",
    inputs: ["Current assets", "Cash", "Receivables", "Current liabilities"],
    purpose: "Short-term solvency — lenders test this before sanctioning limits.",
    usedBy: "Working Capital Agent",
    worked: "CA ₹82L vs CL ₹41L → current 2.0×, quick 1.8×.",
  },
  {
    id: "eoq",
    name: "Economic Order Quantity",
    category: "Working Capital",
    expression: "EOQ = √(2DS/H)",
    inputs: ["Annual demand", "Cost per order", "Holding cost per unit"],
    purpose: "Order size that minimises combined ordering and holding cost.",
    usedBy: "Working Capital Agent",
    worked: "D 12,000, S ₹1,200, H ₹40 → EOQ ≈ 849 units.",
  },
  {
    id: "unit-econ",
    name: "LTV, CAC & Payback",
    category: "Unit Economics",
    expression: "LTV = (ARPU × GM%)/Churn ; CAC = S&M / New customers ; LTV:CAC ≥ 3",
    inputs: ["ARPU", "Gross margin", "Churn", "Sales & marketing spend", "New customers"],
    purpose: "Tells you whether growth spend creates or destroys value.",
    usedBy: "Growth Agent",
    worked: "ARPU ₹18k, GM 72%, churn 3% → LTV ₹4.3L vs CAC ₹96k = 4.5× — scale spend.",
  },
  {
    id: "breakeven",
    name: "Contribution Margin & Break-even",
    category: "Profitability",
    expression: "CM = P − VC ; BEP units = Fixed cost / CM ; BEP ₹ = Fixed cost / CM%",
    inputs: ["Price", "Variable cost", "Fixed cost"],
    purpose: "The revenue level below which every month loses money.",
    usedBy: "FP&A Agent",
    worked: "Fixed ₹32L/mo, CM 61% → break-even revenue ₹52.5L/mo.",
  },
  {
    id: "dupont",
    name: "DuPont ROE Decomposition",
    category: "Profitability",
    expression: "ROE = Net margin × Asset turnover × Equity multiplier",
    inputs: ["Net profit", "Revenue", "Assets", "Equity"],
    purpose: "Shows whether returns come from margin, efficiency or leverage.",
    usedBy: "Reporting Agent",
    worked: "9% × 1.6 × 1.4 → ROE 20.2%.",
  },
  {
    id: "eva",
    name: "Economic Value Added",
    category: "Profitability",
    expression: "EVA = NOPAT − (Capital employed × WACC)",
    inputs: ["NOPAT", "Capital employed", "WACC"],
    purpose: "Profit after paying for the capital used — the real scoreboard.",
    usedBy: "Valuation Agent",
    worked: "NOPAT ₹1.5Cr, capital ₹8Cr at 15% → EVA ₹30L.",
  },
  {
    id: "rule40",
    name: "Rule of 40 & Operating Leverage",
    category: "Profitability",
    expression: "Growth% + EBITDA% ≥ 40 ; DOL = Contribution / EBIT",
    inputs: ["Revenue growth", "EBITDA margin", "Contribution", "EBIT"],
    purpose: "Balances growth against profitability the way investors score it.",
    usedBy: "FP&A Agent",
    worked: "Growth 28% + EBITDA 14% = 42 → healthy trade-off.",
  },
  {
    id: "pareto",
    name: "Pareto (80/20) Spend Analysis",
    category: "Cost Optimisation",
    expression: "Rank spend desc; cumulative share ≥ 80% ⇒ vital few",
    inputs: ["Vendor / category spend"],
    purpose: "Focus negotiation on the handful of lines that carry the cost base.",
    usedBy: "Expense Intelligence Agent",
    worked: "4 of 23 vendors carried 81% of spend — renegotiate those first.",
  },
  {
    id: "zbb",
    name: "Zero-Based Budgeting",
    category: "Cost Optimisation",
    expression: "Budget = Σ justified need ; Saving = Current spend − justified need",
    inputs: ["Current spend per line", "Justified requirement"],
    purpose: "Rebuilds every line from zero instead of inflating last year.",
    usedBy: "FP&A Agent",
    worked: "Travel ₹1.4L/mo justified at ₹85k → ₹6.6L annual saving.",
  },
  {
    id: "seats",
    name: "Licence / Seat Rationalisation",
    category: "Cost Optimisation",
    expression: "Saving = (Paid seats − Active seats) × Price × 12",
    inputs: ["Paid seats", "Active users", "Price per seat"],
    purpose: "Removes shelfware from SaaS spend without touching capability.",
    usedBy: "Expense Intelligence Agent",
    worked: "9 idle seats at ₹760/mo → ₹82,000 a year.",
  },
  {
    id: "consolidation",
    name: "Vendor Consolidation & Should-Cost",
    category: "Cost Optimisation",
    expression: "Saving = Spend × Volume discount ; Target cost = Price × (1 − Required margin)",
    inputs: ["Vendor spend", "Achievable discount", "Target price", "Required margin"],
    purpose: "Converts fragmented spend into negotiating leverage.",
    usedBy: "Expense Intelligence Agent",
    worked: "₹4.8L to 3 similar agencies, 12% discount on consolidation → ₹57.6k.",
  },
  {
    id: "abc",
    name: "Activity-Based Costing",
    category: "Cost Optimisation",
    expression: "Rate = Cost pool / Driver volume ; Cost = Rate × Driver used",
    inputs: ["Overhead pools", "Cost drivers"],
    purpose: "Assigns overhead to the clients and products actually consuming it.",
    usedBy: "Reporting Agent",
    worked: "₹6L delivery overhead over 1,500 hours → ₹400/hour loaded rate.",
  },
  {
    id: "make-buy",
    name: "Make-or-Buy & Early-Payment Discount",
    category: "Cost Optimisation",
    expression: "Δ = Make cost − Buy cost ; APR = (d/(1−d))×(365/(N−D))",
    inputs: ["In-house cost", "Outsourced cost", "Discount %", "Credit days"],
    purpose: "Two of the fastest levers: outsource what is dearer in-house, take discounts that beat your cost of capital.",
    usedBy: "Expense Intelligence Agent",
    worked: "2/10 net 45 → 21.3% APR, cheaper than any working-capital loan.",
  },
  {
    id: "tp-methods",
    name: "Transfer Pricing Methods (Sec 92C)",
    category: "Transfer Pricing",
    expression: "CUP · Cost Plus: C×(1+mark-up) · Resale Price: R×(1−GM) · TNMM · PSM",
    inputs: ["Related-party transaction value", "Cost base", "Comparable margins"],
    purpose: "Prices intra-group transactions so Indian TP assessments hold up.",
    usedBy: "Compliance Agent",
    worked: "Cost ₹80L with 15% arm's length mark-up → invoice the AE at ₹92L.",
  },
  {
    id: "tp-range",
    name: "Arm's Length Range & Primary Adjustment",
    category: "Transfer Pricing",
    expression: "Range = 35th–65th percentile of comparables ; Adjustment = (Median − Tested) × RP revenue",
    inputs: ["Comparable set", "Tested-party margin", "Related-party revenue"],
    purpose: "Tests whether your margin sits inside the statutory range, and sizes the exposure if not.",
    usedBy: "Compliance Agent",
    worked: "Tested 8.4% vs range 9.1%–13.6% → adjust to median 11.2% on ₹3.2Cr = ₹89.6L.",
  },
  {
    id: "berry",
    name: "Berry Ratio & Net Margin Indicators",
    category: "Transfer Pricing",
    expression: "Berry = Gross profit / Operating expenses ; OM = Operating profit / Sales",
    inputs: ["Gross profit", "Operating expenses", "Sales"],
    purpose: "The profit level indicator used for distributors and service providers under TNMM.",
    usedBy: "Compliance Agent",
    worked: "GP ₹1.1Cr on opex ₹92L → Berry 1.20, inside the comparable range.",
  },
  {
    id: "altman",
    name: "Altman Z''-Score",
    category: "Risk & Solvency",
    expression: "Z = 6.56X1 + 3.26X2 + 6.72X3 + 1.05X4",
    inputs: ["Working capital", "Retained earnings", "EBIT", "Book equity", "Assets", "Liabilities"],
    purpose: "Early-warning distress score for private companies.",
    usedBy: "Risk Agent",
    worked: "Z = 3.1 → Safe zone.",
  },
  {
    id: "coverage",
    name: "DSCR, Interest Coverage & Concentration",
    category: "Risk & Solvency",
    expression: "DSCR = NOI/Debt service ; ICR = EBIT/Interest ; HHI = Σ share²",
    inputs: ["Operating income", "Debt service", "Interest", "Vendor/customer shares"],
    purpose: "Tests debt safety and how exposed you are to one client or vendor.",
    usedBy: "Risk Agent",
    worked: "Top customer 31% of revenue, HHI 0.21 → concentration risk flagged.",
  },
  {
    id: "gst",
    name: "GST Net Payable & Advance Tax",
    category: "Tax & Compliance",
    expression: "Net GST = Output tax − ITC ; Instalment = Liability×Cum% − Paid",
    inputs: ["Taxable sales", "Input credit", "Annual tax liability", "Paid to date"],
    purpose: "Keeps the 20th-of-month GST and quarterly advance-tax outflows funded.",
    usedBy: "Compliance Agent",
    worked: "Output ₹6.4L − ITC ₹2.45L → pay ₹3.95L by the 20th.",
  },
  {
    id: "tds",
    name: "TDS & Effective Tax Rate",
    category: "Tax & Compliance",
    expression: "TDS = Payment × Rate ; ETR = Tax expense / PBT",
    inputs: ["Vendor payments", "Applicable TDS rate", "Tax expense", "PBT"],
    purpose: "Prevents disallowance and shows the real tax drag on profit.",
    usedBy: "Compliance Agent",
    worked: "₹1.85L contractor bill at 2% → ₹3,700 TDS withheld.",
  },
];

export const FORMULA_CATEGORIES = Array.from(new Set(FORMULAS.map((f) => f.category)));
