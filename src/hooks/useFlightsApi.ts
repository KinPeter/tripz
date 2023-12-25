import { ApiClient } from '../lib/apiClient.ts';
import { Flight } from '../types/flights.ts';

export const useFlightsApi = () => {
  const api = new ApiClient();

  async function getAllFlights(): Promise<Flight[]> {
    return await api.get('/flights/all');
  }

  return { getAllFlights };
};
