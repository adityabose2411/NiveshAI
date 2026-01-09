import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft,
  User,
  Target,
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
  CheckCircle2,
  PieChart,
  Landmark,
  AlertTriangle
} from "lucide-react";

type Step = "personal" | "goals" | "health" | "risk" | "results";

const Analyze = () => {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    monthlyIncome: "",
    monthlyExpenses: "",
    existingInvestments: "",
    dependents: "",
    // Goals
    goals: [] as string[],
    retirementAge: "",
    emergencyMonths: "",
    // Health
    hasChronicConditions: "",
    conditions: [] as string[],
    smoker: "",
    exerciseFrequency: "",
    familyHistory: [] as string[],
    // Risk
    riskTolerance: "",
    investmentHorizon: "",
    marketDropReaction: "",
  });

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: "personal", label: "Personal", icon: User },
    { id: "goals", label: "Goals", icon: Target },
    { id: "health", label: "Health", icon: Heart },
    { id: "risk", label: "Risk", icon: TrendingUp },
    { id: "results", label: "Results", icon: Sparkles },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progressValue = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: Step[] = ["personal", "goals", "health", "risk", "results"];
    const nextIndex = stepOrder.indexOf(currentStep) + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["personal", "goals", "health", "risk", "results"];
    const prevIndex = stepOrder.indexOf(currentStep) - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(v => v !== value)
    }));
  };

  // Dummy recommendations based on form data
  const recommendations = {
    sips: [
      { name: "Nifty 50 Index Fund", amount: "₹3,000/mo", rationale: "Core portfolio, low-cost diversification" },
      { name: "Flexi Cap Fund", amount: "₹2,000/mo", rationale: "Growth-oriented, multi-cap exposure" },
      { name: "ELSS Tax Saver", amount: "₹1,500/mo", rationale: "Tax benefits under 80C" },
    ],
    bonds: [
      { name: "RBI Floating Rate Bond", amount: "₹25,000 (Lumpsum)", rationale: "Government-backed, inflation protection" },
      { name: "Corporate Bond Fund", amount: "₹15,000 (Lumpsum)", rationale: "Higher yield, moderate risk" },
    ],
    insurance: [
      { name: "Term Life Insurance", cover: "₹1 Cr", premium: "₹750/mo", rationale: "Essential protection for dependents" },
      { name: "Health Insurance", cover: "₹15 Lakh", premium: "₹1,400/mo", rationale: "Family floater with critical illness" },
    ],
    healthScore: 72,
    financialScore: 68,
    investableSurplus: "₹11,300",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-2 ${
                    index <= currentStepIndex ? 'text-teal-600' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStepIndex 
                      ? 'bg-teal-500 text-white' 
                      : index === currentStepIndex 
                        ? 'bg-teal-100 text-teal-600' 
                        : 'bg-muted'
                  }`}>
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{step.label}</span>
                </div>
              ))}
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="fintech-card p-6 md:p-8">
            {currentStep === "personal" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="w-12 h-12 mx-auto text-teal-600 mb-4" />
                  <h2 className="font-display text-2xl font-bold text-foreground">Tell Us About Yourself</h2>
                  <p className="text-muted-foreground">Basic information to personalize your wealth plan</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income (₹)</Label>
                    <Input 
                      id="income" 
                      type="number"
                      placeholder="e.g., 50000"
                      value={formData.monthlyIncome}
                      onChange={e => setFormData({...formData, monthlyIncome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Monthly Expenses (₹)</Label>
                    <Input 
                      id="expenses" 
                      type="number"
                      placeholder="e.g., 30000"
                      value={formData.monthlyExpenses}
                      onChange={e => setFormData({...formData, monthlyExpenses: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="existing">Existing Investments (₹)</Label>
                    <Input 
                      id="existing" 
                      type="number"
                      placeholder="e.g., 200000"
                      value={formData.existingInvestments}
                      onChange={e => setFormData({...formData, existingInvestments: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dependents">Number of Dependents</Label>
                    <Input 
                      id="dependents" 
                      type="number"
                      placeholder="0, 1, 2..."
                      value={formData.dependents}
                      onChange={e => setFormData({...formData, dependents: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "goals" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Target className="w-12 h-12 mx-auto text-teal-600 mb-4" />
                  <h2 className="font-display text-2xl font-bold text-foreground">Financial Goals</h2>
                  <p className="text-muted-foreground">What are you saving and investing for?</p>
                </div>

                <div className="space-y-4">
                  <Label>Select Your Goals (Multiple)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Retirement Planning",
                      "Child's Education",
                      "Buying a Home",
                      "Emergency Fund",
                      "Wealth Creation",
                      "Tax Saving",
                      "Child's Marriage",
                      "Travel & Lifestyle"
                    ].map(goal => (
                      <label 
                        key={goal}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.goals.includes(goal) 
                            ? 'border-teal-500 bg-teal-50' 
                            : 'border-border hover:border-teal-200'
                        }`}
                      >
                        <Checkbox 
                          checked={formData.goals.includes(goal)}
                          onCheckedChange={(checked) => handleCheckboxChange('goals', goal, checked as boolean)}
                        />
                        <span className="text-sm font-medium">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="retireAge">Desired Retirement Age</Label>
                    <Input 
                      id="retireAge" 
                      type="number"
                      placeholder="e.g., 55"
                      value={formData.retirementAge}
                      onChange={e => setFormData({...formData, retirementAge: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Fund (Months of expenses)</Label>
                    <Input 
                      id="emergency" 
                      type="number"
                      placeholder="e.g., 6"
                      value={formData.emergencyMonths}
                      onChange={e => setFormData({...formData, emergencyMonths: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "health" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Heart className="w-12 h-12 mx-auto text-teal-600 mb-4" />
                  <h2 className="font-display text-2xl font-bold text-foreground">Health Profile</h2>
                  <p className="text-muted-foreground">To recommend appropriate insurance coverage</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Do you have any chronic conditions?</Label>
                    <RadioGroup 
                      value={formData.hasChronicConditions}
                      onValueChange={v => setFormData({...formData, hasChronicConditions: v})}
                      className="flex gap-4"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="yes" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="no" />
                        <span>No</span>
                      </label>
                    </RadioGroup>
                  </div>

                  {formData.hasChronicConditions === "yes" && (
                    <div className="space-y-3">
                      <Label>Select Conditions (if any)</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "Diabetes",
                          "Hypertension",
                          "Heart Disease",
                          "Asthma/Respiratory",
                          "Thyroid",
                          "Obesity"
                        ].map(condition => (
                          <label 
                            key={condition}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              formData.conditions.includes(condition) 
                                ? 'border-teal-500 bg-teal-50' 
                                : 'border-border hover:border-teal-200'
                            }`}
                          >
                            <Checkbox 
                              checked={formData.conditions.includes(condition)}
                              onCheckedChange={(checked) => handleCheckboxChange('conditions', condition, checked as boolean)}
                            />
                            <span className="text-sm">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label>Do you smoke?</Label>
                    <RadioGroup 
                      value={formData.smoker}
                      onValueChange={v => setFormData({...formData, smoker: v})}
                      className="flex gap-4"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="yes" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="no" />
                        <span>No</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="occasionally" />
                        <span>Occasionally</span>
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Exercise Frequency</Label>
                    <RadioGroup 
                      value={formData.exerciseFrequency}
                      onValueChange={v => setFormData({...formData, exerciseFrequency: v})}
                      className="flex flex-wrap gap-4"
                    >
                      {["Never", "1-2 times/week", "3-4 times/week", "Daily"].map(freq => (
                        <label key={freq} className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value={freq} />
                          <span>{freq}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Family Medical History</Label>
                    <div className="flex flex-wrap gap-3">
                      {["Heart Disease", "Cancer", "Diabetes", "Stroke", "None"].map(history => (
                        <label 
                          key={history}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${
                            formData.familyHistory.includes(history) 
                              ? 'border-teal-500 bg-teal-50' 
                              : 'border-border hover:border-teal-200'
                          }`}
                        >
                          <Checkbox 
                            checked={formData.familyHistory.includes(history)}
                            onCheckedChange={(checked) => handleCheckboxChange('familyHistory', history, checked as boolean)}
                          />
                          <span className="text-sm">{history}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "risk" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-teal-600 mb-4" />
                  <h2 className="font-display text-2xl font-bold text-foreground">Risk Assessment</h2>
                  <p className="text-muted-foreground">Understanding your investment temperament</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>How would you describe your risk tolerance?</Label>
                    <RadioGroup 
                      value={formData.riskTolerance}
                      onValueChange={v => setFormData({...formData, riskTolerance: v})}
                      className="space-y-3"
                    >
                      {[
                        { value: "conservative", label: "Conservative", desc: "Prefer safety over returns, minimal losses" },
                        { value: "moderate", label: "Moderate", desc: "Balance between growth and safety" },
                        { value: "aggressive", label: "Aggressive", desc: "Willing to take risks for higher returns" },
                      ].map(option => (
                        <label 
                          key={option.value}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.riskTolerance === option.value 
                              ? 'border-teal-500 bg-teal-50' 
                              : 'border-border hover:border-teal-200'
                          }`}
                        >
                          <RadioGroupItem value={option.value} className="mt-1" />
                          <div>
                            <p className="font-medium text-foreground">{option.label}</p>
                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Investment Horizon</Label>
                    <RadioGroup 
                      value={formData.investmentHorizon}
                      onValueChange={v => setFormData({...formData, investmentHorizon: v})}
                      className="flex flex-wrap gap-3"
                    >
                      {["1-3 years", "3-5 years", "5-10 years", "10+ years"].map(horizon => (
                        <label 
                          key={horizon}
                          className={`px-4 py-2 rounded-full border cursor-pointer transition-all ${
                            formData.investmentHorizon === horizon 
                              ? 'border-teal-500 bg-teal-50' 
                              : 'border-border hover:border-teal-200'
                          }`}
                        >
                          <RadioGroupItem value={horizon} className="sr-only" />
                          <span className="text-sm font-medium">{horizon}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>If your investments dropped 20% in a month, you would:</Label>
                    <RadioGroup 
                      value={formData.marketDropReaction}
                      onValueChange={v => setFormData({...formData, marketDropReaction: v})}
                      className="space-y-3"
                    >
                      {[
                        { value: "sell", label: "Sell everything immediately" },
                        { value: "partial", label: "Sell some, keep some" },
                        { value: "hold", label: "Hold and wait for recovery" },
                        { value: "buy", label: "Buy more at lower prices" },
                      ].map(option => (
                        <label 
                          key={option.value}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            formData.marketDropReaction === option.value 
                              ? 'border-teal-500 bg-teal-50' 
                              : 'border-border hover:border-teal-200'
                          }`}
                        >
                          <RadioGroupItem value={option.value} />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "results" && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-wealth-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-wealth-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Your Personalized Wealth Plan
                  </h2>
                  <p className="text-muted-foreground">
                    Based on your profile, here's what we recommend
                  </p>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-teal-50 border border-teal-100">
                    <PieChart className="w-8 h-8 mx-auto text-teal-600 mb-2" />
                    <p className="text-2xl font-display font-bold text-teal-700">{recommendations.financialScore}</p>
                    <p className="text-xs text-muted-foreground">Financial Score</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-wealth-50 border border-wealth-100">
                    <Heart className="w-8 h-8 mx-auto text-wealth-600 mb-2" />
                    <p className="text-2xl font-display font-bold text-wealth-700">{recommendations.healthScore}</p>
                    <p className="text-xs text-muted-foreground">Health Score</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-trust-50 border border-trust-100">
                    <TrendingUp className="w-8 h-8 mx-auto text-trust-600 mb-2" />
                    <p className="text-2xl font-display font-bold text-trust-700">{recommendations.investableSurplus}</p>
                    <p className="text-xs text-muted-foreground">Monthly Surplus</p>
                  </div>
                </div>

                {/* SIP Recommendations */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-wealth-600" />
                    <h3 className="font-display font-semibold text-lg">Recommended SIPs</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.sips.map((sip, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                          <p className="font-medium text-foreground">{sip.name}</p>
                          <p className="text-sm text-muted-foreground">{sip.rationale}</p>
                        </div>
                        <p className="font-semibold text-wealth-600">{sip.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bond Recommendations */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Landmark className="w-5 h-5 text-trust-600" />
                    <h3 className="font-display font-semibold text-lg">Recommended Bonds</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.bonds.map((bond, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                          <p className="font-medium text-foreground">{bond.name}</p>
                          <p className="text-sm text-muted-foreground">{bond.rationale}</p>
                        </div>
                        <p className="font-semibold text-trust-600">{bond.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance Recommendations */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <h3 className="font-display font-semibold text-lg">Insurance Protection</h3>
                  </div>
                  {formData.conditions.length > 0 && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        Based on your health profile ({formData.conditions.join(", ")}), we recommend 
                        comprehensive coverage with critical illness riders.
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {recommendations.insurance.map((ins, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                          <p className="font-medium text-foreground">{ins.name}</p>
                          <p className="text-sm text-muted-foreground">{ins.rationale}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-teal-600">{ins.cover}</p>
                          <p className="text-sm text-muted-foreground">{ins.premium}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Button variant="trust" size="xl" className="w-full group">
                    Start Automated Investing
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    You can modify these recommendations before starting
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep !== "results" && (
              <div className="flex justify-between pt-8 mt-8 border-t border-border">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  disabled={currentStep === "personal"}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  variant="trust" 
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentStep === "risk" ? "See Results" : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyze;
