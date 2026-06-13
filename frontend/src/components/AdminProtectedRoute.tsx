import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  // Check admin authentication
  const isAdmin = localStorage.getItem('isAdmin');
  const adminEmail = localStorage.getItem('adminEmail');

  if (!isAdmin || isAdmin !== 'true') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
