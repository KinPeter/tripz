import { ApiClient } from '../lib/apiClient.ts';
import { Flight } from '@kinpeter/pk-common';

export const useFlightsApi = () => {
  const api = new ApiClient();

  async function getAllFlights(): Promise<Flight[]> {
    return await api.get('/flights/all');
  }

  return { getAllFlights };
};
