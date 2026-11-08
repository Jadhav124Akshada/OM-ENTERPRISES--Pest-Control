import React from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'My Profile', path: '/profile', icon: <PersonIcon /> },
    { label: 'Book Service', path: '/book', icon: <CalendarMonthIcon /> },
    { label: 'My Bookings', path: '/bookings', icon: <BookOnlineIcon /> },
    { label: 'My Addresses', path: '/addresses', icon: <HomeIcon /> },
  ];

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 140px)', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Customer Left Sidebar */}
          <Paper
            elevation={1}
            sx={{
              width: { xs: '100%', md: 260 },
              flexShrink: 0,
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              alignSelf: 'flex-start',
            }}
          >
            {/* Sidebar User Header */}
            <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f1f5f9' }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 1.5,
                  backgroundColor: '#1565c0',
                  fontWeight: 700,
                  fontSize: '1.4rem',
                }}
              >
                {user?.customerName ? user.customerName.charAt(0).toUpperCase() : 'C'}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {user?.customerName || 'Customer'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                {user?.phoneNo || user?.email || ''}
              </Typography>
              <Chip
                label={`${user?.customerType || 'DOMESTIC'} CLIENT`}
                size="small"
                color={user?.customerType === 'COMMERCIAL' ? 'secondary' : 'primary'}
                sx={{ fontWeight: 600, fontSize: '0.72rem' }}
              />
            </Box>

            <Divider />

            {/* Sidebar Navigation Menu */}
            <List sx={{ py: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      to={item.path}
                      sx={{
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                        color: isActive ? '#1565c0' : '#475569',
                        '&:hover': {
                          backgroundColor: isActive ? '#e3f2fd' : '#f1f5f9',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? '#1565c0' : '#64748b',
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.95rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Logout Option in Sidebar */}
            <Box sx={{ p: 2 }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Sign Out
              </Button>
            </Box>
          </Paper>

          {/* Main Content Area */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Outlet />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CustomerLayout;
