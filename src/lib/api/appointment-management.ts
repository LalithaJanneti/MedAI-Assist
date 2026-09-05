import { supabase } from "@/lib/supabase";

export async function saveAppointment(data: {
  patient_id: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
}) {
  const { data: result, error } = await supabase
    .from("appointments")
    .insert([data])
    .select();

  if (error) throw error;

  return result;
}