import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ConnectBank from "./pages/ConnectBank";
import Analyze from "./pages/Analyze";
import NotFound from "./pages/NotFound";
import { AppStoreProvider } from "@/store/AppStore";
import AppLayout from "@/components/app/AppLayout";
import Overview from "./pages/app/Overview";
import DailyBrief from "./pages/app/DailyBrief";
import CFOChat from "./pages/app/CFOChat";
import Transactions from "./pages/app/Transactions";
import Reconciliation from "./pages/app/Reconciliation";
import Expenses from "./pages/app/Expenses";
import CashFlow from "./pages/app/CashFlow";
import Receivables from "./pages/app/Receivables";
import Payables from "./pages/app/Payables";
import Budgets from "./pages/app/Budgets";
import Planning from "./pages/app/Planning";
import Reports from "./pages/app/Reports";
import Formulas from "./pages/app/Formulas";
import Agents from "./pages/app/Agents";
import Audit from "./pages/app/Audit";
import Integrations from "./pages/app/Integrations";
import Settings from "./pages/app/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppStoreProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/connect-bank" element={<ConnectBank />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route
              path="/app/*"
              element={
                <AppLayout>
                  <Routes>
                    <Route index element={<Overview />} />
                    <Route path="brief" element={<DailyBrief />} />
                    <Route path="cfo" element={<CFOChat />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="reconciliation" element={<Reconciliation />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="cashflow" element={<CashFlow />} />
                    <Route path="receivables" element={<Receivables />} />
                    <Route path="payables" element={<Payables />} />
                    <Route path="budgets" element={<Budgets />} />
                    <Route path="planning" element={<Planning />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="formulas" element={<Formulas />} />
                    <Route path="agents" element={<Agents />} />
                    <Route path="audit" element={<Audit />} />
                    <Route path="integrations" element={<Integrations />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppStoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
