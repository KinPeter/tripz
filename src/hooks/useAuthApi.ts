import { ApiClient } from '../lib/apiClient.ts';
import { USER_KEY } from '../lib/constants.ts';
import { AuthData as User } from '../types';

export const useAuthApi = () => {
  const api = new ApiClient();

  async function login(email: string): Promise<{ message: string }> {
    return await api.post('/auth/login-code', { email }, false);
  }

  async function passwordLogin(email: string, password: string): Promise<User> {
    return await api.post('/auth/password-login', { email, password }, false);
  }

  async function verify(email: string, loginCode: string): Promise<User> {
    return await api.post<User>('/auth/verify-login-code', { email, loginCode }, false);
  }

  async function refresh(): Promise<User> {
    const stored = localStorage.getItem(USER_KEY);
    const { email, token } = JSON.parse(stored as string);
    return await api.post<User>('/auth/token-refresh', { email, token }, true);
  }

  return {
    login,
    passwordLogin,
    verify,
    refresh,
  };
};
