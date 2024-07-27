import { MapMarker } from './map.ts';
import { Visit } from '@kinpeter/pk-common';

export interface MapVisitsData {
  markers: MapMarker[];
}

export interface StatsVisitsData {
  citiesCount: number;
  countriesCount: number;
}

export type VisitWithPosition = Visit & { position: number };
