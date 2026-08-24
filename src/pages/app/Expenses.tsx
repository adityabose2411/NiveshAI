import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { Repeat, Scissors, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentTag, PageHeader, Panel, chartColors } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { savingsOpportunities } from "@/data/demo";
import { categoryTotals, currentMonthKey, inr, inrFull, monthKeys, vendorTotals } from "@/lib/finance";

const Expenses = () => {
  const { transactions } = useApp();
  const months = monthKeys(transactions).length;
  const cats = useMemo(() => categoryTotals(transactions), [transactions]);
  const curr = useMemo(() => categoryTotals(transactions, currentMonthKey()), [transactions]);
  const vendors = useMemo(() => vendorTotals(transactions), [transactions]);
  const recurring = useMemo(
    () =>
      Array.from(
        transactions
          .filter((t) => t.recurring)
          .reduce((map, t) => {
            const prev = map.get(t.counterparty) ?? { vendor: t.counterparty, category: t.category, monthly: 0, count: 0 };
            prev.monthly += t.amount;
            prev.count += 1;
            map.set(t.counterparty, prev);
            return map;
          }, new Map<string, { vendor: string; category: string; monthly: number; count: number }>())
          .values(),
      )
        .map((r) => ({ ...r, monthly: r.monthly / Math.max(r.count / 1, 1) / 1 }))
        .map((r) => ({ ...r, perMonth: (r.monthly * r.count) / r.count }))
        .sort((a, b) => b.monthly - a.monthly),
    [transactions],
  );
  const totalSavings = savingsOpportunities.reduce((s, o) => s + o.annualSaving, 0);

  const chartData = cats.map((c) => ({ ...c, avg: Math.round(c.amount / months) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses & optimisation"
        subtitle="Where the money goes, which charges repeat, and what can be cut without hurting the business."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">6-month spend</div>
          <div className="font-display text-xl font-bold tnum mt-1">{inr(cats.reduce((s, c) => s + c.amount, 0))}</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Monthly average</div>
          <div className="font-display text-xl font-bold tnum mt-1">{inr(cats.reduce((s, c) => s + c.amount, 0) / months)}</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Recurring charges</div>
          <div className="font-display text-xl font-bold tnum mt-1">{recurring.length}</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Savings found</div>
          <div className="font-display text-xl font-bold tnum mt-1 text-[hsl(var(--success))]">{inr(totalSavings)}/yr</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Spend by category" description="Average per month across the last 6 months.">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <RTooltip formatter={(v: number) => inrFull(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="avg" name="Avg / month" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top vendors" description="Concentration tells you where you have negotiating leverage.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">6-month spend</TableHead>
                <TableHead className="text-right w-[80px]">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.slice(0, 10).map((v) => (
                <TableRow key={v.vendor}>
                  <TableCell className="text-[13px] font-medium">{v.vendor}</TableCell>
                  <TableCell className="text-right text-[13px] tnum">{inrFull(v.amount)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground tnum">{Math.round(v.share * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>

      <Panel
        title="Optimisation opportunities"
        description="Each item names the evidence behind it. You approve; the agent never cancels anything on its own."
        actions={<AgentTag agent="Expense Intelligence Agent" />}
        footer={<span>Total identified: {inrFull(totalSavings)} per year ({inr(totalSavings / 12)} per month).</span>}
      >
        <div className="space-y-3">
          {savingsOpportunities.map((o) => (
            <div key={o.id} className="rounded-lg border border-border/70 p-4">
              <div className="flex flex-wrap items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--success-soft))] flex items-center justify-center shrink-0">
                  <Scissors className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="font-medium text-sm">{o.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">{o.why}</p>
                  <p className="text-[11px] text-muted-foreground/80 mt-1.5">Evidence: {o.evidence}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm tnum text-[hsl(var(--success))]">{inr(o.annualSaving)}/yr</div>
                  <div className="text-[11px] text-muted-foreground">{o.confidence} confidence</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg h-8 mt-3"
                onClick={() => toast.success("Added to your approval queue", { description: "Review it in the Daily Brief." })}
              >
                Send to approvals
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recurring charges" description="Subscriptions and fixed costs the agent tracks every month." actions={<Repeat className="w-4 h-4 text-muted-foreground" />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Per month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurring.slice(0, 12).map((r) => (
                <TableRow key={r.vendor}>
                  <TableCell className="text-[13px] font-medium">{r.vendor}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.category}</TableCell>
                  <TableCell className="text-right text-[13px] tnum">{inrFull(r.monthly / r.count)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel title="Anomalies this month" description="Deviations against the 6-month baseline." actions={<TriangleAlert className="w-4 h-4 text-[hsl(var(--warning))]" />}>
          <div className="space-y-3">
            {curr
              .map((c) => {
                const baseline = (cats.find((x) => x.category === c.category)?.amount ?? 0) / months;
                return { ...c, baseline, delta: baseline ? (c.amount - baseline) / baseline : 0 };
              })
              .filter((c) => Math.abs(c.delta) > 0.15)
              .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
              .slice(0, 6)
              .map((c) => (
                <div key={c.category} className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5">
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{c.category}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {inrFull(c.amount)} this month vs {inrFull(c.baseline)} baseline
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold tnum rounded-md px-1.5 py-0.5 ${
                      c.delta > 0 ? "bg-[hsl(var(--danger-soft))] text-[hsl(var(--danger))]" : "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
                    }`}
                  >
                    {c.delta > 0 ? "+" : ""}
                    {Math.round(c.delta * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Expenses;
