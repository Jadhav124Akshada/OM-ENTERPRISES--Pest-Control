import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import apiClient from '../api/apiClient';
import { emitSyncEvent, subscribeSyncEvents } from '../utils/syncEvents';

const BookServicePage = () => {
  const [services, setServices] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [bookingDate, setBookingDate] = useState('');

  // Add Address Modal state
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [newAddressText, setNewAddressText] = useState('');
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // Status & feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadData();

    const unsubscribe = subscribeSyncEvents((event) => {
      if (['SERVICE_UPDATED', 'ADDRESS_UPDATED'].includes(event.type)) {
        loadData();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, addressesRes] = await Promise.all([
        apiClient.get('/services'),
        apiClient.get('/customers/addresses'),
      ]);

      const activeServices = (servicesRes.data?.services || []).filter((s) => s.isActive);
      setServices(activeServices);

      const customerAddresses = addressesRes.data?.addresses || [];
      setAddresses(customerAddresses);

      // Check URL query parameters for preselected service
      const queryParams = new URLSearchParams(location.search);
      const preselectedId = queryParams.get('serviceId');
      if (preselectedId && activeServices.some((s) => s.serviceId === Number(preselectedId))) {
        setSelectedServiceId(Number(preselectedId));
      } else if (activeServices.length > 0) {
        setSelectedServiceId(activeServices[0].serviceId);
      }

      if (customerAddresses.length > 0) {
        setSelectedAddressId(customerAddresses[0].addressId);
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingDate(tomorrow.toISOString().split('T')[0]);
    } catch (err) {
      console.error('Error loading booking data:', err);
      setErrorMessage('Failed to load services or addresses. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddressText.trim()) return;

    try {
      setAddressSubmitting(true);
      const res = await apiClient.post('/customers/addresses', {
        address: newAddressText.trim(),
      });

      if (res.data && res.data.address) {
        const added = res.data.address;
        setAddresses((prev) => [...prev, added]);
        setSelectedAddressId(added.addressId);
        setNewAddressText('');
        setOpenAddressModal(false);
        emitSyncEvent('ADDRESS_UPDATED');
      }
    } catch (err) {
      console.error('Failed to add address:', err);
      alert(err.response?.data?.message || 'Failed to add address.');
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedServiceId) {
      setErrorMessage('Please select a service.');
      return;
    }

    if (!selectedAddressId) {
      setErrorMessage('Please select an address or add a new one.');
      return;
    }

    if (!bookingDate) {
      setErrorMessage('Please select a preferred service date.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        serviceId: Number(selectedServiceId),
        addressId: Number(selectedAddressId),
        bookingDate: new Date(bookingDate).toISOString(),
      };

      const res = await apiClient.post('/bookings', payload);

      if (res.data && res.data.success) {
        setSuccessMessage('Booking created successfully! Redirecting to your bookings list...');
        emitSyncEvent('BOOKING_CREATED', { booking: res.data.booking });
        setTimeout(() => {
          navigate('/bookings');
        }, 800);
      }
    } catch (err) {
      console.error('Booking creation error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentService = services.find((s) => s.serviceId === Number(selectedServiceId));
  const currentAddress = addresses.find((a) => a.addressId === Number(selectedAddressId));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: '#8C7366' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 0.5 }}>
          Schedule a Pest Control Service
        </Typography>
        <Typography variant="body2" sx={{ color: '#72655F' }}>
          Select your required pest treatment package, service location address, and preferred date.
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Booking Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, sm: 4.5 },
              borderRadius: 4.5,
              border: '1px solid rgba(176, 148, 133, 0.25)',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 30px rgba(43, 37, 35, 0.04)',
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              {/* Step 1: Select Service */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.2, color: '#2B2523' }}>
                1. Select Pest Control Service
              </Typography>
              <FormControl fullWidth sx={{ mb: 3.5 }} required>
                <InputLabel id="service-select-label">Service Treatment</InputLabel>
                <Select
                  labelId="service-select-label"
                  value={selectedServiceId}
                  label="Service Treatment"
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  {services.map((service) => (
                    <MenuItem key={service.serviceId} value={service.serviceId}>
                      {service.serviceName} - ₹{Number(service.price).toLocaleString('en-IN')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Step 2: Select Address */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2B2523' }}>
                  2. Select Service Address
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddLocationAltIcon />}
                  onClick={() => setOpenAddressModal(true)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    color: '#8C7366',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(140, 115, 102, 0.08)' },
                  }}
                >
                   Add New Address
                </Button>
              </Box>

              {addresses.length === 0 ? (
                <Alert severity="warning" sx={{ mb: 3.5, borderRadius: 3 }}>
                  No saved addresses found. Please click <strong>+ Add New Address</strong> above.
                </Alert>
              ) : (
                <FormControl fullWidth sx={{ mb: 3.5 }} required>
                  <InputLabel id="address-select-label">Saved Address</InputLabel>
                  <Select
                    labelId="address-select-label"
                    value={selectedAddressId}
                    label="Saved Address"
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  >
                    {addresses.map((addr) => (
                      <MenuItem key={addr.addressId} value={addr.addressId}>
                        {addr.address}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Step 3: Preferred Date */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.2, color: '#2B2523' }}>
                3. Choose Preferred Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                sx={{ mb: 4 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting || addresses.length === 0}
                startIcon={<BookmarkAddedIcon />}
                sx={{
                  py: 1.4,
                  borderRadius: 9999,
                  fontWeight: 750,
                  fontSize: '0.95rem',
                  backgroundColor: '#8C7366',
                  color: '#F4EFEA',
                  boxShadow: '0 4px 16px rgba(140, 115, 102, 0.25)',
                  '&:hover': { backgroundColor: '#735b4f' },
                }}
              >
                {submitting ? <CircularProgress size={24} sx={{ color: '#F4EFEA' }} /> : 'Confirm & Place Booking'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Live Booking Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4.5,
              border: '1px solid rgba(140, 115, 102, 0.3)',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)',
              boxShadow: '0 8px 30px rgba(43, 37, 35, 0.04)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', mb: 2, letterSpacing: '-0.01em' }}>
                Booking Summary
              </Typography>

              <Divider sx={{ mb: 2.5, borderColor: 'rgba(176, 148, 133, 0.25)' }} />

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                  Selected Treatment:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#2B2523', mt: 0.3 }}>
                  {currentService ? currentService.serviceName : 'None selected'}
                </Typography>
                {currentService && (
                  <Typography variant="caption" sx={{ color: '#72655F', display: 'block', mt: 0.5, lineHeight: 1.5 }}>
                    {currentService.description}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                  Warranty Validity:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#8C7366', mt: 0.3 }}>
                  {currentService ? `${currentService.validity || 30} Days Post-Treatment` : '-'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                  Service Address:
                </Typography>
                <Typography variant="body2" sx={{ color: '#2B2523', fontWeight: 600, mt: 0.3, lineHeight: 1.5 }}>
                  {currentAddress ? currentAddress.address : 'No address selected'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                  Scheduled Date:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523', mt: 0.3 }}>
                  {bookingDate ? new Date(bookingDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) : '-'}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2.5, borderColor: 'rgba(176, 148, 133, 0.25)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2B2523' }}>
                  Total Payable:
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#8C7366', letterSpacing: '-0.02em' }}>
                  ₹{currentService ? Number(currentService.price).toLocaleString('en-IN') : '0.00'}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#72655F', display: 'block', mt: 1.5 }}>
                * Payment is collected upon service completion via Cash or UPI.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Address Modal Dialog */}
      <Dialog open={openAddressModal} onClose={() => setOpenAddressModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.01em' }}>
          Add New Service Address
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#72655F', mb: 2 }}>
            Please enter complete flat/house number, building/society name, street, and landmark.
          </Typography>
          <TextField
            autoFocus
            required
            fullWidth
            multiline
            rows={3}
            label="Full Address"
            placeholder="Enter complete building/flat number, street, area, city, and pincode"
            value={newAddressText}
            onChange={(e) => setNewAddressText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenAddressModal(false)} sx={{ color: '#72655F' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddAddress}
            variant="contained"
            disabled={addressSubmitting || !newAddressText.trim()}
            sx={{
              backgroundColor: '#8C7366',
              color: '#F4EFEA',
              fontWeight: 700,
              borderRadius: 9999,
              px: 3,
              '&:hover': { backgroundColor: '#735b4f' },
            }}
          >
            {addressSubmitting ? 'Saving...' : 'Save Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookServicePage;
