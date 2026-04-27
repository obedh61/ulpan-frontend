import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { School, Visibility, VisibilityOff, Google as GoogleIcon, MarkEmailRead } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { resendVerification } from '../services/api';
import SEO from '../components/SEO';
import { trackCompleteRegistration } from '../utils/metaPixel';

const Register = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ nombre: false, email: false, password: false });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { register } = useAuth();

  const nombreError = touched.nombre && !nombre.trim() ? t('auth.nameRequired') : '';

  const emailError = touched.email && !email.trim()
    ? t('auth.emailRequired')
    : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? t('auth.emailInvalid')
      : '';

  const passwordError = touched.password && !password
    ? t('auth.passwordRequired')
    : touched.password && password.length < 6
      ? t('auth.minChars')
      : '';

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const isValid = () =>
    nombre.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ nombre: true, email: true, password: true });
    if (!isValid()) return;

    setError('');
    setLoading(true);
    try {
      await register(nombre, email, password, undefined, language);
      trackCompleteRegistration({ method: 'email' });
      setRegistrationSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.messageKey ? t(data.messageKey) : (data?.message || t('auth.registerError')));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const res = await resendVerification(email, language);
      setResendMessage(res.data.messageKey ? t(res.data.messageKey) : res.data.message);
    } catch {
      setResendMessage(t('auth.sendError'));
    } finally {
      setResendLoading(false);
    }
  };

  // Pantalla de éxito post-registro
  if (registrationSuccess) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
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
              <MarkEmailRead sx={{ fontSize: 36, color: 'success.main' }} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              {t('auth.verifyEmailTitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {t('auth.verifyEmailSent')}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 3 }}>
              {email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('auth.verifyEmailHint')}
            </Typography>

            {resendMessage && (
              <Alert severity="info" sx={{ mb: 2 }}>{resendMessage}</Alert>
            )}

            <Button
              variant="outlined"
              onClick={handleResend}
              disabled={resendLoading}
              sx={{ mb: 2 }}
            >
              {resendLoading ? <CircularProgress size={20} color="inherit" /> : t('auth.resendVerification')}
            </Button>

            <Typography variant="body2" color="text.secondary">
              {t('auth.hasAccount')}{' '}
              <Link component={RouterLink} to="/login" fontWeight={600}>
                {t('auth.signInLink')}
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <SEO title={t('seo.registerTitle')} description={t('seo.registerDesc')} path="/register" />
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, sm: 5 } }}>
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'rgba(92, 107, 192, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <School sx={{ fontSize: 28, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4">{t('auth.createAccount')}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('auth.startLearning')}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label={t('auth.fullName')}
              fullWidth
              margin="normal"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={handleBlur('nombre')}
              error={!!nombreError}
              helperText={nombreError}
            />
            <TextField
              label={t('auth.email')}
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur('email')}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handleBlur('password')}
              error={!!passwordError}
              helperText={passwordError || t('auth.minChars')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.signUp')}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>{t('common.or')}</Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            sx={{ py: 1.5 }}
            onClick={() => {
              const apiBase = import.meta.env.VITE_API_URL || '/api';
              window.location.href = `${apiBase}/auth/google`;
            }}
          >
            {t('auth.continueGoogle')}
          </Button>

          <Typography textAlign="center" mt={3} variant="body2" color="text.secondary">
            {t('auth.hasAccount')}{' '}
            <Link component={RouterLink} to="/login" fontWeight={600}>
              {t('auth.signInLink')}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
