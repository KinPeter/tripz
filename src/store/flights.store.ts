import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Flight } from '../types/flights.ts';

export interface FlightsStore {
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
}

export const createFlightsStoreSlice: StateCreator<
  CombinedStore,
  [],
  [],
  FlightsStore
> = setState => ({
  flights: [],
  setFlights: (flights: Flight[]) => {
    setState(() => ({ flights }));
  },
});
