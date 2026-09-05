import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, FileText, TrendingUp, Calendar, Stethoscope, Activity, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/doctor-dashboard")({
  head: () => ({
    meta: [
      { title: "Doctor Dashboard — AI Health Assistant" },
      { name: "description", content: "AI-prepared patient summaries, reports, recovery progress and risk alerts in one view." },
    ],
  }),
  component: DoctorDashboard,
});

type Patient = {
  name: string;
  status: "Scheduled" | "Checked-in" | "In progress" | "Recovery";
  summary: string;
  reports: string[];
  recovery: number;
  risk: "low" | "medium" | "high";
  followUp: string;
};

const PATIENTS: Patient[] = [
  {
    name: "Aarav Mehta", status: "Checked-in",
    summary: "32 y/o male. Chest discomfort for 2 days, intermittent, worse on exertion. No prior cardiac history.",
    reports: ["ECG_oct.pdf", "lipid_panel.pdf"],
    recovery: 0, risk: "high",
    followUp: "Immediate cardiology consult; order troponin & repeat ECG.",
  },
  {
    name: "Sara Khan", status: "Scheduled",
    summary: "29 y/o female. Recurring migraines 3x/week, photophobia, mild nausea. OTC analgesics partially effective.",
    reports: ["headache_diary.pdf"],
    recovery: 0, risk: "medium",
    followUp: "Discuss preventive therapy options; consider MRI if pattern changes.",
  },
  {
    name: "John Doe", status: "Recovery",
    summary: "Post-op knee surgery, week 3. Pain trending down (3/10), energy stable, mobility independent.",
    reports: ["op_notes.pdf", "physio_plan.pdf"],
    recovery: 75, risk: "low",
    followUp: "Continue physiotherapy; teleconsult in 1 week.",
  },
  {
    name: "Maya Thomas", status: "Recovery",
    summary: "Post-pneumonia recovery, week 2. Slight regression in energy levels reported this week.",
    reports: ["xray_chest.pdf"],
    recovery: 48, risk: "medium",
    followUp: "Recommend follow-up appointment; review oxygen saturation.",
  },
];

function DoctorDashboard() {
  const totals = {
    patients: PATIENTS.length,
    high: PATIENTS.filter((p) => p.risk === "high").length,
    recovery: PATIENTS.filter((p) => p.status === "Recovery").length,
    today: PATIENTS.filter((p) => p.status !== "Recovery").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-7xl px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to home
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/10"><Stethoscope className="mr-1 h-3 w-3" /> Doctor view</Badge>
            <h1 className="mt-2 font-display text-3xl font-bold">Welcome back, Dr. Sharma</h1>
            <p className="mt-1 text-muted-foreground">Patients arrive pre-briefed by AI. Review summaries, reports and recovery trends at a glance.</p>
          </div>
          <Button asChild className="bg-care-gradient text-white">
            <Link to="/appointment"><Calendar className="mr-2 h-4 w-4" /> New appointment</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Activity} label="Active patients" value={totals.patients} />
          <Stat icon={Calendar} label="Today's queue" value={totals.today} />
          <Stat icon={TrendingUp} label="In recovery" value={totals.recovery} />
          <Stat icon={AlertTriangle} label="High-risk alerts" value={totals.high} tone="danger" />
        </div>

        <div className="mt-8 grid gap-4">
          {PATIENTS.map((p) => <PatientRow key={p.name} p={p} />)}
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <div className="text-sm text-muted-foreground">
              All data is encrypted in transit and at rest. Patients consent to share AI-generated summaries with their treating clinician.
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone?: "danger" }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function PatientRow({ p }: { p: Patient }) {
  const riskBadge = p.risk === "high"
    ? <Badge className="bg-destructive text-destructive-foreground"><AlertTriangle className="mr-1 h-3 w-3" />HIGH RISK</Badge>
    : p.risk === "medium"
      ? <Badge className="bg-warning text-warning-foreground">MEDIUM</Badge>
      : <Badge className="bg-secondary text-secondary-foreground">LOW</Badge>;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-care-gradient font-bold text-white">
            {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <div className="font-display text-lg font-semibold">{p.name}</div>
            <div className="text-xs text-muted-foreground">Status: <span className="font-medium text-foreground">{p.status}</span></div>
          </div>
        </div>
        {riskBadge}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI symptom summary</div>
          <p className="mt-1 text-sm">{p.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.reports.map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs">
                <FileText className="h-3 w-3" /> {r}
              </span>
            ))}
          </div>
        </div>
        <div>
          {p.status === "Recovery" ? (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recovery progress</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-care-gradient" style={{ width: `${p.recovery}%` }} />
                </div>
                <span className="text-sm font-semibold">{p.recovery}%</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk alert</div>
              <p className="mt-2 text-sm">{p.risk === "high" ? "Urgent review needed. AI flagged red-zone symptoms." : "Within manageable range. Monitor during consult."}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary/5 p-4">
        <div className="text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Follow-up recommendation</div>
          <p className="mt-0.5">{p.followUp}</p>
        </div>
        <Button asChild size="sm" variant="outline"><Link to="/appointment">Schedule follow-up</Link></Button>
      </div>
    </div>
  );
}
