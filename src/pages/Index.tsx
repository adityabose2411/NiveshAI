import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import InvestmentSection from "@/components/InvestmentSection";
import WhyHundiAISection from "@/components/WhyHundiAISection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <InvestmentSection />
      <WhyHundiAISection />
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
