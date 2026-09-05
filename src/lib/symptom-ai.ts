// Lightweight rule-based "AI" for the prototype symptom analyzer.
// Picks intelligent follow-up questions based on previously collected answers,
// then classifies severity from accumulated keywords.

export type Severity = "low" | "medium" | "high";

export interface AnalyzerState {
  symptoms: string;           // initial complaint
  answers: Record<string, string>;
  asked: string[];            // ids of questions already asked
  finished: boolean;
}

export interface FollowUp {
  id: string;
  question: string;
}

const GENERIC_FOLLOWUPS: FollowUp[] = [
  { id: "duration", question: "When did your symptoms first start? (today, a few days ago, weeks?)" },
  { id: "severity_self", question: "On a scaley from 1 to 10, how bad does it feel right now?" },
  { id: "fever", question: "Do you also have a fever, chills, or sweating?" },
  { id: "worsening", question: "Are your symptoms staying the same, getting better, or getting worse?" },
  { id: "medication", question: "Have you taken any medication or treatment for this so far?" },
  { id: "history", question: "Do you have any existing medical conditions or allergies I should know about?" },
];

const TARGETED: Record<string, FollowUp[]> = {
  chest: [
    { id: "chest_radiate", question: "Does the chest pain spread to your arm, jaw, neck, or back?" },
    { id: "chest_breath", question: "Are you having difficulty breathing or shortness of breath?" },
  ],
  pain: [
    { id: "pain_location", question: "Where exactly is the pain located, and is it sharp or dull?" },
  ],
  fever: [
    { id: "fever_temp", question: "Do you know your temperature? Is it above 39°C / 102°F?" },
  ],
  stomach: [
    { id: "stomach_food", question: "Have you noticed it after eating, or any vomiting or diarrhea?" },
  ],
  head: [
    { id: "head_vision", question: "Any blurred vision, confusion, or sensitivity to light?" },
  ],
  skin: [
    { id: "skin_spread", question: "Is the rash spreading, and is it itchy, painful, or both?" },
  ],
  cough: [
    { id: "cough_type", question: "Is the cough dry, or are you bringing up mucus or blood?" },
  ],
  tired: [
    { id: "tired_sleep", question: "How is your sleep, appetite and stress level recently?" },
  ],
};

const HIGH_RISK = [
  "chest pain", "shortness of breath", "can't breathe", "cant breathe", "unconscious",
  "severe bleeding", "blood", "stroke", "numb", "slur", "suicidal", "fainted", "seizure",
  "crushing", "radiating",
];

function tokens(text: string) {
  return text.toLowerCase();
}

export function nextFollowUp(state: AnalyzerState): FollowUp | null {
  const haystack = [state.symptoms, ...Object.values(state.answers)].join(" ").toLowerCase();

  // Targeted questions first
  for (const [keyword, list] of Object.entries(TARGETED)) {
    if (haystack.includes(keyword)) {
      const next = list.find((q) => !state.asked.includes(q.id));
      if (next) return next;
    }
  }
  // Generic follow-ups
  const next = GENERIC_FOLLOWUPS.find((q) => !state.asked.includes(q.id));
  if (next) return next;
  return null;
}

export function analyzeSeverity(state: AnalyzerState): {
  severity: Severity;
  summary: string;
  advice: string[];
} {
  const text = tokens([state.symptoms, ...Object.values(state.answers)].join(" "));
  const hitHigh = HIGH_RISK.some((k) => text.includes(k));

  // Self-reported pain score
  const painMatch = text.match(/\b(10|[1-9])\b/);
  const pain = painMatch ? parseInt(painMatch[1], 10) : 0;

  let severity: Severity = "low";
  if (hitHigh || pain >= 8) severity = "high";
  else if (pain >= 5 || /worse|worsening|fever|vomit|diarrhea|spreading|days|weeks/.test(text)) severity = "medium";

  const summary =
    severity === "high"
      ? "Your symptoms suggest a potentially serious condition that needs urgent medical attention."
      : severity === "medium"
        ? "Your symptoms are moderate. Monitoring is recommended and a doctor visit would be wise within 24–48 hours."
        : "Your symptoms appear mild and can likely be managed at home with supportive care.";

  const advice =
    severity === "high"
      ? [
          "Seek immediate medical care or go to the nearest emergency room.",
          "Do not drive yourself if you feel faint or short of breath.",
          "Keep a list of your current medications ready for the doctor.",
        ]
      : severity === "medium"
        ? [
            "Rest, hydrate, and monitor your symptoms over the next 24 hours.",
            "Book an appointment with a qualified doctor for a clinical evaluation.",
            "Seek urgent care if symptoms worsen suddenly.",
          ]
        : [
            "Rest and drink plenty of fluids.",
            "Use over-the-counter relief if appropriate for your condition.",
            "If symptoms persist beyond 3 days, schedule a consultation.",
          ];

  return { severity, summary, advice };
}
