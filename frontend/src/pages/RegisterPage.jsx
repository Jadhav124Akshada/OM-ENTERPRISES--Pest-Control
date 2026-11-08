import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phoneNo: '',
    customerType: 'DOMESTIC',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!formData.customerName.trim()) {
      setErrorMessage('Full name is required');
      return;
    }

    if (!formData.phoneNo.trim()) {
      setErrorMessage('Phone number is required');
      return;
    }

    // Phone format check: 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNo.trim())) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        email: formData.email.trim() || undefined,
        phoneNo: formData.phoneNo.trim(),
        customerType: formData.customerType,
        password: formData.password,
      };

      const res = await apiClient.post('/auth/register', payload);

      if (res.data) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        const identifier = formData.phoneNo.trim() || formData.email.trim();
        // Clear any previous session so user must explicitly log in
        localStorage.removeItem('om_token');
        localStorage.removeItem('om_user');
        localStorage.removeItem('om_role');
        setTimeout(() => {
          navigate('/login', {
            state: {
              registeredIdentifier: identifier,
              successMsg: 'Registration successful! Please log in with your credentials.',
            },
          });
        }, 1000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || 'Registration failed. Email or phone number might already exist.';
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
            <PersonAddAlt1Icon fontSize="large" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 0.5 }}>
            Customer Registration
          </Typography>
          <Typography variant="body2" sx={{ color: '#72655F' }}>
            Create an account to book and manage your pest control appointments
          </Typography>
        </Box>

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
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                id="customerName"
                label="Full Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="phoneNo"
                label="Phone Number (10 digits)"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="customer-type-label">Customer Type</InputLabel>
                <Select
                  labelId="customer-type-label"
                  id="customerType"
                  name="customerType"
                  value={formData.customerType}
                  label="Customer Type"
                  onChange={handleChange}
                >
                  <MenuItem value="DOMESTIC">Domestic (Home / Flat)</MenuItem>
                  <MenuItem value="COMMERCIAL">Commercial (Office / Shop)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="email"
                label="Email Address (Optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password (min 8 chars)"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

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
              backgroundColor: '#8C7366',
              color: '#F4EFEA',
              boxShadow: '0 4px 14px rgba(140, 115, 102, 0.25)',
              '&:hover': { backgroundColor: '#735b4f' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#72655F' }}>
              Already have an account?{' '}
              <Button component={RouterLink} to="/login" sx={{ textTransform: 'none', fontWeight: 800, color: '#8C7366' }}>
                Sign in here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
