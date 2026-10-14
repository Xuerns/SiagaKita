import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service role Supabase client.
 * HANYA boleh dipanggil di sisi server (Route Handlers, Cron, Push Notification)
 * dan TIDAK PERNAH diakses di sisi klien browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Konfigurasi SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_URL belum diatur.');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
