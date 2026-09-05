import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oaquilrzguqjogcgnals.supabase.co";

const supabaseAnonKey =
  "sb_publishable_1DKXE-2_rXKmpl-OQ2PeFQ_YrwMPOY5";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);