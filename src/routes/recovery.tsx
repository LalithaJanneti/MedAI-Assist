import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Upload, Sparkles, TrendingUp, Activity, Calendar, AlertTriangle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/recovery")({
  head: () => ({
    meta: [
      { title: "Recovery Tracker — AI Health Assistant" },
      { name: "description", content: "Log weekly progress and let AI analyze your recovery trends." },
    ],
  }),
  component: Recovery,
});

type Entry = {
  week: string;
  notes: string;
  feeling: string;
  pain: number;
  energy: number;
  mobility: string;
};

const INITIAL: Entry[] = [
  { week: "Week 1", notes: "Felt stiff and tired most days", feeling: "Low", pain: 8, energy: 3, mobility: "Limited" },
  { week: "Week 2", notes: "Started light walks, sleeping better", feeling: "Okay", pain: 6, energy: 5, mobility: "Assisted" },
  { week: "Week 3", notes: "Walking unassisted, pain only at night", feeling: "Good", pain: 3, energy: 7, mobility: "Independent" },
];

function recoveryPercent(e: Entry): number {
  const painScore = (10 - e.pain) * 10;
  const energyScore = e.energy * 10;
  const mob = e.mobility === "Independent" ? 100 : e.mobility === "Assisted" ? 60 : 30;
  return Math.round((painScore + energyScore + mob) / 3);
}

