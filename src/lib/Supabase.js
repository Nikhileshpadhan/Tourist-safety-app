import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yxmdxbyzileikvstzbvl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bWR4Ynl6aWxlaWt2c3R6YnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDEwODQsImV4cCI6MjA3MzYxNzA4NH0.TN63s6HMHzy1Zn-UOjMU1jxtw94aXJhuojg7Yi5CQAg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
