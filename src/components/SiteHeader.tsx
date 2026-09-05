import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/devyora-logo.svg";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="DevyoraMEDai logo" className="h-9 w-9 rounded-xl shadow-glow object-cover" />
          <div className="leading-tight">
            <div className="font-display text-base font-bold">DevyoraMEDai</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Care, intelligently</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/symptom-analyzer" className="hover:text-foreground transition">Symptom AI</Link>
          <Link to="/reports" className="hover:text-foreground transition">Reports</Link>
          <Link to="/recovery" className="hover:text-foreground transition">Recovery</Link>
          <Link to="/doctor-dashboard" className="hover:text-foreground transition">For Doctors</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/appointment">Book Appointment</Link>
          </Button>
          <Button asChild size="sm" className="bg-care-gradient text-white hover:opacity-95">
            <Link to="/symptom-analyzer">Try Symptom AI</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
