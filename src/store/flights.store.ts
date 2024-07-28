import { StateCreator } from 'zustand';
import { CombinedStore } from './index.ts';
import { Flight } from '@kinpeter/pk-common';
import { MapFlightData, StatsFlightData } from '../types/flights.ts';
import { processFlightsForMap, processFlightsForStats } from '../lib/flightUtils.ts';

export interface FlightsStore {
  flights: Flight[];
  filteredFlights: Flight[];
  setFlights: (flights: Flight[]) => void;
  filterFlights: (year: string) => void;
  mapFlightData: MapFlightData;
  statsFlightData: StatsFlightData | null;
  isFiltered: boolean;
  years: string[];
}

export const createFlightsStoreSlice: StateCreator<CombinedStore, [], [], FlightsStore> = (
  setState,
  getState
) => ({
  flights: [],
  filteredFlights: [],
  mapFlightData: { routes: [], markers: [], center: [0, 0] },
  statsFlightData: null,
  isFiltered: false,
  years: [],
  setFlights: (flights: Flight[]) => {
    const mapFlightData = processFlightsForMap(flights);
    const statsFlightData = processFlightsForStats(flights);
    const years = statsFlightData.years.reverse();
    const filteredFlights = [...flights];
    const isFiltered = false;
    setState(() => ({
      flights,
      filteredFlights,
      mapFlightData,
      statsFlightData,
      years,
      isFiltered,
    }));
  },
  filterFlights: (year: string) => {
    const allFlights = [...getState().flights];
    let filteredFlights: Flight[];
    let mapFlightData: MapFlightData;
    let statsFlightData: StatsFlightData;
    if (year.startsWith('All')) {
      filteredFlights = [...allFlights];
      mapFlightData = processFlightsForMap(allFlights);
      statsFlightData = processFlightsForStats(allFlights);
    } else {
      filteredFlights = allFlights.filter(({ date }) => date.startsWith(year));
      mapFlightData = processFlightsForMap(filteredFlights);
      statsFlightData = processFlightsForStats(filteredFlights);
    }
    setState(() => ({
      filteredFlights,
      mapFlightData,
      statsFlightData,
      isFiltered: allFlights.length !== filteredFlights.length,
    }));
  },
});
