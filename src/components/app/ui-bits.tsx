import { ArrowDownRight, ArrowUpRight, Bot, Info, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const PageHeader = ({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="font-display text-2xl md:text-[28px] font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

export const Panel = ({
  title,
  description,
  actions,
  children,
  className,
  footer,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}) => (
  <section className={cn("panel print-break-inside-avoid", className)}>
    {(title || actions) && (
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-border/70">
        <div>
          {title && <h2 className="font-display font-semibold text-[15px]">{title}</h2>}
          {description && <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </header>
    )}
    <div className="p-5">{children}</div>
    {footer && <div className="px-5 py-3 border-t border-border/70 bg-muted/40 rounded-b-xl text-xs text-muted-foreground">{footer}</div>}
  </section>
);

export const KpiCard = ({
  label,
  value,
  sub,
  delta,
  tone = "neutral",
  hint,
  index = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  tone?: "neutral" | "good" | "warn" | "bad";
  hint?: string;
  index?: number;
}) => {
  const toneClass = {
    neutral: "text-foreground",
    good: "text-[hsl(var(--success))]",
    warn: "text-[hsl(var(--warning))]",
    bad: "text-[hsl(var(--danger))]",
  }[tone];
  const DeltaIcon = delta === undefined ? Minus : delta >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="panel p-4"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Info className="w-3 h-3 opacity-60" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className={cn("font-display text-2xl font-bold mt-2 tnum", toneClass)}>{value}</div>
      <div className="flex items-center gap-2 mt-1.5">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-md px-1.5 py-0.5",
              delta >= 0
                ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
                : "bg-[hsl(var(--danger-soft))] text-[hsl(var(--danger))]",
            )}
          >
            <DeltaIcon className="w-3 h-3" />
            {Math.abs(Math.round(delta * 100))}%
          </span>
        )}
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </motion.div>
  );
};

export const AgentTag = ({ agent, className }: { agent: string; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-md bg-primary/8 text-primary text-[11px] font-medium px-1.5 py-0.5 border border-primary/20",
      className,
    )}
  >
    <Bot className="w-3 h-3" />
    {agent}
  </span>
);

export const Confidence = ({ value }: { value: number }) => {
  const pct = Math.round(value * 100);
  const tone =
    pct >= 90
      ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
      : pct >= 70
        ? "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]"
        : "bg-[hsl(var(--danger-soft))] text-[hsl(var(--danger))]";
  return <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-semibold tnum", tone)}>{pct}%</span>;
};

export const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    paid: "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
    cleared: "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
    scheduled: "bg-[hsl(var(--info-soft))] text-[hsl(var(--info))]",
    open: "bg-[hsl(var(--info-soft))] text-[hsl(var(--info))]",
    due: "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]",
    pending: "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]",
    overdue: "bg-[hsl(var(--danger-soft))] text-[hsl(var(--danger))]",
  };
  return (
    <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize", map[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </span>
  );
};

export const DemoNote = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-foreground/80">
    <Badge variant="outline" className="border-primary/40 text-primary bg-background text-[10px] shrink-0">
      Demo
    </Badge>
    <span>{children}</span>
  </div>
);

export const chartColors = ["hsl(21 90% 48%)", "hsl(33 94% 55%)", "hsl(158 64% 34%)", "hsl(214 80% 44%)", "hsl(280 55% 52%)", "hsl(24 10% 35%)", "hsl(45 90% 45%)", "hsl(190 70% 40%)", "hsl(340 65% 50%)", "hsl(120 30% 45%)", "hsl(24 6% 62%)"];
