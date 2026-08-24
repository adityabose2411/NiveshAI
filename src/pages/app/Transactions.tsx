import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Confidence, DemoNote, PageHeader, Panel, StatusPill } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { accounts, categories } from "@/data/demo";
import { computeMetrics, inrFull } from "@/lib/finance";

const Transactions = () => {
  const { transactions, recategorise } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [acct, setAcct] = useState("all");
  const [conf, setConf] = useState("all");
  const [limit, setLimit] = useState(40);

  const rows = useMemo(
    () =>
      transactions.filter((t) => {
        if (q && !`${t.description} ${t.counterparty}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat !== "all" && t.category !== cat) return false;
        if (acct !== "all" && t.accountId !== acct) return false;
        if (conf === "low" && t.confidence >= 0.7) return false;
        if (conf === "high" && t.confidence < 0.9) return false;
        return true;
      }),
    [transactions, q, cat, acct, conf],
  );

  const exportCsv = () => {
    const header = "Date,Description,Counterparty,Category,Type,Amount,Account,Status,Confidence\n";
    const body = rows
      .map((t) =>
        [t.date, `"${t.description}"`, `"${t.counterparty}"`, t.category, t.type, t.amount, t.accountId, t.status, t.confidence]
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([header + body], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "hundiai-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} transactions`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Every transaction, categorised automatically with a confidence score. Correct a category once and the Accounting Agent learns the rule."
        actions={
          <Button variant="outline" size="sm" className="rounded-lg" onClick={exportCsv}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Transactions</div>
          <div className="font-display text-xl font-bold tnum mt-1">{transactions.length}</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Auto-categorised</div>
          <div className="font-display text-xl font-bold tnum mt-1">
            {Math.round((transactions.filter((t) => t.confidence >= 0.7).length / transactions.length) * 100)}%
          </div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Needs review</div>
          <div className="font-display text-xl font-bold tnum mt-1 text-[hsl(var(--warning))]">
            {transactions.filter((t) => t.confidence < 0.7).length}
          </div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Net this month</div>
          <div className="font-display text-xl font-bold tnum mt-1">{inrFull(m.netCashFlow)}</div>
        </div>
      </div>

      <Panel
        title="Ledger"
        description={`${rows.length} matching transactions`}
        footer={<span>Corrections are stored locally in Demo Mode and immediately update every dependent metric on other screens.</span>}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search description or vendor" className="pl-9 rounded-lg h-9" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[150px] h-9 rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={acct} onValueChange={setAcct}>
            <SelectTrigger className="w-[170px] h-9 rounded-lg">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={conf} onValueChange={setConf}>
            <SelectTrigger className="w-[150px] h-9 rounded-lg">
              <SelectValue placeholder="Confidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any confidence</SelectItem>
              <SelectItem value="high">High (90%+)</SelectItem>
              <SelectItem value="low">Low (&lt;70%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[92px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[170px]">Category</TableHead>
                <TableHead className="w-[80px]">AI conf.</TableHead>
                <TableHead className="w-[90px]">Status</TableHead>
                <TableHead className="text-right w-[120px]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, limit).map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs text-muted-foreground tnum">{t.date.slice(5)}</TableCell>
                  <TableCell>
                    <div className="text-[13px] font-medium">{t.counterparty}</div>
                    <div className="text-[11px] text-muted-foreground">{t.description}</div>
                  </TableCell>
                  <TableCell>
                    <Select value={t.category} onValueChange={(v) => { recategorise(t.id, v); toast.success(`Recategorised to ${v}`, { description: "Rule saved for this vendor." }); }}>
                      <SelectTrigger className="h-8 text-xs rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c} className="text-xs">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Confidence value={t.confidence} />
                  </TableCell>
                  <TableCell>
                    <StatusPill status={t.status} />
                  </TableCell>
                  <TableCell
                    className={`text-right text-[13px] font-semibold tnum ${t.type === "income" ? "text-[hsl(var(--success))]" : ""}`}
                  >
                    {t.type === "income" ? "+" : "−"}
                    {inrFull(t.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length > limit && (
          <Button variant="outline" size="sm" className="rounded-lg mt-4 w-full" onClick={() => setLimit((l) => l + 40)}>
            Load 40 more ({rows.length - limit} remaining)
          </Button>
        )}
        <div className="mt-4">
          <DemoNote>Demo data for {accounts.length} connected accounts across the last 6 months.</DemoNote>
        </div>
      </Panel>
    </div>
  );
};

export default Transactions;
