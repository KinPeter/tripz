import { LatLng, MapMarker } from './map.ts';

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
