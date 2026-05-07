import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  Smartphone,
  RefreshCw
} from "lucide-react";

const banks = [
  { id: "hdfc", name: "HDFC Bank", logo: "https://logo.clearbit.com/hdfcbank.com" },
  { id: "icici", name: "ICICI Bank", logo: "https://logo.clearbit.com/icicibank.com" },
  { id: "sbi", name: "State Bank of India", logo: "https://logo.clearbit.com/sbi.co.in" },
  { id: "axis", name: "Axis Bank", logo: "https://logo.clearbit.com/axisbank.com" },
  { id: "kotak", name: "Kotak Mahindra", logo: "https://logo.clearbit.com/kotak.com" },
  { id: "yes", name: "Yes Bank", logo: "https://logo.clearbit.com/yesbank.in" },
  { id: "pnb", name: "Punjab National Bank", logo: "https://logo.clearbit.com/pnbindia.in" },
  { id: "bob", name: "Bank of Baroda", logo: "https://logo.clearbit.com/bankofbaroda.in" },
];

const ConnectBank = () => {
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "connecting" | "success">("select");
  const [progress, setProgress] = useState(0);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handleConnect = () => {
    if (!selectedBank) return;
    
    setStep("connecting");
    
    // Simulate connection progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep("success");
        }, 500);
      }
    }, 300);
  };

  const handleProceed = () => {
    navigate("/analyze");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-2 text-sm text-teal-700 mb-4">
              <Shield className="w-4 h-4" />
              <span>RBI-Licensed Account Aggregator Framework</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Connect Your Bank Account
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Securely link your bank to enable HundiAI's AI to analyze your transactions 
              and create a personalized wealth plan.
            </p>
          </div>

          {/* Content based on step */}
          {step === "select" && (
            <>
              {/* Bank Selection Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank.id)}
                    className={`fintech-card p-4 flex flex-col items-center gap-3 transition-all ${
                      selectedBank === bank.id 
                        ? "ring-2 ring-teal-500 border-teal-500" 
                        : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src={bank.logo} 
                        alt={bank.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Building2 className="w-6 h-6 text-muted-foreground hidden" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center line-clamp-2">
                      {bank.name}
                    </span>
                    {selectedBank === bank.id && (
                      <CheckCircle2 className="w-5 h-5 text-teal-500 absolute top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Connect Button */}
              <Button 
                onClick={handleConnect}
                disabled={!selectedBank}
                variant="trust" 
                size="xl" 
                className="w-full group"
              >
                Connect Securely
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Security Info */}
              <div className="mt-8 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Bank-Grade Security</h4>
                    <p className="text-muted-foreground text-sm">
                      Your credentials are never stored. We use RBI-licensed Account Aggregator 
                      framework with 256-bit encryption. Read-only access to transaction data only.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === "connecting" && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Connecting to {banks.find(b => b.id === selectedBank)?.name}
              </h2>
              <p className="text-muted-foreground mb-8">
                Please wait while we establish a secure connection...
              </p>
              
              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-wealth transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{progress}% Complete</p>
              </div>

              {/* Steps */}
              <div className="mt-8 space-y-3 text-left max-w-sm mx-auto">
                <div className={`flex items-center gap-3 ${progress >= 30 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${progress >= 30 ? 'text-wealth-500' : ''}`} />
                  <span className="text-sm">Authenticating with bank</span>
                </div>
                <div className={`flex items-center gap-3 ${progress >= 60 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${progress >= 60 ? 'text-wealth-500' : ''}`} />
                  <span className="text-sm">Fetching transaction history</span>
                </div>
                <div className={`flex items-center gap-3 ${progress >= 100 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${progress >= 100 ? 'text-wealth-500' : ''}`} />
                  <span className="text-sm">Encrypting and securing data</span>
                </div>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-wealth-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-wealth-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Bank Connected Successfully!
              </h2>
              <p className="text-muted-foreground mb-8">
                We've analyzed 6 months of transaction data. Now let's understand 
                your financial goals.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="fintech-card p-4">
                  <p className="text-2xl font-display font-bold text-foreground">₹42,500</p>
                  <p className="text-sm text-muted-foreground">Avg Monthly Income</p>
                </div>
                <div className="fintech-card p-4">
                  <p className="text-2xl font-display font-bold text-foreground">₹31,200</p>
                  <p className="text-sm text-muted-foreground">Avg Monthly Spend</p>
                </div>
                <div className="fintech-card p-4">
                  <p className="text-2xl font-display font-bold text-wealth-600">₹11,300</p>
                  <p className="text-sm text-muted-foreground">Investable Surplus</p>
                </div>
              </div>

              <Button onClick={handleProceed} variant="trust" size="xl" className="group">
                Continue to Financial Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* Mobile App Hint */}
          {step === "select" && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="w-4 h-4" />
              <span>You may receive an OTP on your registered mobile number</span>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConnectBank;
