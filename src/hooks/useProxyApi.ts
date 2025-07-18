import { ApiClient } from '../lib/apiClient.ts';
import { Airport, Airline, VisitRequest } from '../types';

export const useProxyApi = () => {
  const api = new ApiClient();

  async function getAirport(iata: string): Promise<Airport> {
    return await api.get('/proxy/airport/' + iata);
  }

  async function getAirline(iata: string): Promise<Airline> {
    return await api.get('/proxy/airline/' + iata);
  }

  async function getCity(lat: number, lng: number): Promise<VisitRequest> {
    return await api.get('/proxy/location/city/?lat=' + lat + '&lng=' + lng);
  }

  return { getAirport, getAirline, getCity };
};
