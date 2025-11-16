// Supabase client setup
import { createClient } from '@supabase/supabase-js';

// Global toggle - matches NEXT_PUBLIC_USE_SUPABASE.
// When this is not "true" we completely avoid creating Supabase clients,
// so local development can safely use placeholder env values without errors.
const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Basic URL sanity check so that placeholder values like
// "your-project-url-here" don't cause runtime errors.
const hasValidUrl =
  !!supabaseUrl && /^https?:\/\//i.test(supabaseUrl);

// Client-side Supabase client (for browser)
export const supabase = useSupabase && hasValidUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side Supabase client (for API routes)
export function createServerClient() {
  if (!useSupabase) {
    return null;
  }
  if (!hasValidUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using local data.');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Admin client with service role key (server-side only, bypasses RLS)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!useSupabase) {
    return null;
  }
  if (!hasValidUrl || !serviceRoleKey) {
    console.warn('Supabase admin credentials not configured.');
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
