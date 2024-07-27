import { ApiClient } from '../lib/apiClient.ts';
import { VisitRequest, Visit } from '@kinpeter/pk-common';

export const useVisitsApi = () => {
  const api = new ApiClient();

  async function getAllVisits(): Promise<Visit[]> {
    return await api.get('/visits');
  }

  async function createVisit(data: VisitRequest): Promise<Visit> {
    return await api.post('/visits', data);
  }

  async function updateVisit(data: VisitRequest, id: string): Promise<Visit> {
    return await api.put('/visits/' + id, data);
  }

  return { getAllVisits, createVisit, updateVisit };
};
