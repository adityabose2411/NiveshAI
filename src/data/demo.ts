// HundiAI Demo Workspace — deterministic mock data for "Acme Digital Labs Pvt. Ltd."
// All numbers are generated deterministically so every screen agrees with every other screen.

export type TxnType = "income" | "expense";

export interface Account {
  id: string;
  name: string;
  kind: "Current Account" | "Payment Gateway" | "Wallet" | "Credit Card";
  institution: string;
  balance: number;
  last4: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO
  description: string;
  counterparty: string;
  category: string;
  amount: number; // always positive
  type: TxnType;
  accountId: string;
  status: "cleared" | "pending";
  reconciled: boolean;
  confidence: number; // 0-1 AI classification confidence
  recurring?: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  issued: string;
  due: string;
  status: "paid" | "open" | "overdue";
}

export interface Bill {
  id: string;
  number: string;
  vendor: string;
  amount: number;
  due: string;
  category: string;
  status: "scheduled" | "due" | "overdue" | "paid";
  importance: "critical" | "high" | "normal";
}

export interface BudgetLine {
  category: string;
  monthlyBudget: number;
}

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
  status: "active" | "monitoring";
}

export interface AuditEntry {
  id: string;
  agent: string;
  timestamp: string;
  action: string;
  dataUsed: string;
  recommendation: string;
  approval: "Approved by Founder" | "Rejected by Founder" | "Awaiting approval";
  result: string;
}

export interface Integration {
  id: string;
  name: string;
  category: "Banking" | "Payments" | "Accounting" | "Commerce" | "Payroll" | "Productivity" | "Files";
  status: "demo" | "coming-soon";
  connected: boolean;
  description: string;
}

export const company = {
  name: "Acme Digital Labs Pvt. Ltd.",
  founder: "Aditya",
  industry: "Digital Agency",
  employees: 24,
  annualRevenue: 48000000,
  state: "Karnataka",
  currency: "INR",
  financialYear: "Apr – Mar",
  cashTarget: 500000,
};

export const accounts: Account[] = [
  { id: "acc-1", name: "HDFC Current Account", kind: "Current Account", institution: "HDFC Bank", balance: 3820000, last4: "4412" },
  { id: "acc-2", name: "ICICI Operations", kind: "Current Account", institution: "ICICI Bank", balance: 1640000, last4: "8801" },
  { id: "acc-3", name: "Razorpay Settlements", kind: "Payment Gateway", institution: "Razorpay", balance: 610000, last4: "RZP1" },
  { id: "acc-4", name: "Corporate Card", kind: "Credit Card", institution: "Axis Bank", balance: 130000, last4: "2290" },
];

export const cashBalance = accounts
  .filter((a) => a.kind !== "Credit Card")
  .reduce((s, a) => s + a.balance, 0); // ₹60.7L

export const expenseCategories = [
  "Payroll",
  "Marketing",
  "SaaS",
  "Vendors",
  "Rent",
  "Travel",
  "Utilities",
  "Taxes",
  "Operations",
  "Payment Fees",
  "Miscellaneous",
];

export const categories = ["Revenue", "Other Income", ...expenseCategories];

export const budgets: BudgetLine[] = [
  { category: "Payroll", monthlyBudget: 1650000 },
  { category: "Marketing", monthlyBudget: 420000 },
  { category: "SaaS", monthlyBudget: 210000 },
  { category: "Vendors", monthlyBudget: 380000 },
  { category: "Rent", monthlyBudget: 280000 },
  { category: "Travel", monthlyBudget: 120000 },
  { category: "Operations", monthlyBudget: 180000 },
  { category: "Miscellaneous", monthlyBudget: 90000 },
];

