import { AuditLog } from '../types';
import { apiClient } from './client';

export const getAuditLogs = async (params?: any): Promise<{ data: AuditLog[]; total: number }> => {
  const { data } = await apiClient.get('/audit', { params });
  return data;
};
