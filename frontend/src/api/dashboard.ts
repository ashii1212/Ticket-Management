import { apiClient } from './client';

export const getStudentDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/student');
  return data;
};

export const getStaffDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/staff');
  return data;
};

export const getAdminDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/admin');
  return data;
};
