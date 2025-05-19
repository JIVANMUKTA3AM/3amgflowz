
import { createClient } from "@supabase/supabase-js";

// Use explicit URL and key instead of environment variables that might not be loaded
const supabaseUrl = "https://llssfiurupclhpiaozug.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3NmaXVydXBjbGhwaWFvenVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMTQwNDUsImV4cCI6MjA1NDc5MDA0NX0.FHHyZskc0QUGVxgJU-duEtIJiUgwQQjFq9F83xJ4Rtg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
