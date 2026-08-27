import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";

const formulaChips = [
  "DCF & Terminal Value",
  "WACC / CAPM",
  "NPV & IRR",
  "Altman Z-Score",
  "DuPont ROE",
  "DSO / DPO / CCC",
  "Contribution margin",
  "LTV : CAC",
  "EOQ",
  "Zero-based budgeting",
  "Transfer pricing (India)",
  "Break-even & operating leverage",
];

const RigorSection = () => (
  <section id="rigor" className="border-y border-border/60 bg-surface py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why you can trust it</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Real CFO math. Shown, not hidden.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            HundiAI doesn't guess. Every number traces back to a named formula, the inputs it used, and
            the transaction lines behind them. Open the formula library and check the working yourself.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Sigma, t: "30+ grounded formulas", b: "Valuation, liquidity, credit risk, unit economics and Indian tax rules." },
              { icon: ShieldCheck, t: "Every action is auditable", b: "Agent recommendations need your approval and are logged permanently." },
              { icon: BookOpen, t: "Assumptions on the surface", b: "Discount rates, growth and margins are editable, never buried." },
            ].map((f) => (
              <div key={f.t} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">{f.t}</p>
                  <p className="text-sm text-muted-foreground">{f.b}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/app/formulas">
            <Button className="mt-8 rounded-2xl">Browse the formula library</Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border/70 bg-card p-7 shadow-elevated"
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Formula library</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {formulaChips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-surface p-5 font-mono text-xs leading-relaxed text-foreground/80">
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-wide text-primary">
              Enterprise value
            </p>
            EV = Σ FCFt / (1 + WACC)^t + TV / (1 + WACC)^n
            <br />
            TV = FCFn × (1 + g) / (WACC − g)
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default RigorSection;
