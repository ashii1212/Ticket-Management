import { Ticket, Comment, Activity, TicketStatus, Priority } from '../types';
import { apiClient } from './client';

export const getTickets = async (params?: any): Promise<{ data: Ticket[]; total: number }> => {
  const { data } = await apiClient.get('/tickets', { params });
  return data;
};

export const createTicket = async (ticketData: any): Promise<Ticket> => {
  const { data } = await apiClient.post('/tickets', ticketData);
  return data;
};

export const getTicket = async (id: number): Promise<Ticket> => {
  const { data } = await apiClient.get(`/tickets/${id}`);
  return data;
};

export const assignTicket = async (id: number, staffId: number): Promise<Ticket> => {
  const { data } = await apiClient.post(`/tickets/${id}/assign`, { staffId });
  return data;
};

export const transitionStatus = async (id: number, status: TicketStatus, reason?: string): Promise<Ticket> => {
  const { data } = await apiClient.post(`/tickets/${id}/status`, { status, reason });
  return data;
};

export const resolveTicket = async (id: number, resolutionNote: string): Promise<Ticket> => {
  const { data } = await apiClient.post(`/tickets/${id}/resolve`, { resolutionNote });
  return data;
};

export const escalateTicket = async (id: number, reason: string): Promise<Ticket> => {
  const { data } = await apiClient.post(`/tickets/${id}/escalate`, { reason });
  return data;
};

export const addComment = async (id: number, commentData: any): Promise<Comment> => {
  const { data } = await apiClient.post(`/tickets/${id}/comments`, commentData);
  return data;
};

export const getComments = async (id: number): Promise<Comment[]> => {
  const { data } = await apiClient.get(`/tickets/${id}/comments`);
  return data;
};

export const getActivity = async (id: number): Promise<Activity[]> => {
  const { data } = await apiClient.get(`/tickets/${id}/activities`);
  return data;
};
