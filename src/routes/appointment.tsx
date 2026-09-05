import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, CheckCircle2, ArrowLeft, Stethoscope, User as UserIcon, Phone, Mail, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/lib/supabase";
export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book Appointment — AI Health Assistant" },
      { name: "description", content: "Book an appointment with a qualified doctor in seconds." },
    ],
  }),
  component: Appointment,
});

const DOCTORS = [
  "Dr. Koteswara — Orthopedic Surgeon",
  "Dr. Anil Sharma — General Physician",
  "Dr. Priya Nair — Internal Medicine",
  "Dr. Rajiv Khanna — Cardiologist",
  "Dr. Meera Iyer — Pediatrician",
  "Dr. Sameer Ali — Dermatologist",
  "Dr. Hassan Omar — ENT Specialist",
  "Dr. Naomi Park — Neurologist",
];
const TIMES = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];

function Appointment() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "", doctor: "" });
  const [confirmed, setConfirmed] = useState<typeof form | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
  e.preventDefault();

  try {
    // save appointment here

    setConfirmed(form);
  } catch (err) {
    console.error(err);
    alert("Failed to book appointment");
  }
}

  function reschedule() {
    setConfirmed(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to home
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold">Book a Doctor Appointment</h1>
        <p className="mt-1 text-muted-foreground">Find the right specialist for any concern — across every medical field.</p>

        {confirmed ? (
          <Confirmation appt={confirmed} onReschedule={reschedule} />
        ) : (
          <form onSubmit={submit} className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Patient Name" icon={UserIcon}>
                <Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" />
              </Field>
              <Field label="Phone Number" icon={Phone}>
                <Input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 123 4567" />
              </Field>
              <Field label="Email" icon={Mail}>
                <Input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
              </Field>
              <Field label="Doctor" icon={Stethoscope}>
                <Select value={form.doctor} onValueChange={(v) => set("doctor", v)}>
                  <SelectTrigger><SelectValue placeholder="Choose a specialist" /></SelectTrigger>
                  <SelectContent>
                    {DOCTORS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Preferred Date" icon={Calendar}>
                <Input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              </Field>
              <Field label="Preferred Time" icon={Clock}>
                <Select value={form.time} onValueChange={(v) => set("time", v)}>
                  <SelectTrigger><SelectValue placeholder="Choose a slot" /></SelectTrigger>
                  <SelectContent>
                    {TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button type="submit" size="lg" className="bg-care-gradient text-white shadow-glow"
                disabled={!form.name || !form.phone || !form.email || !form.date || !form.time || !form.doctor}>
                Book Appointment
              </Button>
              <Button type="button" size="lg" variant="outline" onClick={() => setForm({ name: "", phone: "", email: "", date: "", time: "", doctor: "" })}>
                Clear
              </Button>
            </div>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </Label>
      {children}
    </div>
  );
}

function Confirmation({ appt, onReschedule }: { appt: any; onReschedule: () => void }) {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-secondary/40 bg-card shadow-card">
      <div className="bg-care-gradient p-8 text-white">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8" />
          <h2 className="font-display text-2xl font-bold">Appointment Confirmed</h2>
        </div>
        <p className="mt-2 text-white/85">We've sent the details to {appt.email}.</p>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2 md:p-8">
        <Detail label="Patient" value={appt.name} />
        <Detail label="Doctor" value={appt.doctor} />
        <Detail label="Date" value={appt.date} />
        <Detail label="Time" value={appt.time} />
        <Detail label="Phone" value={appt.phone} />
        <Detail label="Email" value={appt.email} />
      </div>
      <div className="flex flex-wrap gap-3 border-t border-border bg-muted/40 p-6">
        <Button onClick={onReschedule} variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Reschedule</Button>
        <Button asChild className="bg-primary-gradient text-white">
          <Link to="/recovery">Go to Recovery Tracker</Link>
        </Button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
