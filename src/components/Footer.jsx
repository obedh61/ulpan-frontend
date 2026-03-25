import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { School, Email, Phone, LocationOn, WhatsApp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#F5F6FA',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <School sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>
                Ulpan Jerusalem
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t('footer.description')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {t('footer.contact')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Email fontSize="small" sx={{ color: 'text.secondary' }} />
              <Link
                href="mailto:ulpanjerusalem8@gmail.com"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                ulpanjerusalem8@gmail.com
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Phone fontSize="small" sx={{ color: 'text.secondary' }} />
              <Link
                href="tel:+9720527028337"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                +972 052-702-8337
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WhatsApp fontSize="small" sx={{ color: '#25D366' }} />
              <Link
                href={`https://wa.me/9720527028337?text=${encodeURIComponent(t('footer.whatsappMessage'))}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                WhatsApp
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {t('footer.location')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn fontSize="small" sx={{ color: 'text.secondary' }} />
              <Link
                href="https://www.google.com/maps/search/Bacher+Ze'ev+Street+8+Jerusalem"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                {t('footer.address')}
              </Link>
            </Box>

            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {t('footer.legal')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link
                component={RouterLink}
                to="/privacy"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                {t('footer.termsOfService')}
              </Link>
              <Link
                component={RouterLink}
                to="/accessibility"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                {t('footer.accessibilityStatement')}
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}
        >
          &copy; {new Date().getFullYear()} Ulpan Jerusalem. {t('footer.rights')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
