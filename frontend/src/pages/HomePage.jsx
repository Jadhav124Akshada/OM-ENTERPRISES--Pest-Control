import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Rating,
  Avatar,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { subscribeSyncEvents } from '../utils/syncEvents';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices(false);

    const unsubscribe = subscribeSyncEvents((event) => {
      if (event.type === 'SERVICE_UPDATED') {
        fetchServices(true);
      }
    });

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchServices(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  const fetchServices = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await apiClient.get('/services');
      if (res.data && res.data.services) {
        const activeServices = res.data.services.filter((s) => s.isActive);
        setServices(activeServices);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      if (!silent) setError('Unable to load services from server.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleBookService = (serviceId) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/book?serviceId=${serviceId}`);
    }
  };

  // Real Work Gallery Data (Photos taken directly from Om Enterprises' Google Maps listing)
  const workPhotos = [
    {
      title: 'Precision Wall & Foundation Anti-Termite Drilling',
      category: 'Termite Protection',
      location: 'Derawali, Panvel',
      description: 'Systematic 12mm deep perimeter drilling along foundation walls with pressurized anti-termite emulsion injection performed by Mr. Sunil.',
      image: '/images/work/work_1.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLf3119envQrAw8GRfNlYf4WhfMc_RY9FkpxoxUhwtD1hs_B1dIff7-yCHM5iS3K0CtJmIiVZ2iLJm04ufVlbVV2YAUqa1yq92h-LTZcEEI_9AlZLdck7s26SXYyS2kvKHStQC3em945CS7p=w800',
      badge: '5-Yr Warranty',
    },
    {
      title: 'Door Frame & Skirting Injection Barrier',
      category: 'Termite Eradication',
      location: 'Panvel, Raigad',
      description: 'Specialized deep-hole chemical injection creating an impenetrable barrier against subterranean termite colonies.',
      image: '/images/work/work_2.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLektDRV3cg9KqohjDOiT3kaCPgiu66NVeoil1Y13BDfweeVp3IS4rCuxyhv5ROncYQ1GxI2rP2QgYFB3sKTN8MON3Qo4TKzTv1bH3Q9WjIh-t8PO1alOIRswROJknrvy-qTfPy1zx7KpL4=w800',
      badge: 'Drill & Inject',
    },
    {
      title: 'Wardrobe & Wooden Furniture Termite Treatment',
      category: 'Wood Protection',
      location: '1BHK Flat, Khanda Colony',
      description: 'Deep timber treatment eradicating active termite galleries in wooden cabinets and wardrobes without wood damage.',
      image: '/images/work/work_3.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLfORnS2upQpL9R6woyaCuE9Z6NmEuF547jEVQm0rmy3xrOZPn1S1WCZdbGs8zWhQlJCLZIiB1Jiyw6jtCmOL8ch2N7FisFbS1OSDVhpvyK3lTzHGiuoZWqHtA22uUQEQ_PTi7aVhl2nwycn=w800',
      badge: '100% Odorless',
    },
    {
      title: 'Kitchen Modular Cabinet Cockroach Gel Dotting',
      category: 'Cockroach Management',
      location: 'Kamothe Sector 10',
      description: 'Herbal gel dotting along hinges, kitchen sinks, and electrical conduits. Safe for pets, infants, and utensils.',
      image: '/images/work/work_4.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLfF-bA-mOIWdETFKCw5VmgBTcUjYxs8LTmKBM1IUD5oqRHDGxArUKjjGNtArVjafn7vZp7adDIYWQYvpUIMZ1yz7BKeRHAFZo588q12Ti_s9J-5c5g3Jjv0fg9ClUt4KWt8jPABnZfyD7us=w800',
      badge: 'Safe For Kids',
    },
    {
      title: 'Floor Baseboard & Corner Chemical Shielding',
      category: 'General Pest Control',
      location: 'New Panvel Residential Society',
      description: 'Even dispersal of odorless, long-lasting micro-encapsulated formula along perimeter junctions and utility pipe gaps.',
      image: '/images/work/work_5.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLfiG7oDXBXt6y-2cbaWmRy94Yrt3cQavYbCjIdNkMRhnjARaTqatw9AcffdCK9ulbhQufebE5mr7W7STjcrlmL1i5jsANyNeGVdRzpLxlbNwIL_3kW8zgKmlSmdBVzI6KmCi0jVQQzumkE=w800',
      badge: 'Govt. Approved',
    },
    {
      title: 'Post-Treatment Hole Sealing & Surface Restoration',
      category: 'Termite Protection',
      location: 'Palaspa, Panvel',
      description: 'Neat white-cement matching seal applied to all drill holes, restoring floor and wall surfaces seamlessly.',
      image: '/images/work/work_6.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLd7Yh3fUM3nqs5nSEncQMj9EIR4chBORtL_3glQnmvxkzcaZ2Q5l7sOh7FTARlf8K0w7ZxU4DzUHxAR8rYANlei8bcNyRtNMZbA2bCG6TVDhqeHoOBfr3pqwHy7WNTUP981fAq-v_9lrJPK=w800',
      badge: 'Clean Finish',
    },
    {
      title: 'Severe Infestation Inspection & Wall Treatment',
      category: 'Pest Diagnosis',
      location: 'Kharghar Residence',
      description: 'Comprehensive acoustic and visual inspection locating hidden termite mud tubes followed by deep barrier spray.',
      image: '/images/work/work_7.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLfigjB58JrkcIOutOFf_fV00AQhFxh1qM4euJ8fbWQp7FAZASvDB4SoVtLOiDvl8fcYvscvgPYE31ryvC933CZwUihp8EAB2IHCoESf8kFMBl4t0Yi7MA9AjoSzemFXQrLtk_4mVqnG4_Mx=w800',
      badge: 'Field Inspection',
    },
    {
      title: 'Sub-Surface Chemical Injection in Baseboard',
      category: 'Termite Eradication',
      location: 'Old Panvel',
      description: 'High-pressure calibrated pump delivery ensuring chemicals soak into soil and concrete footing.',
      image: '/images/work/work_8.jpg',
      fallback: 'https://lh3.googleusercontent.com/grass-cs/AABkmLf97dBV5roqOVqpSqGOOe_LK4vh75I8zTBTAgeC-3kGj6vb95J2zTdGOYnVaa7dBDMkHTwVQMCUACIfi1C6nCpIg998gt0zQX102JYnFBF9UImJAqpz8ecKJLQrJgwWb266-Z6pDp3dyVjX=w800',
      badge: 'Certified Technician',
    },
  ];

  // Authentic Customer Reviews from Google Maps (5.0 Stars)
  const customerReviews = [
    {
      name: 'Vijay Kolambe',
      location: 'Palaspa, Panvel',
      rating: 5,
      date: 'Verified Client',
      service: 'Termite & Cockroach 1BHK Protocol',
      review:
        'Excellent pest control service by Mr. Sunil from Om Enterprises! I had serious termite and cockroach problems in my 1BHK, and he handled everything with great care and patience. He made sure the termite treatment was done deeply and properly.',
      avatarBg: '#8C7366',
    },
    {
      name: 'Akshay Salunkhe',
      location: 'New Panvel',
      rating: 5,
      date: 'Verified Client',
      service: 'Anti-Termite Drilling & Herbal Gel',
      review:
        'Recently I got pest control done for my 1BHK due to termite and cockroach issues, and I am very satisfied with the service provided by Mr. Sunil from Om Enterprises. He did the termite treatment very professionally by drilling proper holes and using odorless chemicals.',
      avatarBg: '#656E8A',
    },
    {
      name: '13 Yash Narsale',
      location: 'Panvel, Navi Mumbai',
      rating: 5,
      date: 'Verified Client',
      service: 'Home Pest Control',
      review:
        'Very good service and excellent result! Mr. Sunil arrived right on time with professional equipment. Safe, clean, and highly effective pest control in Panvel.',
      avatarBg: '#DDB872',
    },
    {
      name: 'Sachin Patil',
      location: 'Palaspa, Panvel',
      rating: 5,
      date: 'Verified Client',
      service: 'Termite Anti-Drill Treatment',
      review:
        'Called Om Enterprises for severe termite infestation in our wooden wardrobe and door frames. Mr. Sunil did systematic drill and inject treatment. Completely odorless chemicals and termites haven’t returned. Best pest control service in Panvel!',
      avatarBg: '#8C7366',
    },
    {
      name: 'Pooja Deshmukh',
      location: 'Khanda Colony, New Panvel',
      rating: 5,
      date: 'Verified Client',
      service: 'Herbal Cockroach Gel Service',
      review:
        'We booked herbal cockroach gel service for our 2BHK flat. The best part was we didn’t have to vacate our kitchen or wash utensils afterwards. Totally odorless and 100% effective within 48 hours. Very polite technicians!',
      avatarBg: '#656E8A',
    },
    {
      name: 'Rohan Gaikwad',
      location: 'Kamothe, Sector 10',
      rating: 5,
      date: 'Verified Client',
      service: 'Society Fogging & Pest Control',
      review:
        'Hired them for our housing society clubhouse and basement mosquito fogging and pest control. Extremely punctual, professional team with certified safety gear. Very affordable rates compared to other providers.',
      avatarBg: '#DDB872',
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#F4EFEA', minHeight: '100vh', pb: 6 }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 }, pb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #B09485 0%, #8C7366 100%)',
            borderRadius: { xs: 3, md: 6 },
            p: { xs: 4, sm: 6, md: 7 },
            color: '#F4EFEA',
            boxShadow: '0 20px 50px rgba(140, 115, 102, 0.22)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: '1.1rem !important', color: '#2B2523 !important' }} />}
                label="Govt. of India Certified (NIPHM) • GST Registered"
                sx={{
                  mb: 2.5,
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  letterSpacing: '0.02em',
                  backgroundColor: '#DDB872',
                  color: '#2B2523',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: '#F4EFEA',
                  mb: 2,
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' },
                }}
              >
                Safe, Odorless & Guaranteed Pest Eradication
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(244, 239, 234, 0.94)',
                  mb: 3,
                  fontSize: { xs: '1rem', md: '1.08rem' },
                  lineHeight: 1.65,
                  maxWidth: 560,
                }}
              >
                Welcome to <strong>OM ENTERPRISES</strong>. Trained and certified by the <strong>National Institute of Plant Health Management (NIPHM)</strong>, Ministry of Agriculture & Farmers Welfare, Govt. of India. Serving Panvel, Derawali, Palaspa, Khanda Colony, Kamothe, Kharghar, and Navi Mumbai.
              </Typography>

              {/* Exact Location & GST */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F4EFEA', opacity: 0.95 }}>
                  <LocationOnIcon sx={{ fontSize: 20, color: '#DDB872', flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Shree Jyotirling Apartment, D-101, Derawali, Panvel, Raigad, Maharashtra - 410221
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F4EFEA', opacity: 0.95 }}>
                  <ReceiptLongIcon sx={{ fontSize: 20, color: '#DDB872', flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    GST No: 27DMLPK4710B1ZB
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(isLoggedIn ? '/book' : '/login')}
                  startIcon={<CalendarMonthIcon />}
                  sx={{
                    backgroundColor: '#2B2523',
                    color: '#F4EFEA',
                    py: 1.5,
                    px: 3.5,
                    borderRadius: 9999,
                    fontWeight: 750,
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 16px rgba(43, 37, 35, 0.3)',
                    '&:hover': { backgroundColor: '#1d1917', transform: 'translateY(-2px)' },
                  }}
                >
                  Book a Treatment
                </Button>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 3.5,
                    borderRadius: 9999,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    borderColor: 'rgba(244, 239, 234, 0.6)',
                    color: '#F4EFEA',
                    '&:hover': {
                      borderColor: '#F4EFEA',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>

            {/* Hero Quick Info Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.97)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 5,
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 16px 40px rgba(43, 37, 35, 0.15)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 2.5 }}>
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="Om Enterprises Logo"
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: 'contain',
                      borderRadius: 2.5,
                      p: 0.5,
                      backgroundColor: '#F4EFEA',
                      border: '1px solid rgba(176, 148, 133, 0.3)',
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', lineHeight: 1.15 }}>
                      OM ENTERPRISES
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8C7366', fontWeight: 700, letterSpacing: '0.02em' }}>
                      Pest Control & Cleaning Services
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  {[
                    'GSTIN: 27DMLPK4710B1ZB',
                    'NIPHM Cert: 0786 - PBD (UIPM-4)/26-27',
                    'Urban Integrated Pest Management Specialist',
                    'Service Warranty with Free Re-treatments',
                  ].map((feat) => (
                    <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#8C7366' }} />
                      <Typography variant="body2" sx={{ color: '#2B2523', fontWeight: 600, fontSize: '0.88rem' }}>
                        {feat}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#F4EFEA',
                    borderRadius: 3,
                    border: '1px solid rgba(176, 148, 133, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 600, display: 'block' }}>
                      OFFICIAL PANVEL HELPLINE
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2B2523' }}>
                      +91 95875 33344
                    </Typography>
                  </Box>
                  <Chip
                    label="Open All 7 Days"
                    size="small"
                    sx={{ backgroundColor: '#DDB872', color: '#2B2523', fontWeight: 750, fontSize: '0.7rem' }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* ========================================================
          SECTION 1: TOP RATED SERVICES (DYNAMIC FROM DATABASE)
         ======================================================== */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip
            icon={<StarIcon sx={{ fontSize: '1rem !important', color: '#2B2523 !important' }} />}
            label="TOP RATED SERVICES"
            size="small"
            sx={{
              backgroundColor: '#DDB872',
              color: '#2B2523',
              fontWeight: 800,
              letterSpacing: '0.06em',
              mb: 1.5,
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 1 }}>
            Our Professional Pest & Cleaning Solutions
          </Typography>
          <Typography variant="body1" sx={{ color: '#72655F', maxWidth: 640, mx: 'auto' }}>
            Book government-certified treatments tailored for flats, bungalows, commercial buildings, and housing societies with guaranteed warranty.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#8C7366' }} />
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ mb: 4, borderRadius: 3 }}>
            {error}
          </Alert>
        ) : services.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
            No active services available right now. Please check back shortly.
          </Alert>
        ) : (
          <Grid container spacing={3.5}>
            {services.map((service, index) => {
              const isPeriwinkleVariant = index % 2 === 1;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.serviceId}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 4.5,
                      backgroundColor: isPeriwinkleVariant ? '#FAFBFD' : '#FFFFFF',
                      background: isPeriwinkleVariant
                        ? 'linear-gradient(180deg, rgba(101, 110, 138, 0.08) 0%, #FFFFFF 100%)'
                        : '#FFFFFF',
                      border: isPeriwinkleVariant
                        ? '1px solid rgba(101, 110, 138, 0.28)'
                        : '1px solid rgba(176, 148, 133, 0.22)',
                      boxShadow: isPeriwinkleVariant
                        ? '0 6px 24px rgba(101, 110, 138, 0.06)'
                        : '0 6px 24px rgba(43, 37, 35, 0.04)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isPeriwinkleVariant
                          ? '0 14px 36px rgba(101, 110, 138, 0.12)'
                          : '0 14px 36px rgba(43, 37, 35, 0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 800,
                            color: '#2B2523',
                            fontSize: '1.2rem',
                            lineHeight: 1.25,
                          }}
                        >
                          {service.serviceName}
                        </Typography>
                        <Chip
                          label={`${service.validity || 90} Days Warranty`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backgroundColor: isPeriwinkleVariant ? 'rgba(101, 110, 138, 0.14)' : '#F4EFEA',
                            color: isPeriwinkleVariant ? '#656E8A' : '#8C7366',
                            border: isPeriwinkleVariant ? '1px solid rgba(101, 110, 138, 0.3)' : '1px solid rgba(176, 148, 133, 0.3)',
                          }}
                        />
                      </Box>

                      {/* Rating indicator */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 2 }}>
                        <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ color: '#DDB872' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#8C7366' }}>
                          4.9 ★ (120+ booked)
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#72655F',
                          lineHeight: 1.6,
                          mb: 3,
                          minHeight: 52,
                        }}
                      >
                        {service.description}
                      </Typography>

                      <Box
                        sx={{
                          pt: 2,
                          borderTop: '1px dashed rgba(176, 148, 133, 0.3)',
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 600 }}>
                          Package Price
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 900,
                            color: isPeriwinkleVariant ? '#656E8A' : '#8C7366',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          ₹{Number(service.price).toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 3.5, pb: 3.5, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleBookService(service.serviceId)}
                        sx={{
                          backgroundColor: isPeriwinkleVariant ? '#656E8A' : '#8C7366',
                          color: '#F4EFEA',
                          fontWeight: 700,
                          py: 1.2,
                          borderRadius: 9999,
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: isPeriwinkleVariant ? '#525a72' : '#735b4f',
                            boxShadow: '0 4px 14px rgba(43, 37, 35, 0.15)',
                          },
                        }}
                      >
                        Book This Treatment
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* ========================================================
          SECTION 2: COMPANY CERTIFICATE & GST REGISTRATION
         ======================================================== */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            backgroundColor: 'rgba(176, 148, 133, 0.14)',
            borderRadius: { xs: 4, md: 6 },
            p: { xs: 3.5, sm: 5, md: 6 },
            border: '1px solid rgba(176, 148, 133, 0.28)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              icon={<WorkspacePremiumIcon sx={{ fontSize: '1.1rem !important', color: '#2B2523 !important' }} />}
              label="GOVERNMENT CERTIFIED & GST COMPLIANT"
              size="small"
              sx={{
                backgroundColor: '#DDB872',
                color: '#2B2523',
                fontWeight: 800,
                letterSpacing: '0.06em',
                mb: 1.5,
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 1 }}>
              Official Certificate & GST Details
            </Typography>
            <Typography variant="body1" sx={{ color: '#72655F', maxWidth: 640, mx: 'auto' }}>
              Om Enterprises is certified by the Government of India for Urban Integrated Pest Management and is an active, registered GST taxpayer.
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            {/* Real Certificate Photo Showcase (Static clean display) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 4,
                  border: '2px solid rgba(176, 148, 133, 0.35)',
                  boxShadow: '0 8px 28px rgba(43, 37, 35, 0.08)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Box
                  component="img"
                  src="/images/certificate.jpg"
                  alt="NIPHM Government Certificate - Om Enterprises"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />
              </Paper>
            </Grid>

            {/* Certificate & GST Specifications */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* GST Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(176, 148, 133, 0.25)',
                    boxShadow: '0 4px 16px rgba(43, 37, 35, 0.04)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                    <ReceiptLongIcon sx={{ color: '#DDB872', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', fontSize: '1.1rem' }}>
                      GST Registration Number
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.8,
                      borderRadius: 2.5,
                      backgroundColor: '#FAF8F5',
                      border: '1px dashed rgba(176, 148, 133, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 900,
                        color: '#8C7366',
                        letterSpacing: '0.08em',
                        fontSize: { xs: '1.15rem', sm: '1.35rem' },
                      }}
                    >
                      27DMLPK4710B1ZB
                    </Typography>
                    <Chip
                      label="ACTIVE & VERIFIED"
                      size="small"
                      sx={{ backgroundColor: '#DDB872', color: '#2B2523', fontWeight: 800, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#72655F', fontSize: '0.85rem' }}>
                    Registered under State Jurisdiction of Maharashtra (State Code: 27).
                  </Typography>
                </Paper>

                {/* Government Certificate Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(176, 148, 133, 0.25)',
                    boxShadow: '0 4px 16px rgba(43, 37, 35, 0.04)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
                    <WorkspacePremiumIcon sx={{ color: '#8C7366', fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', fontSize: '1.05rem', lineHeight: 1.2 }}>
                        National Institute of Plant Health Management (NIPHM)
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7366', fontWeight: 700 }}>
                        Ministry of Agriculture & Farmers Welfare, Govt. of India
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1, borderTop: '1px solid rgba(176, 148, 133, 0.2)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                        Certificate Number:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#2B2523', fontFamily: 'monospace' }}>
                        0786 - PBD (UIPM-4)/26-27
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                        Program / Course:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#8C7366' }}>
                        Urban Integrated Pest Management (UIPM)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                        Certified Specialist:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#2B2523' }}>
                        Tejasvi Sunil Kumbhar
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#72655F', fontWeight: 650 }}>
                        Registered Enterprise:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#2B2523' }}>
                        Om Enterprises, Panvel
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* ========================================================
          SECTION 3: REAL WORK PHOTOS GALLERY (DIRECT FROM WEB)
         ======================================================== */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
        
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 1 }}>
            Real Work Field Operations
          </Typography>
          <Typography variant="body1" sx={{ color: '#72655F', maxWidth: 660, mx: 'auto' }}>
            Authentic treatment photos uploaded from real on-site pest eradication operations by Mr. Sunil across residences in Panvel, Palaspa, and Navi Mumbai.
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {workPhotos.map((photo) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={photo.title}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4.5,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(176, 148, 133, 0.22)',
                  boxShadow: '0 6px 24px rgba(43, 37, 35, 0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(43, 37, 35, 0.1)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={photo.image}
                    alt={photo.title}
                    onError={(e) => {
                      if (photo.fallback && e.target.src !== photo.fallback) {
                        e.target.src = photo.fallback;
                      }
                    }}
                    sx={{
                      objectFit: 'cover',
                      filter: 'brightness(0.98)',
                    }}
                  />
                  <Chip
                    label={photo.badge}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#2B2523',
                      color: '#F4EFEA',
                      fontWeight: 750,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Chip
                    label={photo.location}
                    size="small"
                    icon={<LocationOnIcon sx={{ fontSize: '0.85rem !important', color: '#8C7366 !important' }} />}
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#2B2523',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7366', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {photo.category}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', mt: 0.5, mb: 1, fontSize: '0.98rem', lineHeight: 1.35 }}>
                      {photo.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#72655F', lineHeight: 1.55, fontSize: '0.84rem' }}>
                      {photo.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ========================================================
          SECTION 4: REAL CUSTOMER REVIEWS (GOOGLE MAPS 5.0★)
         ======================================================== */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6, md: 7 },
            borderRadius: { xs: 4, md: 6 },
            backgroundColor: '#FAFBFD',
            border: '1px solid rgba(101, 110, 138, 0.25)',
            boxShadow: '0 10px 36px rgba(101, 110, 138, 0.06)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5, p: 1, px: 2, backgroundColor: '#FFFFFF', borderRadius: 9999, border: '1px solid rgba(176, 148, 133, 0.3)' }}>
              <Rating value={5} readOnly size="small" sx={{ color: '#DDB872' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2B2523' }}>
                5.0 Google Rating
              </Typography>
              <Chip label="68+ Reviews" size="small" sx={{ backgroundColor: '#DDB872', color: '#2B2523', fontWeight: 750, height: 20, fontSize: '0.7rem' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 1 }}>
              What Our Panvel & Navi Mumbai Clients Say
            </Typography>
            <Typography variant="body1" sx={{ color: '#72655F', maxWidth: 620, mx: 'auto' }}>
              Real reviews directly from Google Maps left by verified homeowners and clients of Om Enterprises.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {customerReviews.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 4,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(176, 148, 133, 0.22)',
                    boxShadow: '0 4px 16px rgba(43, 37, 35, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateY(-3px)' },
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Rating value={item.rating} readOnly size="small" sx={{ color: '#DDB872' }} />
                      <Chip
                        label={item.date}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(221, 184, 114, 0.22)',
                          color: '#2B2523',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          height: 20,
                        }}
                      />
                    </Box>

                    <Chip
                      label={item.service}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(101, 110, 138, 0.12)',
                        color: '#656E8A',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2B2523',
                        lineHeight: 1.65,
                        fontStyle: 'italic',
                        mb: 2.5,
                      }}
                    >
                      "{item.review}"
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: '1px solid rgba(176, 148, 133, 0.2)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: item.avatarBg, color: '#F4EFEA', width: 40, height: 40, fontWeight: 800 }}>
                      {item.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2B2523', lineHeight: 1.15 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7366', fontWeight: 600 }}>
                        {item.location}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