// ---------- deterministic pseudo-random ----------
function mulberry(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry(20260824);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const between = (a: number, b: number) => Math.round((a + rand() * (b - a)) / 100) * 100;

export const vendors = [
  { name: "Amazon Web Services", category: "SaaS", importance: "critical" as const },
  { name: "Google Ads", category: "Marketing", importance: "high" as const },
  { name: "Meta Ads", category: "Marketing", importance: "normal" as const },
  { name: "Slack Technologies", category: "SaaS", importance: "normal" as const },
  { name: "Notion Labs", category: "SaaS", importance: "normal" as const },
  { name: "Figma Inc.", category: "SaaS", importance: "high" as const },
  { name: "Zoom Video", category: "SaaS", importance: "normal" as const },
  { name: "HubSpot", category: "SaaS", importance: "normal" as const },
  { name: "Prime Workspaces LLP", category: "Rent", importance: "critical" as const },
  { name: "Cloudpix Studio", category: "Vendors", importance: "high" as const },
  { name: "Vega Talent Partners", category: "Vendors", importance: "normal" as const },
  { name: "MakeMyTrip Business", category: "Travel", importance: "normal" as const },
  { name: "BESCOM Utilities", category: "Utilities", importance: "high" as const },
  { name: "Airtel Business", category: "Utilities", importance: "normal" as const },
  { name: "Razorpay Fees", category: "Payment Fees", importance: "normal" as const },
  { name: "GST Payment", category: "Taxes", importance: "critical" as const },
  { name: "Team Payroll", category: "Payroll", importance: "critical" as const },
  { name: "Officely Supplies", category: "Operations", importance: "normal" as const },
];

export const customers = [
  "Northwind Retail Pvt Ltd",
  "Kestrel Health Systems",
  "Lumen SaaS Labs",
  "BluePeak Consulting",
  "Orchid D2C Brands",
  "Zentro Fintech",
  "Marigold Education",
];

const today = new Date("2026-08-24T00:00:00Z");
const iso = (d: Date) => d.toISOString().slice(0, 10);
const shift = (days: number) => {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() + days);
  return iso(d);
};

