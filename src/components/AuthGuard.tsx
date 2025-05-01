
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireModerator = false
}) => {
  const { toast } = useToast();
  const location = useLocation();
  const isAuthenticated = api.auth.isAuthenticated();
  const user = api.auth.getCurrentUser();
  const isAdmin = api.auth.isAdmin();
  const isModerator = api.auth.isModerator();

  useEffect(() => {
    // Verify token validity with a backend call when a protected route is accessed
    const verifyAuth = async () => {
      if (requireAuth && isAuthenticated) {
        try {
          await api.auth.getProfile();
        } catch (error) {
          // If token is invalid, log out user
          await api.auth.logout();
          toast({
            title: "Session expired",
            description: "Please log in again.",
            variant: "destructive"
          });
        }
      }
    };

    verifyAuth();
  }, [location.pathname, requireAuth, isAuthenticated, toast]);

  // Check for authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for admin requirement
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    toast({
      title: "Access denied",
      description: "Administrator access required.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  // Check for moderator requirement
  if (requireModerator && (!isAuthenticated || !isModerator)) {
    toast({
      title: "Access denied",
      description: "Moderator access required.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated but trying to access login/register pages, redirect to home
  if (isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;