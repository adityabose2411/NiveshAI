// Report definitions: each one converts ledger data into a printable PDF spec.
import { Transaction, bills, invoices, savingsOpportunities, company } from "@/data/demo";
import {
  Metrics,
  ageingBuckets,
  budgetRows,
  cashForecast,
  categoryTotals,
  daysBetween,
  healthScore,
  inr,
  inrFull,
  monthKeys,
  vendorTotals,
} from "@/lib/finance";
import { ReportSpec, generateReport } from "@/lib/pdf";
import {
  altmanZ,
  breakEvenRevenue,
  cashConversionCycle,
  dcf,
  dpo,
  dso,
  earlyPaymentApr,
  herfindahl,
  pareto,
  ruleOf40,
  transferPricingCheck,
  wacc,
} from "@/lib/formulas";

export interface ReportDef {
  id: string;
  name: string;
  description: string;
  pages: string;
  audience: string;
  build: (m: Metrics, txns: Transaction[]) => ReportSpec;
}

const period = "Last 6 months · FY Apr–Mar";
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const base = (title: string, subtitle: string, fileName: string, sections: ReportSpec["sections"]): ReportSpec => ({
  title,
  subtitle,
  company: company.name,
  period,
  fileName,
  sections,
});

/* ------------------------- 1. Financial health ------------------------- */
const healthReport: ReportDef["build"] = (m, txns) => {
  const h = healthScore(m);
  const months = monthKeys(txns).length;
  const cats = categoryTotals(txns);
  const dsoV = dso(m.receivables, m.avgRevenue * 12);
  const dpoV = dpo(m.payables, m.avgExpenses * 12);
  const z = altmanZ({
    workingCapital: m.cashBalance + m.receivables - m.payables,
    retainedEarnings: (m.avgRevenue - m.avgExpenses) * 12,
    ebit: (m.avgRevenue - m.avgExpenses) * 12,
    equityBook: m.cashBalance * 1.6,
    totalAssets: m.cashBalance + m.receivables + 2500000,
    totalLiabilities: m.payables + 1800000,
  });
  return base(
    "Financial Health Report",
    "A full diagnostic of profitability, liquidity, working capital and solvency, scored by the HundiAI agent stack against the formula library.",
    "HundiAI-Financial-Health-Report.pdf",
    [
      {
        heading: "Executive summary",
        paragraphs: [
          `Overall business health scores ${h.total}/100. Cash across accounts is ${inrFull(m.cashBalance)} with average monthly revenue of ${inrFull(Math.round(m.avgRevenue))} against average spend of ${inrFull(Math.round(m.avgExpenses))}, leaving a net monthly movement of ${inrFull(Math.round(m.avgRevenue - m.avgExpenses))}.`,
          `At the current net burn the business holds ${m.runwayMonths.toFixed(1)} months of runway. Receivables stand at ${inrFull(m.receivables)} (${inrFull(m.overdueReceivables)} overdue) and payables at ${inrFull(m.payables)} (${inrFull(m.overduePayables)} overdue).`,
        ],
        kpis: [
          { label: "Health score", value: `${h.total}/100` },
          { label: "Cash balance", value: inr(m.cashBalance) },
          { label: "Runway", value: `${m.runwayMonths.toFixed(1)} months` },
          { label: "Avg monthly revenue", value: inr(m.avgRevenue) },
          { label: "Gross margin", value: pct(m.grossMargin) },
          { label: "Rule of 40", value: ruleOf40(m.revenueGrowth * 100, m.grossMargin * 100).toFixed(0) },
        ],
      },
      {
        heading: "Score breakdown",
        table: {
          head: ["Dimension", "Score", "Basis used by the agent"],
          rows: h.parts.map((p) => [p.label, `${p.score}/100`, p.hint]),
          widthHints: { 0: 40, 1: 20 },
        },
      },
      {
        heading: "Working capital & solvency",
        table: {
          head: ["Metric", "Formula", "Value"],
          rows: [
            ["DSO", "(Receivables / Revenue) × 365", `${dsoV.toFixed(0)} days`],
            ["DPO", "(Payables / COGS) × 365", `${dpoV.toFixed(0)} days`],
            ["Cash conversion cycle", "DSO + DIO − DPO", `${cashConversionCycle(dsoV, 0, dpoV).toFixed(0)} days`],
            ["Break-even revenue", "Fixed cost / CM%", inrFull(Math.round(breakEvenRevenue(m.avgExpenses * 0.62, Math.max(m.grossMargin, 0.2))))],
            ["Altman Z''", "6.56X1+3.26X2+6.72X3+1.05X4", `${z.z.toFixed(2)} (${z.zone})`],
            ["Vendor concentration (HHI)", "Σ share²", herfindahl(vendorTotals(txns).map((v) => v.share)).toFixed(3)],
          ],
          widthHints: { 0: 46 },
        },
      },
      {
        heading: "Cost structure",
        table: {
          head: ["Category", "6-month spend", "Monthly average", "Share"],
          rows: cats.slice(0, 10).map((c) => [
            c.category,
            inrFull(c.amount),
            inrFull(Math.round(c.amount / months)),
            pct(c.amount / cats.reduce((s, x) => s + x.amount, 0)),
          ]),
        },
        note: "Figures derive from categorised bank and gateway transactions. Recategorisations you approve in the app flow straight into this report.",
      },
    ],
  );
};

