import { Bot, Sparkles, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

const SolutionSection = () => {
  const features = [
    {
      icon: Bot,
      title: "Agentic AI Analysis",
      description: "Our AI autonomously analyzes your income patterns, spending habits, and identifies optimal surplus for investing.",
    },
    {
      icon: Sparkles,
      title: "UPI-Powered Insights",
      description: "Direct bank statement analysis via Account Aggregator framework gives us real-time visibility into your financial health.",
    },
    {
      icon: Shield,
      title: "Risk-Profiled Allocation",
      description: "Personalized investment mix based on your age, goals, liabilities, and risk tolerance—no cookie-cutter portfolios.",
    },
    {
      icon: Zap,
      title: "Automated Execution",
      description: "Once approved, NiveshAI automatically executes SIP mandates, bond purchases, and insurance premiums.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div 
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-3xl gradient-trust shadow-elevated flex items-center justify-center">
                  <Bot className="w-20 h-20 text-primary-foreground" />
                </div>
              </div>

              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-teal-500 shadow-lg flex items-center justify-center animate-float">
                <span className="text-primary-foreground font-bold text-xs">UPI</span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-wealth-500 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "0.5s" }}>
                <span className="text-accent-foreground font-bold text-xs">SIP</span>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-trust-600 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                <span className="text-primary-foreground font-bold text-xs">BONDS</span>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-trust-500 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "1.5s" }}>
                <span className="text-primary-foreground font-bold text-xs">INSURE</span>
              </div>

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <line x1="200" y1="80" x2="200" y2="120" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" opacity="0.3" />
                <line x1="200" y1="280" x2="200" y2="320" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" opacity="0.3" />
                <line x1="80" y1="200" x2="120" y2="200" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" opacity="0.3" />
                <line x1="280" y1="200" x2="320" y2="200" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" opacity="0.3" />
              </svg>
            </div>
          </motion.div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
                The Solution
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Meet Your AI <span className="gradient-text">Wealth Engineer</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                NiveshAI combines the power of Agentic AI with India's UPI infrastructure to transform
                passive savers into active wealth creators—automatically and intelligently.
              </p>
            </motion.div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex gap-4 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
