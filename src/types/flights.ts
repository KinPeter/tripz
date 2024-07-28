import { LatLng, MapMarker } from './map.ts';
import { Flight } from '@kinpeter/pk-common';

export interface Route {
  a: LatLng;
  b: LatLng;
  count: number;
}

export interface MapFlightData {
  routes: Route[];
  markers: MapMarker[];
  center: LatLng;
}

export interface StatsFlightData {
  // stats
  totalCount: number;
  domesticCount: number;
  intlCount: number;
  totalDistance: number;
  totalDurationMinutes: number;
  flightClassesByCount: Array<[string, number]>;
  reasonsByCount: Array<[string, number]>;
  seatTypeByCount: Array<[string, number]>;
  continentsByCount: Array<[string, number]>;
  totalCountries: number;
  countriesByCount: Array<[string, number]>;
  totalAirports: number;
  airportsByCount: Array<[string, number]>;
  totalAirlines: number;
  airlinesByCount: Array<[string, number]>;
  airlinesByDistance: Array<[string, number]>;
  totalAircrafts: number;
  aircraftByCount: Array<[string, number]>;
  aircraftByDistance: Array<[string, number]>;
  totalRoutes: number;
  routesByCount: Array<[string, number]>;
  routesByDistance: Array<[string, number]>;
  flightsPerYear: Array<[string, number]>;
  distancePerYear: Array<[string, number]>;
  flightsPerMonth: Array<[string, number]>;
  flightsPerWeekday: Array<[string, number]>;
  // helpers
  airportsMap: Record<string, string>;
  aircraftMap: Record<string, string>;
  airlinesMap: Record<string, string>;
  years: string[];
}

export type FlightWithPosition = Flight & { position: number };