/* ------------------------- 2. Cash flow ------------------------- */
const cashReport: ReportDef["build"] = (m, txns) => {
  const f = cashForecast(m, 6);
  const series = m.series;
  return base(
    "Cash Flow & Runway Report",
    "Historic inflows and outflows, a driver-based 6-month forecast, and the liquidity actions the Cash Flow Agent recommends.",
    "HundiAI-Cash-Flow-Report.pdf",
    [
      {
        heading: "Position today",
        kpis: [
          { label: "Cash balance", value: inr(m.cashBalance) },
          { label: "Net monthly movement", value: inr(Math.round(m.avgRevenue - m.avgExpenses)) },
          { label: "Runway", value: `${m.runwayMonths.toFixed(1)} months` },
          { label: "Receivables due", value: inr(m.receivables) },
          { label: "Payables due", value: inr(m.payables) },
          { label: "Dues next 10 days", value: inr(m.duesNext10Days) },
        ],
        paragraphs: [
          `Runway = Cash / Net burn = ${inrFull(m.cashBalance)} / ${inrFull(m.burn)}. The forecast below assumes ${pct(0.45)} of open receivables collect in month 1, ${pct(0.35)} in month 2 and the balance thereafter.`,
        ],
      },
      {
        heading: "Historic monthly flows",
        table: {
          head: ["Month", "Revenue", "Expenses", "Net"],
          rows: series.map((s) => [s.label, inrFull(s.revenue), inrFull(s.expenses), inrFull(s.net)]),
        },
      },
      {
        heading: "Forecast (driver based)",
        table: {
          head: ["Month", "Opening", "Revenue", "Collections", "Payroll", "Vendors", "Taxes", "Opex", "Closing"],
          rows: f.map((r) => [
            r.label,
            inr(r.opening),
            inr(r.revenue),
            inr(r.receivables),
            inr(r.payroll),
            inr(r.vendors),
            inr(r.taxes),
            inr(r.opex),
            inr(r.closing),
          ]),
        },
        note: "Forecast is deterministic: each driver is the trailing average of that category, revenue decays 2% a month to stay conservative.",
      },
      {
        heading: "Recommended actions",
        bullets: [
          `Chase ${inrFull(m.overdueReceivables)} of overdue invoices — the single fastest liquidity lever available.`,
          `Hold a ${inrFull(500000)} buffer ahead of the GST outflow on the 20th.`,
          `Negotiate early-payment discounts: 2/10 net 45 terms are worth ${pct(earlyPaymentApr(0.02, 45, 10))} annualised, cheaper than borrowing.`,
        ],
      },
    ],
  );
};

