import { LatLng, MapMarker } from './map.ts';
import { BaseEntity } from './misc';

export const SeatType = {
  AISLE: 'Aisle',
  MIDDLE: 'Middle',
  WINDOW: 'Window',
} as const;

export type SeatType = (typeof SeatType)[keyof typeof SeatType];

export const FlightClass = {
  ECONOMY: 'Economy',
  PREMIUM_ECONOMY: 'Premium Economy',
  BUSINESS: 'Business',
  FIRST: 'First',
} as const;

export type FlightClass = (typeof FlightClass)[keyof typeof FlightClass];

export const FlightReason = {
  LEISURE: 'Leisure',
  BUSINESS: 'Business',
  CREW: 'Crew',
} as const;

export type FlightReason = (typeof FlightReason)[keyof typeof FlightReason];

export interface Flight extends BaseEntity {
  date: string;
  flightNumber: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: number;
  airline: Airline;
  aircraft: Aircraft;
  registration: string | null;
  seatNumber: string | null;
  seatType: SeatType;
  flightClass: FlightClass;
  flightReason: FlightReason;
  note: string | null;
  isPlanned?: boolean;
}

export type FlightRequest = Omit<Flight, 'id'>;

export interface Airport {
  city: string;
  name: string;
  country: string;
  iata: string;
  icao: string;
  lat: number;
  lng: number;
}

export interface Airline {
  name: string;
  iata: string;
  icao: string;
}

export interface Aircraft {
  name: string;
  icao: string;
}

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
