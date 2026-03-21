import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  RadialBarChart, RadialBar, Legend
} from "recharts";
import { 
  ArrowRight, ArrowLeft, User, Target, Heart, TrendingUp, Shield, Sparkles,
  CheckCircle2, PieChart as PieChartIcon, Landmark, AlertTriangle, Loader2,
  IndianRupee, Calendar, Activity, Download, RotateCcw, BadgeCheck, Zap,
  BarChart3
} from "lucide-react";

type Step = "personal" | "goals" | "health" | "risk" | "analyzing" | "results";

const Analyze = () => {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    monthlyIncome: "",
    monthlyExpenses: "",
    existingInvestments: "",
    dependents: "",
    goals: [] as string[],
    retirementAge: "",
    emergencyMonths: "",
    hasChronicConditions: "",
    conditions: [] as string[],
    smoker: "",
    exerciseFrequency: "",
    familyHistory: [] as string[],
    riskTolerance: "",
    investmentHorizon: "",
    marketDropReaction: "",
  });

  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzePhase, setAnalyzePhase] = useState("");

  const visibleSteps: { id: Step; label: string; icon: any }[] = [
    { id: "personal", label: "Personal", icon: User },
    { id: "goals", label: "Goals", icon: Target },
    { id: "health", label: "Health", icon: Heart },
    { id: "risk", label: "Risk", icon: TrendingUp },
    { id: "results", label: "Results", icon: Sparkles },
  ];

  const allSteps: Step[] = ["personal", "goals", "health", "risk", "analyzing", "results"];
  const currentStepIndex = visibleSteps.findIndex(s => s.id === currentStep);
  const progressValue = currentStep === "analyzing" || currentStep === "results" 
    ? 100 
    : ((currentStepIndex + 1) / visibleSteps.length) * 100;

  // Dynamic recommendations based on form data
  const recommendations = useMemo(() => {
    const income = parseInt(formData.monthlyIncome) || 50000;
    const expenses = parseInt(formData.monthlyExpenses) || 30000;
    const age = parseInt(formData.age) || 30;
    const existing = parseInt(formData.existingInvestments) || 0;
    const dependents = parseInt(formData.dependents) || 0;
    const surplus = Math.max(income - expenses, 0);
    const riskLevel = formData.riskTolerance || "moderate";
    const hasConditions = formData.conditions.length > 0;
    const isSmoker = formData.smoker === "yes";

    // Financial score calculation
    const savingsRate = income > 0 ? (surplus / income) * 100 : 0;
    let financialScore = Math.min(95, Math.round(
      (savingsRate * 1.2) +
      (existing > 100000 ? 15 : existing > 50000 ? 10 : 5) +
      (formData.goals.length > 2 ? 10 : 5) +
      (age < 35 ? 10 : age < 45 ? 7 : 3)
    ));

    // Health score
    let healthScore = 85;
    if (hasConditions) healthScore -= formData.conditions.length * 8;
    if (isSmoker) healthScore -= 12;
    if (formData.exerciseFrequency === "Daily") healthScore += 5;
    if (formData.exerciseFrequency === "Never") healthScore -= 10;
    if (formData.familyHistory.filter(h => h !== "None").length > 0) healthScore -= 5;
    healthScore = Math.max(30, Math.min(98, healthScore));

    // SIP allocation based on risk
    const sipAllocation = riskLevel === "aggressive" ? 0.6 : riskLevel === "moderate" ? 0.45 : 0.3;
    const bondAllocation = riskLevel === "aggressive" ? 0.15 : riskLevel === "moderate" ? 0.25 : 0.4;
    const insuranceAllocation = 1 - sipAllocation - bondAllocation;

    const sipBudget = Math.round(surplus * sipAllocation);
    const bondBudget = Math.round(surplus * bondAllocation);

    // Insurance premium based on health
    const basePremium = age < 30 ? 500 : age < 40 ? 800 : age < 50 ? 1200 : 1800;
    const healthMultiplier = hasConditions ? 1.4 : isSmoker ? 1.3 : 1;
    const lifeCover = Math.max(5000000, income * 12 * 15);
    const healthCover = dependents > 2 ? 2000000 : dependents > 0 ? 1500000 : 1000000;

    const sips = [
      { 
        name: "Nifty 50 Index Fund", 
        provider: "UTI AMC",
        amount: `₹${Math.round(sipBudget * 0.4).toLocaleString("en-IN")}/mo`, 
        rationale: "Core portfolio — low-cost broad market exposure",
        returns: "12.4% (3Y)",
        risk: riskLevel === "aggressive" ? "Moderate" : "Low-Moderate"
      },
      { 
        name: riskLevel === "aggressive" ? "Small Cap Fund" : "Flexi Cap Fund", 
        provider: riskLevel === "aggressive" ? "Nippon India" : "Parag Parikh",
        amount: `₹${Math.round(sipBudget * 0.35).toLocaleString("en-IN")}/mo`, 
        rationale: riskLevel === "aggressive" ? "High growth potential for long-term" : "Multi-cap diversified growth",
        returns: riskLevel === "aggressive" ? "22.5% (3Y)" : "18.2% (3Y)",
        risk: riskLevel === "aggressive" ? "High" : "Moderate"
      },
      { 
        name: "ELSS Tax Saver Fund", 
        provider: "Mirae Asset",
        amount: `₹${Math.round(sipBudget * 0.25).toLocaleString("en-IN")}/mo`, 
        rationale: "Tax benefits under Section 80C + equity growth",
        returns: "15.6% (3Y)",
        risk: "Moderate"
      },
    ];

    const bonds = [
      { 
        name: "RBI Floating Rate Bond", 
        issuer: "Govt. of India",
        amount: `₹${Math.round(bondBudget * 8).toLocaleString("en-IN")}`, 
        rationale: "Government-backed, inflation protection",
        yield: "8.05%",
        tenure: "7 Years"
      },
      { 
        name: "Sovereign Gold Bond", 
        issuer: "RBI",
        amount: `₹${Math.round(bondBudget * 4).toLocaleString("en-IN")}`, 
        rationale: "Gold exposure with 2.5% interest + capital gains",
        yield: "2.5% + Gold",
        tenure: "8 Years"
      },
      ...(bondBudget > 3000 ? [{
        name: "Corporate Bond Fund",
        issuer: "HDFC AMC",
        amount: `₹${Math.round(bondBudget * 3).toLocaleString("en-IN")}`,
        rationale: "Higher yield with moderate credit risk",
        yield: "7.80%",
        tenure: "3-5 Years"
      }] : []),
    ];

    const insurance = [
      { 
        name: "Term Life Insurance", 
        provider: "HDFC Life",
        cover: `₹${(lifeCover / 10000000).toFixed(1)} Cr`, 
        premium: `₹${Math.round(basePremium * 0.8 * healthMultiplier).toLocaleString("en-IN")}/mo`, 
        rationale: dependents > 0 ? `Essential protection for ${dependents} dependent(s)` : "Pure risk cover for future planning"
      },
      { 
        name: "Health Insurance", 
        provider: "Star Health",
        cover: `₹${(healthCover / 100000).toFixed(0)} Lakh`, 
        premium: `₹${Math.round(basePremium * 1.5 * healthMultiplier).toLocaleString("en-IN")}/mo`, 
        rationale: hasConditions 
          ? `Family floater with critical illness cover for ${formData.conditions.join(", ")}` 
          : dependents > 0 ? "Family floater with no-claim bonus" : "Individual plan with day-care coverage"
      },
      ...(hasConditions || isSmoker ? [{
        name: "Critical Illness Cover",
        provider: "ICICI Prudential",
        cover: "₹25 Lakh",
        premium: `₹${Math.round(basePremium * 0.5 * healthMultiplier).toLocaleString("en-IN")}/mo`,
        rationale: `Lump-sum payout on diagnosis of 36 critical illnesses`
      }] : []),
    ];

    // Allocation chart data
    const allocationData = [
      { name: "SIPs", value: Math.round(sipAllocation * 100), fill: "hsl(158, 64%, 40%)" },
      { name: "Bonds", value: Math.round(bondAllocation * 100), fill: "hsl(221, 83%, 25%)" },
      { name: "Insurance", value: Math.round(insuranceAllocation * 100), fill: "hsl(174, 60%, 40%)" },
    ];

    // Projection data (wealth growth over years)
    const projectionData = [];
    let currentWealth = existing;
    const monthlyInvest = sipBudget + bondBudget;
    const annualReturn = riskLevel === "aggressive" ? 0.14 : riskLevel === "moderate" ? 0.12 : 0.09;
    for (let year = 0; year <= 20; year += 5) {
      projectionData.push({
        year: `Year ${year}`,
        wealth: Math.round(currentWealth / 100000),
      });
      for (let m = 0; m < 60; m++) { // 5 years
        currentWealth = currentWealth * (1 + annualReturn / 12) + monthlyInvest;
      }
    }

    return {
      sips, bonds, insurance,
      healthScore, financialScore,
      surplus: `₹${surplus.toLocaleString("en-IN")}`,
      surplusNum: surplus,
      allocationData,
      projectionData,
      lifeCover: `₹${(lifeCover / 10000000).toFixed(1)} Cr`,
      monthlyInvest: `₹${monthlyInvest.toLocaleString("en-IN")}`,
      savingsRate: `${savingsRate.toFixed(0)}%`,
    };
  }, [formData]);

  const handleNext = () => {
    const idx = allSteps.indexOf(currentStep);
    if (currentStep === "risk") {
      // Go to analyzing phase
      setCurrentStep("analyzing");
      startAnalyzing();
    } else if (idx < allSteps.length - 1) {
      setCurrentStep(allSteps[idx + 1]);
    }
  };

  const handleBack = () => {
    const idx = allSteps.indexOf(currentStep);
    if (currentStep === "results") {
      setCurrentStep("risk");
    } else if (idx > 0) {
      setCurrentStep(allSteps[idx - 1]);
    }
  };

  const startAnalyzing = () => {
    setAnalyzeProgress(0);
    const phases = [
      "Analyzing income patterns...",
      "Scanning expense categories...",
      "Calculating investable surplus...",
      "Profiling risk tolerance...",
      "Matching insurance needs...",
      "Optimizing SIP allocations...",
      "Building wealth projections...",
      "Generating your personalized plan..."
    ];
    let progress = 0;
    let phaseIdx = 0;
    setAnalyzePhase(phases[0]);

    const interval = setInterval(() => {
      progress += 2;
      setAnalyzeProgress(progress);
      const newPhaseIdx = Math.min(Math.floor(progress / (100 / phases.length)), phases.length - 1);
      if (newPhaseIdx !== phaseIdx) {
        phaseIdx = newPhaseIdx;
        setAnalyzePhase(phases[phaseIdx]);
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setCurrentStep("results"), 600);
      }
    }, 80);
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(v => v !== value)
    }));
  };

  const handleRestart = () => {
    setCurrentStep("personal");
    setAnalyzeProgress(0);
  };

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Header */}
          {currentStep !== "analyzing" && (
            <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-4">
                {visibleSteps.map((step, index) => {
                  const isCompleted = currentStep === "results" ? true : index < currentStepIndex;
                  const isActive = step.id === currentStep || (currentStep === "results" && index === visibleSteps.length - 1);
                  return (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-2 transition-colors duration-300 ${
                        isActive || isCompleted ? 'text-teal-600' : 'text-muted-foreground'
                      }`}
                    >
                      <motion.div 
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-teal-500 text-primary-foreground shadow-md' 
                            : isActive 
                              ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-500/30' 
                              : 'bg-muted text-muted-foreground'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {isCompleted && !isActive ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-4 h-4" />
                        )}
                      </motion.div>
                      <span className="hidden md:block text-sm font-medium">{step.label}</span>
                    </div>
                  );
                })}
              </div>
              <Progress value={progressValue} className="h-2" />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ANALYZING PHASE */}
            {currentStep === "analyzing" && (
              <motion.div 
                key="analyzing"
                {...fadeVariants}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative w-32 h-32 mb-8">
                  {/* Outer ring */}
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                    <circle 
                      cx="60" cy="60" r="54" fill="none" 
                      stroke="url(#analyzeGradient)" strokeWidth="6" 
                      strokeLinecap="round"
                      strokeDasharray={`${analyzeProgress * 3.39} 339`}
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient id="analyzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(174, 60%, 40%)" />
                        <stop offset="100%" stopColor="hsl(158, 64%, 40%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-10 h-10 text-teal-500" />
                    </motion.div>
                  </div>
                </div>

                <motion.p 
                  className="text-3xl font-display font-bold text-foreground mb-2"
                  key={analyzeProgress}
                >
                  {analyzeProgress}%
                </motion.p>

                <motion.p 
                  className="text-muted-foreground text-center mb-2"
                  key={analyzePhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {analyzePhase}
                </motion.p>

                <p className="text-sm text-muted-foreground/60 mt-4">
                  NiveshAI is building your personalized wealth plan...
                </p>
              </motion.div>
            )}

            {/* FORM STEPS */}
            {currentStep !== "analyzing" && currentStep !== "results" && (
              <motion.div key={currentStep} {...fadeVariants} className="fintech-card p-6 md:p-8">
                {currentStep === "personal" && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-100 flex items-center justify-center mb-4">
                        <User className="w-7 h-7 text-teal-600" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-foreground">Tell Us About Yourself</h2>
                      <p className="text-muted-foreground mt-1">Basic information to personalize your wealth plan</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { id: "name", label: "Full Name", type: "text", placeholder: "Enter your name", field: "name" },
                        { id: "age", label: "Age", type: "number", placeholder: "Your age", field: "age" },
                        { id: "income", label: "Monthly Income (₹)", type: "number", placeholder: "e.g., 50000", field: "monthlyIncome" },
                        { id: "expenses", label: "Monthly Expenses (₹)", type: "number", placeholder: "e.g., 30000", field: "monthlyExpenses" },
                        { id: "existing", label: "Existing Investments (₹)", type: "number", placeholder: "e.g., 200000", field: "existingInvestments" },
                        { id: "dependents", label: "Number of Dependents", type: "number", placeholder: "0, 1, 2...", field: "dependents" },
                      ].map(input => (
                        <div key={input.id} className="space-y-2">
                          <Label htmlFor={input.id} className="text-sm font-medium">{input.label}</Label>
                          <Input 
                            id={input.id} 
                            type={input.type}
                            placeholder={input.placeholder}
                            value={formData[input.field as keyof typeof formData] as string}
                            onChange={e => setFormData({...formData, [input.field]: e.target.value})}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Live Surplus Indicator */}
                    {formData.monthlyIncome && formData.monthlyExpenses && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-wealth-50 border border-teal-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-teal-600" />
                            <span className="text-sm font-medium text-foreground">Estimated Monthly Surplus</span>
                          </div>
                          <span className="text-xl font-display font-bold text-teal-700">
                            ₹{Math.max(0, (parseInt(formData.monthlyIncome) || 0) - (parseInt(formData.monthlyExpenses) || 0)).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {currentStep === "goals" && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-wealth-100 flex items-center justify-center mb-4">
                        <Target className="w-7 h-7 text-wealth-600" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-foreground">Financial Goals</h2>
                      <p className="text-muted-foreground mt-1">What are you saving and investing for?</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Select Your Goals (Multiple)</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          { label: "Retirement Planning", emoji: "🏖️" },
                          { label: "Child's Education", emoji: "🎓" },
                          { label: "Buying a Home", emoji: "🏠" },
                          { label: "Emergency Fund", emoji: "🛡️" },
                          { label: "Wealth Creation", emoji: "📈" },
                          { label: "Tax Saving", emoji: "💰" },
                          { label: "Child's Marriage", emoji: "💍" },
                          { label: "Travel & Lifestyle", emoji: "✈️" },
                        ].map(goal => (
                          <motion.label 
                            key={goal.label}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                              formData.goals.includes(goal.label) 
                                ? 'border-teal-500 bg-teal-50 shadow-sm' 
                                : 'border-border hover:border-teal-200 hover:bg-muted/30'
                            }`}
                          >
                            <Checkbox 
                              checked={formData.goals.includes(goal.label)}
                              onCheckedChange={(checked) => handleCheckboxChange('goals', goal.label, checked as boolean)}
                            />
                            <span className="text-lg">{goal.emoji}</span>
                            <span className="text-sm font-medium">{goal.label}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="retireAge">Desired Retirement Age</Label>
                        <Input 
                          id="retireAge" type="number" placeholder="e.g., 55"
                          value={formData.retirementAge}
                          onChange={e => setFormData({...formData, retirementAge: e.target.value})}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency">Emergency Fund (Months)</Label>
                        <Input 
                          id="emergency" type="number" placeholder="e.g., 6"
                          value={formData.emergencyMonths}
                          onChange={e => setFormData({...formData, emergencyMonths: e.target.value})}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "health" && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
                        <Heart className="w-7 h-7 text-rose-600" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-foreground">Health Profile</h2>
                      <p className="text-muted-foreground mt-1">To recommend appropriate insurance coverage</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Do you have any chronic conditions?</Label>
                        <RadioGroup 
                          value={formData.hasChronicConditions}
                          onValueChange={v => setFormData({...formData, hasChronicConditions: v})}
                          className="flex gap-4"
                        >
                          {["yes", "no"].map(val => (
                            <label key={val} className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                              formData.hasChronicConditions === val ? 'border-teal-500 bg-teal-50' : 'border-border hover:border-teal-200'
                            }`}>
                              <RadioGroupItem value={val} />
                              <span className="capitalize font-medium">{val}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>

                      <AnimatePresence>
                        {formData.hasChronicConditions === "yes" && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-3 overflow-hidden"
                          >
                            <Label>Select Conditions</Label>
                            <div className="grid md:grid-cols-3 gap-3">
                              {["Diabetes", "Hypertension", "Heart Disease", "Asthma/Respiratory", "Thyroid", "Obesity"].map(condition => (
                                <motion.label 
                                  key={condition}
                                  whileHover={{ scale: 1.02 }}
                                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                    formData.conditions.includes(condition) 
                                      ? 'border-rose-400 bg-rose-50' 
                                      : 'border-border hover:border-rose-200'
                                  }`}
                                >
                                  <Checkbox 
                                    checked={formData.conditions.includes(condition)}
                                    onCheckedChange={(checked) => handleCheckboxChange('conditions', condition, checked as boolean)}
                                  />
                                  <span className="text-sm">{condition}</span>
                                </motion.label>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-3">
                        <Label>Do you smoke?</Label>
                        <RadioGroup 
                          value={formData.smoker}
                          onValueChange={v => setFormData({...formData, smoker: v})}
                          className="flex gap-3"
                        >
                          {[
                            { value: "no", label: "No" },
                            { value: "occasionally", label: "Occasionally" },
                            { value: "yes", label: "Yes" },
                          ].map(opt => (
                            <label key={opt.value} className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                              formData.smoker === opt.value ? 'border-teal-500 bg-teal-50' : 'border-border hover:border-teal-200'
                            }`}>
                              <RadioGroupItem value={opt.value} />
                              <span className="text-sm font-medium">{opt.label}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label>Exercise Frequency</Label>
                        <RadioGroup 
                          value={formData.exerciseFrequency}
                          onValueChange={v => setFormData({...formData, exerciseFrequency: v})}
                          className="flex flex-wrap gap-3"
                        >
                          {["Never", "1-2 times/week", "3-4 times/week", "Daily"].map(freq => (
                            <label key={freq} className={`px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                              formData.exerciseFrequency === freq ? 'border-teal-500 bg-teal-50' : 'border-border hover:border-teal-200'
                            }`}>
                              <RadioGroupItem value={freq} className="sr-only" />
                              <span className="text-sm font-medium">{freq}</span>
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
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all ${
                                formData.familyHistory.includes(history) 
                                  ? 'border-teal-500 bg-teal-50' 
                                  : 'border-border hover:border-teal-200'
                              }`}
                            >
                              <Checkbox 
                                checked={formData.familyHistory.includes(history)}
                                onCheckedChange={(checked) => handleCheckboxChange('familyHistory', history, checked as boolean)}
                                className="w-4 h-4"
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
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-trust-100 flex items-center justify-center mb-4">
                        <BarChart3 className="w-7 h-7 text-trust-600" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-foreground">Risk Assessment</h2>
                      <p className="text-muted-foreground mt-1">Understanding your investment temperament</p>
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
                            { value: "conservative", label: "Conservative", desc: "Prefer safety over returns, minimal losses", emoji: "🛡️" },
                            { value: "moderate", label: "Moderate", desc: "Balance between growth and safety", emoji: "⚖️" },
                            { value: "aggressive", label: "Aggressive", desc: "Willing to take risks for higher returns", emoji: "🚀" },
                          ].map(option => (
                            <motion.label 
                              key={option.value}
                              whileHover={{ scale: 1.01 }}
                              className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                                formData.riskTolerance === option.value 
                                  ? 'border-teal-500 bg-teal-50 shadow-sm' 
                                  : 'border-border hover:border-teal-200'
                              }`}
                            >
                              <RadioGroupItem value={option.value} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span>{option.emoji}</span>
                                  <p className="font-semibold text-foreground">{option.label}</p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5">{option.desc}</p>
                              </div>
                            </motion.label>
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
                              className={`px-5 py-3 rounded-xl border cursor-pointer transition-all ${
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
                            { value: "sell", label: "Sell everything immediately", emoji: "😰" },
                            { value: "partial", label: "Sell some, keep some", emoji: "🤔" },
                            { value: "hold", label: "Hold and wait for recovery", emoji: "💎" },
                            { value: "buy", label: "Buy more at lower prices", emoji: "🦈" },
                          ].map(option => (
                            <motion.label 
                              key={option.value}
                              whileHover={{ scale: 1.01 }}
                              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                formData.marketDropReaction === option.value 
                                  ? 'border-teal-500 bg-teal-50' 
                                  : 'border-border hover:border-teal-200'
                              }`}
                            >
                              <RadioGroupItem value={option.value} />
                              <span className="text-lg">{option.emoji}</span>
                              <span className="text-sm font-medium">{option.label}</span>
                            </motion.label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
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
                    size="lg"
                  >
                    {currentStep === "risk" ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze My Finances
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* RESULTS DASHBOARD */}
            {currentStep === "results" && (
              <motion.div key="results" {...fadeVariants}>
                {/* Header */}
                <motion.div className="text-center mb-10" variants={staggerItem}>
                  <motion.div 
                    className="w-20 h-20 mx-auto rounded-3xl gradient-wealth flex items-center justify-center mb-5 shadow-elevated"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}
                  >
                    <BadgeCheck className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {formData.name ? `${formData.name}'s` : "Your"} Wealth Plan
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Personalized by NiveshAI based on your complete financial profile
                  </p>
                </motion.div>

                {/* Score Cards */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    { label: "Financial Score", value: `${recommendations.financialScore}/100`, icon: PieChartIcon, color: "teal", bg: "from-teal-50 to-teal-100/50" },
                    { label: "Health Score", value: `${recommendations.healthScore}/100`, icon: Activity, color: "rose", bg: "from-rose-50 to-rose-100/50" },
                    { label: "Monthly Surplus", value: recommendations.surplus, icon: IndianRupee, color: "wealth", bg: "from-emerald-50 to-emerald-100/50" },
                    { label: "Savings Rate", value: recommendations.savingsRate, icon: TrendingUp, color: "trust", bg: "from-blue-50 to-blue-100/50" },
                  ].map((card, i) => (
                    <motion.div 
                      key={card.label}
                      variants={staggerItem}
                      className={`p-5 rounded-2xl bg-gradient-to-br ${card.bg} border border-border/50 text-center`}
                    >
                      <card.icon className={`w-6 h-6 mx-auto mb-2 text-${card.color}-600`} />
                      <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Allocation Pie */}
                  <motion.div 
                    className="fintech-card p-6"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-teal-600" />
                      Asset Allocation
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={recommendations.allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {recommendations.allocationData.map((entry, index) => (
                            <Cell key={index} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Wealth Projection */}
                  <motion.div 
                    className="fintech-card p-6"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-wealth-600" />
                      Wealth Projection (₹ Lakhs)
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={recommendations.projectionData}>
                        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: number) => `₹${value} L`} />
                        <Bar dataKey="wealth" fill="hsl(158, 64%, 40%)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* SIP Recommendations */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-wealth-600" />
                    <h3 className="font-display font-semibold text-xl text-foreground">Recommended SIPs</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.sips.map((sip, i) => (
                      <motion.div 
                        key={i} 
                        className="fintech-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-foreground">{sip.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{sip.provider}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{sip.rationale}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Returns</p>
                            <p className="text-sm font-semibold text-wealth-600">{sip.returns}</p>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="text-xs text-muted-foreground">Invest</p>
                            <p className="text-lg font-display font-bold text-foreground">{sip.amount}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Bond Recommendations */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Landmark className="w-5 h-5 text-trust-600" />
                    <h3 className="font-display font-semibold text-xl text-foreground">Recommended Bonds</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendations.bonds.map((bond, i) => (
                      <motion.div 
                        key={i} 
                        className="fintech-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.7 + i * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-foreground">{bond.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{bond.issuer}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{bond.rationale}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Yield</p>
                            <p className="text-sm font-semibold text-trust-600">{bond.yield}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Tenure</p>
                            <p className="text-sm font-medium text-foreground">{bond.tenure}</p>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="text-xs text-muted-foreground">Invest</p>
                            <p className="text-lg font-display font-bold text-foreground">{bond.amount}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Insurance Recommendations */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <h3 className="font-display font-semibold text-xl text-foreground">Insurance Protection</h3>
                  </div>

                  {formData.conditions.length > 0 && (
                    <motion.div 
                      className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-800 text-sm">Health Conditions Detected</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Based on your profile ({formData.conditions.join(", ")}), we've included comprehensive 
                          coverage with critical illness riders and increased health insurance limits.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    {recommendations.insurance.map((ins, i) => (
                      <motion.div 
                        key={i} 
                        className="fintech-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.9 + i * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-foreground">{ins.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{ins.provider}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{ins.rationale}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Cover</p>
                            <p className="text-sm font-semibold text-teal-600">{ins.cover}</p>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="text-xs text-muted-foreground">Premium</p>
                            <p className="text-lg font-display font-bold text-foreground">{ins.premium}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Summary & CTA */}
                <motion.div 
                  className="rounded-2xl gradient-trust p-6 md:p-8 text-primary-foreground"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                >
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="font-display font-bold text-2xl mb-3">
                      Ready to Start Your Wealth Journey?
                    </h3>
                    <p className="text-primary-foreground/80 mb-6">
                      Your total monthly investment of {recommendations.monthlyInvest} will be automatically 
                      allocated across SIPs, bonds, and insurance for optimal wealth creation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="wealth" size="xl" className="group">
                        <Zap className="w-5 h-5" />
                        Start Automated Investing
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button variant="heroOutline" size="lg" onClick={handleRestart} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Modify Inputs
                      </Button>
                    </div>
                    <p className="text-sm text-primary-foreground/50 mt-4">
                      🔒 Bank-grade security • Modify anytime • No lock-in period
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyze;
