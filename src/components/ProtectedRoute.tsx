import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { refreshUserProfile } from '../lib/auth';
import { toast } from 'sonner';
import Cookies from 'universal-cookie';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component that handles authentication
 * If requireAuth is true, redirects to login if not authenticated
 * If requireAuth is false, redirects to home if authenticated (for login/signup pages)
 */
const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const location = useLocation();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(true);

  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = cookies.get('token');

      if (token) {
        setIsAuthed(true);

        if (requireAuth) {
          try {
            const profile = await refreshUserProfile();
            if (!profile) {
              setIsAuthed(false);

              if (location.pathname !== '/login') {
                toast.error('Your session has expired. Please log in again.');
              }
            }
          } catch (error) {
            console.error('Error refreshing profile:', error);
            setIsAuthed(false);
          }
        }
      } else {
        setIsAuthed(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [requireAuth, location.pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (requireAuth && !isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
