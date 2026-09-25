export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';
export type TicketStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_STUDENT' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SlaStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED';
export type CommentType = 'PUBLIC' | 'INTERNAL';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  slaStatus: SlaStatus;
  slaDeadline: string;
  category: { id: number; name: string };
  student: { id: number; name: string; email: string };
  assignedStaff?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
  pendingReason?: string;
  pendingSince?: string;
  ageingBucket: string;
}

export interface Comment {
  id: number;
  content: string;
  type: CommentType;
  author: { id: number; name: string; role: Role };
  createdAt: string;
}

export interface Activity {
  id: number;
  activityType: string;
  description: string;
  actor: { id: number; name: string };
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface SlaPolicy {
  id: number;
  priority: Priority;
  resolutionHours: number;
  active: boolean;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  oldValue: string;
  newValue: string;
}
