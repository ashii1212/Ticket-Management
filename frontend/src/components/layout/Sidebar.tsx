import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  PlusCircle, 
  Tags, 
  Clock, 
  ActivitySquare
} from 'lucide-react';
import { cn } from '../Badges';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getLinks = () => {
    if (user?.role === 'STUDENT') {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Tickets', path: '/student/tickets', icon: TicketIcon },
        { name: 'Create Ticket', path: '/student/tickets/new', icon: PlusCircle },
      ];
    }
    if (user?.role === 'STAFF') {
      return [
        { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
        { name: 'Tickets', path: '/staff/tickets', icon: TicketIcon },
      ];
    }
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'All Tickets', path: '/admin/tickets', icon: TicketIcon },
        { name: 'Categories', path: '/admin/categories', icon: Tags },
        { name: 'SLA Policies', path: '/admin/sla', icon: Clock },
        { name: 'Audit Log', path: '/admin/audit', icon: ActivitySquare },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-800 text-white min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <h1 className="text-lg font-bold text-blue-400">Edumerge Support</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
