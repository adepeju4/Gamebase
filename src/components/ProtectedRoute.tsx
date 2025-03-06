import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, refreshUserProfile } from '../lib/auth';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(isAuthenticated());

  console.log(
    `ProtectedRoute (${location.pathname}): requireAuth=${requireAuth}, isAuthed=${isAuthed}, isLoading=${isLoading}`
  );

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Checking authentication...');
      // If already authenticated, verify the token is still valid by refreshing profile
      if (isAuthed && requireAuth) {
        try {
          console.log('ProtectedRoute: Refreshing user profile...');
          const profile = await refreshUserProfile();
          if (!profile) {
            console.log('ProtectedRoute: Profile refresh failed, setting isAuthed to false');
            setIsAuthed(false);
            toast.error('Your session has expired. Please log in again.');
          } else {
            console.log('ProtectedRoute: Profile refresh successful', profile);
          }
        } catch (error) {
          console.error('ProtectedRoute: Error refreshing profile', error);
          setIsAuthed(false);
        }
      }
      setIsLoading(false);
      console.log('ProtectedRoute: Authentication check complete, isAuthed=', isAuthed);
    };

    checkAuth();
  }, [isAuthed, requireAuth]);

  if (isLoading) {
    console.log('ProtectedRoute: Still loading, showing loading state');
    // You could show a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If requireAuth is true and user is not authenticated, redirect to login
  if (requireAuth && !isAuthed) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requireAuth is false (login/signup pages) and user is authenticated, redirect to home
  if (!requireAuth && isAuthed) {
    console.log('ProtectedRoute: User already authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children
  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
