import { createClient } from '@supabase/supabase-js';

// Safe environment variable access for both Node.js (Vercel) and Browser (Preview)
const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    'Distillery Checklists: Supabase credentials not found. ' +
    'API calls will fail until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured in environment variables.'
  );
}

// Ensure the client doesn't throw during initialization even if keys are empty strings
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey || 'placeholder');
