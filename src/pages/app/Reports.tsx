import { useMemo, useState } from "react";
import { Download, FileText, Loader2, Printer, Stamp } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentTag, DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { computeMetrics, healthScore, inr } from "@/lib/finance";
import { REPORTS, downloadBoardPack, downloadReport } from "@/lib/reports";

const Reports = () => {
  const { transactions } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const h = healthScore(m);
  const [busy, setBusy] = useState<string | null>(null);

  const run = (id: string, label: string, fn: () => void) => {
    setBusy(id);
    setTimeout(() => {
      try {
        fn();
        toast.success(`${label} downloaded as PDF`);
      } catch {
        toast.error("Could not generate the PDF. Please retry.");
      } finally {
        setBusy(null);
      }
    }, 350);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Board-ready PDFs generated from your live ledger. Every figure traces back to a transaction and a named formula."
        actions={
          <>
            <Button variant="outline" className="rounded-lg" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1.5" /> Print view
            </Button>
            <Button
              className="rounded-lg"
              disabled={busy === "pack"}
              onClick={() => run("pack", "Board Pack", () => downloadBoardPack(m, transactions))}
            >
              {busy === "pack" ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Stamp className="w-4 h-4 mr-1.5" />}
              Download full board pack
            </Button>
          </>
        }
      />

      <Panel title="This period at a glance" description="The headline numbers that appear on every report cover page." actions={<AgentTag agent="Reporting Agent" />}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Health score", value: `${h.total}/100` },
            { label: "Cash", value: inr(m.cashBalance) },
            { label: "Runway", value: `${m.runwayMonths.toFixed(1)} mo` },
            { label: "Receivables", value: inr(m.receivables) },
            { label: "Payables", value: inr(m.payables) },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-border/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className="font-display text-lg font-bold tnum mt-1">{k.value}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="panel p-5 flex flex-col"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-[15px] mt-3">{r.name}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 flex-1">{r.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="text-[10px]">
                {r.pages}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {r.audience}
              </Badge>
            </div>
            <Button
              className="rounded-lg mt-4 w-full"
              variant="outline"
              disabled={busy === r.id}
              onClick={() => run(r.id, r.name, () => downloadReport(r.id, m, transactions))}
            >
              {busy === r.id ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
              Download PDF
            </Button>
          </motion.div>
        ))}
      </div>

      <DemoNote>
        PDFs are generated in your browser — nothing is uploaded. Each report states the formula behind every calculated line so your CA or investor
        can verify it.
      </DemoNote>
    </div>
  );
};

export default Reports;
