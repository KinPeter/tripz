import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Flight } from '@kinpeter/pk-common';
import { MapFlightData, StatsFlightData } from '../types/flights.ts';
import { processFlightsForMap, processFlightsForStats } from '../lib/flightUtils.ts';

export interface FlightsStore {
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  mapFlightData: MapFlightData;
  statsFlightData: StatsFlightData | null;
}

export const createFlightsStoreSlice: StateCreator<
  CombinedStore,
  [],
  [],
  FlightsStore
> = setState => ({
  flights: [],
  mapFlightData: { routes: [], markers: [], center: [0, 0] },
  statsFlightData: null,
  setFlights: (flights: Flight[]) => {
    const mapFlightData = processFlightsForMap(flights);
    const statsFlightData = processFlightsForStats(flights);
    setState(() => ({ flights, mapFlightData, statsFlightData }));
  },
});
