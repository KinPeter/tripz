import { ApiClient } from '../lib/apiClient.ts';
import { Trips, UUID } from '../types';

export const usePublicTripzApi = () => {
  const api = new ApiClient();

  async function getAllTrips(userId: UUID): Promise<Trips> {
    return await api.get('/public/trips/' + userId, false);
  }

  return { getAllTrips };
};
