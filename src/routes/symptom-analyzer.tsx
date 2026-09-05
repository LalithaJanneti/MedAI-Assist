import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, User, Sparkles, AlertTriangle, ShieldCheck, Calendar, ArrowLeft, RotateCcw, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PatientDetailsForm, type PatientDetails } from "@/components/PatientDetailsForm";
import {
  analyzeSeverity,
  nextFollowUp,
  type AnalyzerState,
  type Severity,
} from "@/lib/symptom-ai";
import {
  savePatientRecord,
  initiateAICall,
  generateAICallScript,
  bookAppointment,
  updatePatientAppointment,
  updatePatientRecord,
  type PatientRecord,
} from "@/lib/api/patient-management";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { testSupabaseConnection } from "@/lib/testSupabase";
export const Route = createFileRoute("/symptom-analyzer")({
  head: () => ({
    meta: [
      { title: "Symptom Analyzer — AI Health Assistant" },
      { name: "description", content: "Chat with our AI to understand your symptoms before seeing a doctor." },
    ],
  }),
  component: SymptomAnalyzer,
});

type Msg =
  | { role: "ai"; content: string }
  | { role: "user"; content: string }
  | { role: "result"; severity: Severity; summary: string; advice: string[]; onBook?: () => void };

const STARTER = "Hello 👋 I'm your AI health assistant. Can I know how you feel today? Describe your symptoms in your own words.";
const EXAMPLES = ["I have fever", "I have chest pain", "I have stomach discomfort", "My skin is itchy", "I feel tired all the time"];

interface AnalyzerSessionState {
  messages: Msg[];
  input: string;
  state: AnalyzerState;
  pendingQ: string | null;
  thinking: boolean;
  // Patient registration state
  showPatientForm: boolean;
  patientDetails: PatientDetails | null;
  patientLoading: boolean;
  patientError: string | null;
  patientRecord: PatientRecord | null;
  // AI call state
  showAICallDialog: boolean;
  aiCallScheduled: boolean;
  aiCallInitiated: boolean;
  aiCallScript: string | null;
  aiCallMessage: string | null;
  // Appointment booking state
  showAppointmentDialog: boolean;
  appointmentDate: string;
  appointmentTime: string;
  appointmentLoading: boolean;
  appointmentError: string | null;
  appointmentSuccess: string | null;
}

