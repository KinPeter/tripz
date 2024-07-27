import { Aircraft, Airline, Flight } from '@kinpeter/pk-common/types/flights.ts';
import {
  Airport,
  airportSchema,
  FlightClass,
  FlightReason,
  flightSchema,
  SeatType,
  ValidationError,
} from '@kinpeter/pk-common';
import { createFormContext } from '@mantine/form';
import { FlexProps } from '@mantine/core';
import * as yup from 'yup';

export type FormFlight = Omit<Flight, 'id' | 'createdAt'>;

export const [FlightFormProvider, useFlightFormContext, useFlightForm] =
  createFormContext<FormFlight>();

export function transformFlightValues(values: FormFlight): FormFlight {
  return {
    ...values,
    flightNumber: values.flightNumber.toUpperCase(),
    distance: Number(values.distance),
    from: {
      ...values.from,
      lat: Number(values.from.lat),
      lng: Number(values.from.lng),
      iata: values.from.iata.toUpperCase(),
      icao: values.from.icao.toUpperCase(),
    },
    to: {
      ...values.to,
      lat: Number(values.to.lat),
      lng: Number(values.to.lng),
      iata: values.to.iata.toUpperCase(),
      icao: values.to.icao.toUpperCase(),
    },
    departureTime:
      values.departureTime.length === 5 ? `${values.departureTime}:00` : values.departureTime,
    arrivalTime: values.arrivalTime.length === 5 ? `${values.arrivalTime}:00` : values.arrivalTime,
    duration: values.duration.length === 5 ? `${values.duration}:00` : values.duration,
    aircraft: {
      ...values.aircraft,
      icao: values.aircraft.icao.toUpperCase(),
    },
    airline: {
      ...values.airline,
      icao: values.airline.icao.toUpperCase(),
      iata: values.airline.iata.toUpperCase(),
    },
    seatNumber: values.seatNumber.toUpperCase(),
    registration: values.registration.toUpperCase(),
  };
}

export function findAirportFromFlights(iata: string, flights: Flight[]): Airport | null {
  const flightIndex = flights.findIndex(
    ({ to, from }) =>
      to.iata.toLowerCase() === iata.toLowerCase() || from.iata.toLowerCase() === iata.toLowerCase()
  );
  if (flightIndex === -1) return null;
  const flight = flights[flightIndex];
  if (flight.from.iata.toLowerCase() === iata.toLowerCase()) return flight.from;
  else return flight.to;
}

export function findAirlineFromFlights(iata: string, flights: Flight[]): Airline | null {
  const flight = flights.find(({ airline }) => airline.iata.toLowerCase() === iata.toLowerCase());
  if (!flight) return null;
  else return flight.airline;
}

export function findAircraftFromFlights(icao: string, flights: Flight[]): Aircraft | null {
  const flight = flights.find(({ aircraft }) => aircraft.icao.toLowerCase() === icao.toLowerCase());
  if (!flight) return null;
  else return flight.aircraft;
}

export const HH_MM_REGEX = new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/);
export const flightFormSchema = flightSchema.shape({
  from: airportSchema.shape({
    lat: yup.number().required(ValidationError.NUMBER_REQUIRED),
    lng: yup.number().required(ValidationError.NUMBER_REQUIRED),
  }),
  to: airportSchema.shape({
    lat: yup.number().required(ValidationError.NUMBER_REQUIRED),
    lng: yup.number().required(ValidationError.NUMBER_REQUIRED),
  }),
  departureTime: yup
    .string()
    .matches(HH_MM_REGEX, ValidationError.INVALID_TIME)
    .required(ValidationError.STRING_REQUIRED),
  arrivalTime: yup
    .string()
    .matches(HH_MM_REGEX, ValidationError.INVALID_TIME)
    .required(ValidationError.STRING_REQUIRED),
  duration: yup
    .string()
    .matches(HH_MM_REGEX, ValidationError.INVALID_TIME)
    .required(ValidationError.STRING_REQUIRED),
});

export const flightInitialValues = {
  date: '',
  flightNumber: '',
  departureTime: '',
  arrivalTime: '',
  duration: '',
  registration: '',
  seatNumber: '',
  seatType: SeatType.AISLE,
  flightClass: FlightClass.ECONOMY,
  flightReason: FlightReason.LEISURE,
  distance: 0,
  note: '',
  from: {
    iata: '',
    icao: '',
    country: '',
    city: '',
    name: '',
    lat: 0,
    lng: 0,
  },
  to: {
    iata: '',
    icao: '',
    country: '',
    city: '',
    name: '',
    lat: 0,
    lng: 0,
  },
  airline: {
    iata: '',
    icao: '',
    name: '',
  },
  aircraft: {
    icao: '',
    name: '',
  },
};

export const formFlexProps = {
  gap: 'md',
  wrap: 'wrap',
  mb: 'md',
} as FlexProps;
