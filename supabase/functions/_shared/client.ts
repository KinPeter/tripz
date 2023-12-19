import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createGuestClient(): SupabaseClient {
  return createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'));
}

export function createAuthenticatedClient(req: Request): SupabaseClient {
  return createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  });
}
