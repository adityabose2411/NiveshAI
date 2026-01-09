import { AlertTriangle, TrendingDown, Clock, Brain } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingDown,
      title: "Idle Savings",
      description: "Over ₹20 lakh crore sits in savings accounts earning just 3-4% annually, losing value to inflation.",
    },
    {
      icon: Clock,
      title: "Lack of Time",
      description: "Middle-income families juggle work and life, leaving no time to research or manage investments.",
    },
    {
      icon: AlertTriangle,
      title: "Fear & Confusion",
      description: "Complex financial jargon and fear of losses keep 85% of Indians away from equity markets.",
    },
    {
      icon: Brain,
      title: "No Expert Access",
      description: "Quality financial advice costs ₹50,000+ annually, beyond reach of most households.",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-trust-100/50 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            The Problem
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            India Adopted UPI, But Wealth Creation Remains{" "}
            <span className="gradient-text">Elusive</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Despite 10B+ monthly UPI transactions, the average Indian household still struggles
            to convert digital convenience into lasting financial security.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="fintech-card p-6 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-trust-50 rounded-3xl border border-trust-100">
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-bold text-trust-700">85%</p>
            <p className="text-muted-foreground text-sm mt-1">Indians avoid equity</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-bold text-trust-700">₹20L Cr</p>
            <p className="text-muted-foreground text-sm mt-1">Idle in savings</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-bold text-trust-700">3.5%</p>
            <p className="text-muted-foreground text-sm mt-1">Avg savings rate</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-bold text-trust-700">7%</p>
            <p className="text-muted-foreground text-sm mt-1">Avg inflation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
