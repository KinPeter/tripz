import { ApiClient } from '../lib/apiClient.ts';
import { Airport, Airline, Aircraft, ListResponse, UUID, Trips } from '../types';

export const useTripsApi = () => {
  const api = new ApiClient();

  async function getTrips(userId: UUID): Promise<Trips> {
    return await api.get('/trips/' + userId, false);
  }

  async function getAirport(iata: string): Promise<Airport> {
    return await api.get('/trips/airports?iata=' + encodeURIComponent(iata));
  }

  async function searchAirlines(iata: string | null, name: string | null): Promise<Airline[]> {
    let query = '';
    if (iata) {
      query += `iata=${encodeURIComponent(iata)}`;
    } else if (name && !iata) {
      query += `name=${encodeURIComponent(name)}`;
    }
    const res = await api.get<ListResponse<Airline>>(`/trips/airlines?${query}`);
    return res.entities;
  }

  async function searchAircrafts(search: string): Promise<Aircraft[]> {
    const res = await api.get<ListResponse<Aircraft>>(
      '/trips/aircrafts?search=' + encodeURIComponent(search)
    );
    return res.entities;
  }

  return { getTrips, getAirport, searchAirlines, searchAircrafts };
};
