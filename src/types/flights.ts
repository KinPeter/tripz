import { LatLng, MapMarker } from './map.ts';
import { Aircraft, Airline, Airport } from '@kinpeter/pk-common';

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
  flightClassesCount: Record<string, number>;
  reasonsCount: Record<string, number>;
  seatTypeCount: Record<string, number>;
  continentsCount: Record<string, number>;
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
  flightsPerYear: Record<string, number>;
  flightsPerMonth: Record<string, number>;
  flightsPerWeekday: Record<string, number>;
  // helpers
  airportsMap: Record<string, Airport>;
  aircraftMap: Record<string, Aircraft>;
  airlinesMap: Record<string, Airline>;
}