function Recovery() {
  const [entries, setEntries] = useState<Entry[]>(INITIAL);
  const [draft, setDraft] = useState<Entry>({
    week: `Week ${INITIAL.length + 1}`,
    notes: "", feeling: "Good", pain: 3, energy: 7, mobility: "Independent",
  });

  function add(e: React.FormEvent) {
    e.preventDefault();
    setEntries((es) => [...es, draft]);
    setDraft({
      week: `Week ${entries.length + 2}`,
      notes: "", feeling: "Good", pain: Math.max(1, draft.pain - 1), energy: Math.min(10, draft.energy + 1), mobility: "Independent",
    });
  }

  const chartData = useMemo(
    () => entries.map((e) => ({ week: e.week, recovery: recoveryPercent(e), pain: e.pain, energy: e.energy })),
    [entries],
  );
  const latest = entries[entries.length - 1];
  const trend = entries.length > 1 ? recoveryPercent(latest) - recoveryPercent(entries[entries.length - 2]) : 0;
  const insight =
    trend >= 10 ? { tone: "good", text: "Your recovery is progressing well — pain is decreasing and energy is improving." } :
    trend >= 0 ? { tone: "ok", text: "Steady recovery. Maintain your current routine and check in next week." } :
    { tone: "warn", text: "Recovery appears to have slowed. A follow-up consultation is recommended." };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to home
        </Link>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Recovery Tracker</h1>
            <p className="mt-1 text-muted-foreground">Log how you feel each week. AI keeps an eye on your trends.</p>
          </div>
          <Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/10 hidden sm:inline-flex">
            <Activity className="mr-1 h-3 w-3" /> {entries.length} weeks logged
          </Badge>
        </div>

        {/* Dashboard */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <StatCard label="Latest recovery" value={`${recoveryPercent(latest)}%`} hint={trend >= 0 ? `+${trend}% vs last week` : `${trend}% vs last week`} accent="primary" />
          <StatCard label="Pain level" value={`${latest.pain}/10`} hint={latest.pain <= 3 ? "Mild" : latest.pain <= 6 ? "Moderate" : "Severe"} accent="warning" />
          <StatCard label="Energy" value={`${latest.energy}/10`} hint={latest.energy >= 7 ? "Strong" : latest.energy >= 4 ? "Steady" : "Low"} accent="secondary" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Recovery progress</h3>
              <Badge className="bg-secondary/15 text-secondary-foreground hover:bg-secondary/15"><TrendingUp className="mr-1 h-3 w-3" /> trend</Badge>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.17 245)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.72 0.14 165)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 230)" />
                  <XAxis dataKey="week" stroke="oklch(0.48 0.03 245)" fontSize={12} />
                  <YAxis stroke="oklch(0.48 0.03 245)" fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="recovery" stroke="oklch(0.55 0.17 245)" strokeWidth={2.5} fill="url(#rec)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
            <h3 className="font-display text-lg font-semibold">Pain vs Energy</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 230)" />
                  <XAxis dataKey="week" stroke="oklch(0.48 0.03 245)" fontSize={12} />
                  <YAxis stroke="oklch(0.48 0.03 245)" fontSize={12} domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="pain" stroke="oklch(0.65 0.2 25)" strokeWidth={2.5} dot />
                  <Line type="monotone" dataKey="energy" stroke="oklch(0.72 0.14 165)" strokeWidth={2.5} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI insight */}
        <div className={`mt-6 rounded-3xl border p-6 shadow-soft ${
          insight.tone === "good" ? "border-secondary/40 bg-secondary/10" :
          insight.tone === "warn" ? "border-destructive/30 bg-destructive/10" :
          "border-primary/30 bg-primary/5"
        }`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${
              insight.tone === "good" ? "bg-secondary" : insight.tone === "warn" ? "bg-destructive" : "bg-primary"
            }`}>
              {insight.tone === "warn" ? <AlertTriangle className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">AI Recovery Assistant</div>
              <p className="mt-1 text-sm">{insight.text}</p>
              {insight.tone === "warn" && (
                <Button asChild className="mt-4 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Link to="/appointment"><Calendar className="mr-2 h-4 w-4" /> Book Follow-Up Appointment</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Logger + entries */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={add} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Log this week</h3>
            <div className="mt-5 grid gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recovery Notes</Label>
                <Textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Describe how you've felt this week..." className="mt-1.5" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Feeling</Label>
                  <Select value={draft.feeling} onValueChange={(v) => setDraft({ ...draft, feeling: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Excellent", "Good", "Okay", "Low", "Bad"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mobility Status</Label>
                  <Select value={draft.mobility} onValueChange={(v) => setDraft({ ...draft, mobility: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Limited", "Assisted", "Independent"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Pain Level</span><span className="text-foreground">{draft.pain}/10</span>
                </Label>
                <Slider min={1} max={10} step={1} value={[draft.pain]} onValueChange={([v]) => setDraft({ ...draft, pain: v })} className="mt-3" />
              </div>
              <div>
                <Label className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Energy Level</span><span className="text-foreground">{draft.energy}/10</span>
                </Label>
                <Slider min={1} max={10} step={1} value={[draft.energy]} onValueChange={([v]) => setDraft({ ...draft, energy: v })} className="mt-3" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <UploadCard icon={Video} label="Upload walking / exercise video" accept="video/*" />
                <UploadCard icon={Upload} label="Upload recovery photo" accept="image/*" />
              </div>
              <Button type="submit" className="bg-care-gradient text-white shadow-glow">Save weekly entry</Button>
            </div>
          </form>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">History</h3>
            <ul className="mt-4 space-y-3">
              {entries.slice().reverse().map((e) => (
                <li key={e.week} className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{e.week}</div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{recoveryPercent(e)}%</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{e.notes || <em>No notes</em>}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Pill>Feeling: {e.feeling}</Pill>
                    <Pill>Pain: {e.pain}/10</Pill>
                    <Pill>Energy: {e.energy}/10</Pill>
                    <Pill>Mobility: {e.mobility}</Pill>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1">{children}</span>;
}

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint: string; accent: "primary" | "secondary" | "warning" }) {
  const color = accent === "primary" ? "bg-primary/10 text-primary" : accent === "secondary" ? "bg-secondary/15 text-secondary-foreground" : "bg-warning/15 text-warning-foreground";
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        <Activity className="h-4 w-4" />
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function UploadCard({ icon: Icon, label, accept }: { icon: any; label: string; accept: string }) {
  const [name, setName] = useState<string | null>(null);
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background p-4 text-center text-xs text-muted-foreground hover:border-primary hover:text-primary transition">
      <input type="file" accept={accept} className="hidden" onChange={(e) => setName(e.target.files?.[0]?.name ?? null)} />
      <Icon className="h-5 w-5" />
      <span>{name ?? label}</span>
    </label>
  );
}
