import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { TicketStatus, Priority, SlaStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const colors = {
    NEW: 'bg-gray-100 text-gray-800',
    ASSIGNED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    PENDING_STUDENT: 'bg-amber-100 text-amber-800',
    ESCALATED: 'bg-red-100 text-red-800',
    RESOLVED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-slate-200 text-slate-800',
  };
  const labels = {
    NEW: 'New',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    PENDING_STUDENT: 'Pending Student',
    ESCALATED: 'Escalated',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", colors[status])}>
      {labels[status]}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", colors[priority])}>
      {priority}
    </span>
  );
};

export const SlaBadge: React.FC<{ status: SlaStatus }> = ({ status }) => {
  const colors = {
    ON_TRACK: 'bg-green-100 text-green-800',
    AT_RISK: 'bg-amber-100 text-amber-800',
    BREACHED: 'bg-red-100 text-red-800',
  };
  
  const labels = {
    ON_TRACK: 'On Track',
    AT_RISK: 'At Risk',
    BREACHED: 'Breached'
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", colors[status])}>
      {labels[status]}
    </span>
  );
};
