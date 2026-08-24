import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { Calculator, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentTag, KpiCard, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { computeMetrics, inr, inrFull } from "@/lib/finance";
import {
  breakEvenRevenue,
  costOfEquity,
  dcf,
  irr,
  npv,
  wacc,
} from "@/lib/formulas";
import { downloadReport } from "@/lib/reports";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const Planning = () => {
  const { transactions } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);

  // scenario inputs
  const [hires, setHires] = useState(2);
  const [salary, setSalary] = useState(900000);
  const [growth, setGrowth] = useState(14);
  const [marketingDelta, setMarketingDelta] = useState(0);

  // valuation inputs
  const [beta, setBeta] = useState(1.25);
  const [debtShare, setDebtShare] = useState(25);
  const [terminalGrowth, setTerminalGrowth] = useState(5);
  const [explicitGrowth, setExplicitGrowth] = useState(14);

  // capex inputs
  const [outlay, setOutlay] = useState(4000000);
  const [annualBenefit, setAnnualBenefit] = useState(1400000);
  const [projectYears, setProjectYears] = useState(5);

  const re = costOfEquity(0.07, beta, 0.14);
  const rate = wacc({ equity: 1 - debtShare / 100, debt: debtShare / 100, costEquity: re, costDebt: 0.11, taxRate: 0.25 });
  const baseFcf = Math.max((m.avgRevenue - m.avgExpenses) * 12 * 0.85, 100000);
  const valuation = dcf({
    baseFcf,
    growth: explicitGrowth / 100,
    years: 5,
    discountRate: rate,
    terminalGrowth: terminalGrowth / 100,
    netDebt: Math.max(m.payables - m.cashBalance, 0),
  });

  const projectFlows = Array.from({ length: projectYears }, () => annualBenefit);
  const projectNpv = npv(rate, projectFlows, outlay);
  const projectIrr = irr(projectFlows, outlay);
  const payback = annualBenefit ? outlay / annualBenefit : Infinity;

  // 12-month scenario projection
  const scenario = useMemo(() => {
    const extra = (hires * salary) / 12 + marketingDelta;
    let cash = m.cashBalance;
    return Array.from({ length: 12 }, (_, i) => {
      const revenue = m.avgRevenue * Math.pow(1 + growth / 100 / 12, i + 1);
      const expenses = m.avgExpenses + extra;
      cash += revenue - expenses;
      return { label: `M${i + 1}`, revenue: Math.round(revenue), expenses: Math.round(expenses), cash: Math.round(cash) };
    });
  }, [hires, salary, growth, marketingDelta, m]);

  const newBurn = m.burn + (hires * salary) / 12 + marketingDelta;
  const newRunway = m.cashBalance / Math.max(newBurn - m.avgRevenue > 0 ? newBurn - m.avgRevenue : newBurn, 1);
  const breakEven = breakEvenRevenue(m.avgExpenses * 0.62 + (hires * salary) / 12, Math.max(m.grossMargin, 0.2));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planning & valuation"
        subtitle="Model hires, growth and capex, then value the business with a full DCF — every number computed from the formula library, not guessed."
        actions={
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => {
              downloadReport("valuation", m, transactions);
              toast.success("Valuation & Technical Analysis downloaded");
            }}
          >
            <Download className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Enterprise value (DCF)" value={inr(valuation.enterpriseValue)} index={0} hint="Σ PV(FCF) + PV(Terminal value)" />
        <KpiCard label="Equity value" value={inr(valuation.equityValue)} index={1} sub="EV − net debt" />
        <KpiCard label="WACC" value={pct(rate)} index={2} hint="(E/V)·Re + (D/V)·Rd·(1−t)" />
        <KpiCard label="Cost of equity" value={pct(re)} index={3} hint="CAPM: Rf + β(Rm − Rf)" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Scenario inputs" description="Adjust and every panel recalculates instantly.">
          <div className="space-y-5">
            <div>
              <Label className="text-xs">New hires: {hires}</Label>
              <Slider value={[hires]} min={0} max={10} step={1} onValueChange={(v) => setHires(v[0])} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs">Annual salary per hire</Label>
              <Input type="number" className="mt-1.5 h-9 rounded-lg tnum" value={salary} onChange={(e) => setSalary(Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs">Annual revenue growth: {growth}%</Label>
              <Slider value={[growth]} min={-20} max={80} step={1} onValueChange={(v) => setGrowth(v[0])} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs">Extra monthly marketing</Label>
              <Input
                type="number"
                className="mt-1.5 h-9 rounded-lg tnum"
                value={marketingDelta}
                onChange={(e) => setMarketingDelta(Number(e.target.value))}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Scenario outcome" description="12 months forward on the inputs to the left." className="lg:col-span-2" actions={<AgentTag agent="FP&A Agent" />}>
          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            <div className="rounded-lg border border-border/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">New monthly burn</div>
              <div className="font-display text-lg font-bold tnum mt-1">{inr(newBurn)}</div>
            </div>
            <div className="rounded-lg border border-border/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Runway after change</div>
              <div className="font-display text-lg font-bold tnum mt-1">{newRunway.toFixed(1)} mo</div>
            </div>
            <div className="rounded-lg border border-border/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Break-even revenue</div>
              <div className="font-display text-lg font-bold tnum mt-1">{inr(breakEven)}</div>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenario}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(24 10% 90%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} width={58} />
                <RTooltip formatter={(v: number) => inrFull(v)} />
                <Line type="monotone" dataKey="cash" name="Cash" stroke="hsl(21 90% 48%)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(158 64% 34%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(24 10% 55%)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="DCF assumptions" className="lg:col-span-2">
          <div className="space-y-5">
            <div>
              <Label className="text-xs">Beta: {beta.toFixed(2)}</Label>
              <Slider value={[beta * 100]} min={60} max={220} step={5} onValueChange={(v) => setBeta(v[0] / 100)} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs">Debt in capital structure: {debtShare}%</Label>
              <Slider value={[debtShare]} min={0} max={70} step={5} onValueChange={(v) => setDebtShare(v[0])} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs">Explicit-period FCF growth: {explicitGrowth}%</Label>
              <Slider value={[explicitGrowth]} min={0} max={40} step={1} onValueChange={(v) => setExplicitGrowth(v[0])} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs">Terminal growth: {terminalGrowth}%</Label>
              <Slider value={[terminalGrowth]} min={1} max={8} step={1} onValueChange={(v) => setTerminalGrowth(v[0])} className="mt-2" />
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground leading-relaxed">
              Year-1 FCF is taken as 85% of trailing operating surplus ({inr(baseFcf)}). Terminal value uses Gordon Growth:
              FCFn(1+g)/(WACC−g).
            </div>
          </div>
        </Panel>

        <Panel title="Discounted cash flow" description="Explicit five-year period plus discounted terminal value." className="lg:col-span-3">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">FCF</TableHead>
                  <TableHead className="text-right">Discount factor</TableHead>
                  <TableHead className="text-right">Present value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuation.rows.map((r) => (
                  <TableRow key={r.year}>
                    <TableCell className="font-medium">Year {r.year}</TableCell>
                    <TableCell className="text-right tnum">{inrFull(Math.round(r.fcf))}</TableCell>
                    <TableCell className="text-right tnum">{r.discountFactor.toFixed(3)}</TableCell>
                    <TableCell className="text-right tnum">{inrFull(Math.round(r.pv))}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Terminal value</TableCell>
                  <TableCell className="text-right tnum">{inr(valuation.terminalValue)}</TableCell>
                  <TableCell className="text-right tnum">{(1 / Math.pow(1 + rate, 5)).toFixed(3)}</TableCell>
                  <TableCell className="text-right tnum">{inrFull(Math.round(valuation.pvTerminal))}</TableCell>
                </TableRow>
                <TableRow className="bg-muted/40">
                  <TableCell className="font-semibold">Enterprise value</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-right tnum font-semibold">{inrFull(Math.round(valuation.enterpriseValue))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Capex / project appraisal" description="NPV, IRR and payback at your own WACC." actions={<Calculator className="w-4 h-4 text-muted-foreground" />}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-xs">Initial outlay</Label>
              <Input type="number" className="mt-1.5 h-9 rounded-lg tnum" value={outlay} onChange={(e) => setOutlay(Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs">Annual benefit</Label>
              <Input
                type="number"
                className="mt-1.5 h-9 rounded-lg tnum"
                value={annualBenefit}
                onChange={(e) => setAnnualBenefit(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-xs">Years</Label>
              <Input
                type="number"
                className="mt-1.5 h-9 rounded-lg tnum"
                value={projectYears}
                onChange={(e) => setProjectYears(Math.max(1, Math.min(15, Number(e.target.value))))}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 mt-4">
            <div className="rounded-lg border border-border/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">NPV @ {pct(rate)}</div>
              <div className={`font-display text-lg font-bold tnum mt-1 ${projectNpv >= 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]"}`}>
                {inr(projectNpv)}
              </div>
            </div>
            <div className="rounded-lg border border-border/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">IRR</div>
              <div className="font-display text-lg font-bold tnum mt-1">{pct(projectIrr)}</div>
            </div>
            <div className="rounded-lg border border-border/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Payback</div>
              <div className="font-display text-lg font-bold tnum mt-1">{payback.toFixed(1)} yrs</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {projectNpv >= 0
              ? `Accept — the project returns ${pct(projectIrr)} against a ${pct(rate)} hurdle rate.`
              : `Reject — IRR of ${pct(projectIrr)} is below your ${pct(rate)} cost of capital.`}
          </div>
        </Panel>

        <Panel title="Valuation sensitivity" description="Enterprise value across WACC and terminal growth." actions={<Sparkles className="w-4 h-4 text-primary" />}>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[0.03, 0.04, 0.05, 0.06, 0.07].map((g) => ({
                  label: `g ${(g * 100).toFixed(0)}%`,
                  ev: dcf({ baseFcf, growth: explicitGrowth / 100, years: 5, discountRate: rate, terminalGrowth: g, netDebt: 0 }).enterpriseValue,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(24 10% 90%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11 }} width={62} />
                <RTooltip formatter={(v: number) => inrFull(v)} />
                <Bar dataKey="ev" name="Enterprise value" fill="hsl(21 90% 48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Planning;
