import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileText, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Medical Report Analyzer — AI Health Assistant" },
      { name: "description", content: "Upload blood, lab and prescription reports and get patient-friendly AI summaries." },
    ],
  }),
  component: Reports,
});

type Row = { label: string; value: string; status: "ok" | "low" | "high" };

const MOCK: Row[] = [
  { label: "Hemoglobin", value: "11.2 g/dL", status: "low" },
  { label: "Red Blood Cells", value: "4.6 M/µL", status: "ok" },
  { label: "White Blood Cells", value: "7,400 /µL", status: "ok" },
  { label: "Platelets", value: "240,000 /µL", status: "ok" },
  { label: "Total Cholesterol", value: "232 mg/dL", status: "high" },
  { label: "Fasting Glucose", value: "94 mg/dL", status: "ok" },
];

function Reports() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  function onFile(f: File | null) {
    setFile(f);
    setAnalyzed(false);
  }
  function analyze() {
    if (!file) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalyzed(true); }, 1100);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to home
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold">Medical Report Analyzer</h1>
        <p className="mt-1 text-muted-foreground">Upload blood reports, lab tests, or prescriptions — we'll explain them in plain language.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center shadow-soft transition hover:border-primary hover:bg-primary/5">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Upload className="h-7 w-7" />
              </div>
              <div className="mt-4 font-semibold">Click to upload a report</div>
              <div className="mt-1 text-xs text-muted-foreground">PDF, JPG or PNG — up to 20 MB</div>
              {file && (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-secondary/15 px-3 py-1.5 text-xs text-secondary-foreground">
                  <FileText className="h-3.5 w-3.5" /> {file.name}
                </div>
              )}
            </label>
            <Button onClick={analyze} disabled={!file || loading} className="mt-4 w-full bg-care-gradient text-white shadow-glow">
              <Sparkles className="mr-2 h-4 w-4" /> {loading ? "Analyzing..." : "Analyze Report"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo: this prototype generates a sample analysis. Connect Lovable AI to enable live OCR + LLM extraction.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4 text-primary" /> {analyzed ? file?.name : "Awaiting upload"}
                </div>
                {analyzed && <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/20">Analyzed</Badge>}
              </div>

              {!analyzed ? (
                <div className="mt-8 grid place-items-center py-14 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <FileText className="h-7 w-7" />
                  </div>
                  <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                    Upload a blood report, lab test or prescription on the left and click Analyze to see a patient-friendly breakdown here.
                  </p>
                </div>
              ) : (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold">Extracted values</h3>
                  <ul className="mt-3 space-y-2">
                    {MOCK.map((r) => (
                      <li key={r.label} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">{r.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{r.value}</span>
                          {r.status === "ok" && <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/20">Normal</Badge>}
                          {r.status === "low" && <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/20">Low</Badge>}
                          {r.status === "high" && <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15">High</Badge>}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-2xl bg-primary/5 p-4 text-sm leading-relaxed">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> Patient-friendly summary</div>
                    Your hemoglobin appears slightly below the normal range, which may cause tiredness. Your cholesterol is moderately high — consider dietary adjustments. Other values look healthy. Please discuss with your doctor before changing any medication.
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Shareable with your doctor</span>
                    <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Stored privately to this session</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
