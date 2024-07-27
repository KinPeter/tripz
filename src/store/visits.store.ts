import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Visit } from '@kinpeter/pk-common';
import { MapVisitsData, StatsVisitsData } from '../types/visits.ts';
import { processVisitsForMap, processVisitsForStats } from '../lib/visitUtils.ts';

export interface VisitsStore {
  visits: Visit[];
  setVisits: (visits: Visit[]) => void;
  mapVisitsData: MapVisitsData;
  statsVisitsData: StatsVisitsData;
}

export const createVisitsStoreSlice: StateCreator<
  CombinedStore,
  [],
  [],
  VisitsStore
> = setState => ({
  visits: [],
  mapVisitsData: { markers: [] },
  statsVisitsData: { citiesCount: 0, countriesCount: 0 },
  setVisits: (visits: Visit[]) => {
    const mapVisitsData = processVisitsForMap(visits);
    const statsVisitsData = processVisitsForStats(visits);
    setState(() => ({ visits, mapVisitsData, statsVisitsData }));
  },
});
