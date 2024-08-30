
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcvzbfxklypiivrfrtzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnpiZnhrbHlwaWl2cmZydHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5OTQwNzMsImV4cCI6MjA0MDU3MDA3M30.Gir56AOYX96fqdOvUmwKeZWnda2-P_8kKCsmkfgWa_8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
