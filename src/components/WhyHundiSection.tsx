import { motion } from "framer-motion";
import { Scroll, Sparkles } from "lucide-react";

const WhyHundiSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-wealth-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-wealth-50 border border-wealth-100 rounded-full px-4 py-2 text-sm text-wealth-700 mb-6">
            <Scroll className="w-4 h-4" />
            <span>Heritage meets Intelligence</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why <span className="gradient-text">HundiAI</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            Historically, a <span className="font-semibold text-foreground">Hundi</span> represented
            trust, trade, and financial movement across India — a centuries-old instrument that powered
            commerce long before modern banking. HundiAI reimagines that system for the AI era,
            transforming idle savings into autonomous wealth creation.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { era: "Then", title: "Trust & Trade", desc: "Hundis enabled wealth movement across India on the foundation of trust." },
              { era: "Now", title: "UPI & Payments", desc: "UPI digitized payments. But savings still sit idle, earning inflation-eaten returns." },
              { era: "Next", title: "Autonomous Wealth", desc: "HundiAI autonomously grows your wealth — the next layer of India's financial stack." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="fintech-card p-6 text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-teal-600">{item.era}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyHundiSection;