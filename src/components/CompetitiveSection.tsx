import { motion } from "framer-motion";
import { Building2, LineChart, BarChart3, Sparkles } from "lucide-react";

const CompetitiveSection = () => {
  const rows = [
    { icon: Building2, name: "Banks", role: "Store your money", highlight: false },
    { icon: LineChart, name: "Zerodha", role: "Helps you trade", highlight: false },
    { icon: BarChart3, name: "INDmoney", role: "Helps you track wealth", highlight: false },
    { icon: Sparkles, name: "HundiAI", role: "Autonomously grows your wealth", highlight: true },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Competitive Positioning
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            A New Layer in India's <span className="gradient-text">Financial Stack</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Others store, trade, or track. HundiAI is the first to autonomously grow.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                row.highlight
                  ? "gradient-trust border-transparent shadow-elevated"
                  : "bg-card border-border"
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  row.highlight ? "bg-white/15" : "bg-muted"
                }`}
              >
                <row.icon
                  className={`w-6 h-6 ${row.highlight ? "text-primary-foreground" : "text-muted-foreground"}`}
                />
              </div>
              <div className="flex-1">
                <p
                  className={`font-display font-bold text-lg ${
                    row.highlight ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {row.name}
                </p>
                <p
                  className={`text-sm ${
                    row.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {row.role}
                </p>
              </div>
              {row.highlight && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold bg-white/15 text-primary-foreground rounded-full px-3 py-1">
                  Autonomous
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitiveSection;