import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { signInSuccess, signOut } from '../features/auth/authSlice';
import React, { startTransition, Suspense, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import routeConfig from './routeConfig';
import ProtectedRoute from './ProtectedRoutes';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../pages/NotFound';
import AuthLayout from '../layout/AuthLayout';
import SignUp from '../pages/Authentication/SignUp';
import SignIn from '../pages/Authentication/SignIn';
import ResetPassword from '../pages/Authentication/ResetPassword';
import NewAccountCreation from '../pages/NewAccountCreation';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const AppRoutes: React.FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, role, isInitializing } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const roleMapping: Record<string, string> = {
    Admin: 'admin',
    guest: 'guest',
  };

  const normalizedRole = useMemo(() => roleMapping[role || 'guest'], [role]);

  // Handle authentication state on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    startTransition(() => {
      if (token) {
        startTransition(() => {
          dispatch(signInSuccess({ authToken: token, role }));
        });
      } else {
        dispatch(signOut());
      }
    });
  }, [dispatch]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const defaultRoute = useMemo(() => {
    // if (normalizedRole === 'guest') return '/auth/signin';
    return normalizedRole === 'admin' ? '/dashboard' : '/auth/signin';
  }, [normalizedRole]);

  // Handle page refresh and initial loading
  useEffect(() => {
    if (isInitializing) return;
  }, [isInitializing, isAuthenticated, pathname, navigate]);

  // Define public routes that are always accessible
  const publicRoutes = ['/auth/signin', '/auth/signup', '/reset-password', '/new-account-creation'];

  // To keep the user on same page if page is reload
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        {routeConfig.map((route, index) => (
          <Route
            key={`${route.path}-${index}`}
            path={route.path}
            element={
              <ProtectedRoute
                component={route.component}
                allowedRoles={route.roles}
                title={route.title}
                Layout={route.layout}
              />
            }
          />
        ))}
        {/* Separate catch-all route with its own Suspense boundary */}
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute
                component={NotFound}
                allowedRoles={['admin', 'guest']}
                title="404 Not Found"
                Layout={AuthLayout}
              />
            </Suspense>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute component={SignUp} allowedRoles={['guest']} title="Sign Up" Layout={AuthLayout} />
            </Suspense>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute component={SignIn} allowedRoles={['guest']} title="Sign In" Layout={AuthLayout} />
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute
                component={ResetPassword}
                allowedRoles={['guest']}
                title="Reset Password"
                Layout={AuthLayout}
              />
            </Suspense>
          }
        />
        <Route
          path="/new-account-creation"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute
                component={NewAccountCreation}
                allowedRoles={['guest']}
                title="New Account Creation | SSI"
                Layout={AuthLayout}
              />
            </Suspense>
          }
        />
        {/* Catch all route - redirect to default if not a public route */}
        <Route path="*" element={publicRoutes.includes(pathname) ? null : <Navigate to={defaultRoute} replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
