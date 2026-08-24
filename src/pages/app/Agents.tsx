import { useMemo } from "react";
import { Bot, CheckCircle2, Sigma } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { agents } from "@/data/demo";
import { FORMULAS } from "@/lib/formulas";
import { useApp } from "@/store/AppStore";

const Agents = () => {
  const { approvals } = useApp();
  const pending = approvals.filter((a) => a.status === "pending").length;
  const modelsFor = useMemo(
    () => (name: string) => FORMULAS.filter((f) => f.usedBy.toLowerCase().includes(name.split(" ")[0].toLowerCase())),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI agents"
        subtitle="Nine specialists working the same ledger. Each one is scoped to a job, grounded on the formula library, and required to ask before acting."
        actions={
          <Link to="/app/formulas">
            <Button variant="outline" className="rounded-lg">
              <Sigma className="w-4 h-4 mr-1.5" /> Formula library
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Agents active</div>
          <div className="font-display text-2xl font-bold mt-1">{agents.filter((a) => a.status === "active").length}</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Models available</div>
          <div className="font-display text-2xl font-bold mt-1">{FORMULAS.length}</div>
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Awaiting your approval</div>
          <div className="font-display text-2xl font-bold mt-1 text-primary">{pending}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: i * 0.04 }}
            className="panel p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-primary" />
              </div>
              <Badge
                variant="outline"
                className={
                  a.status === "active"
                    ? "text-[10px] border-[hsl(var(--success))]/40 text-[hsl(var(--success))] bg-[hsl(var(--success-soft))]"
                    : "text-[10px]"
                }
              >
                {a.status}
              </Badge>
            </div>
            <h3 className="font-display font-semibold text-[15px] mt-3">{a.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{a.role}</p>
            <ul className="mt-3 space-y-1.5">
              {a.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-1.5 text-[12px] text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
            {modelsFor(a.name).length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/70">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Models it may use</div>
                <div className="flex flex-wrap gap-1.5">
                  {modelsFor(a.name).slice(0, 4).map((f) => (
                    <span key={f.id} className="rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <DemoNote>
        In Demo Mode agents read and recommend only. Every recommendation lands in the Daily Brief for your approval and is written to the audit trail.
      </DemoNote>
    </div>
  );
};

export default Agents;