function SymptomAnalyzer() {
  const [analyzerState, setAnalyzerState] = useState<AnalyzerSessionState>({
    messages: [{ role: "ai", content: STARTER }],
    input: "",
    state: { symptoms: "", answers: {}, asked: [], finished: false },
    pendingQ: null,
    thinking: false,
    showPatientForm: false,
    patientDetails: null,
    patientLoading: false,
    patientError: null,
    patientRecord: null,
    showAICallDialog: false,
    aiCallScheduled: false,
    aiCallInitiated: false,
    aiCallScript: null,
    aiCallMessage: null,
    showAppointmentDialog: false,
    appointmentDate: "",
    appointmentTime: "",
    appointmentLoading: false,
    appointmentError: null,
    appointmentSuccess: null,
  });

  const scroller = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(crypto.randomUUID());

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [analyzerState.messages, analyzerState.thinking]);

  // Run the database test exactly once when the component first mounts
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  async function handlePatientDetailsSubmit(details: PatientDetails) {
    setAnalyzerState((s) => ({
      ...s,
      patientLoading: true,
      patientError: null,
    }));

    try {
      // Save patient record
      const record = await savePatientRecord(
        sessionIdRef.current,
        details,
        analyzerState.state.symptoms,
        "medium", // Will be updated after analysis
        "Patient information received. Starting symptom analysis..."
      );
      localStorage.setItem(
        "patientId",
        record.id
      );

      setAnalyzerState((s) => ({
        ...s,
        patientDetails: details,
        patientRecord: record,
        showPatientForm: false,
        patientLoading: false,
        messages: [
          ...s.messages,
          {
            role: "ai",
            content: `Thank you, ${details.name}! I've saved your information. Now, let's discuss your symptoms in more detail so I can provide the best assessment.`,
          },
        ],
      }));
    } catch (error) {
      setAnalyzerState((s) => ({
        ...s,
        patientLoading: false,
        patientError: error instanceof Error ? error.message : "Failed to save patient information",
      }));
    }

  // This function will be called by PatientDetailsForm on validation failure
  function handlePatientDetailsValidationFail(errors: Record<string, string>) {
    const errorMessages = Object.values(errors).join(" ");
    setAnalyzerState((s) => ({
      ...s,
      patientLoading: false,
      // Display a generic message, but individual fields will show specific errors.
      // Or, you could concatenate them.
      patientError: "Please correct the errors in the form.",
    }));
  }
  }

  async function initiateAICallAndBooking(severity: Severity, summary: string, advice: string[]) {
    const patientRecord = analyzerState.patientRecord;
    const patientDetails = analyzerState.patientDetails;
    if (!patientRecord || !patientDetails) return;

    const script = generateAICallScript(
      patientDetails.name,
      severity,
      summary,
      advice
    );

    setAnalyzerState((s) => ({
      ...s,
      showAICallDialog: true,
      aiCallScheduled: true,
      aiCallInitiated: true,
      aiCallScript: script,
      aiCallMessage: `AI call will be placed to ${patientDetails.phone} within 60 seconds. The AI will summarize your situation and ask if you would like to book an appointment with a preferred date and time slot.`,
    }));

    try {
      // Initiate the AI call (this will execute within ~60 seconds)
      setTimeout(() => {
        initiateAICall(patientRecord.id, patientDetails, {
          symptoms: analyzerState.state.symptoms,
          severity,
          summary,
          advice,
        }).catch((error) => {
          console.error("AI call initiation failed:", error);
          setAnalyzerState((s) => ({
            ...s,
            patientError: "Failed to initiate AI call. Please try booking manually.",
          }));
        });
      }, 1000);
    } catch (error) {
      console.error("Error preparing AI call:", error);
      setAnalyzerState((s) => ({
        ...s,
        patientError: error instanceof Error ? error.message : "Failed to initiate AI call",
      }));
    }
  }

  async function handleBookAppointment() {
    if (!analyzerState.patientRecord || !analyzerState.appointmentDate || !analyzerState.appointmentTime) {
      setAnalyzerState((s) => ({
        ...s,
        appointmentError: "Please choose a date and time before booking.",
      }));
      return;
    }

    setAnalyzerState((s) => ({
      ...s,
      appointmentLoading: true,
      appointmentError: null,
      appointmentSuccess: null,
    }));

    try {
      const appointment = await bookAppointment(
        analyzerState.patientRecord.id,
        analyzerState.appointmentDate,
        analyzerState.appointmentTime
      );

      await updatePatientAppointment(
        analyzerState.patientRecord.id,
        analyzerState.appointmentDate,
        analyzerState.appointmentTime,
        appointment.appointmentId
      );

      setAnalyzerState((s) => ({
        ...s,
        appointmentLoading: false,
        appointmentSuccess: appointment.message,
        showAppointmentDialog: false,
        messages: [
          ...s.messages,
          {
            role: "ai",
            content: `Your appointment is confirmed for ${s.appointmentDate} at ${s.appointmentTime}. Appointment ID: ${appointment.appointmentId}. A confirmation has been sent to ${s.patientDetails?.email ?? 'your email'}.`,
          },
        ],
      }));
    } catch (error) {
      setAnalyzerState((s) => ({
        ...s,
        appointmentLoading: false,
        appointmentError: error instanceof Error ? error.message : "Failed to book appointment",
      }));
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || analyzerState.state.finished) return;

    setAnalyzerState((s) => ({
      ...s,
      input: "",
      messages: [...s.messages, { role: "user", content: trimmed }],
    }));

    const isInitial = !analyzerState.state.symptoms;
    let newAnalyzerState = analyzerState.state;

    if (isInitial) {
      newAnalyzerState = { ...analyzerState.state, symptoms: trimmed };
      // Show patient form on first symptom
      setAnalyzerState((s) => ({
        ...s,
        state: newAnalyzerState,
        showPatientForm: true,
      }));
      return;
    } else if (analyzerState.pendingQ) {
      newAnalyzerState = {
        ...analyzerState.state,
        answers: { ...analyzerState.state.answers, [analyzerState.pendingQ]: trimmed },
        asked: analyzerState.state.asked.includes(analyzerState.pendingQ)
          ? analyzerState.state.asked
          : [...analyzerState.state.asked, analyzerState.pendingQ],
      };
    } else {
      newAnalyzerState = {
        ...analyzerState.state,
        symptoms: analyzerState.state.symptoms + " " + trimmed,
      };
    }

    setAnalyzerState((s) => ({
      ...s,
      state: newAnalyzerState,
      thinking: true,
    }));

    setTimeout(() => {
      const totalAnswered = Object.keys(newAnalyzerState.answers).length + (isInitial ? 0 : 1);
      const enough = totalAnswered >= 4;

      if (enough) {
        const result = analyzeSeverity(newAnalyzerState);
        const onBook = () => setAnalyzerState((s) => ({ ...s, showAppointmentDialog: true }));

        setAnalyzerState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            { role: "ai", content: "Thank you. Based on what you've shared, here's my preliminary assessment:" },
            { role: "result", ...result, onBook },
            { role: "ai", content: "Would you like me to book a doctor appointment with your preferred date and time slot?" },
          ],
          state: { ...newAnalyzerState, finished: true },
          pendingQ: null,
          thinking: false,
        }));

        if (analyzerState.patientRecord) {
          updatePatientRecord(analyzerState.patientRecord.id, {
            severity: result.severity,
            summary: result.summary,
          }).catch((error) => console.error("Failed to update patient record:", error));
        }

        // Initiate AI call after 2 seconds if patient details are saved
        setTimeout(() => {
          initiateAICallAndBooking(result.severity, result.summary, result.advice);
        }, 2000);
      } else {
        const fu = nextFollowUp(newAnalyzerState);
        if (!fu) {
          const result = analyzeSeverity(newAnalyzerState);
          const appointmentOnBook = () => setAnalyzerState((s) => ({ ...s, showAppointmentDialog: true }));
          setAnalyzerState((s) => ({
            ...s,
            messages: [
              ...s.messages,
              { role: "ai", content: "Here is my preliminary assessment:" },
              { role: "result", ...result, onBook: appointmentOnBook },
              { role: "ai", content: "Would you like me to book a doctor appointment with your preferred date and time slot?" },
            ],
            state: { ...newAnalyzerState, finished: true },
            pendingQ: null,
            thinking: false,
          }));

          if (analyzerState.patientRecord) {
            updatePatientRecord(analyzerState.patientRecord.id, {
              severity: result.severity,
              summary: result.summary,
            }).catch((error) => console.error("Failed to update patient record:", error));
          }

          // Initiate AI call
          setTimeout(() => {
            initiateAICallAndBooking(result.severity, result.summary, result.advice);
          }, 2000);
        } else {
          setAnalyzerState((s) => ({
            ...s,
            messages: [...s.messages, { role: "ai", content: fu.question }],
            state: { ...newAnalyzerState, asked: [...newAnalyzerState.asked, fu.id] },
            pendingQ: fu.id,
            thinking: false,
          }));
        }
      }
    }, 700);
  }

  function reset() {
    setAnalyzerState({
      messages: [{ role: "ai", content: STARTER }],
      input: "",
      state: { symptoms: "", answers: {}, asked: [], finished: false },
      pendingQ: null,
      thinking: false,
      showPatientForm: false,
      patientDetails: null,
      patientLoading: false,
      patientError: null,
      patientRecord: null,
      showAICallDialog: false,
      aiCallScheduled: false,
      aiCallInitiated: false,
      aiCallScript: null,
      aiCallMessage: null,
      showAppointmentDialog: false,
      appointmentDate: "",
      appointmentTime: "",
      appointmentLoading: false,
      appointmentError: null,
      appointmentSuccess: null,
    });
    sessionIdRef.current = crypto.randomUUID();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="container mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to home
            </Link>
            <h1 className="mt-2 font-display text-3xl font-bold">AI Symptom Analyzer</h1>
            <p className="text-sm text-muted-foreground">A safe, conversational pre-triage. Not a substitute for a doctor.</p>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Restart
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-care-gradient text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Health AI</div>
              <div className="text-xs text-muted-foreground">
                Online · responses are private to this session
                {analyzerState.patientDetails && (
                  <span className="ml-2 text-primary font-medium">
                    {analyzerState.patientDetails.name}
                  </span>
                )}
              </div>
            </div>
            <Badge className="ml-auto border-secondary/30 bg-secondary/15 text-secondary-foreground hover:bg-secondary/15">
              <ShieldCheck className="mr-1 h-3 w-3" /> Secure
            </Badge>
          </div>

          <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-5 py-6" style={{ maxHeight: "60vh" }}>
            {analyzerState.messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
            {analyzerState.thinking && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-care-gradient text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                  <Dot /><Dot delay={120} /><Dot delay={240} />
                </div>
              </div>
            )}
          </div>

          {!analyzerState.state.symptoms && (
            <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 px-5 py-3">
              {EXAMPLES.map((e) => (
                <button key={e} onClick={() => send(e)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary hover:text-primary transition">
                  {e}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(analyzerState.input); }}
            className="flex items-center gap-2 border-t border-border bg-background p-3"
          >
            <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <input
                value={analyzerState.input}
                onChange={(e) => setAnalyzerState((s) => ({ ...s, input: e.target.value }))}
                disabled={analyzerState.state.finished || analyzerState.showPatientForm}
                placeholder={
                  analyzerState.state.finished
                    ? "Conversation complete — restart to begin again"
                    : analyzerState.showPatientForm
                      ? "Please complete your information first"
                      : "Type your message..."
                }
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
              />
            </div>
            <Button
              type="submit"
              disabled={analyzerState.state.finished || !analyzerState.input.trim() || analyzerState.showPatientForm}
              className="bg-care-gradient text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Patient Details Form Modal */}
        <Dialog open={analyzerState.showPatientForm} onOpenChange={(open) => {
          if (!open && analyzerState.patientLoading) return; // Don't close while loading
          setAnalyzerState((s) => ({ ...s, showPatientForm: open }));
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Health Information</DialogTitle>
              <DialogDescription>
                We need your contact details to provide personalized care and connect you with a doctor
              </DialogDescription>
            </DialogHeader>
            <PatientDetailsForm
              onSubmit={handlePatientDetailsSubmit}
              isLoading={analyzerState.patientLoading}
              onValidationFail={handlePatientDetailsValidationFail}
              error={analyzerState.patientError}
            />
          </DialogContent>
        </Dialog>

        {/* AI Call Dialog */}
        <Dialog open={analyzerState.showAICallDialog} onOpenChange={(open) =>
          setAnalyzerState((s) => ({ ...s, showAICallDialog: open }))
        }>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary animate-pulse" />
                AI Doctor Call
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Call Initiated</p>
                    <p className="text-xs text-muted-foreground">
                      Our AI will call you on {analyzerState.patientDetails?.phone} within the next 60 seconds
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Call Script:</p>
                  <p className="text-sm leading-relaxed text-foreground italic">
                    "{analyzerState.aiCallScript}"
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-3">
                <p className="text-xs text-amber-900 dark:text-amber-100">
                  💡 <strong>Tip:</strong> Make sure you're in a quiet place and ready to discuss your preferred appointment date and time with the AI.
                </p>
              </div>

              <Button
                className="w-full bg-care-gradient text-white"
                onClick={() => setAnalyzerState((s) => ({ ...s, showAICallDialog: false }))}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Go to Appointment Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Appointment Booking Dialog */}
        <Dialog open={analyzerState.showAppointmentDialog} onOpenChange={(open) =>
          setAnalyzerState((s) => ({ ...s, showAppointmentDialog: open }))
        }>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book a Doctor Appointment</DialogTitle>
              <DialogDescription>
                Select your preferred date and time so the AI can finalize booking after your call.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-medium">
                  Preferred Date
                  <input
                    type="date"
                    value={analyzerState.appointmentDate}
                    onChange={(e) => setAnalyzerState((s) => ({ ...s, appointmentDate: e.target.value }))}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium">
                  Preferred Time
                  <input
                    type="time"
                    value={analyzerState.appointmentTime}
                    onChange={(e) => setAnalyzerState((s) => ({ ...s, appointmentTime: e.target.value }))}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                  />
                </label>
              </div>

              {analyzerState.appointmentError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                  {analyzerState.appointmentError}
                </div>
              )}

              {analyzerState.appointmentSuccess && (
                <div className="rounded-lg bg-primary/10 border border-primary/30 p-3 text-sm text-primary-foreground">
                  {analyzerState.appointmentSuccess}
                </div>
              )}

              <Button
                className="w-full bg-care-gradient text-white"
                onClick={handleBookAppointment}
                disabled={analyzerState.appointmentLoading}
              >
                {analyzerState.appointmentLoading ? "Booking appointment..." : "Confirm Appointment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <SiteFooter />
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${delay}ms` }} />;
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "result") return <SeverityCard severity={msg.severity} summary={msg.summary} advice={msg.advice} onBook={msg.onBook} />;
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-primary text-primary-foreground" : "bg-care-gradient text-white"}`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
        {msg.content}
      </div>
    </div>
  );
}

function SeverityCard({ severity, summary, advice, onBook }: { severity: Severity; summary: string; advice: string[]; onBook?: () => void }) {
  const config = {
    low: { label: "Low Severity", tone: "bg-secondary/15 border-secondary/40 text-secondary-foreground", chip: "bg-secondary text-secondary-foreground", icon: ShieldCheck },
    medium: { label: "Medium Severity", tone: "bg-warning/15 border-warning/40 text-warning-foreground", chip: "bg-warning text-warning-foreground", icon: Sparkles },
    high: { label: "High Severity", tone: "bg-destructive/10 border-destructive/40 text-destructive", chip: "bg-destructive text-destructive-foreground", icon: AlertTriangle },
  }[severity];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border-2 p-5 ${config.tone}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.chip}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">AI Assessment</div>
          <div className="font-display text-lg font-bold">{config.label}</div>
        </div>
      </div>
      <p className="mt-4 text-sm">{summary}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {advice.map((a) => <li key={a} className="flex gap-2"><span>•</span><span>{a}</span></li>)}
      </ul>
      {onBook ? (
        <Button size="lg" className="mt-5 w-full bg-care-gradient text-white shadow-glow" onClick={onBook}>
          <Calendar className="mr-2 h-5 w-5" />
          {severity === "high" ? "Book Appointment Now — Urgent" : "Book Appointment"}
        </Button>
      ) : severity !== "low" ? (
        <Button asChild size="lg" className="mt-5 w-full bg-care-gradient text-white shadow-glow">
          <Link to="/appointment">
            <Calendar className="mr-2 h-5 w-5" />
            {severity === "high" ? "Book Appointment Now — Urgent" : "Book Appointment"}
          </Link>
        </Button>
      ) : (
        <div className="mt-4 text-xs opacity-80">
          If symptoms persist beyond 3 days, please <Link to="/appointment" className="underline font-semibold">book a consultation</Link>.
        </div>
      )}
    </div>
  );
}
