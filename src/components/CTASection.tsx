import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl gradient-trust p-8 md:p-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-wealth-500/20 rounded-full blur-3xl" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-primary-foreground/90 mb-6">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Start your wealth journey today</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Savings?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of Indians who are already using InvestIQ to convert idle 
              savings into intelligent, automated wealth creation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze">
                <Button variant="wealth" size="xl" className="w-full sm:w-auto group">
                  Analyze My Financial Health
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/connect-bank">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  Connect My Bank
                </Button>
              </Link>
            </div>

            <p className="text-sm text-primary-foreground/60 mt-6">
              🔒 Bank-grade security • No credit card required • Takes only 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
