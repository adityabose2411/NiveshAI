import { Search, BarChart3, PieChart, Cog } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Track",
      subtitle: "Connect Your Accounts",
      description: "Securely link your bank accounts via Account Aggregator. We analyze 6-12 months of transaction data to understand your complete financial picture.",
      color: "trust",
    },
    {
      number: "02",
      icon: BarChart3,
      title: "Analyze",
      subtitle: "AI-Powered Insights",
      description: "Our Agentic AI identifies income patterns, recurring expenses, discretionary spending, and calculates your investable surplus with precision.",
      color: "teal",
    },
    {
      number: "03",
      icon: PieChart,
      title: "Allocate",
      subtitle: "Personalized Portfolio",
      description: "Based on your risk profile, goals, and health data, we recommend the optimal mix of SIPs, bonds, and insurance products.",
      color: "wealth",
    },
    {
      number: "04",
      icon: Cog,
      title: "Automate",
      subtitle: "Set & Forget",
      description: "Approve once, and InvestIQ handles the rest—executing SIP mandates, rebalancing portfolios, and adjusting as your income grows.",
      color: "trust",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      trust: { bg: "bg-trust-100", icon: "text-trust-600", border: "border-trust-200", number: "text-trust-600" },
      teal: { bg: "bg-teal-100", icon: "text-teal-600", border: "border-teal-200", number: "text-teal-600" },
      wealth: { bg: "bg-wealth-100", icon: "text-wealth-600", border: "border-wealth-200", number: "text-wealth-600" },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section id="how-it-works" className="py-20 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Four Steps to <span className="gradient-text">Financial Freedom</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From idle savings to intelligent wealth in minutes, not months.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const colorClasses = getColorClasses(step.color);
            return (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                
                {/* Card */}
                <div className={`fintech-card p-6 relative z-10 border-t-4 ${colorClasses.border}`}>
                  {/* Step Number */}
                  <span className={`font-display text-4xl font-bold ${colorClasses.number} opacity-20`}>
                    {step.number}
                  </span>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${colorClasses.bg} flex items-center justify-center mt-2 mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-7 h-7 ${colorClasses.icon}`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