/* ------------------------- 3. P&L ------------------------- */
const plReport: ReportDef["build"] = (m, txns) => {
  const cats = categoryTotals(txns);
  const revenue = m.series.reduce((s, x) => s + x.revenue, 0);
  const expenses = m.series.reduce((s, x) => s + x.expenses, 0);
  return base(
    "Profit & Loss Summary",
    "Management P&L for the reading period with margin analysis and variance commentary generated by the Reporting Agent.",
    "HundiAI-Profit-And-Loss.pdf",
    [
      {
        heading: "Summary",
        kpis: [
          { label: "Revenue", value: inr(revenue) },
          { label: "Total expenses", value: inr(expenses) },
          { label: "Net profit", value: inr(revenue - expenses) },
          { label: "Net margin", value: pct(revenue ? (revenue - expenses) / revenue : 0) },
          { label: "Revenue growth (MoM)", value: pct(m.revenueGrowth) },
          { label: "Expense growth (MoM)", value: pct(m.expenseGrowth) },
        ],
      },
      {
        heading: "Statement",
        table: {
          head: ["Line item", "Amount", "% of revenue"],
          rows: [
            ["Revenue", inrFull(revenue), "100.0%"],
            ...cats.map((c) => [c.category, `(${inrFull(c.amount)})`, pct(c.amount / (revenue || 1))]),
            ["Net profit", inrFull(revenue - expenses), pct(revenue ? (revenue - expenses) / revenue : 0)],
          ],
          widthHints: { 0: 60 },
        },
      },
      {
        heading: "Budget variance",
        table: {
          head: ["Category", "Budget", "Actual (MTD)", "Forecast", "Variance"],
          rows: budgetRows(txns).map((b) => [
            b.category,
            inrFull(b.monthlyBudget),
            inrFull(b.actual),
            inrFull(b.forecast),
            `${b.forecast > b.monthlyBudget ? "+" : "−"}${inrFull(Math.abs(b.forecast - b.monthlyBudget))}`,
          ]),
        },
      },
    ],
  );
};

/* ------------------------- 4. Valuation ------------------------- */
export const VALUATION_ASSUMPTIONS = {
  growth: 0.14,
  years: 5,
  terminalGrowth: 0.05,
  riskFree: 0.07,
  beta: 1.25,
  marketReturn: 0.14,
  costDebt: 0.11,
  taxRate: 0.25,
  debtShare: 0.25,
};

export function valuationInputs(m: Metrics) {
  const annualFcf = Math.max((m.avgRevenue - m.avgExpenses) * 12 * 0.85, 100000);
  const costEquity =
    VALUATION_ASSUMPTIONS.riskFree + VALUATION_ASSUMPTIONS.beta * (VALUATION_ASSUMPTIONS.marketReturn - VALUATION_ASSUMPTIONS.riskFree);
  const equityShare = 1 - VALUATION_ASSUMPTIONS.debtShare;
  const rate = wacc({
    equity: equityShare,
    debt: VALUATION_ASSUMPTIONS.debtShare,
    costEquity,
    costDebt: VALUATION_ASSUMPTIONS.costDebt,
    taxRate: VALUATION_ASSUMPTIONS.taxRate,
  });
  const result = dcf({
    baseFcf: annualFcf,
    growth: VALUATION_ASSUMPTIONS.growth,
    years: VALUATION_ASSUMPTIONS.years,
    discountRate: rate,
    terminalGrowth: VALUATION_ASSUMPTIONS.terminalGrowth,
    netDebt: Math.max(m.payables - m.cashBalance, 0),
  });
  return { annualFcf, costEquity, rate, result };
}

