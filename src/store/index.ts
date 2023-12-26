import { AuthStore, createAuthStoreSlice } from './auth.store.ts';
import { create } from 'zustand';
import { createFlightsStoreSlice, FlightsStore } from './flights.store.ts';
import { createVisitsStoreSlice, VisitsStore } from './visits.store.ts';

export type CombinedStore = AuthStore & FlightsStore & VisitsStore;

export const useStore = create<CombinedStore>((...args) => ({
  ...createAuthStoreSlice(...args),
  ...createFlightsStoreSlice(...args),
  ...createVisitsStoreSlice(...args),
}));
