import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = "https://xkvtxtpmyopifiplmpcp.supabase.co";
const supabaseKey: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrdnR4dHBteW9waWZpcGxtcGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODgxMTQsImV4cCI6MjA3MDI2NDExNH0.lQYMfAoKBU7C_GbTHz-MbeuR4crFRZCIPhS7NK4ldNg";

export const supabase = createClient(supabaseUrl, supabaseKey);
