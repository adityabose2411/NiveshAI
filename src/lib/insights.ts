// Deterministic insight generation. Numbers come from finance.ts; the wording is
// templated so every explanation is traceable to the data that produced it.
import { Transaction, bills, invoices, savingsOpportunities } from "@/data/demo";
import {
  Metrics,
  budgetRows,
  cashForecast,
  categoryTotals,
  currentMonthKey,
  daysBetween,
  inr,
  monthProgress,
  reconciliationStats,
  vendorTotals,
} from "@/lib/finance";

export type InsightKind = "attention" | "risk" | "opportunity" | "positive";

export interface Insight {
  id: string;
  kind: InsightKind;
  agent: string;
  title: string;
  finding: string;
  why: string;
  dataUsed: string;
  action: string;
  metric?: string;
}

export function buildInsights(m: Metrics, txns: Transaction[]): Insight[] {
  const out: Insight[] = [];
  const key = currentMonthKey();
  const { day, total, factor } = monthProgress();
  const rows = budgetRows(txns);
  const forecast = cashForecast(m);
  const recon = reconciliationStats(txns);

  // 1. Budget overrun (largest forecast breach)
  const breach = [...rows].sort((a, b) => b.forecastPct - a.forecastPct)[0];
  if (breach && breach.forecastPct > 1) {
    out.push({
      id: "ins-budget",
      kind: "attention",
      agent: "FP&A Agent",
      title: `${breach.category} will finish ${Math.round((breach.forecastPct - 1) * 100)}% over budget`,
      finding: `${breach.category} is at ${inr(breach.actual)} after ${day} of ${total} days, which run-rates to ${inr(breach.forecast)} against a ${inr(breach.monthlyBudget)} budget.`,
      why: `Spend is ${Math.round((breach.forecastPct - 1) * 100)}% above plan with ${breach.daysLeft} days left, so the overrun is locked in unless spend is paused.`,
      dataUsed: `${breach.category} transactions for ${key}, category budget, ${day}/${total} month progress`,
      action: `Pause discretionary ${breach.category.toLowerCase()} spend or raise the budget deliberately.`,
      metric: inr(breach.forecast - breach.monthlyBudget) + " over",
    });
  }

  // 2. Overdue receivables
  const overdue = invoices.filter((i) => i.status === "overdue");
  if (overdue.length) {
    const worst = [...overdue].sort((a, b) => daysBetween(b.due) - daysBetween(a.due))[0];
    out.push({
      id: "ins-ar",
      kind: "risk",
      agent: "Accounts Receivable Agent",
      title: `${inr(m.overdueReceivables)} of receivables are overdue`,
      finding: `${overdue.length} invoices are past due. The oldest, ${worst.number} from ${worst.customer}, is ${daysBetween(worst.due)} days late for ${inr(worst.amount)}.`,
      why: `Overdue receivables equal ${(m.overdueReceivables / Math.max(m.avgExpenses, 1)).toFixed(1)}x of one month's operating spend — collecting them is cheaper than any financing.`,
      dataUsed: "Invoice ageing ledger, customer payment history",
      action: "Approve the drafted reminders, starting with the two oldest invoices.",
      metric: `${overdue.length} invoices`,
    });
  }

  // 3. Runway
  out.push({
    id: "ins-runway",
    kind: m.runwayMonths < 4 ? "risk" : "positive",
    agent: "Cash Flow Agent",
    title: `Runway is ${m.runwayMonths.toFixed(1)} months at the current burn`,
    finding: `Cash of ${inr(m.cashBalance)} against an average monthly outflow of ${inr(m.burn)} gives ${m.runwayMonths.toFixed(1)} months of cover.`,
    why: `Average revenue of ${inr(m.avgRevenue)} covers ${Math.round((m.avgRevenue / Math.max(m.avgExpenses, 1)) * 100)}% of spend, so runway is ${m.avgRevenue >= m.avgExpenses ? "stable rather than depleting" : "shortening each month"}.`,
    dataUsed: "All bank + gateway balances, 6 months of transactions",
    action: m.runwayMonths < 4 ? "Convert overdue receivables and defer non-critical vendor payments." : "Hold the buffer and reinvest surplus into growth.",
    metric: inr(m.cashBalance),
  });

  // 4. Savings opportunity
  const saving = savingsOpportunities.reduce((s, o) => s + o.annualSaving, 0);
  out.push({
    id: "ins-savings",
    kind: "opportunity",
    agent: "Expense Intelligence Agent",
    title: `${inr(saving)} of annual savings identified`,
    finding: `${savingsOpportunities.length} opportunities across SaaS licences, duplicate services, vendor pricing and gateway fee tiers.`,
    why: "Each item is a recurring charge, so removing it compounds every month rather than saving once.",
    dataUsed: "12 months of recurring vendor charges, payroll headcount, gateway fee slabs",
    action: "Review the optimisation list and approve the high-confidence items.",
    metric: inr(saving) + "/yr",
  });

  // 5. Upcoming obligations
  const soon = bills.filter((b) => b.status !== "paid" && daysBetween(b.due) > -11);
  if (soon.length) {
    const amt = soon.reduce((s, b) => s + b.amount, 0);
    out.push({
      id: "ins-ap",
      kind: "attention",
      agent: "Accounts Payable Agent",
      title: `${inr(amt)} of bills fall due within 10 days`,
      finding: `${soon.length} obligations including ${soon.filter((b) => b.importance === "critical").length} critical ones (rent, GST, infrastructure).`,
      why: `Projected closing cash for ${forecast[0].label} is ${inr(forecast[0].closing)}, so these payments are affordable but should be sequenced after the tax outflow.`,
      dataUsed: "Payables schedule, vendor terms, 90-day cash forecast",
      action: "Approve the payment order recommended by the AP agent.",
      metric: `${soon.length} bills`,
    });
  }

  // 6. Reconciliation backlog
  if (recon.unmatched + recon.review > 0) {
    out.push({
      id: "ins-recon",
      kind: "attention",
      agent: "Reconciliation Agent",
      title: `${recon.unmatched + recon.review} transactions need reconciliation`,
      finding: `${recon.matched} are matched automatically, ${recon.unmatched} await confirmation and ${recon.review} are low-confidence.`,
      why: "Unmatched entries distort category totals, so every downstream forecast inherits the error.",
      dataUsed: "Bank statements, invoice ledger, vendor bill records",
      action: "Confirm the high-confidence matches in one action, then review the flagged few.",
      metric: `${Math.round((recon.matched / txns.length) * 100)}% matched`,
    });
  }

  // 7. Vendor concentration
  const vendorsTop = vendorTotals(txns);
  const topShare = vendorsTop.slice(0, 3).reduce((s, v) => s + v.share, 0);
  out.push({
    id: "ins-vendor",
    kind: topShare > 0.6 ? "risk" : "positive",
    agent: "Expense Intelligence Agent",
    title: `Top 3 vendors take ${Math.round(topShare * 100)}% of spend`,
    finding: `${vendorsTop
      .slice(0, 3)
      .map((v) => `${v.vendor} (${Math.round(v.share * 100)}%)`)
      .join(", ")}.`,
    why: "Concentrated spend gives you negotiating leverage, but also single-vendor dependency risk.",
    dataUsed: "6 months of expense transactions grouped by counterparty",
    action: "Use the concentration in your next renewal negotiation.",
  });

  // 8. Category momentum
  const cur = categoryTotals(txns, key);
  const spike = cur.map((c) => ({ ...c, annualised: c.amount * factor }))[0];
  if (spike) {
    out.push({
      id: "ins-momentum",
      kind: "positive",
      agent: "Accounting Agent",
      title: `${spike.category} is the largest cost line this month`,
      finding: `${inr(spike.amount)} spent so far, run-rating to ${inr(spike.annualised)} for the full month.`,
      why: "Knowing the dominant line item tells you where a 10% cut actually moves the needle.",
      dataUsed: `Categorised transactions for ${key}`,
      action: "Review the vendor detail behind this category before making cuts elsewhere.",
    });
  }

  return out;
}

export function insightTone(kind: InsightKind) {
  switch (kind) {
    case "risk":
      return { label: "Risk", chip: "bg-[hsl(var(--danger-soft))] text-[hsl(var(--danger))]" };
    case "attention":
      return { label: "Needs attention", chip: "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]" };
    case "opportunity":
      return { label: "Opportunity", chip: "bg-[hsl(var(--info-soft))] text-[hsl(var(--info))]" };
    default:
      return { label: "On track", chip: "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]" };
  }
}
