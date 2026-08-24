import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AgentTag, KpiCard, Panel, PageHeader, chartColors } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { accounts } from "@/data/demo";
import { cashForecast, categoryTotals, computeMetrics, currentMonthKey, healthScore, inr, inrFull } from "@/lib/finance";
import { buildInsights, insightTone } from "@/lib/insights";

const Overview = () => {
  const { transactions, profile } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const health = useMemo(() => healthScore(m), [m]);
  const insights = useMemo(() => buildInsights(m, transactions), [m, transactions]);
  const cats = useMemo(() => categoryTotals(transactions, currentMonthKey()).slice(0, 7), [transactions]);
  const forecast = useMemo(() => cashForecast(m, 3), [m]);

  const trend = [
    ...m.series.map((s) => ({ label: s.label, cash: 0, revenue: s.revenue, expenses: s.expenses, type: "actual" })),
  ];
  const cashPath = [
    { label: "Now", cash: m.cashBalance, projected: m.cashBalance },
    ...forecast.map((f) => ({ label: f.label, cash: null as number | null, projected: f.closing })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${profile.businessName.split(" ")[0]}`}
        subtitle="Your financial position, computed from every connected account. Numbers are deterministic; the AI only explains them."
        actions={
          <Link to="/app/brief">
            <Button variant="outline" size="sm" className="rounded-lg">
              Today's brief <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard index={0} label="Cash on hand" value={inr(m.cashBalance)} sub={`${accounts.length} accounts`} hint="Sum of all current-account, gateway and wallet balances. Credit card dues excluded." />
        <KpiCard index={1} label="Revenue (run-rate)" value={inr(m.monthlyRevenue)} delta={m.revenueGrowth} tone="good" sub="this month" hint="Month-to-date revenue extrapolated to the full month using days elapsed." />
        <KpiCard index={2} label="Expenses (run-rate)" value={inr(m.monthlyExpenses)} delta={m.expenseGrowth} tone={m.expenseGrowth > 0.1 ? "warn" : "neutral"} sub="this month" hint="Month-to-date spend extrapolated to the full month." />
        <KpiCard index={3} label="Runway" value={`${m.runwayMonths.toFixed(1)} mo`} tone={m.runwayMonths < 4 ? "warn" : "good"} sub={`at ${inr(m.burn)}/mo outflow`} hint="Cash divided by average monthly outflow across closed months." />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health score */}
        <Panel
          title="Business Health Score"
          description="Six weighted dimensions, each computed from your ledger."
          className="lg:col-span-1"
          footer={<span>Score recalculates every time transactions change. No AI is used in the calculation.</span>}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(health.total / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold tnum">{health.total}</span>
                <span className="text-[10px] text-muted-foreground">/ 100</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-semibold">
                {health.total >= 75 ? "Healthy" : health.total >= 60 ? "Stable, watch spend" : "Needs attention"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Driven mainly by {[...health.parts].sort((a, b) => a.score - b.score)[0].label.toLowerCase()} at{" "}
                {[...health.parts].sort((a, b) => a.score - b.score)[0].score}/100.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {health.parts.map((p) => (
              <div key={p.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-semibold tnum">{p.score}</span>
                </div>
                <Progress value={p.score} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground/80 mt-1">{p.hint}</p>
              </div>
            ))}
          </div>
        </Panel>

        {/* Revenue vs expenses */}
        <Panel
          title="Revenue vs expenses"
          description="Last 6 months, from categorised bank and gateway transactions."
          className="lg:col-span-2"
        >
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ left: -14, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <RTooltip formatter={(v: number) => inrFull(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/70">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Avg revenue</div>
              <div className="font-semibold tnum">{inr(m.avgRevenue)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Avg expenses</div>
              <div className="font-semibold tnum">{inr(m.avgExpenses)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Avg margin</div>
              <div className="font-semibold tnum">{Math.round(m.grossMargin * 100)}%</div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Cash projection" description="Where cash lands over the next 3 months." className="lg:col-span-2">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashPath} margin={{ left: -14, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <RTooltip formatter={(v: number) => inrFull(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Area type="monotone" dataKey="projected" name="Projected cash" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#cashFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Assumes {inr(m.avgRevenue)} monthly revenue, {inr(forecast.reduce((s, f) => s + f.receivables, 0))} of receivables collected across 3 months, and scheduled payroll, vendor, tax and opex outflows.
          </p>
        </Panel>

        <Panel title="This month's spend" description="Category split, month to date.">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cats} dataKey="amount" nameKey="category" innerRadius={48} outerRadius={78} paddingAngle={2}>
                  {cats.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <RTooltip formatter={(v: number) => inrFull(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {cats.map((c, i) => (
              <div key={c.category} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ background: chartColors[i % chartColors.length] }} />
                <span className="flex-1 text-muted-foreground">{c.category}</span>
                <span className="font-medium tnum">{inr(c.amount)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="What needs your attention" description="Generated by the specialist agents from today's data." className="lg:col-span-2">
          <div className="space-y-3">
            {insights.slice(0, 4).map((i) => {
              const tone = insightTone(i.kind);
              return (
                <div key={i.id} className="rounded-lg border border-border/70 p-3.5">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${tone.chip}`}>{tone.label}</span>
                    <AgentTag agent={i.agent} />
                    {i.metric && <span className="ml-auto text-xs font-semibold tnum">{i.metric}</span>}
                  </div>
                  <div className="font-medium text-sm">{i.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">{i.finding}</p>
                </div>
              );
            })}
          </div>
          <Link to="/app/brief" className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-4">
            See the full brief with reasoning <ArrowRight className="w-3 h-3" />
          </Link>
        </Panel>

        <Panel title="Accounts" description="Connected in Demo Mode (read-only).">
          <div className="space-y-2.5">
            {accounts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {a.kind} ····{a.last4}
                  </div>
                </div>
                <div className="text-sm font-semibold tnum">{inr(a.balance)}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--success))]" />
            Receivables {inr(m.receivables)} · Payables {inr(m.payables)}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Overview;
