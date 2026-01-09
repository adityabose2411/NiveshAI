import { TrendingUp, Shield, Landmark, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const InvestmentSection = () => {
  const sips = [
    { name: "Nifty 50 Index Fund", provider: "UTI AMC", returns: "12.4%", risk: "Moderate", minAmount: "₹500" },
    { name: "Flexi Cap Fund", provider: "Parag Parikh", returns: "18.2%", risk: "High", minAmount: "₹1,000" },
    { name: "Balanced Advantage Fund", provider: "ICICI Pru", returns: "10.8%", risk: "Low", minAmount: "₹500" },
    { name: "Small Cap Fund", provider: "Nippon India", returns: "22.5%", risk: "Very High", minAmount: "₹1,000" },
  ];

  const bonds = [
    { name: "RBI Floating Rate Bond", issuer: "Govt. of India", yield: "8.05%", tenure: "7 Years", minInvest: "₹1,000" },
    { name: "NHAI Tax Free Bond", issuer: "NHAI", yield: "5.50%", tenure: "10 Years", minInvest: "₹10,000" },
    { name: "Corporate Bond Fund", issuer: "HDFC AMC", yield: "7.80%", tenure: "3-5 Years", minInvest: "₹5,000" },
    { name: "SGBs (Sovereign Gold)", issuer: "RBI", yield: "2.50% + Gold", tenure: "8 Years", minInvest: "₹4,500" },
  ];

  const insurance = [
    { name: "Term Life Insurance", provider: "LIC", cover: "₹1 Cr", premium: "₹700/mo", feature: "Pure protection" },
    { name: "Health Insurance", provider: "Star Health", cover: "₹10 L", premium: "₹1,200/mo", feature: "Family floater" },
    { name: "Critical Illness", provider: "HDFC Life", cover: "₹25 L", premium: "₹450/mo", feature: "36 illnesses covered" },
  ];

  return (
    <section id="investments" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Investment Coverage
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Curated Products for <span className="gradient-text">Every Goal</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Based on your financial health score, we recommend from our carefully vetted 
            universe of SIPs, bonds, and insurance products.
          </p>
        </div>

        {/* SIPs Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-wealth-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-wealth-600" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">SIP Investments</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sips.map((sip, index) => (
              <div key={index} className="fintech-card p-5 group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{sip.provider}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-wealth-600 transition-colors" />
                </div>
                <h4 className="font-semibold text-foreground mb-4 line-clamp-2">{sip.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">3Y Returns</span>
                    <span className="font-semibold text-wealth-600">{sip.returns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk</span>
                    <span className="font-medium text-foreground">{sip.risk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min SIP</span>
                    <span className="font-medium text-foreground">{sip.minAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bonds Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-trust-100 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-trust-600" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">Bond Portfolio</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bonds.map((bond, index) => (
              <div key={index} className="fintech-card p-5 group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{bond.issuer}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-trust-600 transition-colors" />
                </div>
                <h4 className="font-semibold text-foreground mb-4 line-clamp-2">{bond.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yield</span>
                    <span className="font-semibold text-trust-600">{bond.yield}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenure</span>
                    <span className="font-medium text-foreground">{bond.tenure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Invest</span>
                    <span className="font-medium text-foreground">{bond.minInvest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">Insurance Protection</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {insurance.map((ins, index) => (
              <div key={index} className="fintech-card p-5 group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{ins.provider}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-teal-600 transition-colors" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{ins.name}</h4>
                <p className="text-xs text-muted-foreground mb-4">{ins.feature}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cover</span>
                    <span className="font-semibold text-teal-600">{ins.cover}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Premium</span>
                    <span className="font-medium text-foreground">{ins.premium}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/analyze">
            <Button variant="trust" size="lg">
              Get Personalized Recommendations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
