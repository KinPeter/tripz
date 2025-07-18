import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { USER_KEY } from '../lib/constants.ts';
import { AuthData as User } from '../types';

export interface AuthStore {
  userId: string;
  email: string;
  token: string | null;
  tokenExpiresAt: Date | string;
  isAuthenticated: boolean;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
}

export const createAuthStoreSlice: StateCreator<CombinedStore, [], [], AuthStore> = setState => ({
  userId: '',
  email: '',
  tokenExpiresAt: '',
  token: null,
  isAuthenticated: false,
  handleLogin: (user: User) => {
    setState(() => ({
      token: user.token,
      isAuthenticated: true,
      userId: user.id,
      email: user.email,
      tokenExpiresAt: user.expiresAt,
    }));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  handleLogout: () => {
    setState(() => ({ token: null, isAuthenticated: false }));
    localStorage.removeItem(USER_KEY);
  },
});
