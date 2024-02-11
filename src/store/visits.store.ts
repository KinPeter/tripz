import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Visit } from '@kinpeter/pk-common';
import { MapVisitsData } from '../types/visits.ts';
import { processVisitsForMap } from '../lib/visitUtils.ts';

export interface VisitsStore {
  visits: Visit[];
  setVisits: (visits: Visit[]) => void;
  mapVisitsData: MapVisitsData;
}

export const createVisitsStoreSlice: StateCreator<
  CombinedStore,
  [],
  [],
  VisitsStore
> = setState => ({
  visits: [],
  mapVisitsData: { markers: [] },
  setVisits: (visits: Visit[]) => {
    setState(() => ({ visits, mapVisitsData: processVisitsForMap(visits) }));
  },
});
