import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home, SentimentDissatisfied } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <SentimentDissatisfied
          sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }}
        />
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '6rem', sm: '8rem' },
            background: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          {t('notFound.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('notFound.description')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          component={RouterLink}
          to="/"
          sx={{ py: 1.5, px: 4 }}
        >
          {t('notFound.backHome')}
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
