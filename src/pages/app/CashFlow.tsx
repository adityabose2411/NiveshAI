import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { Download, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentTag, DemoNote, KpiCard, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { accounts } from "@/data/demo";
import { cashForecast, computeMetrics, inr, inrFull } from "@/lib/finance";
import { earlyPaymentApr, runwayAfterCut } from "@/lib/formulas";
import { downloadReport } from "@/lib/reports";

const CashFlow = () => {
  const { transactions } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const forecast = useMemo(() => cashForecast(m, 6), [m]);

  const chart = [
    { label: "Now", closing: m.cashBalance },
    ...forecast.map((f) => ({ label: f.label, closing: f.closing })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash flow & runway"
        subtitle="Where cash sits today, what the next six months look like, and which levers change the answer."
        actions={
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => {
              downloadReport("cash", m, transactions);
              toast.success("Cash Flow Report downloaded as PDF");
            }}
          >
            <Download className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Cash balance" value={inr(m.cashBalance)} sub="Across 3 accounts" index={0} />
        <KpiCard
          label="Net monthly movement"
          value={inr(Math.round(m.avgRevenue - m.avgExpenses))}
          tone={m.avgRevenue - m.avgExpenses >= 0 ? "good" : "bad"}
          sub="Trailing average"
          index={1}
        />
        <KpiCard label="Runway" value={`${m.runwayMonths.toFixed(1)} mo`} tone={m.runwayMonths > 9 ? "good" : "warn"} hint="Runway = Cash / Net burn" index={2} />
        <KpiCard label="Dues next 10 days" value={inr(m.duesNext10Days)} tone="warn" sub="Scheduled outflows" index={3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Projected closing cash" description="Driver-based projection using trailing category averages." className="lg:col-span-2">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(21 90% 48%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(21 90% 48%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(24 10% 90%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} width={62} />
                <RTooltip formatter={(v: number) => inrFull(v)} />
                <Area type="monotone" dataKey="closing" stroke="hsl(21 90% 48%)" fill="url(#cashGrad)" strokeWidth={2} name="Closing cash" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Accounts" description="Balances read-only from connected sources.">
          <div className="space-y-3">
            {accounts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border/70 p-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {a.kind} · ••{a.last4}
                  </div>
                </div>
                <div className="font-display font-semibold tnum text-sm">{inr(a.balance)}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Six-month cash forecast"
        description="Every column is a driver the Cash Flow Agent can explain."
        actions={<AgentTag agent="Cash Flow Agent" />}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Opening</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Collections</TableHead>
                <TableHead className="text-right">Payroll</TableHead>
                <TableHead className="text-right">Vendors</TableHead>
                <TableHead className="text-right">Taxes</TableHead>
                <TableHead className="text-right">Opex</TableHead>
                <TableHead className="text-right">Closing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecast.map((r) => (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell className="text-right tnum">{inr(r.opening)}</TableCell>
                  <TableCell className="text-right tnum">{inr(r.revenue)}</TableCell>
                  <TableCell className="text-right tnum">{inr(r.receivables)}</TableCell>
                  <TableCell className="text-right tnum">({inr(r.payroll)})</TableCell>
                  <TableCell className="text-right tnum">({inr(r.vendors)})</TableCell>
                  <TableCell className="text-right tnum">({inr(r.taxes)})</TableCell>
                  <TableCell className="text-right tnum">({inr(r.opex)})</TableCell>
                  <TableCell className="text-right tnum font-semibold">{inr(r.closing)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Liquidity levers" description="Formula-backed sensitivity, computed live.">
          <div className="space-y-3 text-sm">
            {[
              { label: "Collect all overdue receivables", effect: `+${inr(m.overdueReceivables)} cash`, detail: "Immediate one-time inflow" },
              {
                label: "Cut ₹1L/month of discretionary spend",
                effect: `${runwayAfterCut(m.cashBalance, m.burn - m.avgRevenue > 0 ? m.burn - m.avgRevenue : m.burn, 100000).toFixed(1)} mo runway`,
                detail: "Runway = Cash / (Net burn − saving)",
              },
              {
                label: "Take 2/10 net 45 supplier discounts",
                effect: `${(earlyPaymentApr(0.02, 45, 10) * 100).toFixed(1)}% APR`,
                detail: "(d/(1−d)) × (365/(N−D))",
              },
              { label: "Delay non-critical vendor payments by 15 days", effect: `+${inr(m.payables * 0.3)} float`, detail: "Extends DPO without penalty" },
            ].map((l) => (
              <div key={l.label} className="flex items-start justify-between gap-3 rounded-lg border border-border/70 p-3">
                <div>
                  <div className="font-medium text-[13px]">{l.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{l.detail}</div>
                </div>
                <div className="text-[13px] font-semibold text-primary shrink-0 tnum">{l.effect}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Inflow vs outflow history">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(24 10% 90%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} width={58} />
                <RTooltip formatter={(v: number) => inrFull(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" name="Inflow" fill="hsl(158 64% 34%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Outflow" fill="hsl(21 90% 48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <DemoNote>
        Balances and forecasts come from the demo workspace. Connecting a real bank feed replaces the data without changing any of the maths.
      </DemoNote>
    </div>
  );
};

export default CashFlow;
