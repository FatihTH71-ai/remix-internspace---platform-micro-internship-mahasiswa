// src/components/ProtectedRoute.tsx
import React, { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  // Flag status login/akses (misal dari state/localStorage/context)
  isAuthenticated: boolean;
  // Route tujuan jika tidak punya akses
  redirectPath?: string;
  children?: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectPath = '/login-admin',
  children,
}) => {
  // Jika tidak terautentikasi, lempar/redirect ke halaman Login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Jika ada children render children, jika tidak render child route via Outlet
  return children ? children : <Outlet />;
};