// ---------- transactions: last 6 months ----------
function buildTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  let n = 0;
  const id = () => `txn-${(++n).toString().padStart(4, "0")}`;

  for (let m = 5; m >= 0; m--) {
    const monthStart = new Date(today);
    monthStart.setUTCDate(1);
    monthStart.setUTCMonth(monthStart.getUTCMonth() - m);
    const daysInMonth = m === 0 ? today.getUTCDate() : 28;
    const day = (d: number) => {
      const x = new Date(monthStart);
      x.setUTCDate(Math.min(d, daysInMonth));
      return iso(x);
    };

    // Revenue: 5-7 client payments per month, ₹38L–₹45L total
    const revTarget = between(3800000, 4500000) * (m === 0 ? 0.82 : 1);
    const invoicesCount = 6;
    for (let i = 0; i < invoicesCount; i++) {
      const amt = Math.round(revTarget / invoicesCount);
      txns.push({
        id: id(),
        date: day(3 + i * 4),
        description: `Client payment — retainer & project milestone`,
        counterparty: pick(customers),
        category: "Revenue",
        amount: amt,
        type: "income",
        accountId: rand() > 0.5 ? "acc-1" : "acc-3",
        status: "cleared",
        reconciled: rand() > 0.08,
        confidence: 0.98,
      });
    }

    // Payroll
    txns.push({
      id: id(),
      date: day(1),
      description: "Monthly payroll — 24 employees",
      counterparty: "Team Payroll",
      category: "Payroll",
      amount: between(1580000, 1690000),
      type: "expense",
      accountId: "acc-1",
      status: "cleared",
      reconciled: true,
      confidence: 0.99,
      recurring: true,
    });

    // Rent
    txns.push({
      id: id(),
      date: day(2),
      description: "Office rent — Indiranagar workspace",
      counterparty: "Prime Workspaces LLP",
      category: "Rent",
      amount: 280000,
      type: "expense",
      accountId: "acc-2",
      status: "cleared",
      reconciled: true,
      confidence: 0.99,
      recurring: true,
    });

    // Marketing (spikes in the current month)
    const mktMultiplier = m === 0 ? 1.27 : m === 1 ? 1.02 : 0.95;
    for (const v of ["Google Ads", "Meta Ads"]) {
      txns.push({
        id: id(),
        date: day(v === "Google Ads" ? 6 : 14),
        description: `${v} — performance campaigns`,
        counterparty: v,
        category: "Marketing",
        amount: Math.round(between(150000, 220000) * mktMultiplier),
        type: "expense",
        accountId: "acc-4",
        status: "cleared",
        reconciled: rand() > 0.15,
        confidence: 0.93,
        recurring: true,
      });
    }

    // SaaS subscriptions
    const saas = [
      ["Amazon Web Services", 96000],
      ["Figma Inc.", 28000],
      ["Slack Technologies", 21000],
      ["Notion Labs", 14000],
      ["Zoom Video", 12500],
      ["HubSpot", 46000],
    ] as const;
    saas.forEach(([v, amt], i) => {
      txns.push({
        id: id(),
        date: day(4 + i * 3),
        description: `${v} subscription`,
        counterparty: v,
        category: "SaaS",
        amount: amt,
        type: "expense",
        accountId: "acc-4",
        status: "cleared",
        reconciled: rand() > 0.1,
        confidence: 0.9,
        recurring: true,
      });
    });

    // Vendors
    for (const v of ["Cloudpix Studio", "Vega Talent Partners"]) {
      txns.push({
        id: id(),
        date: day(9 + Math.floor(rand() * 10)),
        description: `${v} — contracted delivery work`,
        counterparty: v,
        category: "Vendors",
        amount: between(120000, 240000),
        type: "expense",
        accountId: "acc-2",
        status: "cleared",
        reconciled: rand() > 0.2,
        confidence: 0.84,
      });
    }

    // Travel, Utilities, Operations, Fees, Taxes
    txns.push({ id: id(), date: day(11), description: "Client travel — Mumbai pitch", counterparty: "MakeMyTrip Business", category: "Travel", amount: between(45000, 130000), type: "expense", accountId: "acc-4", status: "cleared", reconciled: rand() > 0.2, confidence: 0.79 });
    txns.push({ id: id(), date: day(7), description: "Electricity & power", counterparty: "BESCOM Utilities", category: "Utilities", amount: between(28000, 46000), type: "expense", accountId: "acc-2", status: "cleared", reconciled: true, confidence: 0.95, recurring: true });
    txns.push({ id: id(), date: day(8), description: "Internet & leased line", counterparty: "Airtel Business", category: "Utilities", amount: 18500, type: "expense", accountId: "acc-2", status: "cleared", reconciled: true, confidence: 0.95, recurring: true });
    txns.push({ id: id(), date: day(16), description: "Office supplies & pantry", counterparty: "Officely Supplies", category: "Operations", amount: between(38000, 90000), type: "expense", accountId: "acc-2", status: "cleared", reconciled: rand() > 0.25, confidence: 0.72 });
    txns.push({ id: id(), date: day(20), description: "Payment gateway fees", counterparty: "Razorpay Fees", category: "Payment Fees", amount: between(52000, 78000), type: "expense", accountId: "acc-3", status: "cleared", reconciled: true, confidence: 0.97, recurring: true });
    txns.push({ id: id(), date: day(20), description: "GST remittance", counterparty: "GST Payment", category: "Taxes", amount: between(320000, 480000), type: "expense", accountId: "acc-1", status: "cleared", reconciled: true, confidence: 0.99, recurring: true });

    // A couple of low-confidence / odd ones
    if (m % 2 === 0) {
      txns.push({ id: id(), date: day(23), description: "UPI transfer — unlabelled", counterparty: "UPI/9834XXXX21", category: "Miscellaneous", amount: between(12000, 60000), type: "expense", accountId: "acc-1", status: "pending", reconciled: false, confidence: 0.41 });
    }
  }

  // Duplicate SaaS subscription (Expense agent finding)
  txns.push({ id: id(), date: shift(-9), description: "Notion Labs subscription (second workspace)", counterparty: "Notion Labs", category: "SaaS", amount: 13000, type: "expense", accountId: "acc-4", status: "cleared", reconciled: false, confidence: 0.55, recurring: true });

  return txns.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const transactions: Transaction[] = buildTransactions();

// ---------- receivables ----------
export const invoices: Invoice[] = [
  { id: "inv-1", number: "INV-1024", customer: "Northwind Retail Pvt Ltd", amount: 240000, issued: shift(-63), due: shift(-42), status: "overdue" },
  { id: "inv-2", number: "INV-1031", customer: "Kestrel Health Systems", amount: 410000, issued: shift(-48), due: shift(-18), status: "overdue" },
  { id: "inv-3", number: "INV-1038", customer: "Lumen SaaS Labs", amount: 320000, issued: shift(-30), due: shift(-4), status: "overdue" },
  { id: "inv-4", number: "INV-1042", customer: "BluePeak Consulting", amount: 180000, issued: shift(-22), due: shift(8), status: "open" },
  { id: "inv-5", number: "INV-1047", customer: "Orchid D2C Brands", amount: 260000, issued: shift(-14), due: shift(16), status: "open" },
  { id: "inv-6", number: "INV-1051", customer: "Zentro Fintech", amount: 300000, issued: shift(-9), due: shift(21), status: "open" },
  { id: "inv-7", number: "INV-1054", customer: "Marigold Education", amount: 90000, issued: shift(-5), due: shift(25), status: "open" },
  { id: "inv-8", number: "INV-1019", customer: "Northwind Retail Pvt Ltd", amount: 150000, issued: shift(-88), due: shift(-66), status: "overdue" },
  { id: "inv-9", number: "INV-1013", customer: "BluePeak Consulting", amount: 210000, issued: shift(-40), due: shift(-12), status: "paid" },
];

