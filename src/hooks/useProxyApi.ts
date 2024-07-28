import { ApiClient } from '../lib/apiClient.ts';
import { Airport, Airline, VisitRequest } from '@kinpeter/pk-common';

export const useProxyApi = () => {
  const api = new ApiClient();

  async function getAirport(iata: string): Promise<Airport> {
    return await api.get('/proxy/airport/' + iata);
  }

  async function getAirline(iata: string): Promise<Airline> {
    return await api.get('/proxy/airline/' + iata);
  }

  async function getCity(coords: string): Promise<VisitRequest> {
    return await api.get('/proxy/city/' + coords);
  }

  return { getAirport, getAirline, getCity };
};
