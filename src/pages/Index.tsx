import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AiCfoSection from "@/components/AiCfoSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AgentsSection from "@/components/AgentsSection";
import InvestmentSection from "@/components/InvestmentSection";
import WhyHundiSection from "@/components/WhyHundiSection";
import WhyHundiAISection from "@/components/WhyHundiAISection";
import CompetitiveSection from "@/components/CompetitiveSection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AiCfoSection />
      <ProblemSection />
      <WhyHundiSection />
      <SolutionSection />
      <HowItWorksSection />
      <AgentsSection />
      <CompetitiveSection />
      <InvestmentSection />
      <WhyHundiAISection />
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
