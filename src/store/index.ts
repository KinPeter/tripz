import { AuthStore, createAuthStoreSlice } from './auth.store.ts';
import { create } from 'zustand';

export type CombinedStore = AuthStore; // & OtherStore & OtherStore

export const useStore = create<CombinedStore>((...args) => ({
  ...createAuthStoreSlice(...args),
  // ...createOtherStoreSlice(...args)
}));
