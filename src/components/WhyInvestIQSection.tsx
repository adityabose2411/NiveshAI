import { Bot, Users, TrendingUp, Clock, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const WhyNiveshAISection = () => {
  const benefits = [
    { icon: Bot, title: "True Automation", description: "Not just advice—NiveshAI executes. From SIP mandates to premium payments, everything runs on autopilot." },
    { icon: Users, title: "Financial Inclusion", description: "No minimum wealth requirements. Start with ₹500/month and access the same strategies as HNIs." },
    { icon: Clock, title: "Zero Effort Required", description: "Spend 10 minutes onboarding, then let our AI handle your wealth creation 24/7, 365 days." },
    { icon: TrendingUp, title: "Compounding at Scale", description: "Small, consistent investments grow exponentially. ₹5,000/month becomes ₹1.5 Cr in 25 years at 12% CAGR." },
    { icon: Shield, title: "Bank-Grade Security", description: "RBI-licensed Account Aggregator framework. Your data never leaves secure, encrypted channels." },
    { icon: Sparkles, title: "Continuous Optimization", description: "As your income grows, NiveshAI automatically increases investments and rebalances your portfolio." },
  ];

  return (
    <section id="why-niveshai" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-50/50 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Why NiveshAI
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built for India's <span className="gradient-text">Middle Class</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We understand the challenges of busy professionals and growing families. 
            NiveshAI is designed to make wealth creation effortless and accessible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-teal-200 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-display font-bold text-2xl text-center text-foreground mb-8">
            Traditional vs NiveshAI
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-4">Traditional Investing</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {["Research for hours to pick funds", "Pay ₹50K+ for financial advisors", "Manually set up each SIP mandate", "Remember to rebalance quarterly", "Track expenses in spreadsheets"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-destructive">✗</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100">
              <h4 className="font-semibold text-foreground mb-4">With NiveshAI</h4>
              <ul className="space-y-3 text-sm text-foreground">
                {["AI picks optimal funds in seconds", "Expert advice at ₹0 cost", "One-click mandate setup", "Automatic rebalancing", "Real-time expense tracking via UPI"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-wealth-600">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyNiveshAISection;