const valuationReport: ReportDef["build"] = (m) => {
  const { annualFcf, costEquity, rate, result } = valuationInputs(m);
  const tp = transferPricingCheck({
    method: "TNMM",
    testedMargin: m.grossMargin,
    comparables: [0.082, 0.094, 0.107, 0.118, 0.126, 0.139, 0.152],
    relatedPartyRevenue: m.avgRevenue * 4,
  });
  return base(
    "Valuation & Technical Analysis",
    "Discounted cash flow valuation, cost of capital build-up, sensitivity grid and transfer-pricing position.",
    "HundiAI-Valuation-Report.pdf",
    [
      {
        heading: "Valuation summary",
        kpis: [
          { label: "Enterprise value", value: inr(result.enterpriseValue) },
          { label: "Equity value", value: inr(result.equityValue) },
          { label: "WACC", value: pct(rate) },
          { label: "Cost of equity (CAPM)", value: pct(costEquity) },
          { label: "Year-1 FCF", value: inr(annualFcf) },
          { label: "Terminal value (PV)", value: inr(result.pvTerminal) },
        ],
        paragraphs: [
          `Cost of equity uses CAPM: Re = ${pct(VALUATION_ASSUMPTIONS.riskFree)} + ${VALUATION_ASSUMPTIONS.beta} × (${pct(VALUATION_ASSUMPTIONS.marketReturn)} − ${pct(VALUATION_ASSUMPTIONS.riskFree)}) = ${pct(costEquity)}. WACC blends ${pct(1 - VALUATION_ASSUMPTIONS.debtShare)} equity and ${pct(VALUATION_ASSUMPTIONS.debtShare)} debt at ${pct(VALUATION_ASSUMPTIONS.costDebt)} pre-tax with a ${pct(VALUATION_ASSUMPTIONS.taxRate)} tax shield.`,
          `Terminal value applies Gordon Growth: TV = FCFn × (1 + g) / (WACC − g) with g = ${pct(VALUATION_ASSUMPTIONS.terminalGrowth)}.`,
        ],
      },
      {
        heading: "Explicit forecast period",
        table: {
          head: ["Year", "Free cash flow", "Discount factor", "Present value"],
          rows: result.rows.map((r) => [`Year ${r.year}`, inrFull(Math.round(r.fcf)), r.discountFactor.toFixed(3), inrFull(Math.round(r.pv))]),
        },
      },
      {
        heading: "Sensitivity — enterprise value",
        table: {
          head: ["WACC \\ terminal g", "3%", "4%", "5%", "6%"],
          rows: [-0.02, -0.01, 0, 0.01, 0.02].map((dw) => [
            pct(rate + dw),
            ...[0.03, 0.04, 0.05, 0.06].map((g) =>
              inr(
                dcf({
                  baseFcf: annualFcf,
                  growth: VALUATION_ASSUMPTIONS.growth,
                  years: VALUATION_ASSUMPTIONS.years,
                  discountRate: rate + dw,
                  terminalGrowth: g,
                  netDebt: 0,
                }).enterpriseValue,
              ),
            ),
          ]),
        },
      },
      {
        heading: "Transfer pricing position (Sec 92C, TNMM)",
        table: {
          head: ["Test", "Value"],
          rows: [
            ["Tested-party operating margin", pct(m.grossMargin)],
            ["Arm's length range (35th–65th pct)", `${pct(tp.p35)} – ${pct(tp.p65)}`],
            ["Median of comparables", pct(tp.median)],
            [
              "Within range?",
              tp.compliant
                ? "Yes — no adjustment"
                : tp.adjustmentMargin > 0
                  ? "Below range — upward adjustment required"
                  : "Above range — no adjustment (margin exceeds range)",
            ],
            ["Primary adjustment exposure", inrFull(Math.round(tp.adjustment))],
          ],
          widthHints: { 0: 70 },
        },
        note: "Comparable margins shown are illustrative. In production the Compliance Agent pulls a screened comparable set and documents the search strategy for the TP study.",
      },
    ],
  );
};

/* ------------------------- 5. Cost optimisation ------------------------- */
const costReport: ReportDef["build"] = (m, txns) => {
  const vendors = vendorTotals(txns);
  const { vital, total } = pareto(vendors.map((v) => ({ ...v, amount: v.amount })));
  const savings = savingsOpportunities.reduce((s, o) => s + o.annualSaving, 0);
  return base(
    "Cost Optimisation Report",
    "Pareto spend analysis, zero-based budget targets, vendor leverage and a costed savings plan from the Expense Intelligence Agent.",
    "HundiAI-Cost-Optimisation-Report.pdf",
    [
      {
        heading: "Opportunity summary",
        kpis: [
          { label: "Annual savings identified", value: inr(savings) },
          { label: "As % of annual spend", value: pct(savings / Math.max(m.avgExpenses * 12, 1)) },
          {
            label: "Runway impact",
            value:
              m.burn > 0
                ? `+${(m.cashBalance / Math.max(m.burn - savings / 12, 1) - m.runwayMonths).toFixed(1)} months`
                : "Cash-flow positive — extends buffer",
          },
          { label: "Vendors driving 80% spend", value: `${vital.length} of ${vendors.length}` },
          { label: "6-month spend base", value: inr(total) },
          { label: "Techniques applied", value: "6" },
        ],
      },
      {
        heading: "Pareto — the vital few",
        table: {
          head: ["Vendor", "Spend", "Share", "Cumulative"],
          rows: vital.map((v) => [v.vendor, inrFull(v.amount), pct(v.share), pct(v.cumShare)]),
        },
      },
      {
        heading: "Costed savings plan",
        table: {
          head: ["Opportunity", "Technique", "Annual saving", "Confidence"],
          rows: savingsOpportunities.map((o) => [o.title, o.why, inrFull(o.annualSaving), o.confidence]),
          widthHints: { 0: 44 },
        },
      },
      {
        heading: "Techniques the agent applied",
        bullets: [
          "Pareto 80/20 — concentrate renegotiation on the vendors carrying the cost base.",
          "Zero-based budgeting — rebuild every discretionary line from justified need instead of last year's spend.",
          "Licence rationalisation — (paid seats − active seats) × price × 12.",
          "Vendor consolidation — convert fragmented spend into a volume discount.",
          "Activity-based costing — load overhead onto the clients that consume it before repricing.",
          `Early-payment discounts — 2/10 net 45 equals ${pct(earlyPaymentApr(0.02, 45, 10))} annualised return on cash.`,
        ],
      },
    ],
  );
};

