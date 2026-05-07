import { Search, BarChart3, PieChart, Cog } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    { number: "01", icon: Search, title: "Track", subtitle: "Connect Your Accounts", description: "Securely link your bank accounts via Account Aggregator. We analyze 6-12 months of transaction data to understand your complete financial picture.", color: "trust" },
    { number: "02", icon: BarChart3, title: "Analyze", subtitle: "AI-Powered Insights", description: "Our Agentic AI identifies income patterns, recurring expenses, discretionary spending, and calculates your investable surplus with precision.", color: "teal" },
    { number: "03", icon: PieChart, title: "Allocate", subtitle: "Personalized Portfolio", description: "Based on your risk profile, goals, and health data, we recommend the optimal mix of SIPs, bonds, and insurance products.", color: "wealth" },
    { number: "04", icon: Cog, title: "Automate", subtitle: "Set & Forget", description: "Approve once, and HundiAI handles the rest—executing SIP mandates, rebalancing portfolios, and adjusting as your income grows.", color: "trust" },
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
            Four Steps to <span className="gradient-text">Financial Freedom</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From idle savings to intelligent wealth in minutes, not months.
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
