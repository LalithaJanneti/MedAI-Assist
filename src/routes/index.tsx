import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope, Activity, Brain, ShieldCheck, FileText, HeartPulse,
  Sparkles, MessageSquareText, Calendar, ClipboardList, LineChart,
  ArrowRight, CheckCircle2, AlertTriangle, UserCheck, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/hero-health.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Health Assistant — Smarter Healthcare with AI" },
      { name: "description", content: "Personalized symptom guidance, medical report analysis, doctor appointments, and AI-powered recovery tracking — all in one healthcare platform." },
      { property: "og:title", content: "AI Health Assistant — Smarter Healthcare with AI" },
      { property: "og:description", content: "From your first symptom to your full recovery — guided by intelligent, doctor-friendly AI." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <JourneyCards />
      <ReportAnalyzer />
      <RecoveryPreview />
      <DoctorPreview />
      <TechShowcase />
      <Testimonials />
      <CTASection />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="container relative mx-auto grid items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-2">
        <div>
          <Badge className="mb-5 border-primary/20 bg-primary/10 text-primary hover:bg-primary/10">
            <Sparkles className="mr-1 h-3 w-3" /> AI-powered patient companion
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Smarter Healthcare with{" "}
            <span className="text-gradient">AI Assistance</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Get personalized symptom guidance, upload medical reports, connect with doctors, and track your recovery journey — all in one trusted platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-care-gradient text-white shadow-glow hover:opacity-95">
              <Link to="/symptom-analyzer">
                <MessageSquareText className="mr-2 h-5 w-5" /> Try Symptom Analyzer
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/appointment">
                <Calendar className="mr-2 h-5 w-5" /> Book Appointment
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 text-center">
            {[
              ["50k+", "Patients guided"],
              ["1.2k+", "Doctors onboard"],
              ["98%", "Trust rating"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold text-foreground">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-care-gradient opacity-20 blur-3xl" />
          <div className="relative animate-float overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <img src={heroImg} alt="Patient using AI healthcare assistant while doctor reviews insights" width={1280} height={960} className="h-auto w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 shadow-card md:-left-8">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <HeartPulse className="h-5 w-5" />
              <span className="absolute inset-0 animate-pulse-ring rounded-xl" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Live vitals</div>
              <div className="text-sm font-semibold">Recovery 87% on track</div>
            </div>
          </div>
          <div className="absolute -top-4 -right-3 hidden items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 shadow-card md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">AI insight</div>
              <div className="text-sm font-semibold">3 follow-ups suggested</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: MessageSquareText, title: "Describe symptoms", desc: "Tell our AI how you feel — naturally, in your own words." },
    { icon: Brain, title: "Smart follow-ups", desc: "AI asks intelligent questions tailored to your case." },
    { icon: Activity, title: "Severity check", desc: "Instant low / medium / high risk classification." },
    { icon: Calendar, title: "Book a doctor", desc: "Get the right specialist when one is actually needed." },
    { icon: Stethoscope, title: "Receive treatment", desc: "Connect, share reports, and follow the care plan." },
    { icon: LineChart, title: "Track recovery", desc: "Weekly check-ins and AI insights until you're well." },
  ];
  return (
    <section className="container mx-auto px-4 py-24">
      <SectionHeader
        eyebrow="The patient journey"
        title="How it works, end-to-end"
        subtitle="One platform that walks with you before, during and after the doctor visit."
      />
      <div className="relative mt-14 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
        {steps.map((s, i) => (
          <div key={s.title} className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
            <div className="absolute -top-3 left-5 rounded-full bg-care-gradient px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Step {i + 1}</div>
            <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function JourneyCards() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-6 lg:grid-cols-2">
        <JourneyCard
          to="/symptom-analyzer"
          tag="Before Doctor"
          title="Before Doctor Consultation"
          desc="Understand your symptoms before visiting a doctor."
          features={[
            "AI Symptom Analyzer",
            "Intelligent Follow-up Questions",
            "Severity Detection",
            "Health Guidance",
            "Appointment Recommendation",
          ]}
          accent="primary"
          icon={Brain}
        />
        <JourneyCard
          to="/recovery"
          tag="After Doctor"
          title="After Doctor Consultation"
          desc="Track recovery and stay connected with your healthcare journey."
          features={[
            "Weekly Progress Entry",
            "Pain & Energy Tracking",
            "Upload Recovery Videos",
            "AI Trend Analysis",
            "Follow-up Recommendations",
          ]}
          accent="secondary"
          icon={LineChart}
        />
      </div>
    </section>
  );
}

function JourneyCard({
  to, tag, title, desc, features, accent, icon: Icon,
}: {
  to: string; tag: string; title: string; desc: string; features: string[];
  accent: "primary" | "secondary"; icon: any;
}) {
  return (
    <Link to={to} className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className={`absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl ${accent === "primary" ? "bg-primary/20" : "bg-secondary/30"}`} />
      <Badge className="relative border-transparent bg-foreground/5 text-foreground/70 hover:bg-foreground/5">{tag}</Badge>
      <div className="relative mt-5 flex items-start gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${accent === "primary" ? "bg-primary" : "bg-secondary"}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold">{title}</h3>
          <p className="mt-1 text-muted-foreground">{desc}</p>
        </div>
      </div>
      <ul className="relative mt-6 grid gap-2 sm:grid-cols-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            {f}
          </li>
        ))}
      </ul>
      <div className="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Open this experience <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ReportAnalyzer() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-8 shadow-soft md:p-12 lg:grid-cols-2">
        <div>
          <Badge className="border-secondary/30 bg-secondary/15 text-secondary-foreground">Medical Report AI</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Upload reports. Get answers in plain language.</h2>
          <p className="mt-3 text-muted-foreground">
            PDFs, lab results, prescriptions and scan reports — our AI extracts the values, highlights anything outside normal range, and explains it in language you actually understand.
          </p>
          <ul className="mt-6 grid gap-3 text-sm">
            {[
              "Supports PDF, JPG and PNG uploads",
              "Highlights abnormal values automatically",
              "Patient-friendly summaries in seconds",
              "Shareable with your treating doctor",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" />{f}</li>
            ))}
          </ul>
          <Button asChild className="mt-7 bg-primary-gradient text-white shadow-glow">
            <Link to="/reports"><FileText className="mr-2 h-4 w-4" /> Try the Report Analyzer</Link>
          </Button>
        </div>
        <div className="relative">
          <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-primary" /> blood_report_oct.pdf
              </div>
              <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/20">Analyzed</Badge>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <ResultRow label="Hemoglobin" value="11.2 g/dL" status="low" />
              <ResultRow label="WBC" value="7,400 /µL" status="ok" />
              <ResultRow label="Platelets" value="240k /µL" status="ok" />
              <ResultRow label="Cholesterol" value="232 mg/dL" status="high" />
            </ul>
            <div className="mt-4 rounded-xl bg-primary/5 p-3 text-xs text-primary">
              Your hemoglobin appears slightly below the normal range. Consider iron-rich foods and discuss supplementation with your doctor.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultRow({ label, value, status }: { label: string; value: string; status: "ok" | "low" | "high" }) {
  const badge = status === "ok"
    ? <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/20">Normal</Badge>
    : status === "low"
      ? <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/20">Low</Badge>
      : <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15">High</Badge>;
  return (
    <li className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-semibold">{value}</span>{badge}
      </div>
    </li>
  );
}

function RecoveryPreview() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Badge className="border-secondary/30 bg-secondary/15 text-secondary-foreground">Recovery</Badge>
          <h2 className="mt-3 font-display text-3xl font-bold">Healing, tracked weekly</h2>
          <p className="mt-3 text-muted-foreground">
            Patients log how they feel, upload progress videos, and our AI translates raw notes into trend lines doctors can read in seconds.
          </p>
          <Button asChild className="mt-5" variant="outline">
            <Link to="/recovery">Open Recovery Tracker <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {[
            { w: "Week 1", p: 30 },
            { w: "Week 2", p: 50 },
            { w: "Week 3", p: 75 },
            { w: "Week 4", p: 95 },
          ].map((r) => (
            <div key={r.w} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{r.w}</span>
                <span className="text-sm font-semibold">{r.p}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-care-gradient" style={{ width: `${r.p}%` }} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {r.p < 50 ? "Early-stage recovery. Light activity recommended." : r.p < 80 ? "Pain trending down, mobility improving." : "Near full recovery — maintain routine."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorPreview() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="overflow-hidden rounded-3xl border border-border bg-foreground text-background shadow-card">
        <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-2">
          <div>
            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">For Doctors</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">A clean cockpit for every consultation</h2>
            <p className="mt-3 text-white/70">
              Patients arrive pre-briefed. Doctors see symptom summaries, uploaded reports, AI risk alerts and recovery progress on one screen — across every specialty.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-white/80">
              {[
                "AI symptom summary per patient",
                "Uploaded reports with abnormal values flagged",
                "Recovery progress and risk alerts",
                "Follow-up recommendations ready to send",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" />{f}</li>
              ))}
            </ul>
            <Button asChild className="mt-7 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/doctor-dashboard">Open Doctor Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Today's queue</div>
              <span className="text-white/50">8 patients</span>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { n: "Aarav Mehta", s: "Chest discomfort, 2 days", r: "high" },
                { n: "Sara Khan", s: "Recurring migraines", r: "medium" },
                { n: "John Doe", s: "Post-op recovery check", r: "low" },
              ].map((p) => (
                <li key={p.n} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div>
                    <div className="font-semibold">{p.n}</div>
                    <div className="text-xs text-white/60">{p.s}</div>
                  </div>
                  <Badge className={
                    p.r === "high" ? "bg-destructive text-destructive-foreground" :
                    p.r === "medium" ? "bg-warning text-warning-foreground" :
                    "bg-secondary text-secondary-foreground"
                  }>
                    {p.r === "high" && <AlertTriangle className="mr-1 h-3 w-3" />}
                    {p.r.toUpperCase()}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechShowcase() {
  const tags = [
    "Artificial Intelligence", "Natural Language Processing", "Machine Learning",
    "Medical Report Analysis", "Recovery Tracking", "Secure Healthcare Platform",
  ];
  return (
    <section className="container mx-auto px-4 py-16">
      <SectionHeader
        eyebrow="Technology"
        title="Built with clinical-grade rigor"
        subtitle="Powered by modern AI, designed for trust."
      />
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium shadow-soft">
            <Sparkles className="mr-2 inline h-3.5 w-3.5 text-primary" />{t}
          </span>
        ))}
      </div>
      <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-secondary" /> HIPAA-conscious architecture · End-to-end encryption · Doctor-reviewed
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { n: "Priya R.", role: "Patient · Asthma", quote: "Before my appointment I already had a clear summary. My doctor said it was the most prepared consultation she'd had all week." },
    { n: "Dr. Anil S.", role: "General Physician", quote: "AI pre-triage means I spend my time on care, not on paperwork. Recovery tracking is a game changer for follow-ups." },
    { n: "Maya T.", role: "Post-op patient", quote: "Logging my recovery weekly kept me motivated. The AI flagged a setback early and my doctor adjusted my plan." },
  ];
  return (
    <section className="container mx-auto px-4 py-24">
      <SectionHeader
        eyebrow="Stories"
        title="From first symptom to full recovery"
        subtitle="Real patients, real doctors, real outcomes."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.n} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <Quote className="h-7 w-7 text-primary/40" />
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-care-gradient text-sm font-bold text-white">
                {t.n.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.n}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="container mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl bg-care-gradient p-10 text-white shadow-glow md:p-14">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h3 className="font-display text-2xl font-bold md:text-3xl">Ready to meet your AI health companion?</h3>
            <p className="mt-2 max-w-2xl text-white/85">Start with a free symptom check — no sign up needed for the prototype.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/symptom-analyzer"><ClipboardList className="mr-2 h-4 w-4" /> Start Symptom AI</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to="/appointment">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/10">{eyebrow}</Badge>
      <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
