import React from 'react';
import { Container, Typography, Box, Grid, Paper, Card, CardContent, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpaIcon from '@mui/icons-material/Spa';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 1.5 }}>
                   ABOUT US</Typography>
        <Typography variant="body1" sx={{ color: '#72655F', maxWidth: 680, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.65 }}>
          Professional pest eradication and hygiene solutions for homes, societies, and commercial premises across Panvel, Derawali, and Navi Mumbai.
        </Typography>
      </Box>

      {/* Main Profile & Credentials */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, md: 5 },
          mb: 6,
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(176, 148, 133, 0.25)',
          borderRadius: 5,
          boxShadow: '0 8px 32px rgba(43, 37, 35, 0.04)',
        }}
      >
        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <VerifiedIcon sx={{ color: '#DDB872', fontSize: 24 }} />
              <Typography variant="caption" sx={{ color: '#8C7366', fontWeight: 800, letterSpacing: '0.04em' }}>
                GOVERNMENT OF INDIA CERTIFIED SPECIALIST
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2B2523', mb: 2, letterSpacing: '-0.01em' }}>
              Om Enterprises & Certified Expertise
            </Typography>
            <Typography variant="body1" sx={{ color: '#2B2523', mb: 2, lineHeight: 1.75 }}>
              <strong>OM ENTERPRISES</strong> operates under certified leadership with formal qualification in <strong>"Urban Integrated Pest Management" (UIPM)</strong> conducted by the <strong>National Institute of Plant Health Management (NIPHM)</strong>, Department of Agriculture & Farmers Welfare, Ministry of Agriculture & Farmers Welfare, Government of India.
            </Typography>
            <Typography variant="body1" sx={{ color: '#72655F', lineHeight: 1.75, mb: 3 }}>
              Every treatment is executed with scientific precision using safe, odorless formulations and calibrated dosages, guaranteeing long-lasting protection with verifiable warranty coverage.
            </Typography>

            {/* Quick Contact & Verified Credentials Pill */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                backgroundColor: '#F4EFEA',
                border: '1px solid rgba(176, 148, 133, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <ReceiptLongIcon sx={{ fontSize: 20, color: '#8C7366', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2B2523' }}>
                  GSTIN: 27DMLPK4710B1ZB
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <WorkspacePremiumIcon sx={{ fontSize: 20, color: '#8C7366', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2B2523' }}>
                  NIPHM Certificate No: 0786 - PBD (UIPM-4)/26-27 (Tejasvi Sunil Kumbhar)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <LocationOnIcon sx={{ fontSize: 20, color: '#8C7366', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 650, color: '#2B2523' }}>
                  Shree Jyotirling Apartment, D-101, Derawali, Panvel, Raigad, Maharashtra - 410221
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <PhoneInTalkIcon sx={{ fontSize: 20, color: '#8C7366', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2B2523' }}>
                  +91 95875 33344 / +91 79411 88860
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Certificate Image Box */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#FAF8F5',
                borderRadius: 4,
                border: '1px solid rgba(176, 148, 133, 0.3)',
                boxShadow: '0 12px 30px rgba(140, 115, 102, 0.15)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#8C7366', display: 'block', mb: 1, letterSpacing: '0.04em' }}>
                GOVERNMENT OF INDIA CERTIFICATE
              </Typography>
              <Box
                component="img"
                src="/images/certificate.jpg"
                alt="Government of India NIPHM Certificate"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  border: '1px solid rgba(176, 148, 133, 0.25)',
                }}
              />
              <Typography variant="caption" sx={{ color: '#72655F', display: 'block', mt: 1, fontWeight: 600 }}>
                Cert No: 0786 - PBD (UIPM-4)/26-27
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Core Principles */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em' }}>
            Our Service Standards
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              icon: <SecurityIcon sx={{ fontSize: 36, color: '#8C7366' }} />,
              title: 'Safety First',
              desc: 'Odorless, certified formulations safe for infants, seniors, and family pets.',
            },
            {
              icon: <SpaIcon sx={{ fontSize: 36, color: '#656E8A' }} />,
              title: 'Scientific UIPM Approach',
              desc: 'Targeted application techniques based on Govt. of India plant health & urban guidelines.',
            },
            {
              icon: <GroupsIcon sx={{ fontSize: 36, color: '#8C7366' }} />,
              title: 'Trained Personnel',
              desc: 'Experienced operators equipped with specialized drilling and precision misting equipment.',
            },
            {
              icon: <EmojiEventsIcon sx={{ fontSize: 36, color: '#DDB872' }} />,
              title: 'Guaranteed Warranty',
              desc: 'Zero-cost follow-up treatment if target pests resurface during your warranty window.',
            },
          ].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  textAlign: 'center',
                  height: '100%',
                  border: '1px solid rgba(176, 148, 133, 0.22)',
                  borderRadius: 4,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(43, 37, 35, 0.03)',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-3px)' },
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 3,
                    backgroundColor: '#F4EFEA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: '#2B2523' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#72655F', lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          py: 5,
          px: 3,
          background: 'linear-gradient(135deg, #B09485 0%, #8C7366 100%)',
          borderRadius: 5,
          color: '#F4EFEA',
          boxShadow: '0 16px 40px rgba(140, 115, 102, 0.22)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#F4EFEA', mb: 1.5, letterSpacing: '-0.02em' }}>
          Ready for a safe, pest-free home or workplace?
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(244, 239, 234, 0.9)', mb: 3.5, maxWidth: 540, mx: 'auto' }}>
          Schedule an inspection with our certified technicians today. We arrive promptly across Panvel and Navi Mumbai with guaranteed warranty.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/book')}
          sx={{
            backgroundColor: '#2B2523',
            color: '#F4EFEA',
            fontWeight: 750,
            px: 4.5,
            py: 1.4,
            borderRadius: 9999,
            boxShadow: '0 4px 16px rgba(43, 37, 35, 0.3)',
            '&:hover': { backgroundColor: '#1d1917', transform: 'translateY(-2px)' },
          }}
        >
          Book An Appointment
        </Button>
      </Box>
    </Container>
  );
};

export default AboutPage;
