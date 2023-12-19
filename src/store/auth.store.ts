import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Session } from '@supabase/supabase-js';
import { SESSION_KEY } from '../lib/constants.ts';

export interface AuthStore {
  token: string | null;
  isAuthenticated: boolean;
  handleLogin: (session: Session) => void;
  handleLogout: () => void;
}

export const createAuthStoreSlice: StateCreator<CombinedStore, [], [], AuthStore> = setState => ({
  token: null,
  isAuthenticated: false,
  handleLogin: (session: Session) => {
    setState(() => ({ token: session.access_token, isAuthenticated: true }));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  handleLogout: () => {
    setState(() => ({ token: null, isAuthenticated: false }));
    localStorage.removeItem(SESSION_KEY);
  },
});
