import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const proofPoints = [
  "Books reconciled daily, not quarterly",
  "90-day cash runway you can trust",
  "Board-ready PDF reports in one click",
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs font-medium shadow-soft backdrop-blur-md"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Built for Indian businesses doing ₹25L – ₹10Cr revenue
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl"
            >
              The AI CFO your business
              <br />
              <span className="gradient-text">can actually afford.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              HundiAI connects your banks, UPI and gateways, cleans up the books, forecasts cash, and
              tells you exactly what to do next — with the same formulas a ₹40L/year CFO would use.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              {proofPoints.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-soft">
                    <Check className="h-3 w-3 text-success" />
                  </span>
                  {p}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col gap-3 pt-2 sm:flex-row"
            >
              <Link to="/app">
                <Button size="xl" variant="wealth" className="group w-full rounded-2xl sm:w-auto">
                  Open the live demo
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="xl" variant="heroOutline" className="w-full rounded-2xl sm:w-auto">
                  <PlayCircle className="h-5 w-5" />
                  See how it works
                </Button>
              </a>
            </motion.div>

            <p className="text-xs text-muted-foreground">
              No credit card. Full demo workspace with real formulas and sample company data.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-elevated">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Daily brief</p>
                  <p className="font-display text-lg font-semibold">Acme Digital Labs</p>
                </div>
                <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                  Health 78/100
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Cash", v: "₹62.4L" },
                  { l: "Runway", v: "8.6 mo" },
                  { l: "Overdue AR", v: "₹18.2L" },
                ].map((k) => (
                  <div key={k.l} className="rounded-2xl bg-surface p-3">
                    <p className="text-[11px] text-muted-foreground">{k.l}</p>
                    <p className="font-display text-base font-semibold">{k.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  { t: "3 duplicate SaaS charges found", s: "Save ₹1.14L/yr", tone: "warning" },
                  { t: "Zenith Retail invoice 41 days overdue", s: "Send escalation", tone: "danger" },
                  { t: "GST liability due 20th", s: "₹3.8L reserved", tone: "info" },
                ].map((row) => (
                  <div
                    key={row.t}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.t}</p>
                      <p className="text-xs text-muted-foreground">{row.s}</p>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        row.tone === "danger"
                          ? "bg-danger"
                          : row.tone === "warning"
                            ? "bg-warning"
                            : "bg-info"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-soft md:block">
              <p className="text-xs text-muted-foreground">Annual savings identified</p>
              <p className="font-display text-xl font-bold text-success">₹2.35L</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
