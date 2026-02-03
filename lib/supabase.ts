
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // This will fail at runtime if not set, but prevents build-time crashes if keys aren't yet in Vercel
  console.warn('Supabase environment variables are missing.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || ''
);
