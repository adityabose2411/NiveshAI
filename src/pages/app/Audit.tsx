import { useMemo, useState } from "react";
import { ScrollText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AgentTag, DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";

const tone = (approval: string) =>
  approval.startsWith("Approved")
    ? "border-[hsl(var(--success))]/40 text-[hsl(var(--success))] bg-[hsl(var(--success-soft))]"
    : approval.startsWith("Rejected")
      ? "border-[hsl(var(--danger))]/40 text-[hsl(var(--danger))] bg-[hsl(var(--danger-soft))]"
      : "border-[hsl(var(--warning))]/40 text-[hsl(var(--warning))] bg-[hsl(var(--warning-soft))]";

const Audit = () => {
  const { audit } = useApp();
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => audit.filter((a) => (a.agent + a.action + a.recommendation).toLowerCase().includes(q.toLowerCase())),
    [audit, q],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit trail"
        subtitle="Every agent decision, the data it read, what it recommended, and what you decided. Nothing happens without a record."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Entries", value: audit.length },
          { label: "Approved", value: audit.filter((a) => a.approval.startsWith("Approved")).length },
          { label: "Rejected", value: audit.filter((a) => a.approval.startsWith("Rejected")).length },
          { label: "Awaiting you", value: audit.filter((a) => a.approval.startsWith("Awaiting")).length },
        ].map((k) => (
          <div key={k.label} className="panel p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
            <div className="font-display text-2xl font-bold mt-1">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by agent, action or recommendation" className="pl-9 h-10 rounded-lg" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Panel title="Decision log" description="Newest first.">
        <div className="space-y-3">
          {rows.map((a) => (
            <div key={a.id} className="rounded-lg border border-border/70 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <AgentTag agent={a.agent} />
                <span className="text-[11px] text-muted-foreground">{a.timestamp}</span>
                <Badge variant="outline" className={`text-[10px] ml-auto ${tone(a.approval)}`}>
                  {a.approval}
                </Badge>
              </div>
              <div className="font-medium text-[13.5px] mt-2.5 flex items-start gap-1.5">
                <ScrollText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                {a.action}
              </div>
              <div className="grid gap-2 sm:grid-cols-3 mt-3 text-[11.5px]">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Data used</div>
                  <div className="mt-0.5 text-foreground/80">{a.dataUsed}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recommendation</div>
                  <div className="mt-0.5 text-foreground/80">{a.recommendation}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Result</div>
                  <div className="mt-0.5 text-foreground/80">{a.result}</div>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">No entries match that search.</div>}
        </div>
      </Panel>

      <DemoNote>Approving or rejecting a recommendation in the Daily Brief writes a new entry here immediately.</DemoNote>
    </div>
  );
};

export default Audit;
