import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSlaPolicies, updateSlaPolicy } from '../../api/sla';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { Modal } from '../../components/Modal';
import { PriorityBadge } from '../../components/Badges';
import { SlaPolicy } from '../../types';
import { Edit2 } from 'lucide-react';

export const SlaPoliciesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingPolicy, setEditingPolicy] = useState<SlaPolicy | null>(null);
  const [hours, setHours] = useState<number>(0);

  const { data: policies = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['slaPolicies'],
    queryFn: getSlaPolicies
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => updateSlaPolicy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slaPolicies'] });
      setEditingPolicy(null);
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const handleEdit = (policy: SlaPolicy) => {
    setEditingPolicy(policy);
    setHours(policy.resolutionHours);
  };

  const handleSave = () => {
    if (editingPolicy) {
      updateMutation.mutate({ id: editingPolicy.id, data: { resolutionHours: hours } });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">SLA Policies</h1>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resolution Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {policies.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><PriorityBadge priority={p.priority} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{p.resolutionHours} hours</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1 justify-end w-full"
                  >
                    <Edit2 className="w-4 h-4"/> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editingPolicy} onClose={() => setEditingPolicy(null)} title={`Edit SLA Policy: ${editingPolicy?.priority}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Resolution Time (Hours)</label>
            <input
              type="number"
              min="1"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => setEditingPolicy(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200">Cancel</button>
            <button onClick={handleSave} disabled={updateMutation.isPending || hours < 1} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
