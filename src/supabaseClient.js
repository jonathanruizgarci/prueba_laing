import { createClient } from '@supabase/supabase-js';

// Estos datos te los da Supabase en Project Settings -> API
const supabaseUrl = 'https://huuwtbcuzylehuwbajfy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dXd0YmN1enlsZWh1d2JhamZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNTc2MzYsImV4cCI6MjA3OTczMzYzNn0.e8afrXpQnUBj8ma5Ugr71lp6nsZz1aKAlCKj2eBCs7k';

export const supabase = createClient(supabaseUrl, supabaseKey);
