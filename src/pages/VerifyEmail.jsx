import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Link,
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline, MarkEmailRead } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { verifyEmail, resendVerification } from '../services/api';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        const data = err.response?.data;
        setError(data?.messageKey ? t(data.messageKey) : (data?.message || t('auth.verifyError')));
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token, t]);

  const handleResend = async () => {
    if (!resendEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resendEmail)) return;
    setResendLoading(true);
    setResendMessage('');
    try {
      const res = await resendVerification(resendEmail, language);
      setResendMessage(res.data.messageKey ? t(res.data.messageKey) : res.data.message);
    } catch {
      setResendMessage(t('auth.sendError'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
          {loading ? (
            <>
              <CircularProgress size={48} sx={{ mb: 3 }} />
              <Typography variant="h6">{t('auth.verifyingEmail')}</Typography>
            </>
          ) : success ? (
            <>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckCircleOutline sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                {t('auth.emailVerified')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('auth.emailVerifiedDesc')}
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                size="large"
                sx={{ py: 1.5, px: 4 }}
              >
                {t('auth.signIn')}
              </Button>
            </>
          ) : (
            <>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <ErrorOutline sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                {t('auth.verifyErrorTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {error}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('auth.resendVerificationHint')}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
                <TextField
                  size="small"
                  type="email"
                  placeholder={t('auth.email')}
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  sx={{ minWidth: 250 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleResend}
                  disabled={resendLoading}
                >
                  {resendLoading ? <CircularProgress size={20} color="inherit" /> : t('common.send')}
                </Button>
              </Box>

              {resendMessage && (
                <Alert severity="info" sx={{ mb: 2 }}>{resendMessage}</Alert>
              )}

              <Link component={RouterLink} to="/login" variant="body2">
                {t('auth.signInLink')}
              </Link>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyEmail;
