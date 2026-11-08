import React from 'react';
import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAdmin } = useAuth();

  return (
    <Box
      sx={{
        backgroundColor: '#2B2523',
        color: '#F4EFEA',
        mt: 8,
        pt: 7,
        pb: 5,
        borderTop: '1px solid rgba(176, 148, 133, 0.25)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="space-between">
          {/* Company Brief */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Om Enterprises Logo"
                sx={{
                  width: 38,
                  height: 38,
                  objectFit: 'contain',
                  borderRadius: 2,
                  backgroundColor: '#F4EFEA',
                  p: 0.4,
                }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#DDB872', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                  OM ENTERPRISES
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(244, 239, 234, 0.7)', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  {isAdmin ? 'ADMINISTRATIVE CONTROL PANEL' : 'PEST CONTROL & CLEANING SERVICES'}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.8)', lineHeight: 1.7, maxWidth: 480 }}>
              {isAdmin
                ? 'Authorized management console for configuring service catalog, monitoring live customer bookings, setting warranty validities, and reviewing customer accounts.'
                : 'Govt. of India certified pest control & cleaning service based in Derawali, Panvel. Serving residential societies, commercial facilities, and bungalows across Navi Mumbai and Raigad.'}
            </Typography>
          </Grid>

          {/* Official Address & Contacts (NO Quick Navigation, NO Admin Dashboard) */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 750, color: '#DDB872', mb: 2, letterSpacing: '-0.01em' }}>
              Official Address & Contacts
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, color: 'rgba(244, 239, 234, 0.85)' }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1.5, mt: 0.3, color: '#DDB872', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                Shree Jyotirling Apartment, D-101, Derawali, Panvel, Raigad, Maharashtra - 410221
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: 'rgba(244, 239, 234, 0.85)' }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1.5, color: '#DDB872', flexShrink: 0 }} />
              <Typography variant="body2">+91 95875 33344 / +91 79411 88860</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(244, 239, 234, 0.85)' }}>
              <EmailIcon fontSize="small" sx={{ mr: 1.5, color: '#DDB872', flexShrink: 0 }} />
              <Typography variant="body2">info@omenterprisespanvel.com</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(176, 148, 133, 0.2)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'rgba(244, 239, 234, 0.65)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Om Enterprises (Panvel, Raigad, Maharashtra). All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#DDB872', fontWeight: 700, letterSpacing: '0.03em' }}>
              GSTIN: 27DMLPK4710B1ZB
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(244, 239, 234, 0.75)', fontWeight: 650 }}>
              • NIPHM Cert: 0786 - PBD (UIPM-4)/26-27
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
