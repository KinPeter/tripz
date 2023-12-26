export interface Flight {
  id: string;
  date: string;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: number;
  airline: Airline;
  aircraft: Aircraft;
  registration: string;
  seatNumber: string;
  seatType: string;
  flightClass: string;
  flightReason: string;
  note: string;
}

export interface Airport {
  city: string;
  name: string;
  country: string;
  iata: string;
  icao: string;
  lat: number;
  lng: number;
}

export interface Airline {
  name: string;
  iata: string;
  icao: string;
}

export interface Aircraft {
  name: string;
  icao: string;
}
