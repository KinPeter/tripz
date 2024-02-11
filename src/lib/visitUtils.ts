import { Visit } from '@kinpeter/pk-common';
import { MapVisitsData, StatsVisitsData } from '../types/visits.ts';

export function processVisitsForMap(visits: Visit[]): MapVisitsData {
  return {
    markers: visits.map(({ city, lat, lng }) => ({
      popup: city,
      pos: [lat, lng],
    })),
  };
}
export function processVisitsForStats(visits: Visit[]): StatsVisitsData {
  const citiesSet = new Set<string>();
  const countriesSet = new Set<string>();

  visits.forEach(({ city, country }) => {
    citiesSet.add(city);
    countriesSet.add(country);
  });

  return {
    citiesCount: citiesSet.size,
    countriesCount: countriesSet.size,
  };
}
