import { Airport, Flight } from '@kinpeter/pk-common';
import { MapFlightData, Route } from '../types/flights.ts';
import { LatLng, MapMarker } from '../types/map.ts';

export function processFlightsForMap(flights: Flight[]): MapFlightData {
  const routeMap: Map<string, { a: LatLng; b: LatLng; count: number }> = new Map();
  const airportSet: Set<string> = new Set();

  const createKey = (from: Airport, to: Airport): string => {
    const key1 = `${from.iata}-${to.iata}`;
    const key2 = `${to.iata}-${from.iata}`;
    return key1 < key2 ? key1 : key2;
  };

  const parseCoords = (key: string): LatLng => key.split('-').map(parseFloat) as LatLng;

  flights.forEach(flight => {
    const key = createKey(flight.from, flight.to);

    if (routeMap.has(key)) {
      routeMap.get(key)!.count++;
    } else {
      routeMap.set(key, {
        a: [flight.from.lat, flight.from.lng],
        b: [flight.to.lat, flight.to.lng],
        count: 1,
      });
    }

    airportSet.add(`${flight.from.lat}-${flight.from.lng}`);
    airportSet.add(`${flight.to.lat}-${flight.to.lng}`);
  });

  const routes: Route[] = Array.from(routeMap.values());

  const markers: MapMarker[] = Array.from(airportSet).map(key => {
    const [lat, lng] = parseCoords(key);
    const airport =
      flights.find(flight => flight.from.lat === lat && flight.from.lng === lng)?.from ??
      flights.find(flight => flight.to.lat === lat && flight.to.lng === lng)?.to;

    return {
      pos: [lat, lng],
      popup: `${airport!.city} - ${airport!.name}`,
    };
  });

  const center = calculateCenter(Array.from(airportSet).map(parseCoords));

  return { routes, markers, center };
}

function calculateCenter(coordinates: LatLng[]): LatLng {
  if (!coordinates?.length) {
    return [0, 0];
  }

  const boundingBox = coordinates.reduce(
    (box, coord) => {
      return {
        minLatitude: Math.min(box.minLatitude, coord[0]),
        minLongitude: Math.min(box.minLongitude, coord[1]),
        maxLatitude: Math.max(box.maxLatitude, coord[0]),
        maxLongitude: Math.max(box.maxLongitude, coord[1]),
      };
    },
    {
      minLatitude: Number.MAX_VALUE,
      minLongitude: Number.MAX_VALUE,
      maxLatitude: Number.MIN_VALUE,
      maxLongitude: Number.MIN_VALUE,
    }
  );

  const centerLatitude = (boundingBox.minLatitude + boundingBox.maxLatitude) / 2;
  const centerLongitude = (boundingBox.minLongitude + boundingBox.maxLongitude) / 2;

  return [centerLatitude, centerLongitude];
}
