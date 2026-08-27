import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  Link2,
  Scale,
  Sparkles,
  Wallet,
} from "lucide-react";

const steps = [
  { icon: Link2, name: "Connect", body: "Banks, UPI, Razorpay, Stripe, GST and your invoice ledger — read-only." },
  { icon: Brain, name: "Understand", body: "Every transaction categorised with a confidence score and an audit trail." },
  { icon: Scale, name: "Reconcile", body: "Bank movements matched to invoices and bills. Only exceptions reach you." },
  { icon: BarChart3, name: "Analyze", body: "Health score, margins, burn, DSO/DPO, vendor concentration, unit economics." },
  { icon: Activity, name: "Plan", body: "90-day cash forecast, hiring and capex scenarios, DCF, NPV and IRR." },
  { icon: Wallet, name: "Optimize", body: "Duplicate SaaS, price leakage, zero-based budget rebuilds, tax timing." },
  { icon: Sparkles, name: "Act", body: "Recommendations you approve in one click, logged forever in the audit trail." },
];

const WorkflowSection = () => (
  <section id="how-it-works" className="border-y border-border/60 bg-surface py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The loop</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          One continuous finance operating system
        </h2>
        <p className="mt-4 text-muted-foreground">
          Not a dashboard you check. A loop that runs every day and escalates only what needs a human.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative rounded-3xl border border-border/70 bg-card p-6 shadow-soft"
          >
            <span className="absolute right-5 top-5 font-display text-xs font-bold text-muted-foreground/50">
              0{i + 1}
            </span>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl gradient-trust">
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-base font-semibold">{s.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WorkflowSection;