// ---------- payables ----------
export const bills: Bill[] = [
  { id: "bill-1", number: "BILL-2201", vendor: "Cloudpix Studio", amount: 185000, due: shift(3), category: "Vendors", status: "due", importance: "high" },
  { id: "bill-2", number: "BILL-2202", vendor: "Prime Workspaces LLP", amount: 280000, due: shift(6), category: "Rent", status: "due", importance: "critical" },
  { id: "bill-3", number: "BILL-2203", vendor: "Vega Talent Partners", amount: 145000, due: shift(9), category: "Vendors", status: "scheduled", importance: "normal" },
  { id: "bill-4", number: "BILL-2204", vendor: "Amazon Web Services", amount: 96000, due: shift(11), category: "SaaS", status: "scheduled", importance: "critical" },
  { id: "bill-5", number: "BILL-2205", vendor: "GST Payment", amount: 395000, due: shift(16), category: "Taxes", status: "scheduled", importance: "critical" },
  { id: "bill-6", number: "BILL-2198", vendor: "Officely Supplies", amount: 64000, due: shift(-6), category: "Operations", status: "overdue", importance: "normal" },
  { id: "bill-7", number: "BILL-2199", vendor: "MakeMyTrip Business", amount: 78000, due: shift(-2), category: "Travel", status: "overdue", importance: "normal" },
  { id: "bill-8", number: "BILL-2206", vendor: "Airtel Business", amount: 18500, due: shift(0), category: "Utilities", status: "due", importance: "normal" },
];

// ---------- agents ----------
export const agents: AgentDef[] = [
  { id: "accounting", name: "Accounting Agent", role: "Bookkeeping & categorisation", responsibilities: ["Categorise transactions", "Identify accounting anomalies", "Prepare journal-entry suggestions", "Assist bookkeeping"], status: "active" },
  { id: "reconciliation", name: "Reconciliation Agent", role: "Matching & discrepancies", responsibilities: ["Match bank transactions", "Match invoices", "Identify discrepancies", "Flag unmatched transactions"], status: "active" },
  { id: "cashflow", name: "Cash Flow Agent", role: "Liquidity & runway", responsibilities: ["Monitor cash", "Forecast inflows and outflows", "Calculate runway", "Identify cash-flow risks"], status: "active" },
  { id: "fpa", name: "FP&A Agent", role: "Budgets, forecasts & scenarios", responsibilities: ["Budget creation", "Forecasting", "Scenario analysis", "Hiring & expansion modelling"], status: "active" },
  { id: "expense", name: "Expense Intelligence Agent", role: "Spend optimisation", responsibilities: ["Identify abnormal spending", "Track recurring expenses", "Find savings", "Detect duplicates"], status: "active" },
  { id: "ap", name: "Accounts Payable Agent", role: "Bills & obligations", responsibilities: ["Track bills", "Identify due dates", "Prioritise payments", "Flag overdue obligations"], status: "active" },
  { id: "ar", name: "Accounts Receivable Agent", role: "Collections", responsibilities: ["Track invoices", "Identify overdue invoices", "Forecast collections", "Prioritise follow-ups"], status: "active" },
  { id: "reporting", name: "Reporting Agent", role: "Management reporting", responsibilities: ["Generate management reports", "Explain variances", "Executive summaries"], status: "monitoring" },
  { id: "orchestrator", name: "CFO Orchestrator", role: "Primary intelligence layer", responsibilities: ["Route questions to specialist agents", "Combine multi-agent answers", "Recommend actions", "Request human approval"], status: "active" },
];

