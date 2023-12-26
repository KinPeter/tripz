import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Visit } from '../types/visits.ts';

export interface VisitsStore {
  visits: Visit[];
  setVisits: (visits: Visit[]) => void;
}

export const createVisitsStoreSlice: StateCreator<
  CombinedStore,
  [],
  [],
  VisitsStore
> = setState => ({
  visits: [],
  setVisits: (visits: Visit[]) => {
    setState(() => ({ visits }));
  },
});
