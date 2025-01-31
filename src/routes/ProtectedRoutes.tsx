import React, { Suspense, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  component: React.FC;
  allowedRoles: string[];
  Layout: React.FC<{ children: React.ReactNode }>;
  title: string;
}

const roleMapping: Record<string, string> = {
  Admin: 'admin',
  guest: 'guest',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, Layout, allowedRoles, title }) => {
  const { isAuthenticated, role, isInitializing } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedRole = roleMapping[role || 'guest'];

 // To keep the user on same page if page is reload
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  // Handle authentication and authorization with conditional rendering
  if (!isAuthenticated && !allowedRoles.includes('guest')) {
    return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </Layout>
  );
};

export default ProtectedRoute;
