import { ApiClient } from '../lib/apiClient.ts';
import { SESSION_KEY } from '../lib/constants.ts';
import { Session } from '@supabase/supabase-js';

export const useAuthApi = () => {
  const api = new ApiClient();

  async function login(email: string): Promise<{ message: string }> {
    return await api.post('/auth/sign-in', { email }, false);
  }

  async function verify(token: string): Promise<Session> {
    return await api.post<Session>('/auth/verify', { email: 'kinpeter85@gmail.com', token }, false);
  }

  async function refresh(): Promise<Session> {
    const stored = localStorage.getItem(SESSION_KEY);
    const session = JSON.parse(stored as string);
    const refreshToken = session.refresh_token;
    return await api.post<Session>('/auth/refresh', { refreshToken }, false);
  }

  return {
    login,
    verify,
    refresh,
  };
};
