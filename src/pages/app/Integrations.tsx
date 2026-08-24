import { Check, Plug, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { integrations } from "@/data/demo";

const groups = Array.from(new Set(integrations.map((i) => i.category)));

const Integrations = () => (
  <div className="space-y-6">
    <PageHeader
      title="Integrations"
      subtitle="HundiAI reads from the systems you already use. Connections are read-only by default — the agents never move money."
    />

    <div className="grid gap-4 sm:grid-cols-3">
      <div className="panel p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Connected</div>
        <div className="font-display text-2xl font-bold mt-1">{integrations.filter((i) => i.connected).length}</div>
      </div>
      <div className="panel p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Available in demo</div>
        <div className="font-display text-2xl font-bold mt-1">{integrations.filter((i) => i.status === "demo").length}</div>
      </div>
      <div className="panel p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Coming soon</div>
        <div className="font-display text-2xl font-bold mt-1">{integrations.filter((i) => i.status === "coming-soon").length}</div>
      </div>
    </div>

    {groups.map((g) => (
      <Panel key={g} title={g}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {integrations
            .filter((i) => i.category === g)
            .map((i, idx) => (
              <motion.div
                key={i.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.03 }}
                className="rounded-lg border border-border/70 p-4 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plug className="w-4 h-4 text-primary" />
                  </div>
                  {i.connected ? (
                    <Badge variant="outline" className="text-[10px] border-[hsl(var(--success))]/40 text-[hsl(var(--success))] bg-[hsl(var(--success-soft))]">
                      <Check className="w-3 h-3 mr-0.5" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      {i.status === "demo" ? "Available" : "Coming soon"}
                    </Badge>
                  )}
                </div>
                <div className="font-semibold text-[13.5px] mt-2.5">{i.name}</div>
                <p className="text-xs text-muted-foreground mt-1 flex-1">{i.description}</p>
                <Button
                  size="sm"
                  variant={i.connected ? "ghost" : "outline"}
                  className="rounded-lg mt-3 w-full h-8 text-[12px]"
                  disabled={i.status === "coming-soon"}
                  onClick={() =>
                    toast.success(
                      i.connected ? `${i.name} is syncing demo data` : `${i.name} connection simulated (Demo Mode — no real data moved)`,
                    )
                  }
                >
                  {i.connected ? "Manage" : "Connect"}
                </Button>
              </motion.div>
            ))}
        </div>
      </Panel>
    ))}

    <Panel title="Request an integration" description="Tell us what your books already live in.">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <p className="text-sm text-muted-foreground flex-1">
          Marg, Vyapar, Khatabook, Razorpay X, Zoho Payroll and bank-specific corporate feeds are on the roadmap.
        </p>
        <Button variant="outline" className="rounded-lg" onClick={() => toast.success("Request noted — thank you")}>
          Request
        </Button>
      </div>
    </Panel>

    <DemoNote>No live credentials are used anywhere in this demo. Connecting real sources happens through consented, read-only APIs.</DemoNote>
  </div>
);

export default Integrations;
