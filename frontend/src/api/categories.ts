import { Category } from '../types';
import { apiClient } from './client';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get('/categories');
  return data;
};

export const createCategory = async (categoryData: any): Promise<Category> => {
  const { data } = await apiClient.post('/categories', categoryData);
  return data;
};

export const updateCategory = async (id: number, categoryData: any): Promise<Category> => {
  const { data } = await apiClient.put(`/categories/${id}`, categoryData);
  return data;
};
