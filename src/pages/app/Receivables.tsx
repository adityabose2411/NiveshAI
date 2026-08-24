import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentTag, KpiCard, PageHeader, Panel, StatusPill, chartColors } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { invoices } from "@/data/demo";
import { ageingBuckets, computeMetrics, daysBetween, inr, inrFull } from "@/lib/finance";
import { dso } from "@/lib/formulas";
import { downloadReport } from "@/lib/reports";

const Receivables = () => {
  const { transactions } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const a = useMemo(() => ageingBuckets(), []);
  const dsoV = dso(m.receivables, m.avgRevenue * 12);

  const open = invoices
    .filter((i) => i.status !== "paid")
    .map((i) => ({ ...i, overdueDays: daysBetween(i.due) }))
    .sort((x, y) => y.overdueDays - x.overdueDays);

  const priority = (i: (typeof open)[number]) => {
    const score = (i.overdueDays > 0 ? i.overdueDays : 0) * 0.6 + (i.amount / 100000) * 4;
    return score > 30 ? "Chase today" : score > 12 ? "This week" : "Monitor";
  };

  const pieData = [
    { name: "Not yet due", value: a.current },
    { name: "1–30 days", value: a.d30 },
    { name: "31–60 days", value: a.d60 },
    { name: "60+ days", value: a.d90 },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Receivables"
        subtitle="Who owes you, for how long, and the order the AR Agent would chase them in."
        actions={
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => {
              downloadReport("arap", m, transactions);
              toast.success("Receivables & Payables Report downloaded");
            }}
          >
            <Download className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open receivables" value={inr(a.total)} sub={`${open.length} invoices`} index={0} />
        <KpiCard label="Overdue" value={inr(m.overdueReceivables)} tone="bad" sub={`${open.filter((i) => i.overdueDays > 0).length} invoices past due`} index={1} />
        <KpiCard label="DSO" value={`${dsoV.toFixed(0)} days`} hint="DSO = (Receivables / Revenue) × 365" index={2} />
        <KpiCard label="Collectable in 30 days" value={inr(Math.round(a.total * 0.45))} tone="good" sub="Based on payment history" index={3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Ageing mix" description="Every rupee outstanding, bucketed.">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={chartColors[i]} />
                  ))}
                </Pie>
                <RTooltip formatter={(v: number) => inrFull(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: chartColors[i] }} />
                <span className="flex-1 text-muted-foreground">{d.name}</span>
                <span className="tnum font-medium">{inr(d.value)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Collection queue" description="Ranked by days overdue weighted by value." actions={<AgentTag agent="AR Agent" />} className="lg:col-span-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {open.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.number}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{i.customer}</TableCell>
                    <TableCell className="text-right tnum">{inrFull(i.amount)}</TableCell>
                    <TableCell className="text-right tnum">
                      {i.overdueDays > 0 ? `${i.overdueDays} overdue` : `${Math.abs(i.overdueDays)} left`}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={i.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={priority(i) === "Chase today" ? "default" : "ghost"}
                        className="h-7 rounded-md text-[11px]"
                        onClick={() => toast.success(`Reminder drafted for ${i.number} (Demo Mode — nothing sent)`)}
                      >
                        <Mail className="w-3 h-3 mr-1" /> {priority(i)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>
      </div>

      <Panel title="Customer concentration" description="Concentration risk is measured with the Herfindahl index of revenue share.">
        <div className="space-y-2">
          {Array.from(
            open.reduce((map, i) => {
              map.set(i.customer, (map.get(i.customer) ?? 0) + i.amount);
              return map;
            }, new Map<string, number>()),
          )
            .sort((x, y) => y[1] - x[1])
            .map(([customer, amount]) => (
              <div key={customer}>
                <div className="flex items-center justify-between text-[13px] mb-1">
                  <span className="truncate">{customer}</span>
                  <span className="tnum text-muted-foreground">
                    {inrFull(amount)} · {Math.round((amount / a.total) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(amount / a.total) * 100}%` }} />
                </div>
              </div>
            ))}
        </div>
      </Panel>
    </div>
  );
};

export default Receivables;
