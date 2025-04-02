import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

type Environment = 'development' | 'test';

const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

const getSupabaseClient = (env: Environment) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    console.log(env);

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials.');
    }

    return createClient(supabaseUrl, supabaseKey);
};

const currentEnv: Environment = process.env.NODE_ENV === 'test' ? 'test' : 'development';

export const supabase = getSupabaseClient(currentEnv);
export const devSupabase = getSupabaseClient('development');
export const testSupabase = getSupabaseClient('test');