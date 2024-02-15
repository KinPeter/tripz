import { Aircraft, Airline, Airport, Flight } from '@kinpeter/pk-common';
import { MapFlightData, Route, StatsFlightData } from '../types/flights.ts';
import { LatLng, MapMarker } from '../types/map.ts';
import { continentsForCountries } from './continentsForCountries.ts';

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

export function processFlightsForStats(flights: Flight[]): StatsFlightData {
  let domesticCount = 0;
  let intlCount = 0;
  let totalDistance = 0;
  let totalDurationMinutes = 0;
  const flightClassesCount: Record<string, number> = {};
  const reasonsCount: Record<string, number> = {};
  const seatTypeCount: Record<string, number> = {};
  const continentsCount: Record<string, number> = {};
  const countriesSet = new Set<string>();
  const countriesCount: Record<string, number> = {};
  const airportsMap: Record<string, Airport> = {};
  const airportsCount: Record<string, number> = {};
  const airlinesMap: Record<string, Airline> = {};
  const airlinesCount: Record<string, number> = {};
  const airlinesDistance: Record<string, number> = {};
  const aircraftMap: Record<string, Aircraft> = {};
  const aircraftCount: Record<string, number> = {};
  const aircraftDistance: Record<string, number> = {};
  const routesSet = new Set<string>();
  const routesCount: Record<string, number> = {};
  const routesDistance: Record<string, number> = {};
  const flightsPerYear: Record<number, number> = {};
  const flightsPerMonth: Record<number, number> = {};
  const flightsPerWeekday: Record<number, number> = {};

  flights.forEach(f => {
    if (f.to.country === f.from.country) {
      domesticCount++;
    } else {
      intlCount++;
    }

    totalDistance += f.distance;
    const [durationHrs, durationMins] = f.duration.split(':');
    totalDurationMinutes += parseInt(durationHrs) * 60 + parseInt(durationMins);

    if (flightClassesCount[f.flightClass] === undefined) {
      flightClassesCount[f.flightClass] = 1;
    } else {
      flightClassesCount[f.flightClass]++;
    }

    if (reasonsCount[f.flightReason] === undefined) {
      reasonsCount[f.flightReason] = 1;
    } else {
      reasonsCount[f.flightReason]++;
    }

    if (seatTypeCount[f.seatType] === undefined) {
      seatTypeCount[f.seatType] = 1;
    } else {
      seatTypeCount[f.seatType]++;
    }

    const fromContinent = continentsForCountries[f.from.country];
    const toContinent = continentsForCountries[f.to.country];
    if (continentsCount[fromContinent] === undefined) {
      continentsCount[fromContinent] = 1;
    } else {
      continentsCount[fromContinent]++;
    }
    if (continentsCount[toContinent] === undefined) {
      continentsCount[toContinent] = 1;
    } else {
      continentsCount[toContinent]++;
    }

    const fromCountry = f.from.country;
    const toCountry = f.to.country;
    countriesSet.add(fromCountry);
    countriesSet.add(toCountry);
    if (countriesCount[fromCountry] === undefined) {
      countriesCount[fromCountry] = 1;
    } else {
      countriesCount[fromCountry]++;
    }
    if (countriesCount[toCountry] === undefined) {
      countriesCount[toCountry] = 1;
    } else {
      countriesCount[toCountry]++;
    }

    const fromAirport = f.from.iata;
    const toAirport = f.to.iata;
    if (!airportsMap[fromAirport]) {
      airportsMap[fromAirport] = f.from;
    }
    if (!airportsMap[toAirport]) {
      airportsMap[toAirport] = f.to;
    }
    if (airportsCount[fromAirport] === undefined) {
      airportsCount[fromAirport] = 1;
    } else {
      airportsCount[fromAirport]++;
    }
    if (airportsCount[toAirport] === undefined) {
      airportsCount[toAirport] = 1;
    } else {
      airportsCount[toAirport]++;
    }

    const airline = f.airline.iata;
    if (!airlinesMap[airline]) {
      airlinesMap[airline] = f.airline;
    }
    if (airlinesCount[airline] === undefined) {
      airlinesCount[airline] = 1;
    } else {
      airlinesCount[airline]++;
    }
    if (airlinesDistance[airline] === undefined) {
      airlinesDistance[airline] = f.distance;
    } else {
      airlinesDistance[airline] += f.distance;
    }

    const aircraft = f.aircraft.icao;
    if (!aircraftMap[aircraft]) {
      aircraftMap[aircraft] = f.aircraft;
    }
    if (aircraftCount[aircraft] === undefined) {
      aircraftCount[aircraft] = 1;
    } else {
      aircraftCount[aircraft]++;
    }
    if (aircraftDistance[aircraft] === undefined) {
      aircraftDistance[aircraft] = f.distance;
    } else {
      aircraftDistance[aircraft] += f.distance;
    }

    const route = `${f.from.iata}-${f.to.iata}`;
    routesSet.add(route);
    if (routesCount[route] === undefined) {
      routesCount[route] = 1;
    } else {
      routesCount[route]++;
    }
    if (routesDistance[route] === undefined) {
      routesDistance[route] = f.distance;
    } else {
      routesDistance[route] += f.distance;
    }

    const date = new Date(f.date);
    const year = date.getFullYear();
    if (flightsPerYear[year] === undefined) {
      flightsPerYear[year] = 1;
    } else {
      flightsPerYear[year]++;
    }

    const month = date.getMonth();
    if (flightsPerMonth[month] === undefined) {
      flightsPerMonth[month] = 1;
    } else {
      flightsPerMonth[month]++;
    }

    const weekday = date.getDay();
    if (flightsPerWeekday[weekday] === undefined) {
      flightsPerWeekday[weekday] = 1;
    } else {
      flightsPerWeekday[weekday]++;
    }
  });

  const compareFn = (a: [string, number], b: [string, number]) => b[1] - a[1];

  const flightClassesByCount = Object.entries(flightClassesCount).sort(compareFn);
  const reasonsByCount = Object.entries(reasonsCount).sort(compareFn);
  const seatTypeByCount = Object.entries(seatTypeCount).sort(compareFn);
  const continentsByCount = Object.entries(continentsCount).sort(compareFn);
  const countriesByCount = Object.entries(countriesCount).sort(compareFn);
  const airportsByCount = Object.entries(airportsCount).sort(compareFn);
  const airlinesByCount = Object.entries(airlinesCount).sort(compareFn);
  const airlinesByDistance = Object.entries(airlinesDistance).sort(compareFn);
  const aircraftByCount = Object.entries(aircraftCount).sort(compareFn);
  const aircraftByDistance = Object.entries(aircraftDistance).sort(compareFn);
  const routesByCount = Object.entries(routesCount).sort(compareFn);
  const routesByDistance = Object.entries(routesDistance).sort(compareFn);

  const startYear = Math.min(...Object.keys(flightsPerYear).map(Number));
  const currentYear = new Date().getFullYear();
  for (let i = startYear; i <= currentYear; i++) {
    if (flightsPerYear[i] === undefined) {
      flightsPerYear[i] = 0;
    }
  }

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {
    if (flightsPerMonth[i] === undefined) {
      flightsPerMonth[i] = 0;
    }
  });

  [0, 1, 2, 3, 4, 5, 6].forEach(i => {
    if (flightsPerWeekday[i] === undefined) {
      flightsPerWeekday[i] = 0;
    }
  });

  return {
    totalCount: flights.length,
    domesticCount,
    intlCount,
    totalDistance,
    totalDurationMinutes,
    flightClassesByCount,
    reasonsByCount,
    seatTypeByCount,
    continentsByCount,
    totalCountries: countriesSet.size,
    countriesByCount,
    totalAirports: Object.keys(airportsMap).length,
    airportsByCount,
    totalAirlines: Object.keys(airlinesMap).length,
    airlinesByCount,
    airlinesByDistance,
    totalAircrafts: Object.keys(aircraftMap).length,
    aircraftByCount,
    aircraftByDistance,
    totalRoutes: routesSet.size,
    routesByCount,
    routesByDistance,
    flightsPerYear,
    flightsPerMonth,
    flightsPerWeekday,

    //helpers
    airportsMap,
    airlinesMap,
    aircraftMap,
  };
}
