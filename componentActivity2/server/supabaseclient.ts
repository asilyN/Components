import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xlqqwswnnzgnusgyxnoh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscXF3c3dubnpnbnVzZ3l4bm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MjMwODQsImV4cCI6MjA1NjQ5OTA4NH0.ga2Wxe0qpE67N0_K7ilThcvpY76HNqVsTDXdM8HRt4A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
