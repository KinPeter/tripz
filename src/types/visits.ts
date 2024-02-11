import { MapMarker } from './map.ts';

export interface MapVisitsData {
  markers: MapMarker[];
}

export interface StatsVisitsData {
  citiesCount: number;
  countriesCount: number;
}
