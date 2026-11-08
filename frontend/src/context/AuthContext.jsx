import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved session on application start
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('om_token');
      const savedUser = localStorage.getItem('om_user');
      const savedRole = localStorage.getItem('om_role');

      if (savedToken && savedUser && savedRole) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      }
    } catch (error) {
      console.error('Failed to load session from storage:', error);
      localStorage.removeItem('om_token');
      localStorage.removeItem('om_user');
      localStorage.removeItem('om_role');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save session when user logs in
  const login = (userData, userToken, userRole) => {
    setUser(userData);
    setToken(userToken);
    setRole(userRole);

    localStorage.setItem('om_token', userToken);
    localStorage.setItem('om_user', JSON.stringify(userData));
    localStorage.setItem('om_role', userRole);
  };

  // Clear session on logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);

    localStorage.removeItem('om_token');
    localStorage.removeItem('om_user');
    localStorage.removeItem('om_role');
  };

  const value = {
    user,
    token,
    role,
    loading,
    isLoggedIn: !!token,
    isAdmin: role === 'ADMIN',
    isCustomer: role === 'CUSTOMER',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
