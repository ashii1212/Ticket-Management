import { apiClient } from './client';

export const getStudentDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/student');
  const counts = data.ticketCountsByStatus || {};
  return {
    stats: {
      open: (counts.NEW || 0) + (counts.ASSIGNED || 0) + (counts.IN_PROGRESS || 0) + (counts.ESCALATED || 0),
      pendingAction: counts.PENDING_STUDENT || 0,
      resolved: (counts.RESOLVED || 0) + (counts.CLOSED || 0),
    },
    recentTickets: data.recentTickets || [],
  };
};

export const getStaffDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/staff');
  return {
    stats: {
      myTickets: data.myAssignedCount || 0,
      unassigned: data.unassignedCount || 0,
      dueSoon: data.dueSoonCount || 0,
      slaBreached: data.breachedCount || 0,
      pendingStudent: data.pendingStudentCount || 0,
      escalated: data.escalatedCount || 0,
    }
  };
};

export const getAdminDashboard = async () => {
  const { data } = await apiClient.get('/dashboard/admin');
  return {
    stats: {
      total: data.totalTickets || 0,
      open: 0,
      inProgress: 0,
      pending: 0,
      resolved: 0,
      slaAtRisk: 0,
      slaBreached: 0,
      escalated: data.escalatedCount || 0,
    },
    ticketsByCategory: data.byCategory || [],
    ticketsByStatus: data.byStatus ? Object.entries(data.byStatus).map(([name, value]) => ({ name, value })) : [],
    staffWorkload: data.byStaff || [],
  };
};
