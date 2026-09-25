import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../../api/tickets';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { DataTable } from '../../components/DataTable';
import { StatusBadge, PriorityBadge } from '../../components/Badges';
import { Ticket } from '../../types';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentTicketList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['studentTickets', page, searchTerm, statusFilter],
    queryFn: () => getTickets({ page, search: searchTerm, status: statusFilter, limit: 10 })
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const tickets = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / 10) || 1;

  const filters = (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white"
    >
      <option value="">All Statuses</option>
      <option value="NEW">New</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="PENDING_STUDENT">Pending Action</option>
      <option value="RESOLVED">Resolved</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">My Tickets</h1>
        <Link 
          to="/student/tickets/new" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create Ticket
        </Link>
      </div>

      <DataTable<Ticket>
        data={tickets}
        keyExtractor={(t) => t.id}
        onRowClick={(t) => navigate(`/student/tickets/${t.id}`)}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search tickets..."
        filters={filters}
        emptyMessage="No tickets found matching your criteria."
        columns={[
          { header: 'Ticket #', accessor: 'ticketNumber', className: 'font-medium text-blue-600' },
          { header: 'Title', accessor: 'title' },
          { header: 'Status', accessor: (t) => <StatusBadge status={t.status} /> },
          { header: 'Priority', accessor: (t) => <PriorityBadge priority={t.priority} /> },
          { header: 'Category', accessor: (t) => t.category.name },
          { header: 'Created', accessor: (t) => format(new Date(t.createdAt), 'MMM d, yyyy') },
        ]}
      />
    </div>
  );
};
