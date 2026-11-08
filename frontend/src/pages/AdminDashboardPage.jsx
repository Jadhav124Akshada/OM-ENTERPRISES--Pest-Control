import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PeopleIcon from '@mui/icons-material/People';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import apiClient from '../api/apiClient';
import { emitSyncEvent, subscribeSyncEvents } from '../utils/syncEvents';

const AdminDashboardPage = () => {
  const [tabIndex, setTabIndex] = useState(0); // 0 = Services, 1 = Bookings, 2 = Customers
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Data states
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Booking filter
  const [bookingFilter, setBookingFilter] = useState('ALL');

  // Service Modal (Create & Edit)
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    validity: 30,
  });
  const [serviceSubmitting, setServiceSubmitting] = useState(false);

  // Service Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [serviceDeleting, setServiceDeleting] = useState(false);

  // Complete Booking Action state
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    // Initial full fetch
    fetchAllData(false);

    // 1. Subscribe to instant cross-tab / in-app sync events
    const unsubscribe = subscribeSyncEvents((event) => {
      if (
        [
          'BOOKING_CREATED',
          'BOOKING_STATUS_CHANGED',
          'BOOKING_UPDATED',
          'SERVICE_UPDATED',
        ].includes(event.type)
      ) {
        fetchAllData(true); // Silent update without screen-flickering loader
      }
    });

    // 2. Window focus and visibility listener (refreshes instantly when switching tabs)
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchAllData(true);
      }
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // 3. Auto-sync interval (every 3.5 seconds) so new bookings and customer changes arrive live
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAllData(true);
      }
    }, 3500);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(intervalId);
    };
  }, []);

  const fetchAllData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setErrorMessage('');

      const [servicesRes, bookingsRes, customersRes] = await Promise.all([
        apiClient.get('/admin/services'),
        apiClient.get('/admin/bookings'),
        apiClient.get('/admin/customers'),
      ]);

      setServices(servicesRes.data?.services || []);
      setBookings(bookingsRes.data?.bookings || []);
      setCustomers(customersRes.data?.customers || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      if (!silent) {
        setErrorMessage('Failed to load admin dashboard data. Please verify your connection.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // ==========================================
  // SERVICE MANAGEMENT (CRUD)
  // ==========================================
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      description: '',
      price: '',
      validity: 30,
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.serviceName,
      description: service.description,
      price: service.price,
      validity: service.validity || 30,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!serviceForm.name.trim() || !serviceForm.description.trim() || !serviceForm.price) {
      setErrorMessage('Please fill in all service fields.');
      return;
    }

    setServiceSubmitting(true);

    try {
      if (editingService) {
        // UPDATE (PUT /api/admin/services/:id)
        await apiClient.put(`/admin/services/${editingService.serviceId}`, {
          name: serviceForm.name.trim(),
          description: serviceForm.description.trim(),
          price: Number(serviceForm.price),
          validity: Number(serviceForm.validity) || 30,
        });
        setSuccessMessage('Service updated successfully.');
      } else {
        // CREATE (POST /api/admin/services)
        await apiClient.post('/admin/services', {
          name: serviceForm.name.trim(),
          description: serviceForm.description.trim(),
          price: Number(serviceForm.price),
          validity: Number(serviceForm.validity) || 30,
        });
        setSuccessMessage('New service added successfully.');
      }

      setServiceModalOpen(false);
      emitSyncEvent('SERVICE_UPDATED');
      fetchAllData(true);
    } catch (err) {
      console.error('Save service error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setServiceSubmitting(false);
    }
  };

  const handleToggleServiceStatus = async (service) => {
    const newStatus = !service.isActive;
    // Optimistic update
    setServices((prev) =>
      prev.map((s) => (s.serviceId === service.serviceId ? { ...s, isActive: newStatus } : s))
    );

    try {
      await apiClient.patch(`/admin/services/${service.serviceId}/status`, {
        isActive: newStatus,
      });
      setSuccessMessage(`Service status updated to ${newStatus ? 'Active' : 'Inactive'}.`);
      emitSyncEvent('SERVICE_UPDATED');
      fetchAllData(true);
    } catch (err) {
      console.error('Toggle service status error:', err);
      setServices((prev) =>
        prev.map((s) => (s.serviceId === service.serviceId ? { ...s, isActive: service.isActive } : s))
      );
      setErrorMessage(err.response?.data?.message || 'Failed to toggle status.');
    }
  };

  const handleOpenDeleteService = (serviceId) => {
    setDeletingServiceId(serviceId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDeleteService = async () => {
    if (!deletingServiceId) return;

    setServiceDeleting(true);
    try {
      await apiClient.delete(`/admin/services/${deletingServiceId}`);
      setSuccessMessage('Service deleted successfully.');
      setDeleteModalOpen(false);
      emitSyncEvent('SERVICE_UPDATED');
      fetchAllData(true);
    } catch (err) {
      console.error('Delete service error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Cannot delete service with active bookings. Deactivate it instead.'
      );
      setDeleteModalOpen(false);
    } finally {
      setServiceDeleting(false);
    }
  };

  // ==========================================
  // BOOKINGS MANAGEMENT
  // ==========================================
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const targetBooking = bookings.find((b) => b.bookingId === bookingId);
    if (targetBooking && targetBooking.status === 'CANCELLED') {
      setErrorMessage('This booking was cancelled by the customer. All admin options are locked.');
      return;
    }
    if (targetBooking && targetBooking.status === 'COMPLETED') {
      setErrorMessage('This booking is already completed and cannot be modified.');
      return;
    }

    // 1. Instant optimistic state update: Dropdown and badge change immediately without reload
    const previousBookings = [...bookings];
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
    );

    try {
      await apiClient.patch(`/admin/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      setSuccessMessage(`Booking #${bookingId} status changed to ${newStatus}.`);
      emitSyncEvent('BOOKING_STATUS_CHANGED', { bookingId, status: newStatus });
      fetchAllData(true);
    } catch (err) {
      console.error('Update booking status error:', err);
      // Revert if request failed
      setBookings(previousBookings);
      setErrorMessage(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    const targetBooking = bookings.find((b) => b.bookingId === bookingId);
    if (targetBooking && targetBooking.status === 'CANCELLED') {
      setErrorMessage('Cancelled bookings cannot be completed.');
      return;
    }

    setCompletingId(bookingId);
    // Instant optimistic update
    const previousBookings = [...bookings];
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status: 'COMPLETED' } : b))
    );

    try {
      const res = await apiClient.patch(`/bookings/${bookingId}/complete`);
      if (res.data && res.data.success) {
        setSuccessMessage(
          `Booking #${bookingId} marked as COMPLETED! Expiry date automatically set to ${new Date(
            res.data.expiryDate
          ).toLocaleDateString('en-IN')}.`
        );
        emitSyncEvent('BOOKING_STATUS_CHANGED', { bookingId, status: 'COMPLETED' });
        fetchAllData(true);
      }
    } catch (err) {
      console.error('Complete booking error:', err);
      setBookings(previousBookings);
      setErrorMessage(err.response?.data?.message || 'Failed to complete booking.');
    } finally {
      setCompletingId(null);
    }
  };

  const filteredBookings =
    bookingFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === bookingFilter);

  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <Chip
            label="PENDING"
            size="small"
            sx={{
              backgroundColor: 'rgba(221, 184, 114, 0.22)',
              color: '#8A6820',
              fontWeight: 750,
              border: '1px solid rgba(221, 184, 114, 0.45)',
            }}
          />
        );
      case 'CONFIRMED':
        return (
          <Chip
            label="CONFIRMED"
            size="small"
            sx={{
              backgroundColor: 'rgba(101, 110, 138, 0.14)',
              color: '#656E8A',
              fontWeight: 750,
              border: '1px solid rgba(101, 110, 138, 0.3)',
            }}
          />
        );
      case 'COMPLETED':
        return (
          <Chip
            label="COMPLETED"
            size="small"
            sx={{
              backgroundColor: 'rgba(140, 115, 102, 0.15)',
              color: '#8C7366',
              fontWeight: 750,
              border: '1px solid rgba(140, 115, 102, 0.3)',
            }}
          />
        );
      case 'CANCELLED':
        return (
          <Chip
            label="CANCELLED"
            size="small"
            sx={{
              backgroundColor: 'rgba(43, 37, 35, 0.08)',
              color: '#2B2523',
              fontWeight: 750,
              border: '1px solid rgba(43, 37, 35, 0.18)',
            }}
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
     

      {/* Overview Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(176, 148, 133, 0.22)',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(43, 37, 35, 0.03)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 3,
                  backgroundColor: 'rgba(140, 115, 102, 0.12)',
                  color: '#8C7366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MiscellaneousServicesIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TOTAL SERVICES
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 850, color: '#2B2523', letterSpacing: '-0.02em' }}>
                  {services.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(101, 110, 138, 0.25)',
              backgroundColor: '#FAFBFD',
              boxShadow: '0 4px 16px rgba(101, 110, 138, 0.04)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 3,
                  backgroundColor: 'rgba(101, 110, 138, 0.12)',
                  color: '#656E8A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOnlineIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#656E8A', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TOTAL BOOKINGS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 850, color: '#2B2523', letterSpacing: '-0.02em' }}>
                  {bookings.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(221, 184, 114, 0.35)',
              backgroundColor: '#FFFDF9',
              boxShadow: '0 4px 16px rgba(221, 184, 114, 0.06)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 3,
                  backgroundColor: 'rgba(221, 184, 114, 0.2)',
                  color: '#8A6820',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HourglassTopIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#8A6820', fontWeight: 700, letterSpacing: '0.04em' }}>
                  PENDING BOOKINGS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 850, color: '#2B2523', letterSpacing: '-0.02em' }}>
                  {bookings.filter((b) => b.status === 'PENDING').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(176, 148, 133, 0.25)',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(43, 37, 35, 0.03)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 3,
                  backgroundColor: 'rgba(176, 148, 133, 0.18)',
                  color: '#8C7366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PeopleIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 700, letterSpacing: '0.04em' }}>
                  REGISTERED USERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 850, color: '#2B2523', letterSpacing: '-0.02em' }}>
                  {customers.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4.5,
          border: '1px solid rgba(176, 148, 133, 0.25)',
          backgroundColor: '#FFFFFF',
          mb: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(43, 37, 35, 0.03)',
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          sx={{
            borderBottom: '1px solid rgba(176, 148, 133, 0.2)',
            px: 2,
            backgroundColor: '#FAF8F5',
            '& .MuiTabs-indicator': {
              backgroundColor: '#8C7366',
              height: 3,
            },
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.92rem',
              color: '#72655F',
              py: 2,
              '&.Mui-selected': {
                color: '#8C7366',
              },
            },
          }}
        >
          <Tab
            icon={<MiscellaneousServicesIcon />}
            iconPosition="start"
            label="Services Master (CRUD)"
          />
          <Tab
            icon={<BookOnlineIcon />}
            iconPosition="start"
            label={`Bookings Operations (${bookings.length})`}
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label={`Customers Directory (${customers.length})`}
          />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress sx={{ color: '#8C7366' }} />
          </Box>
        ) : (
          <Box sx={{ p: 3.5 }}>
            {/* ========================================================= */}
            {/* TAB 0: SERVICES MANAGEMENT (FULL CRUD) */}
            {/* ========================================================= */}
            {tabIndex === 0 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523' }}>
                    Pest Control Services Master List
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={handleOpenAddService}
                    sx={{
                      backgroundColor: '#8C7366',
                      color: '#F4EFEA',
                      fontWeight: 750,
                      borderRadius: 9999,
                      px: 3,
                      boxShadow: '0 4px 14px rgba(140, 115, 102, 0.25)',
                      '&:hover': { backgroundColor: '#735b4f' },
                    }}
                  >
                    Add New Service
                  </Button>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3.5, border: '1px solid rgba(176, 148, 133, 0.22)' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#FAF8F5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523', py: 2 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Service Name</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Price (₹)</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Validity</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523', textAlign: 'center' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services.map((s) => (
                        <TableRow key={s.serviceId} hover sx={{ '&:hover': { backgroundColor: 'rgba(244, 239, 234, 0.45)' } }}>
                          <TableCell sx={{ fontWeight: 750, color: '#2B2523' }}>#{s.serviceId}</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>{s.serviceName}</TableCell>
                          <TableCell sx={{ maxWidth: 300, color: '#72655F', fontSize: '0.85rem' }}>
                            {s.description}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 850, color: '#8C7366' }}>
                            ₹{Number(s.price).toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell>
                            <Chip label={`${s.validity || 30} Days`} size="small" variant="outlined" sx={{ borderColor: 'rgba(176, 148, 133, 0.4)', color: '#2B2523' }} />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={s.isActive ? 'ACTIVE' : 'INACTIVE'}
                              size="small"
                              sx={{
                                backgroundColor: s.isActive ? 'rgba(140, 115, 102, 0.15)' : 'rgba(43, 37, 35, 0.08)',
                                color: s.isActive ? '#8C7366' : '#72655F',
                                fontWeight: 750,
                                border: s.isActive ? '1px solid rgba(140, 115, 102, 0.3)' : '1px solid rgba(43, 37, 35, 0.15)',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                title="Edit Service"
                                onClick={() => handleOpenEditService(s)}
                                sx={{ color: '#8C7366' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                title={s.isActive ? 'Deactivate Service' : 'Activate Service'}
                                onClick={() => handleToggleServiceStatus(s)}
                                sx={{ color: s.isActive ? '#8C7366' : '#B09485' }}
                              >
                                {s.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                              </IconButton>

                              <IconButton
                                size="small"
                                color="error"
                                title="Delete Service"
                                onClick={() => handleOpenDeleteService(s.serviceId)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* ========================================================= */}
            {/* TAB 1: BOOKINGS MANAGEMENT */}
            {/* ========================================================= */}
            {tabIndex === 1 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523' }}>
                    Customer Booking Appointments
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: '#72655F', fontWeight: 700 }}>
                      Filter by:
                    </Typography>
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                      <Button
                        key={st}
                        size="small"
                        variant={bookingFilter === st ? 'contained' : 'outlined'}
                        onClick={() => setBookingFilter(st)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          borderRadius: 9999,
                          px: 2,
                          py: 0.5,
                          backgroundColor: bookingFilter === st ? '#8C7366' : 'transparent',
                          color: bookingFilter === st ? '#F4EFEA' : '#72655F',
                          borderColor: bookingFilter === st ? '#8C7366' : 'rgba(176, 148, 133, 0.35)',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: bookingFilter === st ? '#735b4f' : 'rgba(140, 115, 102, 0.08)',
                            borderColor: '#8C7366',
                          },
                        }}
                      >
                        {st}
                      </Button>
                    ))}
                  </Box>
                </Box>

                {filteredBookings.length === 0 ? (
                  <Alert severity="info" sx={{ backgroundColor: '#FAF8F5', color: '#2B2523', borderRadius: 3 }}>
                    No bookings found for the selected filter.
                  </Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3.5, border: '1px solid rgba(176, 148, 133, 0.22)' }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#FAF8F5' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523', py: 2 }}>ID</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Customer Info</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Service</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Address</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Scheduled Date</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523', textAlign: 'center' }}>Change Status</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredBookings.map((b) => (
                          <TableRow key={b.bookingId} hover sx={{ '&:hover': { backgroundColor: 'rgba(244, 239, 234, 0.45)' } }}>
                            <TableCell sx={{ fontWeight: 750, color: '#2B2523' }}>#{b.bookingId}</TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2B2523' }}>
                                {b.customer?.customerName || `Customer #${b.customerId}`}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#72655F', display: 'block' }}>
                                📞 {b.customer?.phoneNo || '-'}
                              </Typography>
                              {b.customer?.email && (
                                <Typography variant="caption" sx={{ color: '#72655F', display: 'block' }}>
                                  ✉️ {b.customer.email}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 750, color: '#2B2523' }}>
                                {b.service?.serviceName || `Service #${b.serviceId}`}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 220, fontSize: '0.85rem', color: '#72655F' }}>
                              {b.address?.address || `Address #${b.addressId}`}
                            </TableCell>
                            <TableCell sx={{ color: '#2B2523' }}>
                              {new Date(b.bookingDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 850, color: '#8C7366' }}>
                              ₹{Number(b.price).toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell>{getStatusChip(b.status)}</TableCell>

                            {/* Status Change Dropdown */}
                            <TableCell sx={{ textAlign: 'center' }}>
                              {b.status === 'CANCELLED' ? (
                                <Tooltip title="Customer cancelled before confirmation - All admin options locked" arrow>
                                  <span>
                                    <Select
                                      size="small"
                                      value={b.status}
                                      disabled
                                      sx={{
                                        fontSize: '0.8rem',
                                        minWidth: 120,
                                        borderRadius: 2.5,
                                        backgroundColor: 'rgba(43, 37, 35, 0.04)',
                                      }}
                                    >
                                      <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                                    </Select>
                                  </span>
                                </Tooltip>
                              ) : (
                                <Select
                                  size="small"
                                  value={b.status}
                                  onChange={(e) => handleUpdateBookingStatus(b.bookingId, e.target.value)}
                                  sx={{ fontSize: '0.8rem', minWidth: 120, borderRadius: 2.5 }}
                                  disabled={b.status === 'COMPLETED'}
                                >
                                  <MenuItem value="PENDING">PENDING</MenuItem>
                                  <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                                </Select>
                              )}
                            </TableCell>

                            {/* Mark as Completed Button */}
                            <TableCell sx={{ textAlign: 'center' }}>
                              {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' ? (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  disabled={completingId === b.bookingId}
                                  onClick={() => handleCompleteBooking(b.bookingId)}
                                  sx={{
                                    backgroundColor: '#8C7366',
                                    color: '#F4EFEA',
                                    textTransform: 'none',
                                    fontWeight: 750,
                                    fontSize: '0.78rem',
                                    borderRadius: 9999,
                                    px: 2,
                                    boxShadow: 'none',
                                    '&:hover': { backgroundColor: '#735b4f' },
                                  }}
                                >
                                  {completingId === b.bookingId ? 'Completing...' : 'Mark Complete'}
                                </Button>
                              ) : b.status === 'COMPLETED' ? (
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#8C7366', fontWeight: 800, display: 'block' }}>
                                    ✓ Warranty Active
                                  </Typography>
                                  {b.expiryDate && (
                                    <Typography variant="caption" sx={{ color: '#72655F' }}>
                                      Exp: {new Date(b.expiryDate).toLocaleDateString('en-IN')}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Tooltip title="Customer cancelled before confirmation - No further actions available" arrow>
                                  <Chip
                                    label="Cancel"
                                    size="small"
                                    sx={{
                                      backgroundColor: 'rgba(43, 37, 35, 0.08)',
                                      color: '#72655F',
                                      fontWeight: 700,
                                      fontSize: '0.72rem',
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* ========================================================= */}
            {/* TAB 2: REGISTERED CUSTOMERS DIRECTORY */}
            {/* ========================================================= */}
            {tabIndex === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', mb: 3 }}>
                  Registered Customers Directory
                </Typography>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3.5, border: '1px solid rgba(176, 148, 133, 0.22)' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#FAF8F5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523', py: 2 }}>Customer ID</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Full Name</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Phone Number</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Email Address</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Customer Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers.map((c) => (
                        <TableRow key={c.customerId} hover sx={{ '&:hover': { backgroundColor: 'rgba(244, 239, 234, 0.45)' } }}>
                          <TableCell sx={{ fontWeight: 750, color: '#2B2523' }}>#{c.customerId}</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>{c.customerName}</TableCell>
                          <TableCell sx={{ color: '#2B2523' }}>{c.phoneNo}</TableCell>
                          <TableCell sx={{ color: '#72655F' }}>{c.email || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={c.customerType}
                              size="small"
                              sx={{
                                backgroundColor: c.customerType === 'COMMERCIAL' ? 'rgba(101, 110, 138, 0.14)' : 'rgba(221, 184, 114, 0.22)',
                                color: c.customerType === 'COMMERCIAL' ? '#656E8A' : '#8A6820',
                                fontWeight: 750,
                                border: c.customerType === 'COMMERCIAL' ? '1px solid rgba(101, 110, 138, 0.3)' : '1px solid rgba(221, 184, 114, 0.4)',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Add / Edit Service Dialog */}
      <Dialog open={serviceModalOpen} onClose={() => setServiceModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.01em' }}>
          {editingService ? 'Edit Pest Control Service' : 'Add New Pest Control Service'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            <TextField
              required
              fullWidth
              label="Service Name"
              placeholder="Enter service name"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              sx={{ mb: 2.5 }}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Description"
              placeholder="Enter service description and procedure details"
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              sx={{ mb: 2.5 }}
            />

            <TextField
              required
              fullWidth
              type="number"
              label="Price (₹)"
              placeholder="Enter service price in ₹"
              value={serviceForm.price}
              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Warranty Validity (in Days)"
              placeholder="Enter warranty duration in days (e.g. 30)"
              value={serviceForm.validity}
              onChange={(e) => setServiceForm({ ...serviceForm, validity: e.target.value })}
              helperText="Days of warranty coverage after service completion."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setServiceModalOpen(false)} sx={{ color: '#72655F' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveService}
            variant="contained"
            disabled={serviceSubmitting}
            sx={{
              backgroundColor: '#8C7366',
              color: '#F4EFEA',
              fontWeight: 750,
              borderRadius: 9999,
              px: 3,
              '&:hover': { backgroundColor: '#735b4f' },
            }}
          >
            {serviceSubmitting ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Service Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2B2523' }}>Delete Service #{deletingServiceId}?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#72655F' }}>
            Are you sure you want to delete this service? If the service has existing bookings, the system will prevent
            deletion to maintain historical records (you can deactivate it instead).
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteModalOpen(false)} sx={{ color: '#72655F' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteService}
            color="error"
            variant="contained"
            disabled={serviceDeleting}
            sx={{ fontWeight: 750, borderRadius: 9999 }}
          >
            {serviceDeleting ? 'Deleting...' : 'Delete Service'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboardPage;
