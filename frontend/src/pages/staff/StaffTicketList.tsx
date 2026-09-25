import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTickets } from '../../api/tickets';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { DataTable } from '../../components/DataTable';
import { StatusBadge, PriorityBadge, SlaBadge } from '../../components/Badges';
import { Ticket } from '../../types';
import { format } from 'date-fns';

export const StaffTicketList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const priorityFilter = searchParams.get('priority') || '';
  const slaStatusFilter = searchParams.get('slaStatus') || '';

  const setParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['staffTickets', page, searchTerm, statusFilter, priorityFilter, slaStatusFilter],
    queryFn: () => getTickets({ page, search: searchTerm, status: statusFilter, priority: priorityFilter, slaStatus: slaStatusFilter, limit: 15 })
  });

  const tickets = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / 15) || 1;

  const filters = (
    <>
      <select value={statusFilter} onChange={(e) => setParam('status', e.target.value)} className="border border-slate-300 rounded-md text-sm px-2 py-1.5 bg-white">
        <option value="">All Statuses</option>
        <option value="NEW">New</option>
        <option value="ASSIGNED">Assigned</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="PENDING_STUDENT">Pending</option>
        <option value="ESCALATED">Escalated</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
      <select value={priorityFilter} onChange={(e) => setParam('priority', e.target.value)} className="border border-slate-300 rounded-md text-sm px-2 py-1.5 bg-white">
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
      <select value={slaStatusFilter} onChange={(e) => setParam('slaStatus', e.target.value)} className="border border-slate-300 rounded-md text-sm px-2 py-1.5 bg-white">
        <option value="">All SLA Statuses</option>
        <option value="ON_TRACK">On Track</option>
        <option value="AT_RISK">At Risk</option>
        <option value="BREACHED">Breached</option>
      </select>
    </>
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tickets</h1>

      <DataTable<Ticket>
        data={tickets}
        keyExtractor={(t) => t.id}
        onRowClick={(t) => navigate(`/staff/tickets/${t.id}`)}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setParam('page', p.toString())}
        searchTerm={searchTerm}
        onSearchChange={(t) => setParam('search', t)}
        searchPlaceholder="Search tickets..."
        filters={filters}
        emptyMessage="No tickets found matching your criteria."
        columns={[
          { header: 'Ticket #', accessor: 'ticketNumber', className: 'font-medium text-blue-600' },
          { header: 'Title', accessor: (t) => <div className="truncate max-w-[200px]" title={t.title}>{t.title}</div> },
          { header: 'Student', accessor: (t) => t.student.name },
          { header: 'Category', accessor: (t) => t.category.name },
          { header: 'Priority', accessor: (t) => <PriorityBadge priority={t.priority} /> },
          { header: 'Status', accessor: (t) => <StatusBadge status={t.status} /> },
          { header: 'SLA', accessor: (t) => <SlaBadge status={t.slaStatus} /> },
          { header: 'Assigned To', accessor: (t) => t.assignedStaff?.name || '-' },
          { header: 'Created', accessor: (t) => format(new Date(t.createdAt), 'MMM d, yyyy') },
        ]}
      />
    </div>
  );
};
