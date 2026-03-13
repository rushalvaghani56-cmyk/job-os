/**
 * Supabase Client
 * Placeholder for Supabase browser client (mock-ready)
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Supabase configuration */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

/** Singleton supabase client */
let supabaseClient: SupabaseClient | null = null;

/**
 * Get the Supabase client (singleton pattern)
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseClient;
}

/**
 * Create a new Supabase client for server-side use
 */
export function createServerSupabaseClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Export default client for convenience */
export const supabase = getSupabaseClient();
