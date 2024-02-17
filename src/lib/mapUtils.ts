import { CurvePathData } from '@elfalem/leaflet-curve';
import { LatLng } from '../types/map.ts';
import L, { PointTuple } from 'leaflet';

/**
 * Creating consistently curved lines on Leaflet
 * From: https://ryancatalani.medium.com/creating-consistently-curved-lines-on-leaflet-b59bc03fa9dc
 * @param latLng1
 * @param latLng2
 */
export function calculateCurve(latLng1: LatLng, latLng2: LatLng): CurvePathData {
  const offsetX = latLng2[1] - latLng1[1],
    offsetY = latLng2[0] - latLng1[0];

  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
    theta = Math.atan2(offsetY, offsetX);

  const thetaOffset = 3.14 / 10;

  const r2 = r / 2 / Math.cos(thetaOffset),
    theta2 = theta + thetaOffset;

  const midpointX = r2 * Math.cos(theta2) + latLng1[1],
    midpointY = r2 * Math.sin(theta2) + latLng1[0];

  const midpointLatLng: LatLng = [midpointY, midpointX];

  return ['M', latLng1, 'Q', midpointLatLng, latLng2];
}

// https://en.wikipedia.org/wiki/Haversine_formula
export function getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const r = 6371; // km
  const p = Math.PI / 180;

  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lng2 - lng1) * p))) / 2;

  return Math.floor(2 * r * Math.asin(Math.sqrt(a)));
}

// https://leafletjs.com/examples/custom-icons/
const iconBase = {
  shadowUrl: '/marker-shadow.png',
  iconSize: [28, 41] as PointTuple,
  shadowSize: [43, 40] as PointTuple,
  iconAnchor: [14, 39] as PointTuple,
  shadowAnchor: [14, 39] as PointTuple,
  popupAnchor: [0, -36] as PointTuple,
};

export const markerIcons = {
  flight: L.icon({ ...iconBase, iconUrl: '/marker-airplane.png' }),
  visit: L.icon({ ...iconBase, iconUrl: '/marker-poi.png' }),
};