/* ------------------------- 6. Receivables & payables ------------------------- */
const arApReport: ReportDef["build"] = (m) => {
  const a = ageingBuckets();
  return base(
    "Receivables & Payables Report",
    "Invoice ageing, collection priority, payables calendar and the working-capital consequence of each.",
    "HundiAI-Receivables-Payables-Report.pdf",
    [
      {
        heading: "Ageing summary",
        kpis: [
          { label: "Open receivables", value: inr(a.total) },
          { label: "Not yet due", value: inr(a.current) },
          { label: "1–30 days overdue", value: inr(a.d30) },
          { label: "31–60 days overdue", value: inr(a.d60) },
          { label: "60+ days overdue", value: inr(a.d90) },
          { label: "Open payables", value: inr(m.payables) },
        ],
      },
      {
        heading: "Collection priority",
        table: {
          head: ["Invoice", "Customer", "Amount", "Due", "Days", "Status"],
          rows: invoices
            .filter((i) => i.status !== "paid")
            .sort((x, y) => daysBetween(x.due) - daysBetween(y.due))
            .reverse()
            .map((i) => [i.number, i.customer, inrFull(i.amount), i.due, `${daysBetween(i.due)}`, i.status]),
        },
      },
      {
        heading: "Payables calendar",
        table: {
          head: ["Bill", "Vendor", "Amount", "Due", "Priority", "Status"],
          rows: bills
            .filter((b) => b.status !== "paid")
            .map((b) => [b.number, b.vendor, inrFull(b.amount), b.due, b.importance, b.status]),
        },
        note: "The AP Agent sequences payments by statutory deadline first (GST, TDS, payroll), then by supplier criticality, then by discount value.",
      },
    ],
  );
};

/* ------------------------- registry ------------------------- */
export const REPORTS: ReportDef[] = [
  {
    id: "health",
    name: "Financial Health Report",
    description: "Scored diagnostic across cash flow, profitability, working capital, budget discipline and solvency.",
    pages: "3–4 pages",
    audience: "Founder · Board",
    build: healthReport,
  },
  {
    id: "cash",
    name: "Cash Flow & Runway Report",
    description: "Historic flows, driver-based 6-month forecast and liquidity actions.",
    pages: "3 pages",
    audience: "Founder · Lender",
    build: cashReport,
  },
  {
    id: "pl",
    name: "Profit & Loss Summary",
    description: "Management P&L with margin analysis and budget variance commentary.",
    pages: "2–3 pages",
    audience: "Founder · CA",
    build: plReport,
  },
  {
    id: "valuation",
    name: "Valuation & Technical Analysis",
    description: "DCF, WACC build-up, sensitivity grid and transfer-pricing position.",
    pages: "3 pages",
    audience: "Investor · Board",
    build: valuationReport,
  },
  {
    id: "cost",
    name: "Cost Optimisation Report",
    description: "Pareto analysis, zero-based targets and a costed savings plan.",
    pages: "3 pages",
    audience: "Founder · Ops",
    build: costReport,
  },
  {
    id: "arap",
    name: "Receivables & Payables Report",
    description: "Ageing, collection priority and the payables calendar.",
    pages: "2–3 pages",
    audience: "Finance team",
    build: arApReport,
  },
];

export function downloadReport(id: string, m: Metrics, txns: Transaction[]) {
  const def = REPORTS.find((r) => r.id === id);
  if (!def) return;
  generateReport(def.build(m, txns));
}

export function downloadBoardPack(m: Metrics, txns: Transaction[]) {
  const sections = REPORTS.flatMap((r) => {
    const spec = r.build(m, txns);
    return [{ heading: r.name.toUpperCase(), paragraphs: [spec.subtitle] }, ...spec.sections];
  });
  generateReport({
    title: "Board Pack",
    subtitle: "Every HundiAI report combined into a single investor-ready pack.",
    company: company.name,
    period,
    fileName: "HundiAI-Board-Pack.pdf",
    sections,
  });
}
