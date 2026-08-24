import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuditEntry, Transaction, auditSeed, transactions as seedTransactions } from "@/data/demo";
import { TODAY } from "@/lib/finance";

export interface ApprovalItem {
  id: string;
  agent: string;
  title: string;
  detail: string;
  reasoning: string[];
  dataUsed: string;
  impact: string;
  status: "pending" | "approved" | "rejected";
}

export interface OnboardingProfile {
  businessName: string;
  industry: string;
  employees: string;
  revenueBand: string;
  goals: string[];
  completed: boolean;
}

const APPROVAL_SEED: ApprovalItem[] = [
  {
    id: "apr-1",
    agent: "Accounts Receivable Agent",
    title: "Send a firm reminder for INV-1024 (₹2.4L, 42 days overdue)",
    detail: "Northwind Retail has two overdue invoices totalling ₹3.9L. Their average payment delay has grown from 9 to 38 days.",
    reasoning: [
      "INV-1024 is 42 days past due and INV-1019 is 66 days past due.",
      "Northwind accounts for 18% of quarterly revenue, so escalation should stay commercial.",
      "Collecting ₹2.4L this month lifts the closing cash position above your ₹5L buffer.",
    ],
    dataUsed: "Invoice ageing ledger, 6 months of Northwind payment history",
    impact: "+₹2.4L cash within 14 days",
    status: "pending",
  },
  {
    id: "apr-2",
    agent: "Expense Intelligence Agent",
    title: "Cancel the duplicate Notion workspace",
    detail: "Two Notion Labs subscriptions are billed in the same cycle (₹14,000 and ₹13,000).",
    reasoning: [
      "Both charges recur monthly against the same vendor with different amounts.",
      "Seat count across both workspaces (31) exceeds headcount (24).",
      "No project references the second workspace in the last 90 days of spend descriptions.",
    ],
    dataUsed: "12 months of SaaS transactions, payroll headcount",
    impact: "₹31,200 annual saving",
    status: "pending",
  },
  {
    id: "apr-3",
    agent: "Accounts Payable Agent",
    title: "Reschedule BILL-2203 (Vega Talent, ₹1.45L) by 6 days",
    detail: "Moving this payment past the GST outflow keeps the buffer intact without breaching vendor terms.",
    reasoning: [
      "GST remittance of ₹3.95L lands on the 20th, the largest single outflow this month.",
      "Vega Talent's terms allow net-30; the current schedule pays on day 21.",
      "Rescheduling keeps minimum projected cash at ₹52.6L instead of ₹51.1L.",
    ],
    dataUsed: "Payables schedule, vendor terms, 90-day cash forecast",
    impact: "Protects ₹1.45L of buffer during the tax outflow week",
    status: "pending",
  },
  {
    id: "apr-4",
    agent: "Cash Flow Agent",
    title: "Hold marketing spend at ₹4.2L until collections land",
    detail: "Marketing is tracking 27% above budget while ₹9.8L of receivables are overdue.",
    reasoning: [
      "Month-to-date marketing spend annualises to ₹5.3L against a ₹4.2L budget.",
      "Overdue receivables of ₹9.8L exceed one month of marketing budget twice over.",
      "Pausing incremental spend preserves runway at 3.5 months rather than 3.2.",
    ],
    dataUsed: "Budget vs actuals, receivables ageing, 90-day forecast",
    impact: "Protects ~₹1.1L of cash this month",
    status: "pending",
  },
];

interface Ctx {
  transactions: Transaction[];
  recategorise: (id: string, category: string) => void;
  markReconciled: (ids: string[], value?: boolean) => void;
  approvals: ApprovalItem[];
  decide: (id: string, decision: "approved" | "rejected") => void;
  audit: AuditEntry[];
  demoMode: boolean;
  profile: OnboardingProfile;
  saveProfile: (p: Partial<OnboardingProfile>) => void;
  reset: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

const DEFAULT_PROFILE: OnboardingProfile = {
  businessName: "Acme Digital Labs Pvt. Ltd.",
  industry: "Digital Agency",
  employees: "11-25",
  revenueBand: "₹1Cr – ₹10Cr",
  goals: ["Understand cash flow", "Cut unnecessary spend"],
  completed: false,
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, { category?: string; reconciled?: boolean }>>(() =>
    load("hundi.overrides", {}),
  );
  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => load("hundi.approvals", APPROVAL_SEED));
  const [extraAudit, setExtraAudit] = useState<AuditEntry[]>(() => load("hundi.audit", []));
  const [profile, setProfile] = useState<OnboardingProfile>(() => load("hundi.profile", DEFAULT_PROFILE));

  useEffect(() => localStorage.setItem("hundi.overrides", JSON.stringify(overrides)), [overrides]);
  useEffect(() => localStorage.setItem("hundi.approvals", JSON.stringify(approvals)), [approvals]);
  useEffect(() => localStorage.setItem("hundi.audit", JSON.stringify(extraAudit)), [extraAudit]);
  useEffect(() => localStorage.setItem("hundi.profile", JSON.stringify(profile)), [profile]);

  const transactions = useMemo(
    () =>
      seedTransactions.map((t) => {
        const o = overrides[t.id];
        if (!o) return t;
        return {
          ...t,
          category: o.category ?? t.category,
          reconciled: o.reconciled ?? t.reconciled,
          confidence: o.category ? 1 : t.confidence,
        };
      }),
    [overrides],
  );

  const recategorise = useCallback((id: string, category: string) => {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], category } }));
  }, []);

  const markReconciled = useCallback((ids: string[], value = true) => {
    setOverrides((prev) => {
      const next = { ...prev };
      ids.forEach((id) => (next[id] = { ...next[id], reconciled: value }));
      return next;
    });
  }, []);

  const decide = useCallback((id: string, decision: "approved" | "rejected") => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: decision } : a)));
    setApprovals((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item) {
        setExtraAudit((log) => [
          {
            id: `aud-${Date.now()}`,
            agent: item.agent,
            timestamp: TODAY.toISOString().slice(0, 10) + " " + new Date().toTimeString().slice(0, 5),
            action: item.title,
            dataUsed: item.dataUsed,
            recommendation: item.detail,
            approval: decision === "approved" ? "Approved by Founder" : "Rejected by Founder",
            result: decision === "approved" ? "Action queued (Demo Mode — nothing was executed)" : "No action taken",
          },
          ...log,
        ]);
      }
      return prev;
    });
  }, []);

  const saveProfile = useCallback((p: Partial<OnboardingProfile>) => setProfile((prev) => ({ ...prev, ...p })), []);

  const reset = useCallback(() => {
    setOverrides({});
    setApprovals(APPROVAL_SEED);
    setExtraAudit([]);
    setProfile(DEFAULT_PROFILE);
  }, []);

  const value: Ctx = {
    transactions,
    recategorise,
    markReconciled,
    approvals,
    decide,
    audit: [...extraAudit, ...auditSeed],
    demoMode: true,
    profile,
    saveProfile,
    reset,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}
