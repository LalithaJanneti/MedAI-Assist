import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase Error:", error);
    return false;
  }

  console.log("Supabase Connected:", data);
  return true;
}