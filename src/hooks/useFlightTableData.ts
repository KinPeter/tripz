import { useStore } from '../store';
import { useState } from 'react';
import { Flight, FlightClass } from '@kinpeter/pk-common';
import { FlightWithPosition } from '../types/flights.ts';

function sortByDate(a: Flight, b: Flight): number {
  const timestampA = Date.parse(`${a.date}T${a.departureTime}`);
  const timestampB = Date.parse(`${b.date}T${b.departureTime}`);
  return timestampB - timestampA;
}

function addPosition(f: Flight, index: number, flights: Flight[]): FlightWithPosition {
  return { ...f, position: flights.length - index };
}

function filterDefault(f: Flight, expression: string): boolean {
  if (!isNaN(Number(expression))) {
    return f.date.includes(expression);
  }

  return checkFrom(f, expression) || checkTo(f, expression);
}

function getFilterTerms(expresison: string): [string, string] {
  const regex = /\*(\w+)\s(.+)/;
  const match = expresison.match(regex);
  return [match?.[1] ?? '', match?.[2] ?? ''];
}

function checkFrom(f: Flight, query: string): boolean {
  return (
    f.from.country.toLowerCase().includes(query) ||
    f.from.city.toLowerCase().includes(query) ||
    f.from.name.toLowerCase().includes(query) ||
    f.from.iata.toLowerCase().includes(query)
  );
}

function checkTo(f: Flight, query: string): boolean {
  return (
    f.to.country.toLowerCase().includes(query) ||
    f.to.city.toLowerCase().includes(query) ||
    f.to.name.toLowerCase().includes(query) ||
    f.to.iata.toLowerCase().includes(query)
  );
}

function checkAirline(f: Flight, query: string): boolean {
  return (
    f.airline.name.toLowerCase().includes(query) ||
    f.airline.iata.toLowerCase().includes(query) ||
    f.airline.icao.toLowerCase().includes(query)
  );
}

function checkAircraft(f: Flight, query: string): boolean {
  return (
    f.aircraft.name.toLowerCase().includes(query) || f.aircraft.icao.toLowerCase().includes(query)
  );
}

function checkSeat(f: Flight, query: string): boolean {
  return f.seatType.toLowerCase().includes(query);
}

function checkClass(f: Flight, query: string): boolean {
  if (query.length === 1) {
    return (
      (query === 'y' && f.flightClass === FlightClass.ECONOMY) ||
      (query === 'w' && f.flightClass === FlightClass.PREMIUM_ECONOMY) ||
      (query === 'c' && f.flightClass === FlightClass.BUSINESS) ||
      (query === 'f' && f.flightClass === FlightClass.FIRST)
    );
  }
  return f.flightClass.toLowerCase().includes(query);
}

function checkReason(f: Flight, query: string): boolean {
  return f.flightReason.toLowerCase().includes(query);
}

function filterByFrom(flights: Flight[], query: string): Flight[] {
  return flights.filter(f => checkFrom(f, query));
}

function filterByTo(flights: Flight[], query: string): Flight[] {
  return flights.filter(f => checkTo(f, query));
}

function filterByAirline(flights: Flight[], query: string): Flight[] {
  return flights.filter(f => checkAirline(f, query));
}

function filterByAircraft(flights: Flight[], query: string): Flight[] {
  return flights.filter(f => checkAircraft(f, query));
}

function filterBySeat(flights: Flight[], query: string): Flight[] {
  return flights.filter(f => checkSeat(f, query));
}

function filterByClass(flights: Flight[], query: string): Flight[] {
  return flights.filter(f => checkClass(f, query));
}

function filterByReason(flights: Flight[], query: string): Flight[] {
  return flights.filter(f => checkReason(f, query));
}

export const useFlightTableData = () => {
  const flights = useStore(s => s.flights);
  const [tableData, setTableData] = useState([...flights].sort(sortByDate).map(addPosition));

  const filter = (expression: string) => {
    if (!expression) {
      setTableData([...flights].sort(sortByDate).map(addPosition));
    } else if (expression.startsWith('*')) {
      const [filter, rawQuery] = getFilterTerms(expression);
      if (!filter || !rawQuery) return;
      const query = rawQuery.trim().toLowerCase();
      let data: Flight[] = [];
      switch (filter) {
        case 'from':
          data = filterByFrom([...flights], query);
          break;
        case 'to':
          data = filterByTo([...flights], query);
          break;
        case 'airline':
          data = filterByAirline([...flights], query);
          break;
        case 'aircraft':
          data = filterByAircraft([...flights], query);
          break;
        case 'seat':
          data = filterBySeat([...flights], query);
          break;
        case 'class':
          data = filterByClass([...flights], query);
          break;
        case 'reason':
          data = filterByReason([...flights], query);
          break;
      }
      setTableData(data.sort(sortByDate).map(addPosition));
      return;
    } else {
      setTableData(
        [...flights]
          .filter(f => filterDefault(f, expression))
          .sort(sortByDate)
          .map(addPosition)
      );
    }
  };

  return {
    tableData,
    filter,
  };
};
