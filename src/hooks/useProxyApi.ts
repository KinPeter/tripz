import { ApiClient } from '../lib/apiClient.ts';
import { VisitRequest } from '../types';

export const useProxyApi = () => {
  const api = new ApiClient();

  async function getCity(lat: number, lng: number): Promise<VisitRequest> {
    return await api.get('/proxy/location/city/?lat=' + lat + '&lng=' + lng);
  }

  return { getCity };
};
