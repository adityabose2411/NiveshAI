import { Search, BarChart3, PieChart, Cog } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    { number: "01", icon: Search, title: "Connect Bank", subtitle: "Secure Account Link", description: "Securely link your bank via the RBI-licensed Account Aggregator framework — no passwords, fully encrypted.", color: "trust" },
    { number: "02", icon: BarChart3, title: "AI Detects Surplus", subtitle: "Autonomous Analysis", description: "Autonomous AI agents scan income patterns and expense flows to instantly detect your investable surplus.", color: "teal" },
    { number: "03", icon: PieChart, title: "Auto Allocation", subtitle: "AI-Driven Allocation", description: "AI executes optimal allocation across SIPs, bonds, and insurance — calibrated to your risk profile and goals.", color: "wealth" },
    { number: "04", icon: Cog, title: "Continuous Optimization", subtitle: "Autopilot Mode", description: "Agents continuously rebalance, optimize, and automate your wealth — 24/7, with zero effort from you.", color: "trust" },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; border: string; number: string }> = {
      trust: { bg: "bg-trust-100", icon: "text-trust-600", border: "border-trust-200", number: "text-trust-600" },
      teal: { bg: "bg-teal-100", icon: "text-teal-600", border: "border-teal-200", number: "text-teal-600" },
      wealth: { bg: "bg-wealth-100", icon: "text-wealth-600", border: "border-wealth-200", number: "text-wealth-600" },
    };
    return colors[color];
  };

  return (
    <section id="how-it-works" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            From Idle Savings to <span className="gradient-text">Autonomous Wealth</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four autonomous steps. Zero effort. Your money on autopilot.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const colorClasses = getColorClasses(step.color);
            return (
              <motion.div 
                key={index} 
                className="relative group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                
                <div className={`fintech-card p-6 relative z-10 border-t-4 ${colorClasses.border}`}>
                  <span className={`font-display text-4xl font-bold ${colorClasses.number} opacity-20`}>
                    {step.number}
                  </span>
                  <div className={`w-14 h-14 rounded-2xl ${colorClasses.bg} flex items-center justify-center mt-2 mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-7 h-7 ${colorClasses.icon}`} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{step.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
