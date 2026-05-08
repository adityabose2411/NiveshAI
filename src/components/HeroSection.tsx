import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, TrendingUp, Bot, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-wealth-300/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="text-center lg:text-left space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-primary/20 rounded-full px-4 py-1.5 text-xs font-medium text-foreground shadow-soft"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              India's Autonomous AI Wealth Engine
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight"
            >
              Your money{" "}
              <span className="gradient-text">grows itself.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              HundiAI uses autonomous AI agents to analyze, allocate, and optimize your wealth automatically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            >
              <Link to="/analyze">
                <Button variant="wealth" size="xl" className="w-full sm:w-auto group rounded-2xl">
                  Start Autopilot
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/connect-bank">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto rounded-2xl">
                  Connect Bank
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start pt-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Bank-Grade Security</div>
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> SEBI Compliant</div>
              <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> Agentic AI</div>
            </motion.div>
          </div>

          {/* Right - AI Dashboard Visual */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="glass-card rounded-3xl p-6 shadow-elevated">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-trust flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-sm">HundiAI Autopilot</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live
                  </span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Portfolio Value</p>
                  <p className="text-4xl font-display font-bold tracking-tight">₹4,82,650</p>
                  <p className="text-sm text-wealth-600 font-medium mt-1">+18.4% YTD · AI-optimized</p>
                </div>

                {/* Mini chart */}
                <div className="mt-5 flex items-end gap-1.5 h-20">
                  {[35, 48, 42, 60, 55, 72, 68, 85, 78, 92, 88, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md gradient-wealth opacity-90" style={{ height: `${h}%` }} />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border/60">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">SIPs</p>
                    <p className="text-sm font-semibold mt-0.5">₹15K/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bonds</p>
                    <p className="text-sm font-semibold mt-0.5">₹2.1L</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cover</p>
                    <p className="text-sm font-semibold mt-0.5">₹50L</p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                className="absolute -top-6 -right-6 glass-card rounded-2xl p-3 animate-float"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Agent action</p>
                    <p className="text-xs font-semibold">Rebalanced ✓</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-5 -left-5 glass-card rounded-2xl p-3 animate-float"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-wealth-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-wealth-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">AI Score</p>
                    <p className="text-xs font-semibold">92 / 100</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
