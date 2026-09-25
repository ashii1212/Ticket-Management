import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = 'No records found', 
  message = 'There is no data to display at this time.',
  action 
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Inbox className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-sm">{message}</p>
    {action && <div>{action}</div>}
  </div>
);
