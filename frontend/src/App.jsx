import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import NonAdminRoute from './components/NonAdminRoute';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import BookServicePage from './pages/BookServicePage';
import MyBookingsPage from './pages/MyBookingsPage';
import AddressesPage from './pages/AddressesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Aesthetic Color Palette Theme: Warm Taupe, Cream, Deep Charcoal, Muted Brown, Golden Yellow, Periwinkle Blue
const theme = createTheme({
  palette: {
    primary: {
      main: '#8C7366', // Muted Brown (Sophisticated warm action tone)
      dark: '#735b4f',
      light: '#a68f82',
      contrastText: '#F4EFEA',
    },
    secondary: {
      main: '#DDB872', // Golden Yellow (Warm golden highlight)
      dark: '#c59f56',
      light: '#ebd29f',
      contrastText: '#2B2523',
    },
    info: {
      main: '#656E8A', // Periwinkle Blue (Slate periwinkle accent)
      dark: '#4f5770',
      light: '#8891ac',
      contrastText: '#F4EFEA',
    },
    background: {
      default: '#F4EFEA', // Cream / Off-White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2B2523', // Deep Charcoal
      secondary: '#6E615B', // Warm Charcoal Slate
    },
    divider: 'rgba(176, 148, 133, 0.25)', // Subtle Warm Taupe divider
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', '"Outfit"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'].join(','),
    h1: { color: '#2B2523', fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { color: '#2B2523', fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { color: '#2B2523', fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { color: '#2B2523', fontWeight: 750, letterSpacing: '-0.015em' },
    h5: { color: '#2B2523', fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { color: '#2B2523', fontWeight: 700, letterSpacing: '-0.005em' },
    subtitle1: { color: '#2B2523', fontWeight: 600 },
    subtitle2: { color: '#6E615B', fontWeight: 600 },
    body1: { color: '#2B2523', lineHeight: 1.6 },
    body2: { color: '#6E615B', lineHeight: 1.55 },
    button: { textTransform: 'none', fontWeight: 650, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 650,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 14px rgba(140, 115, 102, 0.25)',
          },
        },
        containedPrimary: {
          backgroundColor: '#8C7366',
          color: '#F4EFEA',
          '&:hover': {
            backgroundColor: '#735b4f',
          },
        },
        containedSecondary: {
          backgroundColor: '#DDB872',
          color: '#2B2523',
          '&:hover': {
            backgroundColor: '#caa456',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(140, 115, 102, 0.4)',
          color: '#8C7366',
          '&:hover': {
            borderColor: '#8C7366',
            backgroundColor: 'rgba(140, 115, 102, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(176, 148, 133, 0.22)',
          boxShadow: '0 4px 20px rgba(43, 37, 35, 0.04), 0 1px 3px rgba(43, 37, 35, 0.02)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          '&:hover': {
            boxShadow: '0 12px 36px rgba(43, 37, 35, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 650,
          fontSize: '0.78rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          '& fieldset': {
            borderColor: 'rgba(176, 148, 133, 0.35)',
            transition: 'border-color 0.2s ease',
          },
          '&:hover fieldset': {
            borderColor: '#8C7366',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#8C7366',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          padding: '8px',
          border: '1px solid rgba(176, 148, 133, 0.25)',
          boxShadow: '0 20px 60px rgba(43, 37, 35, 0.12)',
        },
      },
    },
  },
});

function AppRoutes() {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      {/* Customer & Public Pages - Restricted from Admin */}
      <Route
        path="/"
        element={
          <NonAdminRoute>
            <HomePage />
          </NonAdminRoute>
        }
      />
      <Route
        path="/about"
        element={
          <NonAdminRoute>
            <AboutPage />
          </NonAdminRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <NonAdminRoute>
            <ContactPage />
          </NonAdminRoute>
        }
      />
      <Route
        path="/login"
        element={
          <NonAdminRoute>
            <LoginPage />
          </NonAdminRoute>
        }
      />
      <Route
        path="/register"
        element={
          <NonAdminRoute>
            <RegisterPage />
          </NonAdminRoute>
        }
      />

      {/* Profile Page - Accessible to authenticated Customer and Admin */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book"
        element={
          <ProtectedRoute customerOnly>
            <BookServicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute customerOnly>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/addresses"
        element={
          <ProtectedRoute customerOnly>
            <AddressesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Role Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback wildcard: Redirects Admin to /admin, others to / */}
      <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F4EFEA' }}>
        <Navbar />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <AppRoutes />
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
