import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Banknote,
  CalendarClock,
  FileText,
  LineChart,
  MessageSquare,
  Receipt,
  Scissors,
} from "lucide-react";

const modules = [
  {
    icon: MessageSquare,
    title: "AI CFO chat",
    body: "“Can I afford two senior hires?” — answered with your real numbers, assumptions shown.",
    to: "/app/cfo",
  },
  {
    icon: LineChart,
    title: "Cash flow & runway",
    body: "Six-month projections, liquidity levers, and how each cost cut moves your runway.",
    to: "/app/cashflow",
  },
  {
    icon: Receipt,
    title: "Reconciliation",
    body: "Auto-matched bank lines. An exception queue instead of a spreadsheet marathon.",
    to: "/app/reconciliation",
  },
  {
    icon: Banknote,
    title: "Receivables",
    body: "Ageing mix, a collection queue ranked by recovery odds, customer concentration risk.",
    to: "/app/receivables",
  },
  {
    icon: CalendarClock,
    title: "Payables & statutory",
    body: "GST, TDS and vendor calendar sequenced so you never pay a penalty for timing.",
    to: "/app/payables",
  },
  {
    icon: Scissors,
    title: "Cost optimization",
    body: "Duplicate subscriptions, creeping vendors, zero-based budget rebuild with savings math.",
    to: "/app/budgets",
  },
  {
    icon: FileText,
    title: "Reports & board pack",
    body: "P&L, valuation, ageing and an 8-page board pack as branded PDFs in one click.",
    to: "/app/reports",
  },
  {
    icon: ArrowUpRight,
    title: "Planning & valuation",
    body: "Model hires, growth and capex. Live DCF, WACC, NPV and IRR on your own data.",
    to: "/app/planning",
  },
];

const ProductSection = () => (
  <section id="product" className="py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The product</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Everything a finance team does — running by itself
        </h2>
        <p className="mt-4 text-muted-foreground">
          Every module below is live in the demo workspace. Click any card to open it.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
          >
            <Link
              to={m.to}
              className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <m.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold">{m.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Open module
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductSection;
