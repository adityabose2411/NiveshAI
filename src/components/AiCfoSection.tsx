import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Bot, FileText, ScrollText, Sigma, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FORMULAS } from "@/lib/formulas";
import { REPORTS } from "@/lib/reports";

const modules = [
  { icon: Wallet, title: "Cash flow & runway", detail: "Driver-based six-month forecast, runway sensitivity and a weekly payment calendar." },
  { icon: BarChart3, title: "Planning & valuation", detail: "Scenario modelling plus a full DCF with WACC, CAPM, NPV, IRR and payback." },
  { icon: FileText, title: "PDF reporting", detail: `${REPORTS.length} board-ready reports and a combined board pack, generated in your browser.` },
  { icon: Sigma, title: "Formula library", detail: `${FORMULAS.length} models — DCF, transfer pricing, Pareto, zero-based budgeting, GST and more.` },
  { icon: Bot, title: "Nine AI agents", detail: "Accounting, reconciliation, cash flow, FP&A, expenses, AR, AP, reporting and the CFO orchestrator." },
  { icon: ScrollText, title: "Audit trail", detail: "Every recommendation records the data used, the maths applied and your decision." },
];

const AiCfoSection = () => (
  <section id="ai-cfo" className="py-20 md:py-28 bg-muted/30 border-y border-border">
    <div className="container mx-auto px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          The AI CFO workspace
        </span>
        <h2 className="font-display text-3xl md:text-[42px] font-bold tracking-tight mt-4 leading-[1.1]">
          Every technical model a CFO uses — running on your own ledger
        </h2>
        <p className="text-muted-foreground mt-4 text-[15px] md:text-base">
          HundiAI reads your accounts, reconciles the books, then answers with the same maths a ₹50L-a-year finance team would use: discounted cash
          flow, cost of capital, working-capital cycles, transfer pricing and costed cost-cutting plans. Each answer shows its formula and downloads as
          a PDF.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-10">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-xl border border-border bg-background p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <mod.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-base mt-4">{mod.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5">{mod.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Link to="/app">
          <Button size="lg" className="rounded-xl w-full sm:w-auto">
            Open the AI CFO workspace <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link to="/app/reports">
          <Button size="lg" variant="outline" className="rounded-xl w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-1.5" /> See the PDF reports
          </Button>
        </Link>
        <Link to="/app/formulas">
          <Button size="lg" variant="ghost" className="rounded-xl w-full sm:w-auto">
            <Sigma className="w-4 h-4 mr-1.5" /> Browse the formula library
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default AiCfoSection;
