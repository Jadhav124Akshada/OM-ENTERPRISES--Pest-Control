import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * Route wrapper that prevents ADMIN users from seeing customer/public pages
 * (e.g. Home Page, About Us Page, Contact Us Page).
 * If an Admin attempts to access these pages, they are redirected to /admin.
 */
const NonAdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#8C7366' }} />
      </Box>
    );
  }

  if (isLoggedIn && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default NonAdminRoute;
