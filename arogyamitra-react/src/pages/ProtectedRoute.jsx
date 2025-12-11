import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to home
  if (requiredRole && user) {
    // For hospital staff, check if user has hospital staff properties
    const userRole = user.hospital_name ? 'HOSPITAL_STAFF' : 'PATIENT';
    if (requiredRole === 'HOSPITAL_STAFF' && userRole !== 'HOSPITAL_STAFF') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;