import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import apiClient from '../api/apiClient';
import { emitSyncEvent, subscribeSyncEvents } from '../utils/syncEvents';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cancel dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings(false);

    // 1. Subscribe to instant cross-tab / in-app sync events
    const unsubscribe = subscribeSyncEvents((event) => {
      if (['BOOKING_CREATED', 'BOOKING_STATUS_CHANGED', 'BOOKING_UPDATED'].includes(event.type)) {
        fetchBookings(true); // Silent update without screen-flickering spinner
      }
    });

    // 2. Window focus and visibility listener (refreshes instantly when switching back to tab)
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchBookings(true);
      }
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // 3. Auto-sync interval (every 3.5 seconds) so admin status updates reflect automatically
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchBookings(true);
      }
    }, 3500);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(intervalId);
    };
  }, []);

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setErrorMessage('');
      const res = await apiClient.get('/bookings/my-bookings');
      if (res.data && res.data.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching my bookings:', err);
      if (!silent) setErrorMessage('Failed to load your bookings. Please try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleOpenCancel = (bookingId) => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (booking && booking.status !== 'PENDING') {
      setErrorMessage('Only pending bookings can be cancelled. Confirmed appointments cannot be cancelled.');
      return;
    }
    setSelectedBookingId(bookingId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;

    const targetBooking = bookings.find((b) => b.bookingId === selectedBookingId);
    if (targetBooking && targetBooking.status !== 'PENDING') {
      setErrorMessage('This booking has been confirmed by admin and cannot be cancelled.');
      setCancelDialogOpen(false);
      return;
    }

    // Instant optimistic update: Cancelled chip appears immediately
    const previousBookings = [...bookings];
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === selectedBookingId ? { ...b, status: 'CANCELLED' } : b))
    );

    try {
      setCancelling(true);
      const res = await apiClient.patch(`/bookings/${selectedBookingId}/cancel`);
      if (res.data && res.data.success) {
        setSuccessMessage('Booking cancelled successfully.');
        setCancelDialogOpen(false);
        emitSyncEvent('BOOKING_STATUS_CHANGED', { bookingId: selectedBookingId, status: 'CANCELLED' });
        fetchBookings(true);
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setBookings(previousBookings); // Revert on failure
      setErrorMessage(err.response?.data?.message || 'Failed to cancel booking.');
      setCancelDialogOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <Chip
            icon={<HourglassEmptyIcon sx={{ '&&': { color: '#8A6820', fontSize: 16 } }} />}
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
            icon={<CheckCircleIcon sx={{ '&&': { color: '#656E8A', fontSize: 16 } }} />}
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
            icon={<CheckCircleIcon sx={{ '&&': { color: '#8C7366', fontSize: 16 } }} />}
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
            icon={<CancelIcon sx={{ '&&': { color: '#2B2523', fontSize: 16 } }} />}
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 0.5 }}>
            My Pest Control Bookings
          </Typography>
          <Typography variant="body2" sx={{ color: '#72655F' }}>
            Track the real-time status, scheduled dates, and warranty validity of your service appointments.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/book')}
          startIcon={<CalendarMonthIcon />}
          sx={{
            backgroundColor: '#8C7366',
            color: '#F4EFEA',
            fontWeight: 750,
            borderRadius: 9999,
            px: 3,
            py: 1.1,
            boxShadow: '0 4px 14px rgba(140, 115, 102, 0.25)',
            '&:hover': { backgroundColor: '#735b4f' },
          }}
        >
          Book New Service
        </Button>
      </Box>

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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#8C7366' }} />
        </Box>
      ) : bookings.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: '#FAF8F5',
            border: '2px dashed rgba(176, 148, 133, 0.4)',
            borderRadius: 4.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', mb: 1 }}>
            No Bookings Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#72655F', mb: 3 }}>
            You haven't booked any pest control service yet. Schedule your first appointment today!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/book')}
            sx={{
              backgroundColor: '#8C7366',
              color: '#F4EFEA',
              fontWeight: 750,
              borderRadius: 9999,
              px: 3.5,
              py: 1.2,
              '&:hover': { backgroundColor: '#735b4f' },
            }}
          >
            Book a Service Now
          </Button>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 4.5,
            border: '1px solid rgba(176, 148, 133, 0.25)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 30px rgba(43, 37, 35, 0.04)',
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#FAF8F5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523', py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Service Treatment</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Scheduled Date</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Service Address</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Price (₹)</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523' }}>Warranty / Validity</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#2B2523', textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.bookingId}
                  hover
                  sx={{
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'rgba(244, 239, 234, 0.45)' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 750, color: '#2B2523' }}>#{booking.bookingId}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 750, color: '#2B2523' }}>
                      {booking.service?.serviceName || `Service #${booking.serviceId}`}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#2B2523' }}>
                    {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" sx={{ color: '#72655F', fontSize: '0.85rem' }}>
                      {booking.address?.address || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 850, color: '#8C7366' }}>
                    ₹{Number(booking.price).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>{getStatusChip(booking.status)}</TableCell>
                  <TableCell>
                    {booking.status === 'COMPLETED' ? (
                      booking.isExpired ? (
                        <Chip label="Warranty Expired" size="small" sx={{ backgroundColor: 'rgba(43, 37, 35, 0.08)', color: '#72655F' }} />
                      ) : (
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#8C7366', display: 'block' }}>
                            {booking.remainingDays} days left
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#72655F' }}>
                            Expires: {new Date(booking.expiryDate).toLocaleDateString('en-IN')}
                          </Typography>
                        </Box>
                      )
                    ) : (
                      <Typography variant="caption" sx={{ color: '#72655F' }}>
                        Active post completion
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {booking.status === 'PENDING' ? (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleOpenCancel(booking.bookingId)}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          borderRadius: 9999,
                          px: 1.8,
                        }}
                      >
                        Cancel
                      </Button>
                    ) : booking.status === 'CONFIRMED' ? (
                      <Tooltip title="Confirmed by admin - Cancellation disabled" arrow>
                        <span>
                          <Button
                            size="small"
                            disabled
                            variant="outlined"
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              borderRadius: 9999,
                              px: 1.8,
                              borderColor: 'rgba(43, 37, 35, 0.15) !important',
                              color: 'rgba(114, 101, 95, 0.45) !important',
                            }}
                          >
                            Cancel
                          </Button>
                        </span>
                      </Tooltip>
                    ) : booking.status === 'CANCELLED' ? (
                      <Chip
                        label="Cancelled"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(43, 37, 35, 0.08)',
                          color: '#72655F',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                        }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#72655F' }}>
                        -
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog for Cancellation */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2B2523' }}>Cancel Booking #{selectedBookingId}?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#72655F' }}>
            Are you sure you want to cancel this pest control service booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ color: '#72655F' }}>
            Keep Booking
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained" disabled={cancelling} sx={{ fontWeight: 700, borderRadius: 9999 }}>
            {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookingsPage;
