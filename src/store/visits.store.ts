import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Visit } from '@kinpeter/pk-common';

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
