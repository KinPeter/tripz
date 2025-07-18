import { MapMarker } from './map.ts';
import { BaseEntity } from './misc';

export interface Visit extends BaseEntity {
  city: string;
  country: string;
  year?: string;
  lat: number;
  lng: number;
}

export type VisitRequest = Omit<Visit, 'id' | 'userId' | 'createdAt'>;

export interface MapVisitsData {
  markers: MapMarker[];
}

export interface StatsVisitsData {
  citiesCount: number;
  countriesCount: number;
}

export type VisitWithPosition = Visit & { position: number };
