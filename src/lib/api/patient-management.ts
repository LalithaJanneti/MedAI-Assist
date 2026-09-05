// Patient management and AI call integration API
import { PatientDetails } from "@/components/PatientDetailsForm";
import { supabase } from "@/lib/supabase";
export interface PatientRecord extends PatientDetails {
  id: string;
  sessionId: string;
  symptoms: string;
  severity: "low" | "medium" | "high";
  summary: string;
  createdAt: string;
  aiCallInitiated?: boolean;
  appointmentBooked?: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentId?: string;
}

/**
 * Store patient details and symptom analysis in the database
 * @param sessionId - Unique session identifier
 * @param patient - Patient details
 * @param symptoms - Initial symptom description
 * @param severity - AI-determined severity level
 * @param summary - AI assessment summary
 */
export async function savePatientRecord(
  sessionId: string,
  patient: PatientDetails,
  symptoms: string,
  severity: "low" | "medium" | "high",
  summary: string
): Promise<any> {
  const { data, error } = await supabase
    .from("patients")
    .insert([
      {
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw error;
  }

  console.log("Patient Saved:", data);

  return data[0];
}

/**
 * Initiate an AI call to the patient
 * Uses Twilio or Retell AI integration (configure based on your setup)
 * @param patientId - Patient record ID
 * @param patientDetails - Patient contact information
 * @param callContext - Information about the patient's situation for the AI call
 */
export async function initiateAICall(
  patientId: string,
  patientDetails: PatientDetails,
  callContext: {
    symptoms: string;
    severity: "low" | "medium" | "high";
    summary: string;
    advice: string[];
  }
): Promise<{ callId: string; status: string; message: string }> {
  try {
    const response = await fetch("/api/ai-call/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId,
        patientDetails,
        callContext,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate AI call");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error initiating AI call:", error);
    throw error;
  }
}

/**
 * Book an appointment automatically after AI assessment
 * @param patientId - Patient record ID
 * @param preferredDate - Patient's preferred appointment date
 * @param preferredTime - Patient's preferred appointment time
 */
export async function bookAppointment(
  patientId: string,
  preferredDate: string,
  preferredTime: string
): Promise<{ appointmentId: string; status: string; message: string }> {
  try {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId,
        preferredDate,
        preferredTime,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to book appointment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
}

/**
 * Get patient record by ID
 */
export async function getPatientRecord(patientId: string): Promise<PatientRecord> {
  try {
    const response = await fetch(`/api/patients/${patientId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch patient record");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching patient record:", error);
    throw error;
  }
}

/**
 * Update patient record with appointment details
 */
export async function updatePatientAppointment(
  patientId: string,
  appointmentDate: string,
  appointmentTime: string,
  appointmentId: string
): Promise<PatientRecord> {
  try {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentBooked: true,
        appointmentDate,
        appointmentTime,
        appointmentId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update patient appointment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating patient appointment:", error);
    throw error;
  }
}

export async function updatePatientRecord(
  patientId: string,
  updates: Partial<Pick<PatientRecord, "severity" | "summary" | "aiCallInitiated" | "appointmentBooked" | "appointmentDate" | "appointmentTime" | "appointmentId">>
): Promise<PatientRecord> {
  try {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update patient record");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating patient record:", error);
    throw error;
  }
}

/**
 * Generate AI call script based on patient situation
 * This formats the information the AI should communicate during the call
 */
export function generateAICallScript(
  patientName: string,
  severity: "low" | "medium" | "high",
  summary: string,
  advice: string[]
): string {
  const urgencyTone = {
    high: "We've analyzed your symptoms and they require urgent medical attention.",
    medium: "We've analyzed your symptoms and a doctor's consultation is recommended within 24-48 hours.",
    low: "We've analyzed your symptoms and they appear manageable with home care.",
  }[severity];

  const adviceText = advice.join(" ");

  return `Hello ${patientName}. ${urgencyTone} 

Based on your conversation with our AI health assistant, here's what we found: ${summary}

Here are our recommendations: ${adviceText}

Would you like me to help you book a doctor appointment? I can schedule one for your preferred date and time.`;
}
