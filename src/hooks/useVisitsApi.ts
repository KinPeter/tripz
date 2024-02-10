import { ApiClient } from '../lib/apiClient.ts';
import { Visit } from '@kinpeter/pk-common';

export const useVisitsApi = () => {
  const api = new ApiClient();

  async function getAllVisits(): Promise<Visit[]> {
    return await api.get('/visits/all');
  }

  return { getAllVisits };
};
