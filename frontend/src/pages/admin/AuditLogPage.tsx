import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../../api/audit';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { DataTable } from '../../components/DataTable';
import { AuditLog } from '../../types';
import { format } from 'date-fns';

export const AuditLogPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['auditLogs', page, searchTerm],
    queryFn: () => getAuditLogs({ page, search: searchTerm, limit: 15 })
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const logs = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / 15) || 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">System Audit Log</h1>

      <DataTable<AuditLog>
        data={logs}
        keyExtractor={(l) => l.id}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search actions or actors..."
        emptyMessage="No audit logs found."
        columns={[
          { header: 'Timestamp', accessor: (l) => format(new Date(l.timestamp), 'MMM d, yyyy HH:mm:ss'), className: 'whitespace-nowrap text-slate-500' },
          { header: 'Actor', accessor: 'actor', className: 'font-medium' },
          { header: 'Action', accessor: 'action', className: 'text-slate-600' },
          { header: 'Entity', accessor: 'entity', className: 'text-slate-500 text-xs' },
          { header: 'Changes', accessor: (l) => (
            <div className="text-xs space-y-1">
              {l.oldValue && <div><span className="text-red-500 bg-red-50 px-1 rounded">- {l.oldValue}</span></div>}
              {l.newValue && <div><span className="text-green-500 bg-green-50 px-1 rounded">+ {l.newValue}</span></div>}
            </div>
          ) },
        ]}
      />
    </div>
  );
};
