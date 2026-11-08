import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { subscribeSyncEvents } from '../utils/syncEvents';

const ProfilePage = () => {
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [customerStats, setCustomerStats] = useState({ addressesCount: 0, bookingsCount: 0, completedCount: 0 });
  const [adminStats, setAdminStats] = useState({ servicesCount: 0, bookingsCount: 0, customersCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileData(false);

    // 1. Subscribe to instant cross-tab / in-app sync events
    const unsubscribe = subscribeSyncEvents((event) => {
      if (
        [
          'BOOKING_CREATED',
          'BOOKING_STATUS_CHANGED',
          'BOOKING_UPDATED',
          'SERVICE_UPDATED',
          'ADDRESS_UPDATED',
        ].includes(event.type)
      ) {
        fetchProfileData(true);
      }
    });

    // 2. Focus and visibility listener
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchProfileData(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [isAdmin]);

  const fetchProfileData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError('');

      if (isAdmin) {
        // Fetch Admin profile and platform stats
        const [profileRes, servicesRes, bookingsRes, customersRes] = await Promise.all([
          apiClient.get('/admin/profile').catch(() => ({ data: { admin: user } })),
          apiClient.get('/admin/services').catch(() => ({ data: { services: [] } })),
          apiClient.get('/admin/bookings').catch(() => ({ data: { bookings: [] } })),
          apiClient.get('/admin/customers').catch(() => ({ data: { customers: [] } })),
        ]);

        if (profileRes.data && profileRes.data.admin) {
          setProfile(profileRes.data.admin);
        } else {
          setProfile(user);
        }

        setAdminStats({
          servicesCount: servicesRes.data?.services?.length || 0,
          bookingsCount: bookingsRes.data?.bookings?.length || 0,
          customersCount: customersRes.data?.customers?.length || 0,
        });
      } else {
        // Fetch Customer profile and customer stats
        const [profileRes, addressesRes, bookingsRes] = await Promise.all([
          apiClient.get('/customers/profile').catch(() => ({ data: { customer: user } })),
          apiClient.get('/customers/addresses').catch(() => ({ data: { addresses: [] } })),
          apiClient.get('/bookings/my-bookings').catch(() => ({ data: { bookings: [] } })),
        ]);

        if (profileRes.data && profileRes.data.customer) {
          setProfile(profileRes.data.customer);
        } else {
          setProfile(user);
        }

        const addresses = addressesRes.data?.addresses || [];
        const bookings = bookingsRes.data?.bookings || [];
        const completed = bookings.filter((b) => b.status === 'COMPLETED').length;

        setCustomerStats({
          addressesCount: addresses.length,
          bookingsCount: bookings.length,
          completedCount: completed,
        });
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      if (!silent) setError('Unable to load latest server details. Showing active session profile.');
      setProfile(user);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: '#8C7366' }} />
      </Box>
    );
  }

  const currentProfile = profile || user;

  // ----------------------------------------------------------------------
  // ADMIN PROFILE VIEW
  // ----------------------------------------------------------------------
  if (isAdmin) {
    const adminInitial = currentProfile?.adminName ? currentProfile.adminName.charAt(0).toUpperCase() : 'A';

    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 4.5 }}>
          <Chip
            icon={<AdminPanelSettingsIcon sx={{ fontSize: '1rem !important', color: '#2B2523 !important' }} />}
            label="ADMINISTRATIVE PROFILE"
            size="small"
            sx={{
              backgroundColor: '#DDB872',
              color: '#2B2523',
              fontWeight: 800,
              letterSpacing: '0.06em',
              mb: 1.5,
            }}
          />
         
          <Typography variant="body2" sx={{ color: '#72655F', maxWidth: 520, mx: 'auto' }}>
            System administration credentials, platform access privileges, and live enterprise management overview.
          </Typography>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Admin Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: 4.5,
            border: '1px solid rgba(176, 148, 133, 0.25)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 30px rgba(43, 37, 35, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 76,
                height: 76,
                background: 'linear-gradient(135deg, #8C7366 0%, #735b4f 100%)',
                color: '#F4EFEA',
                fontSize: '2rem',
                fontWeight: 800,
                border: '2px solid #DDB872',
                boxShadow: '0 4px 16px rgba(140, 115, 102, 0.3)',
                margin: '0 20px',
              }}
            >
              {adminInitial}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.8 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.01em' }}>
                  {currentProfile?.adminName || 'System Administrator'}
                </Typography>
                
                
              </Box>

              <Typography variant="body2" sx={{ color: '#72655F' }}>
                • Enterprise: <strong>OM ENTERPRISES (Panvel)</strong>
              </Typography>
            </Box>

           
          </Box>
        </Paper>

        

        {/* Centered Personal & Role Information Card */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: { xs: 3.5, sm: 5 },
              borderRadius: 4.5,
              border: '1px solid rgba(176, 148, 133, 0.25)',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 30px rgba(43, 37, 35, 0.04)',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.01em' }}>
                Administrative Credentials & Access Rights
              </Typography>
              <Typography variant="body2" sx={{ color: '#72655F', mt: 0.3 }}>
                Official identity records and assigned security permissions.
              </Typography>
            </Box>

            <Divider sx={{ mb: 3.5, borderColor: 'rgba(176, 148, 133, 0.22)' }} />

            <Grid container spacing={3}>
              {/* Admin Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3.5,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid rgba(176, 148, 133, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      backgroundColor: '#FFFFFF',
                      color: '#8C7366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(176, 148, 133, 0.25)',
                      flexShrink: 0,
                    }}
                  >
                    <PersonIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                      Administrator Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                      {currentProfile?.adminName || 'Admin'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Admin Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3.5,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid rgba(176, 148, 133, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      backgroundColor: '#FFFFFF',
                      color: '#8C7366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(176, 148, 133, 0.25)',
                      flexShrink: 0,
                    }}
                  >
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                      Official Admin Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                      {currentProfile?.email || 'admin@gmail.com'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

             
              {/* Business Registration */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3.5,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid rgba(176, 148, 133, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      backgroundColor: '#FFFFFF',
                      color: '#DDB872',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(221, 184, 114, 0.4)',
                      flexShrink: 0,
                    }}
                  >
                    <ReceiptLongIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                      GSTIN 
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                      27DMLPK4710B1ZB
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Government Certificate Reference */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3.5,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid rgba(176, 148, 133, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      backgroundColor: '#FFFFFF',
                      color: '#8C7366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(176, 148, 133, 0.25)',
                      flexShrink: 0,
                    }}
                  >
                    <WorkspacePremiumIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                      NIPHM (Govt. of India)
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                       0786 - PBD (UIPM-4)/26-27
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    );
  }

  // ----------------------------------------------------------------------
  // CUSTOMER PROFILE VIEW
  // ----------------------------------------------------------------------
  const customerInitial = currentProfile?.customerName ? currentProfile.customerName.charAt(0).toUpperCase() : 'C';

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Centered Page Header */}
      <Box sx={{ textAlign: 'center', mb: 4.5 }}>
        <Chip
          label="ACCOUNT OVERVIEW"
          size="small"
          sx={{
            backgroundColor: 'rgba(140, 115, 102, 0.12)',
            color: '#8C7366',
            fontWeight: 800,
            letterSpacing: '0.08em',
            mb: 1.5,
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 0.8 }}>
          My Account Profile
        </Typography>
        <Typography variant="body2" sx={{ color: '#72655F', maxWidth: 520, mx: 'auto' }}>
          View your personal details, registered contact numbers, and service history.
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 4,
          borderRadius: 4.5,
          border: '1px solid rgba(176, 148, 133, 0.25)',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 8px 30px rgba(43, 37, 35, 0.04)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 76,
              height: 76,
              background: 'linear-gradient(135deg, #8C7366 0%, #735b4f 100%)',
              color: '#F4EFEA',
              fontSize: '2rem',
              fontWeight: 800,
              border: '2px solid #DDB872',
              boxShadow: '0 4px 16px rgba(140, 115, 102, 0.3)',
            }}
          >
            {customerInitial}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.8 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.01em' }}>
                {currentProfile?.customerName || 'Customer'}
              </Typography>
              <Chip
                label={`${currentProfile?.customerType || 'DOMESTIC'} CLIENT`}
                size="small"
                sx={{
                  backgroundColor: '#DDB872',
                  color: '#2B2523',
                  fontWeight: 750,
                  fontSize: '0.72rem',
                }}
              />
              <Chip
                label="Verified Account"
                size="small"
                sx={{
                  backgroundColor: 'rgba(140, 115, 102, 0.1)',
                  color: '#8C7366',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: '#72655F' }}>
              Customer Reference: <strong>#{currentProfile?.customerId || '-'}</strong>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Account Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
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
                <CalendarMonthIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TOTAL BOOKINGS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 850, color: '#2B2523', letterSpacing: '-0.02em' }}>
                  {customerStats.bookingsCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
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
                <CheckCircleIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#656E8A', fontWeight: 700, letterSpacing: '0.04em' }}>
                  COMPLETED TREATMENTS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 850, color: '#2B2523', letterSpacing: '-0.02em' }}>
                  {customerStats.completedCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
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
                <HomeIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#8A6820', fontWeight: 700, letterSpacing: '0.04em' }}>
                  SAVED ADDRESSES
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 850, color: '#2B2523', letterSpacing: '-0.02em' }}>
                  {customerStats.addressesCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Personal Information Container - Centered */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4.5,
            border: '1px solid rgba(176, 148, 133, 0.25)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 30px rgba(43, 37, 35, 0.04)',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.01em' }}>
              Personal & Contact Information
            </Typography>
            <Typography variant="body2" sx={{ color: '#72655F', mt: 0.3 }}>
              Your verified credentials and account details.
            </Typography>
          </Box>

          <Divider sx={{ mb: 3.5, borderColor: 'rgba(176, 148, 133, 0.22)' }} />

          <Grid container spacing={3}>
            {/* Customer Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(176, 148, 133, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#FFFFFF',
                    color: '#8C7366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(176, 148, 133, 0.25)',
                    flexShrink: 0,
                  }}
                >
                  <PersonIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                    Full Customer Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                    {currentProfile?.customerName || '-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Phone Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(176, 148, 133, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#FFFFFF',
                    color: '#8C7366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(176, 148, 133, 0.25)',
                    flexShrink: 0,
                  }}
                >
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                    Registered Phone Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                    {currentProfile?.phoneNo || '-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Email Address */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(176, 148, 133, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#FFFFFF',
                    color: '#8C7366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(176, 148, 133, 0.25)',
                    flexShrink: 0,
                  }}
                >
                  <EmailIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                    {currentProfile?.email || 'Not Provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Customer Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(176, 148, 133, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#FFFFFF',
                    color: '#8C7366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(176, 148, 133, 0.25)',
                    flexShrink: 0,
                  }}
                >
                  <VerifiedUserIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650, display: 'block' }}>
                    Customer Category
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 750, color: '#2B2523' }}>
                    {currentProfile?.customerType || 'DOMESTIC'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
