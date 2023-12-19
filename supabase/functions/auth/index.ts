// Follow this setup guide to integrate the Deno language server with your editor:
// https://docs.deno.com/runtime/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// npx supabase functions deploy auth --no-verify-jwt

import { CorsOkResponse, ErrorResponse, OkResponse } from '../_shared/response.ts';
import { createGuestClient } from '../_shared/client.ts';
import { SupabaseClient } from '@supabase/supabase-js';

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new CorsOkResponse();
  }

  if (req.method !== 'POST') {
    return new ErrorResponse('Auth request method should be POST', 400);
  }

  try {
    const supabase = createGuestClient();

    switch (true) {
      case req.url.endsWith('/sign-in'):
        return await signIn(req, supabase);
      case req.url.endsWith('/verify'):
        return await verifyCode(req, supabase);
      case req.url.endsWith('/refresh'):
        return await refreshSession(req, supabase);
      default:
        return new ErrorResponse('Unknown operation', 400);
    }
  } catch (error) {
    return new ErrorResponse(error.message, 500);
  }
});

async function signIn(req: Request, supabase: SupabaseClient): Promise<Response> {
  const { email } = await req.json();
  if (!email) return new ErrorResponse('No email address received', 400);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });
  if (error) throw error;
  if (data?.user !== null || data?.session !== null)
    return new ErrorResponse('Something went wrong', 500);

  return new OkResponse({ message: 'Check your inbox' });
}

async function verifyCode(req: Request, supabase: SupabaseClient): Promise<Response> {
  const { email, token } = await req.json();
  if (!email || !token) return new ErrorResponse('Email or token is missing', 400);

  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw error;
  if (!session) return new ErrorResponse('Something went wrong', 500);

  return new OkResponse(session);
}

async function refreshSession(req: Request, supabase: SupabaseClient): Promise<Response> {
  const { refreshToken } = await req.json();
  if (!refreshToken) return new ErrorResponse('RefreshToken is mandatory', 400);

  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error) throw error;
  if (!session) return new ErrorResponse('Something went wrong', 500);

  return new OkResponse(session);
}
