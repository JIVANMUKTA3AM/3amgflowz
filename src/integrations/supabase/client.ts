
import { createClient } from '@supabase/supabase-js';

// URL e chave anônima do Supabase (keys seguras para uso no frontend)
const supabaseUrl = 'https://llssfiurupclhpiaozug.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3NmaXVydXBjbGhwaWFvenVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMTQwNDUsImV4cCI6MjA1NDc5MDA0NX0.FHHyZskc0QUGVxgJU-duEtIJiUgwQQjFq9F83xJ4Rtg';

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
