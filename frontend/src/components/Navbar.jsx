import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, isAdmin, isCustomer, user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/login');
  };

  const displayName = isAdmin
    ? user?.adminName || 'Admin'
    : user?.customerName || 'Customer';
  const userInitial = displayName.charAt(0).toUpperCase();

  const customerMenuItems = [
    { label: 'My Profile', path: '/profile', icon: <PersonIcon /> },
    { label: 'Book Service', path: '/book', icon: <CalendarMonthIcon /> },
    { label: 'My Bookings', path: '/bookings', icon: <BookOnlineIcon /> },
    { label: 'My Addresses', path: '/addresses', icon: <HomeIcon /> },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(176, 148, 133, 0.22)',
          boxShadow: '0 4px 20px rgba(43, 37, 35, 0.03)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            {/* Left: Brand Logo & Title (Links to /admin for Admin, and / for customers/public) */}
            <Box
              component={RouterLink}
              to={isAdmin ? '/admin' : '/'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Om Enterprises Logo"
                sx={{
                  width: 44,
                  height: 44,
                  objectFit: 'contain',
                  borderRadius: 2.5,
                  p: 0.5,
                  backgroundColor: '#F4EFEA',
                  border: '1px solid rgba(176, 148, 133, 0.3)',
                  boxShadow: '0 2px 8px rgba(43, 37, 35, 0.06)',
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    color: '#2B2523',
                    fontSize: '1.15rem',
                  }}
                >
                  OM ENTERPRISES
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#8C7366',
                    letterSpacing: '0.04em',
                    fontWeight: 650,
                    display: 'block',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {isAdmin ? 'Admin Portal' : 'Pest Control & Cleaning Services'}
                </Typography>
              </Box>
            </Box>

            {/* Center Navigation Links: Strictly ONLY Home, About Us, Contact Us for Non-Admin. Admin has NO center buttons. */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isAdmin &&
                [
                  { label: 'Home', path: '/' },
                  { label: 'About Us', path: '/about' },
                  { label: 'Contact Us', path: '/contact' },
                ].map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      sx={{
                        px: 2,
                        py: 0.8,
                        borderRadius: 9999,
                        color: isActive ? '#F4EFEA' : '#2B2523',
                        backgroundColor: isActive ? '#8C7366' : 'transparent',
                        fontWeight: isActive ? 700 : 600,
                        fontSize: '0.92rem',
                        boxShadow: isActive ? '0 2px 8px rgba(140, 115, 102, 0.3)' : 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isActive ? '#735b4f' : 'rgba(140, 115, 102, 0.08)',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}

              {/* Right: User Initial Avatar Icon (Opens Side Bar) or Login/Register */}
              {isLoggedIn ? (
      
                  <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{ ml: 1.5, p: 0.5 }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: '#8C7366',
                        color: '#F4EFEA',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        border: '2px solid #DDB872',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(140, 115, 102, 0.3)',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.06)',
                        },
                      }}
                    >
                      {userInitial}
                    </Avatar>
                  </IconButton>
                
              ) : (
                <Box sx={{ display: 'flex', gap: 1, ml: 1.5 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      px: 2.2,
                      py: 0.7,
                      borderRadius: 9999,
                      borderColor: 'rgba(140, 115, 102, 0.4)',
                      color: '#8C7366',
                      fontWeight: 650,
                      '&:hover': {
                        borderColor: '#8C7366',
                        backgroundColor: 'rgba(140, 115, 102, 0.05)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      px: 2.5,
                      py: 0.7,
                      borderRadius: 9999,
                      backgroundColor: '#8C7366',
                      color: '#F4EFEA',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(140, 115, 102, 0.25)',
                      '&:hover': { backgroundColor: '#735b4f' },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Side Bar (Drawer Under User Initial Icon) */}
      {isLoggedIn && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#FAF8F5',
              color: '#2B2523',
              width: 310,
              borderLeft: '1px solid rgba(176, 148, 133, 0.25)',
              boxShadow: '-8px 0 32px rgba(43, 37, 35, 0.08)',
            },
          }}
        >
          <Box sx={{ width: 310, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
            {/* Sidebar Header with Warm Taupe to Mocha Gradient */}
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #B09485 0%, #8C7366 100%)',
                color: '#F4EFEA',
                boxShadow: '0 4px 16px rgba(43, 37, 35, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: '#2B2523',
                    color: '#DDB872',
                    width: 54,
                    height: 54,
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    border: '2px solid rgba(244, 239, 234, 0.8)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {userInitial}
                </Avatar>
                <IconButton
                  size="small"
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: '#F4EFEA',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
                  }}
                  title="Close"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800, color: '#F4EFEA', lineHeight: 1.2 }}>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(244, 239, 234, 0.85)', display: 'block', mb: 1.5, fontSize: '0.8rem' }}>
                {user?.phoneNo || user?.email || ''}
              </Typography>

              <Chip
                label={isAdmin ? 'ADMINISTRATOR' : `${user?.customerType || 'DOMESTIC'} CLIENT`}
                size="small"
                sx={{
                  backgroundColor: '#DDB872',
                  color: '#2B2523',
                  fontWeight: 750,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              />
            </Box>

            {/* Sidebar Navigation Items */}
            <List sx={{ py: 2.5, px: 2, flexGrow: 1 }}>
              {isCustomer &&
                customerMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        component={RouterLink}
                        to={item.path}
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          py: 1.3,
                          px: 2,
                          borderRadius: 3,
                          backgroundColor: isActive ? 'rgba(140, 115, 102, 0.14)' : 'transparent',
                          color: isActive ? '#8C7366' : '#2B2523',
                          border: isActive ? '1px solid rgba(140, 115, 102, 0.3)' : '1px solid transparent',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: isActive ? 'rgba(140, 115, 102, 0.18)' : 'rgba(176, 148, 133, 0.1)',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive ? '#8C7366' : '#72655F',
                            minWidth: 38,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontWeight: isActive ? 750 : 600,
                            fontSize: '0.92rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}

              {isAdmin && (
                <>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      component={RouterLink}
                      to="/profile"
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        py: 1.3,
                        px: 2,
                        borderRadius: 3,
                        backgroundColor: location.pathname === '/profile' ? 'rgba(140, 115, 102, 0.14)' : 'transparent',
                        color: location.pathname === '/profile' ? '#8C7366' : '#2B2523',
                        border: location.pathname === '/profile' ? '1px solid rgba(140, 115, 102, 0.3)' : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: location.pathname === '/profile' ? 'rgba(140, 115, 102, 0.18)' : 'rgba(176, 148, 133, 0.1)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: location.pathname === '/profile' ? '#8C7366' : '#72655F', minWidth: 38 }}>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Admin Profile"
                        primaryTypographyProps={{ fontWeight: location.pathname === '/profile' ? 750 : 600, fontSize: '0.92rem' }}
                      />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      component={RouterLink}
                      to="/admin"
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        py: 1.3,
                        px: 2,
                        borderRadius: 3,
                        backgroundColor: location.pathname === '/admin' ? 'rgba(140, 115, 102, 0.14)' : 'transparent',
                        color: location.pathname === '/admin' ? '#8C7366' : '#2B2523',
                        border: location.pathname === '/admin' ? '1px solid rgba(140, 115, 102, 0.3)' : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: location.pathname === '/admin' ? 'rgba(140, 115, 102, 0.18)' : 'rgba(176, 148, 133, 0.1)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: location.pathname === '/admin' ? '#8C7366' : '#72655F', minWidth: 38 }}>
                        <AdminPanelSettingsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Admin Dashboard"
                        primaryTypographyProps={{ fontWeight: location.pathname === '/admin' ? 750 : 600, fontSize: '0.92rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>

            <Divider sx={{ mx: 2, borderColor: 'rgba(176, 148, 133, 0.2)' }} />

            {/* Sign Out Button */}
            <Box sx={{ p: 2.5 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  py: 1.2,
                  borderRadius: 3,
                  borderColor: 'rgba(140, 115, 102, 0.35)',
                  color: '#8C7366',
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: '#8C7366',
                    backgroundColor: 'rgba(140, 115, 102, 0.08)',
                  },
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
