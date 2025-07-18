import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { MapVisitsData, StatsVisitsData, Visit } from '../types/visits.ts';
import { processVisitsForMap, processVisitsForStats } from '../lib/visitUtils.ts';

export interface VisitsStore {
  visits: Visit[];
  filteredVisits: Visit[];
  setVisits: (visits: Visit[]) => void;
  filterVisits: (year: string) => void;
  mapVisitsData: MapVisitsData;
  statsVisitsData: StatsVisitsData;
}

export const createVisitsStoreSlice: StateCreator<CombinedStore, [], [], VisitsStore> = (
  setState,
  getState
) => ({
  visits: [],
  filteredVisits: [],
  mapVisitsData: { markers: [] },
  statsVisitsData: { citiesCount: 0, countriesCount: 0 },
  setVisits: (visits: Visit[]) => {
    const mapVisitsData = processVisitsForMap(visits);
    const statsVisitsData = processVisitsForStats(visits);
    const filteredVisits = [...visits];
    setState(() => ({ visits, filteredVisits, mapVisitsData, statsVisitsData }));
  },
  filterVisits: (year: string) => {
    const allVisits = [...getState().visits];
    let filteredVisits: Visit[];
    let mapVisitsData: MapVisitsData;
    let statsVisitsData: StatsVisitsData;
    if (year.startsWith('All')) {
      filteredVisits = [...allVisits];
      mapVisitsData = processVisitsForMap(allVisits);
      statsVisitsData = processVisitsForStats(allVisits);
    } else {
      filteredVisits = allVisits.filter(({ year: visitYear }) => visitYear?.startsWith(year));
      mapVisitsData = processVisitsForMap(filteredVisits);
      statsVisitsData = processVisitsForStats(filteredVisits);
    }
    setState(() => ({
      filteredVisits,
      mapVisitsData,
      statsVisitsData,
    }));
  },
});
