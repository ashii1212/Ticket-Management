import { SlaPolicy } from '../types';
import { apiClient } from './client';

export const getSlaPolicies = async (): Promise<SlaPolicy[]> => {
  const { data } = await apiClient.get('/sla-policies');
  return data;
};

export const updateSlaPolicy = async (id: number, policyData: any): Promise<SlaPolicy> => {
  const { data } = await apiClient.put(`/sla-policies/${id}`, policyData);
  return data;
};
