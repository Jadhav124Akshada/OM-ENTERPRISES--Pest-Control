import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0); // 0 = Customer, 1 = Admin
  const [formData, setFormData] = useState({
    identifier: location.state?.registeredIdentifier || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.successMsg || '');

  const { login } = useAuth();

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.identifier.trim()) {
      setErrorMessage(tabIndex === 0 ? 'Please enter your email or phone number' : 'Please enter admin email');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      if (tabIndex === 0) {
        // Customer Login
        const res = await apiClient.post('/auth/login', {
          identifier: formData.identifier.trim(),
          password: formData.password,
        });

        if (res.data && res.data.token) {
          setSuccessMessage('Customer login successful! Redirecting...');
          login(res.data.customer, res.data.token, 'CUSTOMER');
          setTimeout(() => {
            navigate('/profile');
          }, 600);
        }
      } else {
        // Admin Login
        const res = await apiClient.post('/admin/login', {
          email: formData.identifier.trim(),
          password: formData.password,
        });

        if (res.data && res.data.token) {
          setSuccessMessage('Admin login successful! Redirecting to Admin Panel...');
          login(res.data.admin, res.data.token, 'ADMIN');
          setTimeout(() => {
            navigate('/admin');
          }, 600);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Invalid credentials. Please verify your details.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, sm: 5 },
          borderRadius: 5,
          border: '1px solid rgba(176, 148, 133, 0.25)',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 12px 40px rgba(43, 37, 35, 0.05)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1.8,
              borderRadius: 3.5,
              backgroundColor: '#F4EFEA',
              color: '#8C7366',
              mb: 2,
              border: '1px solid rgba(176, 148, 133, 0.3)',
            }}
          >
            {tabIndex === 0 ? <PersonIcon fontSize="large" /> : <AdminPanelSettingsIcon fontSize="large" />}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 0.5 }}>
            {tabIndex === 0 ? 'Customer Sign In' : 'Administrator Portal'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#72655F' }}>
            {tabIndex === 0
              ? 'Access your pest control bookings and addresses'
              : 'Sign in to access Om Enterprises management console'}
          </Typography>
        </Box>

        {/* Role Tab Selector */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3.5,
            backgroundColor: '#F4EFEA',
            borderRadius: 3,
            p: 0.5,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#72655F',
              minHeight: 44,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                backgroundColor: '#FFFFFF',
                color: '#2B2523 !important',
                boxShadow: '0 2px 8px rgba(43, 37, 35, 0.06)',
              },
            },
          }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Customer" />
          <Tab icon={<AdminPanelSettingsIcon />} iconPosition="start" label="Administrator" />
        </Tabs>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2.5, borderRadius: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="identifier"
            label={tabIndex === 0 ? 'Email Address or Phone Number' : 'Admin Email Address'}
            name="identifier"
            autoComplete="username"
            autoFocus
            value={formData.identifier}
            onChange={handleChange}
            placeholder={tabIndex === 0 ? 'Enter email address or mobile number' : 'Enter administrator email'}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3.5,
              mb: 2,
              py: 1.4,
              borderRadius: 9999,
              fontWeight: 750,
              fontSize: '0.95rem',
              backgroundColor: tabIndex === 0 ? '#8C7366' : '#2B2523',
              color: tabIndex === 0 ? '#F4EFEA' : '#DDB872',
              boxShadow: '0 4px 14px rgba(43, 37, 35, 0.15)',
              '&:hover': {
                backgroundColor: tabIndex === 0 ? '#735b4f' : '#1d1917',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : `Sign In as ${tabIndex === 0 ? 'Customer' : 'Admin'}`}
          </Button>

          {tabIndex === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#72655F' }}>
                Don't have an account yet?{' '}
                <Button component={RouterLink} to="/register" sx={{ textTransform: 'none', fontWeight: 800, color: '#8C7366' }}>
                  Register here
                </Button>
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#72655F' }}>
                Customer looking for service?{' '}
                <Button onClick={() => setTabIndex(0)} sx={{ textTransform: 'none', fontWeight: 800, color: '#8C7366' }}>
                  Switch to Customer Login
                </Button>
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
