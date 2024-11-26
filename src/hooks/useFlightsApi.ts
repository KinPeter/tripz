import { ApiClient } from '../lib/apiClient.ts';
import { Flight, FlightRequest } from '@kinpeter/pk-common';

export const useFlightsApi = () => {
  const api = new ApiClient();

  async function getAllFlights(): Promise<Flight[]> {
    return await api.get('/flights');
  }

  async function createFlight(data: FlightRequest): Promise<Flight> {
    return await api.post('/flights', data);
  }

  async function updateFlight(data: FlightRequest, id: string): Promise<Flight> {
    return await api.put('/flights/' + id, data);
  }

  async function deleteFlight(id: string): Promise<Flight> {
    return await api.delete('/flights/' + id, undefined);
  }

  return { getAllFlights, createFlight, updateFlight, deleteFlight };
};
