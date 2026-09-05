import { Link } from "@tanstack/react-router";
import { Activity, ShieldAlert } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-care-gradient text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">AI Health Assistant</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A complete patient journey platform — from understanding your first symptom to tracking your full recovery, powered by clinical-grade AI.
          </p>
        </div>
        <FooterCol title="Product" links={[
          ["Symptom AI", "/symptom-analyzer"],
          ["Reports", "/reports"],
          ["Recovery", "/recovery"],
          ["Appointments", "/appointment"],
        ]} />
        <FooterCol title="Company" links={[
          ["About", "/"],
          ["Doctors", "/doctor-dashboard"],
          ["Contact", "/"],
        ]} />
        <FooterCol title="Legal" links={[
          ["Privacy Policy", "/"],
          ["Terms of Service", "/"],
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} AI Health Assistant. All rights reserved.</p>
          <p className="flex items-start gap-2 md:max-w-2xl md:justify-end md:text-right">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            This AI assistant does not replace professional medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="hover:text-foreground transition">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
