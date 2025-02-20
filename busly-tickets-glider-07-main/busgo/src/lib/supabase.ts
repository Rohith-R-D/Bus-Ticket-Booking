
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pnxykngdpsbgmshtscan.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueHlrbmdkcHNiZ21zaHRzY2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTAzMDYsImV4cCI6MjA1NTQ2NjMwNn0.ooJsndBAorM5CpuOi8Wrla4sLJvdo9YVehwMR32NyOY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
