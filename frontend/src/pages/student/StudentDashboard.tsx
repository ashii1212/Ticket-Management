import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentDashboard } from '../../api/dashboard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { StatusBadge } from '../../components/Badges';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Ticket } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: getStudentDashboard
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const { stats, recentTickets } = data || { stats: { open: 0, pendingAction: 0, resolved: 0 }, recentTickets: [] };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-1">Open Tickets</div>
          <div className="text-3xl font-bold text-slate-800">{stats.open}</div>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-200">
          <div className="text-sm font-medium text-amber-700 mb-1">Pending Action</div>
          <div className="text-3xl font-bold text-amber-900">{stats.pendingAction}</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
          <div className="text-sm font-medium text-green-700 mb-1">Resolved</div>
          <div className="text-3xl font-bold text-green-900">{stats.resolved}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Recent Tickets</h2>
          <Link to="/student/tickets" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Ticket #</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No recent tickets found.
                  </td>
                </tr>
              ) : (
                recentTickets.map((ticket: Ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">
                      <Link to={`/student/tickets/${ticket.id}`}>{ticket.ticketNumber}</Link>
                    </td>
                    <td className="px-6 py-4">{ticket.title}</td>
                    <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                    <td className="px-6 py-4 text-slate-500">{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
