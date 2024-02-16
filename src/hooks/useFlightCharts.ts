import { StatsFlightData } from '../types/flights.ts';
import { useEffect, useState } from 'react';
import { DonutChartCell } from '@mantine/charts';

export const useFlightCharts = (flights: StatsFlightData | null) => {
  const [continents, setContinents] = useState<DonutChartCell[]>([]);
  const [classes, setClasses] = useState<DonutChartCell[]>([]);
  const [reasons, setReasons] = useState<DonutChartCell[]>([]);
  const [seatTypes, setSeatTypes] = useState<DonutChartCell[]>([]);
  const [airports, setAirports] = useState<Record<string, string | number>[]>([]);
  const [countries, setCountries] = useState<Record<string, string | number>[]>([]);
  const [routesByCount, setRoutesByCount] = useState<Record<string, string | number>[]>([]);
  const [routesByDistance, setRoutesByDistance] = useState<Record<string, string | number>[]>([]);
  const [airlinesByCount, setAirlinesByCount] = useState<Record<string, string | number>[]>([]);
  const [airlinesByDistance, setAirlinesByDistance] = useState<Record<string, string | number>[]>(
    []
  );
  const [aircraftsByCount, setAircraftsByCount] = useState<Record<string, string | number>[]>([]);
  const [aircraftsByDistance, setAircraftsByDistance] = useState<Record<string, string | number>[]>(
    []
  );
  const [flightsPerYear, setFlightsPerYear] = useState<Record<string, string | number>[]>([]);
  const [flightsPerMonth, setFlightsPerMonth] = useState<Record<string, string | number>[]>([]);
  const [flightsPerWeekday, setFlightsPerWeekday] = useState<Record<string, string | number>[]>([]);

  useEffect(() => {
    if (!flights) return;

    const continentColors = getColors(flights.continentsByCount);
    setContinents(
      flights.continentsByCount.map(([name, value], index) => {
        return { name, value, color: continentColors[index] };
      })
    );

    const classColors = getColors(flights.flightClassesByCount);
    setClasses(
      flights.flightClassesByCount.map(([name, value], index) => {
        return { name, value, color: classColors[index] };
      })
    );

    const seatColors = getColors(flights.seatTypeByCount);
    setSeatTypes(
      flights.seatTypeByCount.map(([name, value], index) => {
        return { name, value, color: seatColors[index] };
      })
    );

    const reasonColors = getColors(flights.reasonsByCount);
    setReasons(
      flights.reasonsByCount.map(([name, value], index) => {
        return { name, value, color: reasonColors[index] };
      })
    );

    const mapperFn = ([item, value]: [string, number]) => ({ item, value });

    setAirports(flights.airportsByCount.map(mapperFn));
    setCountries(flights.countriesByCount.map(mapperFn));
    setRoutesByCount(flights.routesByCount.map(mapperFn));
    setRoutesByDistance(flights.routesByDistance.map(mapperFn));
    setAirlinesByCount(flights.airlinesByCount.map(mapperFn));
    setAirlinesByDistance(flights.airlinesByDistance.map(mapperFn));
    setAircraftsByCount(flights.aircraftByCount.map(mapperFn));
    setAircraftsByDistance(flights.aircraftByDistance.map(mapperFn));
    setFlightsPerYear(flights.flightsPerYear.map(mapperFn));
    setFlightsPerMonth(flights.flightsPerMonth.map(mapperFn));
    setFlightsPerWeekday(flights.flightsPerWeekday.map(mapperFn));
  }, [flights]);

  return {
    classes,
    continents,
    reasons,
    seatTypes,
    airports,
    countries,
    routesByCount,
    routesByDistance,
    airlinesByCount,
    airlinesByDistance,
    aircraftsByCount,
    aircraftsByDistance,
    flightsPerYear,
    flightsPerMonth,
    flightsPerWeekday,
  };
};

function getColors(array: unknown[]): string[] {
  switch (array.length) {
    case 1:
      return ['tomato.9'];
    case 2:
      return ['tomato.9', 'tomato.4'];
    case 3:
      return ['tomato.9', 'tomato.5', 'tomato.2'];
    case 4:
      return ['tomato.9', 'tomato.6', 'tomato.3', 'tomato.1'];
    case 5:
      return ['tomato.9', 'tomato.7', 'tomato.5', 'tomato.3', 'tomato.1'];
    default:
      return ['tomato.9', 'tomato.7', 'tomato.5', 'tomato.3', 'tomato.2', 'tomato.0'];
  }
}
