import { ApiClient } from '../lib/apiClient.ts';
import { VisitRequest, Visit, Flight, ListResponse } from '../types';

export const useVisitsApi = () => {
  const api = new ApiClient();

  async function getAllVisits(): Promise<ListResponse<Visit>> {
    return await api.get('/visits/');
  }

  async function createVisit(data: VisitRequest): Promise<Visit> {
    return await api.post('/visits/', data);
  }

  async function updateVisit(data: VisitRequest, id: string): Promise<Visit> {
    return await api.put('/visits/' + id, data);
  }

  async function deleteVisit(id: string): Promise<Flight> {
    return await api.delete('/visits/' + id, undefined);
  }

  return { getAllVisits, createVisit, updateVisit, deleteVisit };
};
