import { CurvePathData } from '@elfalem/leaflet-curve';

export type LatLng = [number, number];

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
