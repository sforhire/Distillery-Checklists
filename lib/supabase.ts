
import { createClient } from '@supabase/supabase-js';

// Safe environment variable access for both Node.js (Vercel) and Browser (Preview)
const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // Try window.process for some preview environments
  if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
    return (window as any).process.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

// Ensure the client doesn't throw during initialization even if keys are empty strings
// In preview mode, we use a dummy URL to avoid initialization errors
const safeUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const safeKey = supabaseServiceKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(safeUrl, safeKey);
