import { useMemo, useState } from "react";
import { BookOpen, Search, Sigma } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentTag, DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { FORMULAS, FORMULA_CATEGORIES } from "@/lib/formulas";
import { cn } from "@/lib/utils";

const Formulas = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const rows = useMemo(
    () =>
      FORMULAS.filter((f) => (cat === "All" || f.category === cat)).filter((f) =>
        (f.name + f.expression + f.purpose + f.inputs.join(" ")).toLowerCase().includes(q.toLowerCase()),
      ),
    [q, cat],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formula library"
        subtitle="The complete model set the HundiAI agents are grounded on — valuation, cost of capital, working capital, cost-cutting techniques, transfer pricing and Indian tax. Agents may only use maths defined here."
        actions={<AgentTag agent="All agents" />}
      />

      <Panel title="How the agents use this" description="Grounding rules that keep answers auditable.">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { t: "Retrieve, don't invent", d: "Every question is mapped to one or more models below. If no model fits, the agent says so instead of estimating." },
            { t: "Ledger inputs only", d: "Inputs are pulled from categorised transactions, invoices, bills and balances — never from free text." },
            { t: "Show the working", d: "Answers and PDFs quote the expression, the inputs used and the resulting value so a CA can verify it." },
          ].map((c) => (
            <div key={c.t} className="rounded-lg border border-border/70 p-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2.5">
                <Sigma className="w-4 h-4 text-primary" />
              </div>
              <div className="font-semibold text-[13px]">{c.t}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.d}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search DCF, WACC, transfer pricing, Pareto, EOQ, GST…"
            className="pl-9 h-10 rounded-lg"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["All", ...FORMULA_CATEGORIES].map((c) => (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "outline"}
              className="rounded-lg h-9 shrink-0 text-[12px]"
              onClick={() => setCat(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.03 }}
            className="panel p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display font-semibold text-[15px]">{f.name}</h3>
              <Badge variant="outline" className="text-[10px] shrink-0 border-primary/30 text-primary bg-primary/5">
                {f.category}
              </Badge>
            </div>
            <div className={cn("mt-3 rounded-lg bg-muted/60 border border-border/70 px-3 py-2.5", "font-mono text-[12px] leading-relaxed break-words")}>
              {f.expression}
            </div>
            <p className="text-xs text-muted-foreground mt-3">{f.purpose}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {f.inputs.map((inp) => (
                <span key={inp} className="rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                  {inp}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/70 p-2.5">
              <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span className="text-[11.5px] text-foreground/80">{f.worked}</span>
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">Owned by {f.usedBy}</div>
          </motion.div>
        ))}
      </div>

      {rows.length === 0 && (
        <Panel>
          <div className="text-sm text-muted-foreground text-center py-6">No formula matches that search.</div>
        </Panel>
      )}

      <DemoNote>
        {FORMULAS.length} models are live. Each one is implemented as a pure function in the app, so a report and a chat answer can never disagree.
      </DemoNote>
    </div>
  );
};

export default Formulas;
