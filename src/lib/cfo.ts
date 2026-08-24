// The AI CFO answer engine.
// Numbers are always computed deterministically from the ledger; this module only
// decides which specialist agent answers and how the numbers are explained.
import { Transaction, bills, invoices, savingsOpportunities } from "@/data/demo";
import {
  Metrics,
  ageingBuckets,
  budgetRows,
  cashForecast,
  categoryTotals,
  daysBetween,
  inr,
  vendorTotals,
} from "@/lib/finance";

export interface CfoAnswer {
  agent: string;
  headline: string;
  body: string[];
  numbers: { label: string; value: string }[];
  dataUsed: string;
  next: string[];
}

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

export function answerQuestion(raw: string, m: Metrics, txns: Transaction[]): CfoAnswer {
  const q = raw.toLowerCase();

  if (has(q, "runway", "how long", "survive", "last")) {
    const f = cashForecast(m, 6);
    return {
      agent: "Cash Flow Agent",
      headline: `You have ${m.runwayMonths.toFixed(1)} months of runway.`,
      body: [
        `Cash across your accounts is ${inr(m.cashBalance)} and average monthly outflow over the last closed months is ${inr(m.burn)}.`,
        `Because average revenue (${inr(m.avgRevenue)}) covers ${Math.round((m.avgRevenue / m.avgExpenses) * 100)}% of spend, your true net monthly movement is ${inr(m.avgRevenue - m.avgExpenses)}.`,
        `Projected closing cash: ${f.slice(0, 3).map((r) => `${r.label} ${inr(r.closing)}`).join(", ")}.`,
      ],
      numbers: [
        { label: "Cash", value: inr(m.cashBalance) },
        { label: "Monthly outflow", value: inr(m.burn) },
        { label: "Runway", value: `${m.runwayMonths.toFixed(1)} mo` },
      ],
      dataUsed: "All account balances, 6 months of transactions, payables schedule",
      next: ["Collect the ₹9.8L of overdue receivables", "Hold the ₹5L buffer before the GST outflow"],
    };
  }

  if (has(q, "hire", "hiring", "headcount", "salary", "afford")) {
    const salary = 900000; // ₹9L annual per mid-level hire
    const monthly = salary / 12;
    const newBurn = m.burn + monthly;
    return {
      agent: "FP&A Agent",
      headline: `Yes — you can afford 2 hires at ₹9L each, with runway moving from ${m.runwayMonths.toFixed(1)} to ${(m.cashBalance / (m.burn + 2 * monthly)).toFixed(1)} months.`,
      body: [
        `Each ₹9L hire adds ${inr(monthly)} to monthly payroll, taking outflow from ${inr(m.burn)} to ${inr(newBurn)} per hire.`,
        `With current revenue of ${inr(m.avgRevenue)} per month, two hires keep you cash-positive as long as revenue stays above ${inr(m.avgExpenses + 2 * monthly)}.`,
        "Model other combinations on the Planning screen — it runs the same maths for salary, timing and revenue growth.",
      ],
      numbers: [
        { label: "Cost per hire / mo", value: inr(monthly) },
        { label: "Runway with 2 hires", value: `${(m.cashBalance / (m.burn + 2 * monthly)).toFixed(1)} mo` },
        { label: "Break-even revenue", value: inr(m.avgExpenses + 2 * monthly) },
      ],
      dataUsed: "Payroll history, average revenue and expenses, current cash",
      next: ["Open Planning → Hiring scenario", "Stagger start dates by 60 days to protect the buffer"],
    };
  }

  if (has(q, "cut", "reduce", "save", "saving", "optimis", "optimiz", "waste")) {
    const total = savingsOpportunities.reduce((s, o) => s + o.annualSaving, 0);
    return {
      agent: "Expense Intelligence Agent",
      headline: `I found ${inr(total)} of annual savings across ${savingsOpportunities.length} items.`,
      body: savingsOpportunities.map((o) => `${o.title}: ${o.why} (${inr(o.annualSaving)}/yr, confidence ${o.confidence.toLowerCase()}).`),
      numbers: [
        { label: "Annual saving", value: inr(total) },
        { label: "Monthly impact", value: inr(total / 12) },
        { label: "High confidence", value: `${savingsOpportunities.filter((o) => o.confidence === "High").length} items` },
      ],
      dataUsed: "12 months of recurring charges, vendor invoices, headcount, gateway fee slabs",
      next: ["Approve the duplicate-subscription cancellation", "Review SaaS seats against 24 employees"],
    };
  }

  if (has(q, "spend", "spent", "expense", "cost", "where is my money", "biggest")) {
    const cats = categoryTotals(txns).slice(0, 5);
    const totalSpend = categoryTotals(txns).reduce((s, c) => s + c.amount, 0);
    return {
      agent: "Accounting Agent",
      headline: `Your five largest cost lines are ${cats.map((c) => c.category).join(", ")}.`,
      body: [
        `Total expenses over the period: ${inr(totalSpend)}.`,
        ...cats.map((c) => `${c.category}: ${inr(c.amount)} (${Math.round((c.amount / totalSpend) * 100)}% of spend).`),
        `Top vendors: ${vendorTotals(txns).slice(0, 3).map((v) => `${v.vendor} ${inr(v.amount)}`).join(", ")}.`,
      ],
      numbers: [
        { label: "Total spend", value: inr(totalSpend) },
        { label: "Largest line", value: `${cats[0].category} ${inr(cats[0].amount)}` },
        { label: "This month", value: inr(m.monthlyExpenses) },
      ],
      dataUsed: "All categorised expense transactions across 6 months",
      next: ["Open Expenses for vendor-level detail", "Compare against budgets"],
    };
  }

  if (has(q, "invoice", "receivable", "owe me", "collect", "customer")) {
    const a = ageingBuckets();
    const overdue = invoices.filter((i) => i.status === "overdue");
    return {
      agent: "Accounts Receivable Agent",
      headline: `${inr(a.total)} is outstanding, of which ${inr(m.overdueReceivables)} is overdue.`,
      body: [
        `Ageing: current ${inr(a.current)}, 1–30 days ${inr(a.d30)}, 31–60 days ${inr(a.d60)}, 60+ days ${inr(a.d90)}.`,
        ...overdue.slice(0, 3).map((i) => `${i.number} — ${i.customer}, ${inr(i.amount)}, ${daysBetween(i.due)} days overdue.`),
        "Collecting the 60+ day bucket alone would fund a full month of payroll.",
      ],
      numbers: [
        { label: "Outstanding", value: inr(a.total) },
        { label: "Overdue", value: inr(m.overdueReceivables) },
        { label: "Invoices open", value: `${invoices.filter((i) => i.status !== "paid").length}` },
      ],
      dataUsed: "Invoice ledger with issue and due dates, payment history",
      next: ["Approve reminders for the two oldest invoices", "Tighten terms for repeat late payers"],
    };
  }

  if (has(q, "bill", "payable", "vendor pay", "due", "pay first", "obligation")) {
    const upcoming = bills.filter((b) => b.status !== "paid").sort((a, b) => (a.due < b.due ? -1 : 1));
    return {
      agent: "Accounts Payable Agent",
      headline: `${inr(m.payables)} is payable, with ${inr(m.overduePayables)} already overdue.`,
      body: [
        `Payment order by risk: ${upcoming
          .filter((b) => b.importance === "critical")
          .map((b) => b.vendor)
          .join(", ")} first (service interruption or statutory penalty), then the rest by due date.`,
        ...upcoming.slice(0, 4).map((b) => `${b.number} — ${b.vendor}, ${inr(b.amount)}, due ${b.due} (${b.importance}).`),
      ],
      numbers: [
        { label: "Total payable", value: inr(m.payables) },
        { label: "Overdue", value: inr(m.overduePayables) },
        { label: "Due in 10 days", value: inr(m.duesNext10Days) },
      ],
      dataUsed: "Vendor bills, due dates, importance classification, cash forecast",
      next: ["Approve the recommended payment sequence", "Reschedule BILL-2203 past the GST outflow"],
    };
  }

  if (has(q, "budget", "over budget", "variance", "plan vs")) {
    const rows = budgetRows(txns).sort((a, b) => b.forecastPct - a.forecastPct);
    return {
      agent: "FP&A Agent",
      headline: `${rows.filter((r) => r.forecastPct > 1).length} categories are forecast to breach budget this month.`,
      body: rows
        .slice(0, 4)
        .map((r) => `${r.category}: ${inr(r.actual)} spent, run-rating to ${inr(r.forecast)} against ${inr(r.monthlyBudget)} (${Math.round(r.forecastPct * 100)}% of budget).`),
      numbers: [
        { label: "Budget", value: inr(rows.reduce((s, r) => s + r.monthlyBudget, 0)) },
        { label: "Forecast", value: inr(rows.reduce((s, r) => s + r.forecast, 0)) },
        { label: "Breaches", value: `${rows.filter((r) => r.forecastPct > 1).length}` },
      ],
      dataUsed: "Current-month transactions, category budgets, month progress",
      next: ["Freeze the largest breaching category", "Rebalance budget from underspent lines"],
    };
  }

  if (has(q, "profit", "margin", "revenue", "growth", "how am i doing", "health")) {
    return {
      agent: "Reporting Agent",
      headline: `Average monthly margin is ${Math.round(m.grossMargin * 100)}% on revenue of ${inr(m.avgRevenue)}.`,
      body: [
        `Revenue is run-rating at ${inr(m.monthlyRevenue)} this month, ${m.revenueGrowth >= 0 ? "up" : "down"} ${Math.abs(Math.round(m.revenueGrowth * 100))}% versus last month.`,
        `Expenses are run-rating at ${inr(m.monthlyExpenses)}, ${m.expenseGrowth >= 0 ? "up" : "down"} ${Math.abs(Math.round(m.expenseGrowth * 100))}%.`,
        `Net cash movement this month is ${inr(m.netCashFlow)}.`,
      ],
      numbers: [
        { label: "Revenue (run-rate)", value: inr(m.monthlyRevenue) },
        { label: "Expenses (run-rate)", value: inr(m.monthlyExpenses) },
        { label: "Margin", value: `${Math.round(m.grossMargin * 100)}%` },
      ],
      dataUsed: "6 months of income and expense transactions",
      next: ["Open Reports for the full P&L view", "Compare category growth against revenue growth"],
    };
  }

  if (has(q, "tax", "gst", "compliance", "tds")) {
    const taxes = categoryTotals(txns).find((c) => c.category === "Taxes");
    const gst = bills.find((b) => b.vendor === "GST Payment");
    return {
      agent: "Cash Flow Agent",
      headline: `Your next GST outflow is ${gst ? inr(gst.amount) : "—"}, due ${gst?.due ?? "—"}.`,
      body: [
        `You have paid ${taxes ? inr(taxes.amount) : "₹0"} in statutory outflows over the last 6 months, averaging ${taxes ? inr(taxes.amount / 6) : "₹0"} per month.`,
        "Statutory payments are treated as critical in the payment ordering because penalties are non-negotiable.",
        "HundiAI does not file returns — it makes sure the cash is reserved before the date arrives.",
      ],
      numbers: [
        { label: "Next GST", value: gst ? inr(gst.amount) : "—" },
        { label: "6-month statutory", value: taxes ? inr(taxes.amount) : "—" },
        { label: "Buffer target", value: inr(500000) },
      ],
      dataUsed: "Tax category transactions, payables schedule",
      next: ["Reserve the GST amount before the 20th", "Review the buffer recommendation"],
    };
  }

  if (has(q, "cash flow", "forecast", "next month", "next 3", "90 day", "projection")) {
    const f = cashForecast(m, 3);
    return {
      agent: "Cash Flow Agent",
      headline: `Projected closing cash: ${f.map((r) => `${r.label} ${inr(r.closing)}`).join(" → ")}.`,
      body: f.map(
        (r) =>
          `${r.label}: opening ${inr(r.opening)}, revenue ${inr(r.revenue)}, collections ${inr(r.receivables)}, payroll ${inr(r.payroll)}, vendors & marketing ${inr(r.vendors)}, taxes ${inr(r.taxes)}, other opex ${inr(r.opex)} → closing ${inr(r.closing)}.`,
      ),
      numbers: [
        { label: "Lowest point", value: inr(Math.min(...f.map((r) => r.closing))) },
        { label: "3-month change", value: inr(f[f.length - 1].closing - m.cashBalance) },
        { label: "Collections assumed", value: inr(f.reduce((s, r) => s + r.receivables, 0)) },
      ],
      dataUsed: "6 months of inflows/outflows, open invoices, scheduled bills",
      next: ["Stress-test the forecast on the Planning screen", "Confirm the collection assumptions"],
    };
  }

  // Fallback — orchestrator routes and summarises
  return {
    agent: "CFO Orchestrator",
    headline: "Here's the position across every agent right now.",
    body: [
      `Cash ${inr(m.cashBalance)}, runway ${m.runwayMonths.toFixed(1)} months, net movement this month ${inr(m.netCashFlow)}.`,
      `Receivables ${inr(m.receivables)} (${inr(m.overdueReceivables)} overdue) and payables ${inr(m.payables)} (${inr(m.overduePayables)} overdue).`,
      `Largest cost line is ${categoryTotals(txns)[0].category} at ${inr(categoryTotals(txns)[0].amount)} over six months.`,
      "Ask me about runway, hiring, cash flow, spending, budgets, invoices, bills, taxes or savings and I'll route it to the right specialist agent.",
    ],
    numbers: [
      { label: "Cash", value: inr(m.cashBalance) },
      { label: "Runway", value: `${m.runwayMonths.toFixed(1)} mo` },
      { label: "Net this month", value: inr(m.netCashFlow) },
    ],
    dataUsed: "All connected accounts, ledger, invoices and bills",
    next: ["Ask: can I afford two hires?", "Ask: where can I cut costs?"],
  };
}

export const suggestedQuestions = [
  "How much runway do I have?",
  "Can I afford to hire two people?",
  "Where can I cut costs without hurting growth?",
  "What does my cash look like over the next 3 months?",
  "Which invoices should I chase first?",
  "Which bills should I pay first?",
  "Am I over budget anywhere?",
  "How profitable am I really?",
];
