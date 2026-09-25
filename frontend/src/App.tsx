import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';

import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentTicketList } from './pages/student/StudentTicketList';
import { CreateTicketPage } from './pages/student/CreateTicketPage';
import { StudentTicketDetail } from './pages/student/StudentTicketDetail';

import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffTicketList } from './pages/staff/StaffTicketList';
import { StaffTicketDetail } from './pages/staff/StaffTicketDetail';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTicketList } from './pages/admin/AdminTicketList';
import { AdminTicketDetail } from './pages/admin/AdminTicketDetail';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { SlaPoliciesPage } from './pages/admin/SlaPoliciesPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'STAFF') return <Navigate to="/staff/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<RoleRedirect />} />
          
          {/* Student Routes */}
          <Route path="student">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="tickets" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentTicketList /></ProtectedRoute>} />
            <Route path="tickets/new" element={<ProtectedRoute allowedRoles={['STUDENT']}><CreateTicketPage /></ProtectedRoute>} />
            <Route path="tickets/:id" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentTicketDetail /></ProtectedRoute>} />
          </Route>

          {/* Staff Routes */}
          <Route path="staff">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffDashboard /></ProtectedRoute>} />
            <Route path="tickets" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffTicketList /></ProtectedRoute>} />
            <Route path="tickets/:id" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffTicketDetail /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="admin">
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="tickets" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTicketList /></ProtectedRoute>} />
            <Route path="tickets/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTicketDetail /></ProtectedRoute>} />
            <Route path="categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><CategoriesPage /></ProtectedRoute>} />
            <Route path="sla" element={<ProtectedRoute allowedRoles={['ADMIN']}><SlaPoliciesPage /></ProtectedRoute>} />
            <Route path="audit" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogPage /></ProtectedRoute>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
