import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard } from '../../api/dashboard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboard
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const { stats, ticketsByCategory, ticketsByStatus, staffWorkload } = data || {
    stats: { total: 0, open: 0, inProgress: 0, pending: 0, resolved: 0, slaAtRisk: 0, slaBreached: 0, escalated: 0 },
    ticketsByCategory: [],
    ticketsByStatus: [],
    staffWorkload: []
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: stats.total, color: 'border-blue-200 bg-blue-50 text-blue-900' },
          { label: 'Open', value: stats.open, color: 'border-slate-200 bg-white text-slate-900' },
          { label: 'In Progress', value: stats.inProgress, color: 'border-indigo-200 bg-indigo-50 text-indigo-900' },
          { label: 'Pending Student', value: stats.pending, color: 'border-amber-200 bg-amber-50 text-amber-900' },
          { label: 'Resolved', value: stats.resolved, color: 'border-green-200 bg-green-50 text-green-900' },
          { label: 'SLA At Risk', value: stats.slaAtRisk, color: 'border-orange-200 bg-orange-50 text-orange-900' },
          { label: 'SLA Breached', value: stats.slaBreached, color: 'border-red-200 bg-red-50 text-red-900' },
          { label: 'Escalated', value: stats.escalated, color: 'border-red-300 bg-red-100 text-red-900 font-bold' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-lg shadow-sm border ${stat.color}`}>
            <div className="text-xs font-medium uppercase tracking-wider mb-1 opacity-80">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tickets by Status</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {ticketsByStatus.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tickets by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketsByCategory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Staff Workload</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffWorkload} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="staffName" />
                <YAxis />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} />
                <Legend />
                <Bar dataKey="openTickets" name="Open Tickets" fill="#3b82f6" stackId="a" />
                <Bar dataKey="inProgressTickets" name="In Progress" fill="#8b5cf6" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
