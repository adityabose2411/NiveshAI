import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-wealth-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-trust-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-primary-foreground/90"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Powered by Agentic AI + UPI Insights</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight"
            >
              Turn Idle Savings into{" "}
              <span className="text-teal-300">Intelligent Wealth</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              HundiAI's autonomous AI analyzes your UPI transactions, identifies surplus income, 
              and automatically allocates funds into SIPs, bonds, and insurance—tailored to your 
              financial health.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/analyze">
                <Button variant="wealth" size="xl" className="w-full sm:w-auto group">
                  Analyze My Financial Health
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4"
            >
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Shield className="w-4 h-4 text-teal-300" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <TrendingUp className="w-4 h-4 text-wealth-300" />
                <span>SEBI Compliant</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Stats/Visual */}
          <motion.div 
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-teal-500/30 to-wealth-500/30 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-float">
                  <div className="text-center">
                    <p className="text-6xl font-display font-bold text-primary-foreground">₹0</p>
                    <p className="text-primary-foreground/60 text-sm mt-2">to Wealth Journey</p>
                  </div>
                </div>
              </div>

              <motion.div 
                className="absolute top-0 right-0 glass-card rounded-2xl p-4 animate-float" 
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-wealth-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-wealth-300" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/60 text-xs">Monthly SIP</p>
                    <p className="text-primary-foreground font-semibold">₹5,000</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-12 left-0 glass-card rounded-2xl p-4 animate-float" 
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/60 text-xs">Insurance Cover</p>
                    <p className="text-primary-foreground font-semibold">₹50L</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-0 right-12 glass-card rounded-2xl p-4 animate-float" 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-trust-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-trust-300" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/60 text-xs">AI Score</p>
                    <p className="text-primary-foreground font-semibold">85/100</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
