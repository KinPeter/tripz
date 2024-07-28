import { ApiClient } from '../lib/apiClient.ts';
import { Airport, Airline } from '@kinpeter/pk-common';

export const useProxyApi = () => {
  const api = new ApiClient();

  async function getAirport(iata: string): Promise<Airport> {
    return await api.get('/proxy/airport/' + iata);
  }

  async function getAirline(iata: string): Promise<Airline> {
    return await api.get('/proxy/airline/' + iata);
  }

  return { getAirport, getAirline };
};
