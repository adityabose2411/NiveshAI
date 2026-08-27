import { motion } from "framer-motion";
import { AlertTriangle, Clock, FileWarning, TrendingDown } from "lucide-react";

const pains = [
  {
    icon: Clock,
    title: "Books close 45 days late",
    body: "Your CA reconciles at quarter-end. By then the money decision was already made — badly.",
  },
  {
    icon: TrendingDown,
    title: "Cash surprises every month",
    body: "Payroll, GST, TDS and vendor dues collide. Nobody models the next 90 days until it hurts.",
  },
  {
    icon: FileWarning,
    title: "Receivables quietly rot",
    body: "Invoices slip past 60 days because no one owns follow-up. That's your working capital, frozen.",
  },
  {
    icon: AlertTriangle,
    title: "No one runs the numbers",
    body: "Hiring, pricing, capex — decided on gut feel because a full-time CFO costs ₹40L+ a year.",
  },
];

const PainSection = () => (
  <section id="problem" className="py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The reality</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Growing businesses don't fail on revenue. They fail on finance visibility.
        </h2>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {pains.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-danger-soft">
              <p.icon className="h-5 w-5 text-danger" />
            </div>
            <h3 className="font-display text-base font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PainSection;
