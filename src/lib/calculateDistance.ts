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
