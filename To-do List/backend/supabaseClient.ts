import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config(); // Ensure environment variables are loaded

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "SupABASE_URL and SUPABASE_KEY must be defined in your .env file"
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
