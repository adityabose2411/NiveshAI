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
