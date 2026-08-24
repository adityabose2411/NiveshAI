import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  Bot,
  Building2,
  CalendarClock,
  FileText,
  Gauge,
  Landmark,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PiggyBank,
  Plug,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/AppStore";

const groups = [
  {
    label: "Understand",
    items: [
      { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
      { to: "/app/brief", label: "Daily Brief", icon: Sparkles },
      { to: "/app/cfo", label: "AI CFO", icon: MessageSquare },
    ],
  },
  {
    label: "Books",
    items: [
      { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
      { to: "/app/reconciliation", label: "Reconciliation", icon: ShieldCheck },
      { to: "/app/expenses", label: "Expenses", icon: Receipt },
    ],
  },
  {
    label: "Cash",
    items: [
      { to: "/app/cashflow", label: "Cash Flow", icon: Activity },
      { to: "/app/receivables", label: "Receivables", icon: PiggyBank },
      { to: "/app/payables", label: "Payables", icon: CalendarClock },
    ],
  },
  {
    label: "Plan",
    items: [
      { to: "/app/budgets", label: "Budgets", icon: Target },
      { to: "/app/planning", label: "Planning", icon: BarChart3 },
      { to: "/app/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    label: "Control",
    items: [
      { to: "/app/agents", label: "AI Agents", icon: Bot },
      { to: "/app/audit", label: "Audit Trail", icon: ScrollText },
      { to: "/app/integrations", label: "Integrations", icon: Plug },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { approvals, profile } = useApp();
  const pending = approvals.filter((a) => a.status === "pending").length;
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[248px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/app" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-trust flex items-center justify-center">
              <Landmark className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="font-display font-bold text-[15px] text-white">
                Hundi<span className="text-primary">AI</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mt-0.5">AI CFO</div>
            </div>
          </Link>
          <button className="lg:hidden text-sidebar-foreground/70" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-3 py-3 border-b border-sidebar-border">
          <div className="rounded-lg bg-sidebar-accent px-3 py-2.5">
            <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/60">
              <Building2 className="w-3.5 h-3.5" /> Workspace
            </div>
            <div className="text-[13px] font-medium text-white mt-1 truncate">{profile.businessName}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {g.label}
              </div>
              <div className="space-y-0.5">
                {g.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={"end" in item ? (item.end as boolean) : false}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white",
                      )
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.to === "/app/brief" && pending > 0 && (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {pending}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Link to="/" className="block text-[11px] text-sidebar-foreground/50 hover:text-white transition-colors">
            ← Back to hundiai.com
          </Link>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 h-16 bg-background/85 backdrop-blur-xl border-b border-border flex items-center gap-3 px-4 md:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reading period: last 6 months · FY Apr–Mar</span>
            <span className="sm:hidden">FY Apr–Mar</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 text-[11px]">
              Demo Mode · read-only
            </Badge>
            <Link to="/app/cfo" className={cn(location.pathname === "/app/cfo" && "hidden")}>
              <Button size="sm" className="rounded-lg h-8">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Ask the CFO
              </Button>
            </Link>
          </div>
        </header>
        <main className="px-4 md:px-6 py-6 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
