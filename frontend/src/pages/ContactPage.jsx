import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import apiClient from '../api/apiClient';

const ContactPage = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiClient.get('/services');
        if (res.data?.services) {
          const activeOnly = res.data.services.filter((s) => s.isActive);
          setServices(activeOnly);
          if (activeOnly.length > 0) {
            setFormData((prev) => ({
              ...prev,
              serviceType: prev.serviceType || activeOnly[0].serviceName,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load services in contact page:', err);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: services.length > 0 ? services[0].serviceName : 'Other Inquiry',
      message: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Chip
          label="GET IN TOUCH"
          size="small"
          sx={{
            backgroundColor: 'rgba(140, 115, 102, 0.12)',
            color: '#8C7366',
            fontWeight: 800,
            letterSpacing: '0.08em',
            mb: 1.5,
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 1.5 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ color: '#72655F', maxWidth: 620, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Have questions regarding our treatments, pricing, or need an urgent commercial quote?
          Our certified pest control specialists are ready to help.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information Cards */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, md: 4.5 },
              height: '100%',
              background: 'linear-gradient(135deg, #B09485 0%, #8C7366 100%)',
              color: '#F4EFEA',
              borderRadius: 4.5,
              boxShadow: '0 12px 36px rgba(140, 115, 102, 0.22)',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F4EFEA', mb: 3.5, letterSpacing: '-0.01em' }}>
              Our Office & Contacts
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LocationOnIcon sx={{ color: '#DDB872', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F4EFEA' }}>
                  Head Office Address
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.88)', lineHeight: 1.6 }}>
                  Om Enterprises, Shree Jyotirling Apartment, D-101, Derawali, Panvel, Raigad, Maharashtra - 410221
                </Typography>
                <Chip
                  label="GSTIN: 27DMLPK4710B1ZB"
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: '#DDB872',
                    color: '#2B2523',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: 'rgba(244, 239, 234, 0.2)' }} />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <PhoneIcon sx={{ color: '#DDB872', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F4EFEA' }}>
                  Telephone & Mobile
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.88)' }}>
                  Mobile: +91 95875 33344
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.88)' }}>
                  Helpline: +91 79411 88860
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: 'rgba(244, 239, 234, 0.2)' }} />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <EmailIcon sx={{ color: '#DDB872', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F4EFEA' }}>
                  Email Support
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.88)' }}>
                  General: info@omenterprisespanvel.com
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.88)' }}>
                  Bookings: bookings@omenterprisespanvel.com
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: 'rgba(244, 239, 234, 0.2)' }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AccessTimeIcon sx={{ color: '#DDB872', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F4EFEA' }}>
                  Working Hours
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.88)' }}>
                  Monday - Saturday: 8:00 AM - 8:30 PM
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.88)' }}>
                  Sunday: 9:00 AM - 5:00 PM (Emergency Pest Treatments)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Contact / Inquiry Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, md: 4.5 },
              border: '1px solid rgba(176, 148, 133, 0.25)',
              borderRadius: 4.5,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(43, 37, 35, 0.04)',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2B2523', mb: 1, letterSpacing: '-0.01em' }}>
              Send Us an Inquiry
            </Typography>
            <Typography variant="body2" sx={{ color: '#72655F', mb: 3 }}>
              Fill in the form below and our customer care team will get back to you within 2 business hours.
            </Typography>

            {submitted && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
                Thank you! Your message has been received. Our team will contact you shortly.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Interested Service"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                  >
                    {services.map((svc) => (
                      <MenuItem key={svc.serviceId} value={svc.serviceName}>
                        {svc.serviceName}
                      </MenuItem>
                    ))}
                    <MenuItem value="Other Inquiry">Other Inquiry</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Message or Infestation Details"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please specify your address area, approximate room count, and current pest issue..."
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                sx={{
                  mt: 3.5,
                  py: 1.4,
                  px: 4.5,
                  fontWeight: 750,
                  borderRadius: 9999,
                  backgroundColor: '#8C7366',
                  color: '#F4EFEA',
                  boxShadow: '0 4px 14px rgba(140, 115, 102, 0.25)',
                  '&:hover': { backgroundColor: '#735b4f' },
                }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;
