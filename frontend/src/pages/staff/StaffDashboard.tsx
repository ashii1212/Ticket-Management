import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getStaffDashboard } from '../../api/dashboard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';

export const StaffDashboard: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['staffDashboard'],
    queryFn: getStaffDashboard
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const stats = data?.stats || { myTickets: 0, unassigned: 0, dueSoon: 0, slaBreached: 0, pendingStudent: 0, escalated: 0 };

  const cards = [
    { title: 'My Tickets', value: stats.myTickets, link: '/staff/tickets?assignee=me', color: 'bg-blue-50 border-blue-200 text-blue-900' },
    { title: 'Unassigned', value: stats.unassigned, link: '/staff/tickets?assignee=none', color: 'bg-slate-50 border-slate-200 text-slate-900' },
    { title: 'Due Soon (At Risk)', value: stats.dueSoon, link: '/staff/tickets?slaStatus=AT_RISK', color: 'bg-orange-50 border-orange-200 text-orange-900' },
    { title: 'SLA Breached', value: stats.slaBreached, link: '/staff/tickets?slaStatus=BREACHED', color: 'bg-red-50 border-red-200 text-red-900' },
    { title: 'Pending Student', value: stats.pendingStudent, link: '/staff/tickets?status=PENDING_STUDENT', color: 'bg-amber-50 border-amber-200 text-amber-900' },
    { title: 'Escalated', value: stats.escalated, link: '/staff/tickets?status=ESCALATED', color: 'bg-purple-50 border-purple-200 text-purple-900' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Staff Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Link key={idx} to={card.link} className={`block p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${card.color}`}>
            <div className="text-sm font-medium uppercase tracking-wider mb-2 opacity-80">{card.title}</div>
            <div className="text-4xl font-bold">{card.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
