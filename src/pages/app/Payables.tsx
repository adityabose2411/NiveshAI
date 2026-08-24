import { useMemo } from "react";
import { CalendarClock, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentTag, KpiCard, PageHeader, Panel, StatusPill } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { bills } from "@/data/demo";
import { computeMetrics, daysBetween, inr, inrFull } from "@/lib/finance";
import { dpo, earlyPaymentApr } from "@/lib/formulas";
import { downloadReport } from "@/lib/reports";

const rank = (b: (typeof bills)[number]) => {
  const statutory = b.category === "Taxes" ? 100 : 0;
  const critical = b.importance === "critical" ? 40 : b.importance === "high" ? 20 : 0;
  const overdue = Math.max(daysBetween(b.due), 0) * 1.5;
  return statutory + critical + overdue + b.amount / 200000;
};

const Payables = () => {
  const { transactions } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const open = bills.filter((b) => b.status !== "paid").sort((a, b) => rank(b) - rank(a));
  const dpoV = dpo(m.payables, m.avgExpenses * 12);
  const weeks = [0, 1, 2, 3].map((w) => ({
    label: `Week ${w + 1}`,
    amount: open
      .filter((b) => {
        const d = -daysBetween(b.due);
        return d >= w * 7 && d < (w + 1) * 7;
      })
      .reduce((s, b) => s + b.amount, 0),
  }));
  const maxWeek = Math.max(...weeks.map((w) => w.amount), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payables"
        subtitle="What you owe, in the order the AP Agent would pay it: statutory deadlines first, then criticality, then discount value."
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
        <KpiCard label="Open payables" value={inr(m.payables)} sub={`${open.length} bills`} index={0} />
        <KpiCard label="Overdue" value={inr(m.overduePayables)} tone="bad" sub="Late payment risk" index={1} />
        <KpiCard label="Due in 10 days" value={inr(m.duesNext10Days)} tone="warn" index={2} />
        <KpiCard label="DPO" value={`${dpoV.toFixed(0)} days`} hint="DPO = (Payables / COGS) × 365" index={3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Payment calendar" description="Cash required per week.">
          <div className="space-y-3">
            {weeks.map((w) => (
              <div key={w.label}>
                <div className="flex items-center justify-between text-[13px] mb-1">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarClock className="w-3.5 h-3.5" /> {w.label}
                  </span>
                  <span className="tnum font-medium">{inr(w.amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(w.amount / maxWeek) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-border/70 p-3 text-xs text-muted-foreground">
            Taking 2/10 net 45 terms on discretionary vendors earns{" "}
            <span className="font-semibold text-foreground">{(earlyPaymentApr(0.02, 45, 10) * 100).toFixed(1)}% APR</span> on cash — better than
            parking it.
          </div>
        </Panel>

        <Panel title="Payment priority" description="Ranked, with the reason for each position." actions={<AgentTag agent="AP Agent" />} className="lg:col-span-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Due in</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {open.map((b, idx) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.number}</TableCell>
                    <TableCell className="max-w-[170px] truncate">{b.vendor}</TableCell>
                    <TableCell className="text-right tnum">{inrFull(b.amount)}</TableCell>
                    <TableCell className="text-right tnum">
                      {daysBetween(b.due) > 0 ? `${daysBetween(b.due)}d overdue` : `${Math.abs(daysBetween(b.due))}d`}
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] font-semibold text-primary">#{idx + 1}</span>{" "}
                      <span className="text-[11px] text-muted-foreground capitalize">{b.category === "Taxes" ? "statutory" : b.importance}</span>
                    </TableCell>
                    <TableCell>
                      <StatusPill status={b.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Payables;
