import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AgentTag, DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { computeMetrics, inr } from "@/lib/finance";
import { buildInsights, insightTone } from "@/lib/insights";

const DailyBrief = () => {
  const { transactions, approvals, decide } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const insights = useMemo(() => buildInsights(m, transactions), [m, transactions]);
  const [open, setOpen] = useState<string | null>(insights[0]?.id ?? null);

  const grouped = {
    attention: insights.filter((i) => i.kind === "attention"),
    risk: insights.filter((i) => i.kind === "risk"),
    opportunity: insights.filter((i) => i.kind === "opportunity"),
    positive: insights.filter((i) => i.kind === "positive"),
  };

  const pending = approvals.filter((a) => a.status === "pending");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Brief"
        subtitle="What changed, what it means, and what to do about it — written from today's ledger by the specialist agents."
      />

      <Panel title="Executive summary" description="Three sentences on where the business stands right now.">
        <p className="text-sm leading-relaxed">
          Cash stands at <strong className="tnum">{inr(m.cashBalance)}</strong> across four accounts, giving{" "}
          <strong>{m.runwayMonths.toFixed(1)} months</strong> of cover at the current outflow of {inr(m.burn)} per month.
          Revenue is run-rating at {inr(m.monthlyRevenue)} this month against expenses of {inr(m.monthlyExpenses)}, a net
          movement of <strong className="tnum">{inr(m.netCashFlow)}</strong>. The two items that most affect the next 30
          days are {inr(m.overdueReceivables)} of overdue receivables and {inr(m.duesNext10Days)} of bills falling due
          within ten days.
        </p>
        <div className="mt-4">
          <DemoNote>
            Every figure above is calculated from the ledger. The AI decides what to highlight and how to explain it — it
            never invents a number.
          </DemoNote>
        </div>
      </Panel>

      {(["attention", "risk", "opportunity", "positive"] as const).map((kind) => {
        const items = grouped[kind];
        if (!items.length) return null;
        const tone = insightTone(kind);
        return (
          <div key={kind} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${tone.chip}`}>{tone.label}</span>
              <span className="text-xs text-muted-foreground">{items.length} item{items.length > 1 ? "s" : ""}</span>
            </div>
            {items.map((i, idx) => (
              <motion.div key={i.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Collapsible open={open === i.id} onOpenChange={(o) => setOpen(o ? i.id : null)}>
                  <div className="panel">
                    <CollapsibleTrigger className="w-full text-left px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="font-display font-semibold text-[15px]">{i.title}</div>
                          <p className="text-xs text-muted-foreground mt-1">{i.finding}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <AgentTag agent={i.agent} />
                            {i.metric && <span className="text-[11px] font-semibold tnum text-foreground/70">{i.metric}</span>}
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open === i.id ? "rotate-180" : ""}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-5 pb-5 pt-0 space-y-3 text-sm">
                        <div className="rounded-lg bg-muted/50 p-3">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Why this matters
                          </div>
                          <p className="text-xs">{i.why}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                              Data used
                            </div>
                            <p className="text-xs text-muted-foreground">{i.dataUsed}</p>
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                              Recommended action
                            </div>
                            <p className="text-xs text-muted-foreground">{i.action}</p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        );
      })}

      <Panel
        title="Awaiting your approval"
        description="Agents recommend; you decide. Nothing is executed without an explicit approval."
        footer={<span>Approved actions are logged to the Audit Trail. In Demo Mode nothing leaves the app.</span>}
      >
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">All caught up — no pending recommendations.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((a) => (
              <div key={a.id} className="rounded-lg border border-border/70 p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <AgentTag agent={a.agent} />
                  <span className="ml-auto text-[11px] font-semibold text-primary">{a.impact}</span>
                </div>
                <div className="font-medium text-sm">{a.title}</div>
                <p className="text-xs text-muted-foreground mt-1">{a.detail}</p>
                <ul className="mt-3 space-y-1">
                  {a.reasoning.map((r) => (
                    <li key={r} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary">·</span>
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground/80 mt-2">Data used: {a.dataUsed}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="rounded-lg h-8"
                    onClick={() => {
                      decide(a.id, "approved");
                      toast.success("Approved and logged", { description: "Demo Mode — no external action was taken." });
                    }}
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg h-8"
                    onClick={() => {
                      decide(a.id, "rejected");
                      toast("Rejected", { description: "The agent will not raise this again this cycle." });
                    }}
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};

export default DailyBrief;
