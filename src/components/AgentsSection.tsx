import { motion } from "framer-motion";
import { Shield, PieChart, RefreshCw, Target } from "lucide-react";

const AgentsSection = () => {
  const agents = [
    {
      icon: Shield,
      name: "Risk Agent",
      role: "Profiles & protects",
      desc: "Continuously profiles your risk tolerance and protects your portfolio from volatility.",
      color: "trust",
    },
    {
      icon: PieChart,
      name: "Allocation Agent",
      role: "Optimizes capital",
      desc: "Executes AI-driven allocation across SIPs, bonds, and insurance — calibrated to your goals.",
      color: "teal",
    },
    {
      icon: RefreshCw,
      name: "Rebalancing Agent",
      role: "Automates discipline",
      desc: "Automatically rebalances your portfolio as markets move and your income grows.",
      color: "wealth",
    },
    {
      icon: Target,
      name: "Goal Agent",
      role: "Tracks outcomes",
      desc: "Optimizes your trajectory toward retirement, home, education, and emergency goals.",
      color: "trust",
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; ring: string }> = {
    trust: { bg: "bg-trust-100", icon: "text-trust-600", ring: "ring-trust-200" },
    teal: { bg: "bg-teal-100", icon: "text-teal-600", ring: "ring-teal-200" },
    wealth: { bg: "bg-wealth-100", icon: "text-wealth-600", ring: "ring-wealth-200" },
  };

  return (
    <section id="agents" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Autonomous Intelligence
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Meet Your <span className="gradient-text">AI Wealth Agents</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four specialized AI agents working in concert — autonomously analyzing, allocating,
            and optimizing your wealth around the clock.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, i) => {
            const c = colorMap[agent.color];
            return (
              <motion.div
                key={i}
                className="fintech-card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.ring} ring-4 ring-offset-2 ring-offset-background flex items-center justify-center mb-4`}>
                  <agent.icon className={`w-7 h-7 ${c.icon}`} />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground">{agent.name}</h3>
                <p className={`text-xs font-medium ${c.icon} uppercase tracking-wider mb-3`}>{agent.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{agent.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;