// Deterministic financial calculations. No AI is used for any number here.
import {
  Transaction,
  bills,
  budgets,
  cashBalance,
  company,
  invoices,
  transactions as seedTransactions,
} from "@/data/demo";

export const inr = (n: number, opts?: { compact?: boolean }) => {
  const abs = Math.abs(n);
  if (opts?.compact !== false) {
    if (abs >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (abs >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  }
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

export const inrFull = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const monthKey = (iso: string) => iso.slice(0, 7);
export const monthLabel = (key: string) =>
  new Date(key + "-01T00:00:00Z").toLocaleDateString("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" });

export const TODAY = new Date("2026-08-24T00:00:00Z");
export const daysBetween = (a: string, b: Date = TODAY) =>
  Math.round((b.getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000);

export function monthKeys(txns: Transaction[]) {
  return Array.from(new Set(txns.map((t) => monthKey(t.date)))).sort();
}

export function monthlySeries(txns: Transaction[]) {
  const keys = monthKeys(txns);
  return keys.map((key) => {
    const rows = txns.filter((t) => monthKey(t.date) === key);
    const revenue = rows.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = rows.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { key, label: monthLabel(key), revenue, expenses, net: revenue - expenses };
  });
}

export function currentMonthKey() {
  return TODAY.toISOString().slice(0, 7);
}

/** Days elapsed in the current month, and the run-rate factor to full month. */
export function monthProgress() {
  const day = TODAY.getUTCDate();
  const total = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + 1, 0)).getUTCDate();
  return { day, total, factor: total / day };
}

export function categoryTotals(txns: Transaction[], key?: string) {
  const rows = txns.filter((t) => t.type === "expense" && (!key || monthKey(t.date) === key));
  const map = new Map<string, number>();
  rows.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
  return Array.from(map, ([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);
}

export function vendorTotals(txns: Transaction[]) {
  const rows = txns.filter((t) => t.type === "expense");
  const map = new Map<string, number>();
  rows.forEach((t) => map.set(t.counterparty, (map.get(t.counterparty) ?? 0) + t.amount));
  const total = rows.reduce((s, t) => s + t.amount, 0);
  return Array.from(map, ([vendor, amount]) => ({ vendor, amount, share: total ? amount / total : 0 })).sort(
    (a, b) => b.amount - a.amount,
  );
}

export interface Metrics {
  cashBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netCashFlow: number;
  receivables: number;
  payables: number;
  burn: number;
  runwayMonths: number;
  avgRevenue: number;
  avgExpenses: number;
  grossMargin: number;
  revenueGrowth: number;
  expenseGrowth: number;
  series: ReturnType<typeof monthlySeries>;
  overdueReceivables: number;
  overduePayables: number;
  duesNext10Days: number;
}

export function computeMetrics(txns: Transaction[] = seedTransactions): Metrics {
  const series = monthlySeries(txns);
  const closed = series.slice(0, -1); // exclude partial current month for averages
  const current = series[series.length - 1];
  const prev = series[series.length - 2];
  const { factor } = monthProgress();

  const avgRevenue = closed.reduce((s, m) => s + m.revenue, 0) / Math.max(closed.length, 1);
  const avgExpenses = closed.reduce((s, m) => s + m.expenses, 0) / Math.max(closed.length, 1);

  const monthlyRevenue = Math.round(current.revenue * factor);
  const monthlyExpenses = Math.round(current.expenses * factor);
  const burn = Math.round(avgExpenses);
  const netMonthly = avgRevenue - avgExpenses;

  const receivables = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
  const payables = bills.filter((b) => b.status !== "paid").reduce((s, b) => s + b.amount, 0);

  const runwayMonths = netMonthly >= 0 ? cashBalance / burn : cashBalance / Math.abs(netMonthly);

  return {
    cashBalance,
    monthlyRevenue,
    monthlyExpenses,
    netCashFlow: monthlyRevenue - monthlyExpenses,
    receivables,
    payables,
    burn,
    runwayMonths,
    avgRevenue,
    avgExpenses,
    grossMargin: avgRevenue ? (avgRevenue - avgExpenses) / avgRevenue : 0,
    revenueGrowth: prev?.revenue ? (current.revenue * factor - prev.revenue) / prev.revenue : 0,
    expenseGrowth: prev?.expenses ? (current.expenses * factor - prev.expenses) / prev.expenses : 0,
    series,
    overdueReceivables: invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0),
    overduePayables: bills.filter((b) => b.status === "overdue").reduce((s, b) => s + b.amount, 0),
    duesNext10Days: bills
      .filter((b) => b.status !== "paid" && daysBetween(b.due) >= -10)
      .filter((b) => daysBetween(b.due) > -11)
      .filter((b) => new Date(b.due) <= new Date(TODAY.getTime() + 10 * 86400000))
      .reduce((s, b) => s + b.amount, 0),
  };
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function healthScore(m: Metrics) {
  const parts = [
    { label: "Cash Flow", score: clamp(50 + (m.netCashFlow / Math.max(m.monthlyRevenue, 1)) * 160), hint: "Net inflow vs revenue over the last 90 days." },
    { label: "Profitability", score: clamp(40 + m.grossMargin * 200), hint: "Average monthly margin across closed months." },
    { label: "Expense Efficiency", score: clamp(90 - Math.abs(m.expenseGrowth) * 220), hint: "Expense growth vs the prior month, penalised for volatility." },
    { label: "Receivables", score: clamp(100 - (m.overdueReceivables / Math.max(m.receivables, 1)) * 60), hint: "Share of receivables currently overdue." },
    { label: "Budget Discipline", score: clamp(100 - budgetVariancePct() * 120), hint: "Actual spend vs budget across all categories." },
    { label: "Financial Risk", score: clamp(30 + Math.min(m.runwayMonths, 12) * 6), hint: "Runway, overdue obligations and vendor concentration." },
  ];
  const total = Math.round(parts.reduce((s, p) => s + p.score, 0) / parts.length);
  return { total, parts };
}

export function budgetRows(txns: Transaction[] = seedTransactions) {
  const key = currentMonthKey();
  const { factor, day, total } = monthProgress();
  return budgets.map((b) => {
    const actual = txns
      .filter((t) => t.type === "expense" && t.category === b.category && monthKey(t.date) === key)
      .reduce((s, t) => s + t.amount, 0);
    const forecast = Math.round(actual * factor);
    return {
      ...b,
      actual,
      forecast,
      usedPct: b.monthlyBudget ? actual / b.monthlyBudget : 0,
      forecastPct: b.monthlyBudget ? forecast / b.monthlyBudget : 0,
      daysLeft: total - day,
    };
  });
}

export function budgetVariancePct() {
  const rows = budgetRows();
  const budget = rows.reduce((s, r) => s + r.monthlyBudget, 0);
  const forecast = rows.reduce((s, r) => s + r.forecast, 0);
  return budget ? Math.abs(forecast - budget) / budget : 0;
}

export interface ForecastRow {
  label: string;
  opening: number;
  revenue: number;
  receivables: number;
  payroll: number;
  vendors: number;
  taxes: number;
  opex: number;
  closing: number;
}

export function cashForecast(m: Metrics, horizonMonths = 3): ForecastRow[] {
  const cats = categoryTotals(seedTransactions);
  const monthsCount = monthKeys(seedTransactions).length;
  const avg = (name: string) => (cats.find((c) => c.category === name)?.amount ?? 0) / monthsCount;
  const rows: ForecastRow[] = [];
  let opening = m.cashBalance;
  const collectible = invoices.filter((i) => i.status !== "paid");

  for (let i = 0; i < horizonMonths; i++) {
    const revenue = Math.round(m.avgRevenue * (1 - i * 0.02));
    const receivables =
      i === 0
        ? Math.round(collectible.reduce((s, inv) => s + inv.amount, 0) * 0.45)
        : i === 1
          ? Math.round(collectible.reduce((s, inv) => s + inv.amount, 0) * 0.35)
          : Math.round(collectible.reduce((s, inv) => s + inv.amount, 0) * 0.15);
    const payroll = Math.round(avg("Payroll"));
    const vendors = Math.round(avg("Vendors") + avg("Marketing"));
    const taxes = Math.round(avg("Taxes"));
    const opex = Math.round(avg("Rent") + avg("SaaS") + avg("Utilities") + avg("Operations") + avg("Travel") + avg("Payment Fees") + avg("Miscellaneous"));
    const closing = opening + revenue + receivables - payroll - vendors - taxes - opex;
    rows.push({
      label: new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + i + 1, 1)).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      opening,
      revenue,
      receivables,
      payroll,
      vendors,
      taxes,
      opex,
      closing,
    });
    opening = closing;
  }
  return rows;
}

export function ageingBuckets() {
  const open = invoices.filter((i) => i.status !== "paid");
  const bucket = (min: number, max: number) =>
    open.filter((i) => {
      const d = daysBetween(i.due);
      return d >= min && d < max;
    }).reduce((s, i) => s + i.amount, 0);
  return {
    total: open.reduce((s, i) => s + i.amount, 0),
    current: open.filter((i) => daysBetween(i.due) < 0).reduce((s, i) => s + i.amount, 0),
    d30: bucket(0, 30),
    d60: bucket(30, 60),
    d90: bucket(60, 10000),
  };
}

export function reconciliationStats(txns: Transaction[] = seedTransactions) {
  const matched = txns.filter((t) => t.reconciled).length;
  const unmatched = txns.filter((t) => !t.reconciled && t.confidence >= 0.6).length;
  const review = txns.filter((t) => !t.reconciled && t.confidence < 0.6).length;
  return { matched, unmatched, review };
}

export function runwayLabel(m: Metrics) {
  return `${m.runwayMonths.toFixed(1)} months`;
}

export const companyInfo = company;