// ---------- audit log seed ----------
export const auditSeed: AuditEntry[] = [
  { id: "aud-1", agent: "Expense Intelligence Agent", timestamp: shift(-1) + " 09:14", action: "Detected duplicate SaaS subscription", dataUsed: "12 months of SaaS transactions, 2 Notion Labs vendor records", recommendation: "Cancel the second Notion workspace — ₹31,200/year saving", approval: "Approved by Founder", result: "Cancellation task created (Demo Mode)" },
  { id: "aud-2", agent: "Reconciliation Agent", timestamp: shift(-2) + " 18:02", action: "Matched 46 bank transactions to invoices", dataUsed: "HDFC + Razorpay statements, open invoice ledger", recommendation: "Approve 44 high-confidence matches, review 2", approval: "Approved by Founder", result: "44 matches posted, 2 sent to review" },
  { id: "aud-3", agent: "Cash Flow Agent", timestamp: shift(-3) + " 07:30", action: "Recalculated 90-day forecast", dataUsed: "6 months of inflows/outflows, payables schedule", recommendation: "Hold ₹5L buffer before the GST outflow on the 20th", approval: "Awaiting approval", result: "Pending" },
  { id: "aud-4", agent: "Accounts Receivable Agent", timestamp: shift(-4) + " 11:47", action: "Drafted collection reminder for INV-1024", dataUsed: "Invoice ageing, customer payment history", recommendation: "Send firm reminder — 42 days overdue, ₹2.4L", approval: "Awaiting approval", result: "Draft ready for review" },
  { id: "aud-5", agent: "Accounting Agent", timestamp: shift(-6) + " 16:20", action: "Suggested journal entries for prepaid rent", dataUsed: "Rent invoices, GL account 5200", recommendation: "Split ₹2.8L across 1 month prepaid", approval: "Rejected by Founder", result: "No entry posted" },
];

// ---------- integrations ----------
export const integrations: Integration[] = [
  { id: "bank", name: "Indian Bank Accounts", category: "Banking", status: "demo", connected: true, description: "Read-only statement sync via account aggregator (demo data only)." },
  { id: "razorpay", name: "Razorpay", category: "Payments", status: "demo", connected: true, description: "Settlements, payouts and gateway fees." },
  { id: "cashfree", name: "Cashfree", category: "Payments", status: "coming-soon", connected: false, description: "Payment collection and vendor payouts." },
  { id: "stripe", name: "Stripe", category: "Payments", status: "coming-soon", connected: false, description: "International revenue and fees." },
  { id: "tally", name: "Tally", category: "Accounting", status: "demo", connected: false, description: "Two-way ledger sync with your CA's Tally books." },
  { id: "zoho", name: "Zoho Books", category: "Accounting", status: "coming-soon", connected: false, description: "Invoices, bills and chart of accounts." },
  { id: "busy", name: "Busy", category: "Accounting", status: "coming-soon", connected: false, description: "Ledger and GST data import." },
  { id: "shopify", name: "Shopify", category: "Commerce", status: "coming-soon", connected: false, description: "Order revenue, refunds and payout reconciliation." },
  { id: "woo", name: "WooCommerce", category: "Commerce", status: "coming-soon", connected: false, description: "Store orders and settlement data." },
  { id: "payroll", name: "Payroll Provider", category: "Payroll", status: "demo", connected: true, description: "Salary registers and headcount costs." },
  { id: "gworkspace", name: "Google Workspace", category: "Productivity", status: "coming-soon", connected: false, description: "Team directory and SaaS seat usage." },
  { id: "microsoft", name: "Microsoft 365", category: "Productivity", status: "coming-soon", connected: false, description: "Directory and licence utilisation." },
  { id: "csv", name: "Excel / CSV Import", category: "Files", status: "demo", connected: true, description: "Upload statements and ledgers manually." },
];

export const savingsOpportunities = [
  { id: "sav-1", title: "Underutilised SaaS subscriptions", why: "Slack, Zoom and HubSpot seats exceed active headcount by 9 licences.", evidence: "6 months of SaaS charges vs 24 employees on payroll", annualSaving: 82000, confidence: "High", agent: "Expense Intelligence Agent" },
  { id: "sav-2", title: "Vendor pricing renegotiation", why: "Cloudpix Studio rates rose 14% with no change in scope.", evidence: "Invoice comparison across last 2 quarters", annualSaving: 68000, confidence: "Medium", agent: "Expense Intelligence Agent" },
  { id: "sav-3", title: "Duplicate services", why: "Two active Notion workspaces billed separately.", evidence: "2 recurring Notion Labs charges in the same month", annualSaving: 31200, confidence: "High", agent: "Expense Intelligence Agent" },
  { id: "sav-4", title: "Payment gateway fee tier", why: "Monthly gateway volume qualifies for a lower fee slab.", evidence: "₹52k–₹78k monthly fee charges on Razorpay settlements", annualSaving: 54000, confidence: "Medium", agent: "Expense Intelligence Agent" },
];
