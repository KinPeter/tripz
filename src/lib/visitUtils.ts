import { Visit } from '@kinpeter/pk-common';
import { MapVisitsData } from '../types/visits.ts';

export function processVisitsForMap(visits: Visit[]): MapVisitsData {
  return {
    markers: visits.map(({ city, lat, lng }) => ({
      popup: city,
      pos: [lat, lng],
    })),
  };
}
