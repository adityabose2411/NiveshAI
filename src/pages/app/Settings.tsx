import { useState } from "react";
import { RotateCcw, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { company } from "@/data/demo";

const Settings = () => {
  const { profile, saveProfile, reset } = useApp();
  const [form, setForm] = useState({
    businessName: profile.businessName ?? company.name,
    industry: profile.industry ?? company.industry,
    revenueBand: profile.revenueBand ?? "₹25L – ₹10Cr",
    employees: profile.employees ?? String(company.employees),
  });
  const [autonomy, setAutonomy] = useState({ categorise: true, reconcile: true, chase: false, pay: false });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Workspace details, agent autonomy limits and data controls." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Business profile" description="Used for reports, tax logic and benchmarking.">
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Registered name</Label>
              <Input
                className="mt-1.5 h-10 rounded-lg"
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Industry</Label>
                <Input className="mt-1.5 h-10 rounded-lg" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Revenue band</Label>
                <Input
                  className="mt-1.5 h-10 rounded-lg"
                  value={form.revenueBand}
                  onChange={(e) => setForm((f) => ({ ...f, revenueBand: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Employees</Label>
              <Input
                className="mt-1.5 h-10 rounded-lg tnum"
                value={form.employees}
                onChange={(e) => setForm((f) => ({ ...f, employees: e.target.value }))}
              />
            </div>
            <Button
              className="rounded-lg"
              onClick={() => {
                saveProfile(form);
                toast.success("Workspace profile saved");
              }}
            >
              <Save className="w-4 h-4 mr-1.5" /> Save profile
            </Button>
          </div>
        </Panel>

        <Panel title="Agent autonomy" description="Decide what agents may do on their own. Everything else needs your approval.">
          <div className="space-y-3">
            {[
              { key: "categorise", label: "Categorise transactions automatically", detail: "Above 90% confidence" },
              { key: "reconcile", label: "Post high-confidence reconciliation matches", detail: "Exact amount + date match" },
              { key: "chase", label: "Send receivable reminders", detail: "Requires email connection" },
              { key: "pay", label: "Schedule vendor payments", detail: "Disabled in Demo Mode" },
            ].map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 p-3">
                <div>
                  <div className="text-[13px] font-medium">{row.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{row.detail}</div>
                </div>
                <Switch
                  checked={autonomy[row.key as keyof typeof autonomy]}
                  disabled={row.key === "pay"}
                  onCheckedChange={(v) => {
                    setAutonomy((a) => ({ ...a, [row.key]: v }));
                    toast.success(`${row.label} ${v ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Data & security" description="What HundiAI stores and how you clear it.">
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-border/70 p-3 text-sm">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground">
              This demo keeps your edits, approvals and audit entries in your own browser only. No financial data leaves the device, and PDF reports are
              rendered locally.
            </span>
          </div>
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => {
              reset();
              toast.success("Workspace reset to the demo baseline");
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" /> Reset demo workspace
          </Button>
        </div>
      </Panel>

      <DemoNote>Payments, payroll actions and outbound email are intentionally disabled in Demo Mode.</DemoNote>
    </div>
  );
};

export default Settings;
