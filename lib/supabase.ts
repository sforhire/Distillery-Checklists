
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    'Distillery Checklists: Supabase credentials not found. ' +
    'API calls will fail until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured in environment variables.'
  );
}

// Ensure the client doesn't throw during initialization even if keys are empty strings
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
