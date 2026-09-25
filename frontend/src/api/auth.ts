import { User, Role } from '../types';
import { apiClient } from './client';

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};
