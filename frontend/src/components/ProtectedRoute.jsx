import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false, customerOnly = false, allowedRoles }) => {
  const { isLoggedIn, isAdmin, isCustomer, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#8C7366' }} />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const requiresAdmin = adminOnly || (allowedRoles && allowedRoles.includes('ADMIN') && !allowedRoles.includes('CUSTOMER'));
  const requiresCustomer = customerOnly || (allowedRoles && allowedRoles.includes('CUSTOMER') && !allowedRoles.includes('ADMIN'));

  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiresCustomer && !isCustomer) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
