import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Flight } from '@kinpeter/pk-common';
import { MapFlightData } from '../types/flights.ts';
import { processFlightsForMap } from '../lib/flightUtils.ts';

export interface FlightsStore {
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  mapFlightData: MapFlightData;
}

export const createFlightsStoreSlice: StateCreator<
  CombinedStore,
  [],
  [],
  FlightsStore
> = setState => ({
  flights: [],
  mapFlightData: { routes: [], markers: [], center: [0, 0] },
  setFlights: (flights: Flight[]) => {
    const mapFlightData = processFlightsForMap(flights);
    console.log('mapFlightData', mapFlightData);
    setState(() => ({ flights, mapFlightData }));
  },
});
