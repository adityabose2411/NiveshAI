import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { Download, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentTag, KpiCard, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { budgetRows, computeMetrics, inr, inrFull } from "@/lib/finance";
import { zeroBasedSaving } from "@/lib/formulas";
import { downloadReport } from "@/lib/reports";
import { cn } from "@/lib/utils";

const Budgets = () => {
  const { transactions } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const rows = useMemo(() => budgetRows(transactions), [transactions]);
  const [zbb, setZbb] = useState<Record<string, number>>({});

  const totalBudget = rows.reduce((s, r) => s + r.monthlyBudget, 0);
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  const totalForecast = rows.reduce((s, r) => s + r.forecast, 0);
  const zbbSaving = rows.reduce((s, r) => s + zeroBasedSaving(r.monthlyBudget, zbb[r.category] ?? r.monthlyBudget), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        subtitle="Budget vs actual for the month in progress, forecast to month end, plus a zero-based rebuild of every line."
        actions={
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => {
              downloadReport("pl", m, transactions);
              toast.success("P&L with budget variance downloaded");
            }}
          >
            <Download className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Monthly budget" value={inr(totalBudget)} index={0} />
        <KpiCard label="Spent so far" value={inr(totalActual)} sub={`${rows[0]?.daysLeft ?? 0} days left in month`} index={1} />
        <KpiCard
          label="Forecast to month end"
          value={inr(totalForecast)}
          tone={totalForecast > totalBudget ? "bad" : "good"}
          delta={totalBudget ? (totalForecast - totalBudget) / totalBudget : 0}
          index={2}
        />
        <KpiCard label="Lines over budget" value={`${rows.filter((r) => r.forecastPct > 1).length} of ${rows.length}`} tone="warn" index={3} />
      </div>

      <Panel title="Budget vs forecast" description="Run-rate projection = spend to date × (days in month / days elapsed).">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows.map((r) => ({ name: r.category, Budget: r.monthlyBudget, Actual: r.actual, Forecast: r.forecast }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(24 10% 90%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-24} textAnchor="end" height={60} />
              <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} width={58} />
              <RTooltip formatter={(v: number) => inrFull(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Budget" fill="hsl(24 10% 78%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="hsl(21 90% 48%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Forecast" fill="hsl(214 80% 44%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Line-by-line" description="Utilisation is actual ÷ budget; the pill flags a forecast overrun." actions={<AgentTag agent="FP&A Agent" />}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Forecast</TableHead>
                <TableHead>Utilisation</TableHead>
                <TableHead className="text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.category}>
                  <TableCell className="font-medium">{r.category}</TableCell>
                  <TableCell className="text-right tnum">{inrFull(r.monthlyBudget)}</TableCell>
                  <TableCell className="text-right tnum">{inrFull(r.actual)}</TableCell>
                  <TableCell className="text-right tnum">{inrFull(r.forecast)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", r.forecastPct > 1 ? "bg-[hsl(var(--danger))]" : "bg-[hsl(var(--success))]")}
                          style={{ width: `${Math.min(r.usedPct * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] tnum text-muted-foreground">{Math.round(r.usedPct * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tnum font-medium",
                      r.forecast > r.monthlyBudget ? "text-[hsl(var(--danger))]" : "text-[hsl(var(--success))]",
                    )}
                  >
                    {r.forecast > r.monthlyBudget ? "+" : "−"}
                    {inrFull(Math.abs(r.forecast - r.monthlyBudget))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <Panel
        title="Zero-based budget rebuild"
        description="Enter the justified requirement for each line. Saving = current budget − justified need."
        actions={
          <span className="text-sm font-semibold text-primary tnum">
            <Target className="w-3.5 h-3.5 inline mr-1" />
            {inr(zbbSaving)}/mo identified
          </span>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.category} className="rounded-lg border border-border/70 p-3">
              <div className="flex items-center justify-between text-[13px] font-medium">
                <span>{r.category}</span>
                <span className="text-muted-foreground tnum">{inr(r.monthlyBudget)}</span>
              </div>
              <Input
                type="number"
                className="mt-2 h-9 rounded-lg tnum"
                placeholder="Justified need"
                value={zbb[r.category] ?? ""}
                onChange={(e) => setZbb((p) => ({ ...p, [r.category]: Number(e.target.value) }))}
              />
              <div className="text-[11px] mt-1.5 text-muted-foreground">
                Saving:{" "}
                <span className="font-semibold text-foreground tnum">
                  {inr(zeroBasedSaving(r.monthlyBudget, zbb[r.category] ?? r.monthlyBudget))}
                </span>{" "}
                / month
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Annualised opportunity from this rebuild: <span className="font-semibold text-foreground">{inrFull(zbbSaving * 12)}</span>
        </div>
      </Panel>
    </div>
  );
};

export default Budgets;
