import { useMemo, useState } from "react";
import { CheckCheck, Link2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentTag, Confidence, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { inrFull, reconciliationStats } from "@/lib/finance";

const Reconciliation = () => {
  const { transactions, markReconciled } = useApp();
  const stats = useMemo(() => reconciliationStats(transactions), [transactions]);
  const [tab, setTab] = useState("unmatched");
  const [selected, setSelected] = useState<string[]>([]);

  const lists = {
    unmatched: transactions.filter((t) => !t.reconciled && t.confidence >= 0.6),
    review: transactions.filter((t) => !t.reconciled && t.confidence < 0.6),
    matched: transactions.filter((t) => t.reconciled).slice(0, 30),
  };
  const rows = lists[tab as keyof typeof lists];

  const toggle = (id: string) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const confirmSelected = () => {
    markReconciled(selected);
    toast.success(`${selected.length} transactions reconciled`, { description: "Category totals and forecasts updated." });
    setSelected([]);
  };

  const pct = Math.round((stats.matched / transactions.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reconciliation"
        subtitle="The Reconciliation Agent matches bank movements to invoices and bills, then hands you only the exceptions."
        actions={
          selected.length > 0 && (
            <Button size="sm" className="rounded-lg" onClick={confirmSelected}>
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Confirm {selected.length} matches
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Auto-matched</div>
          <div className="font-display text-xl font-bold tnum mt-1 text-[hsl(var(--success))]">{stats.matched}</div>
          <div className="text-xs text-muted-foreground mt-1">{pct}% of the ledger</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Awaiting confirmation</div>
          <div className="font-display text-xl font-bold tnum mt-1 text-[hsl(var(--warning))]">{stats.unmatched}</div>
          <div className="text-xs text-muted-foreground mt-1">High confidence, one click each</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Flagged for review</div>
          <div className="font-display text-xl font-bold tnum mt-1 text-[hsl(var(--danger))]">{stats.review}</div>
          <div className="text-xs text-muted-foreground mt-1">Ambiguous counterparty or amount</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Time saved</div>
          <div className="font-display text-xl font-bold tnum mt-1">{Math.round((stats.matched * 40) / 60)} min</div>
          <div className="text-xs text-muted-foreground mt-1">At 40 seconds per manual match</div>
        </div>
      </div>

      <Panel
        title="Exceptions queue"
        description="Nothing is posted without your confirmation."
        actions={<AgentTag agent="Reconciliation Agent" />}
        footer={<span>Discrepancy rules checked: amount tolerance ±2%, date window ±7 days, counterparty name similarity, duplicate detection.</span>}
      >
        <Tabs value={tab} onValueChange={(v) => { setTab(v); setSelected([]); }} className="mb-4">
          <TabsList className="rounded-lg">
            <TabsTrigger value="unmatched" className="text-xs">Awaiting ({lists.unmatched.length})</TabsTrigger>
            <TabsTrigger value="review" className="text-xs">Review ({lists.review.length})</TabsTrigger>
            <TabsTrigger value="matched" className="text-xs">Matched</TabsTrigger>
          </TabsList>
        </Tabs>

        {rows.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
            <CheckCheck className="w-4 h-4 text-[hsl(var(--success))]" /> Nothing left in this queue.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <Table>
              <TableHeader>
                <TableRow>
                  {tab !== "matched" && <TableHead className="w-[40px]"></TableHead>}
                  <TableHead className="w-[92px]">Date</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Suggested match</TableHead>
                  <TableHead className="w-[80px]">Conf.</TableHead>
                  <TableHead className="text-right w-[120px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.id}>
                    {tab !== "matched" && (
                      <TableCell>
                        <Checkbox checked={selected.includes(t.id)} onCheckedChange={() => toggle(t.id)} />
                      </TableCell>
                    )}
                    <TableCell className="text-xs text-muted-foreground tnum">{t.date.slice(5)}</TableCell>
                    <TableCell>
                      <div className="text-[13px] font-medium">{t.counterparty}</div>
                      <div className="text-[11px] text-muted-foreground">{t.description}</div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {t.confidence >= 0.6 ? (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Link2 className="w-3 h-3 text-[hsl(var(--success))]" />
                          {t.type === "income" ? "Open invoice, amount + date match" : `${t.category} bill, vendor + amount match`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[hsl(var(--danger))]">
                          <TriangleAlert className="w-3 h-3" /> No confident match — unlabelled counterparty
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Confidence value={t.confidence} />
                    </TableCell>
                    <TableCell className="text-right text-[13px] font-semibold tnum">{inrFull(t.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default Reconciliation;
