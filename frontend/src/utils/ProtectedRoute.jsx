import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requiredRole = null, allowedRoles = null }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a2e1a 0%, #0f4a2a 100%)',
      }}>
        <div style={{
          color: '#fff',
          fontSize: '18px',
          fontFamily: 'Inter, sans-serif',
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={getRedirect(user?.role)} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRedirect(user?.role)} replace />;
  }

  return children;
}

function getRedirect(role) {
  if (role === 'admin') return '/admin';
  if (['worker', 'veterinarian', 'manager', 'accountant'].includes(role)) return '/worker';
  return '/dashboard';
}

export default ProtectedRoute;
