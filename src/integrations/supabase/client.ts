// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tljtmycivjyrtjxtvtrt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsanRteWNpdmp5cnRqeHR2dHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODE2MzksImV4cCI6MjA2MTE1NzYzOX0.w2ReapkpquCGDG-ut_tAYt5iPZ4QhWOXtpwbhONgNaA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);