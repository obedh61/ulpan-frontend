import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { School, Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth, getRedirectPath } from '../context/AuthContext';
import { forgotPassword } from '../services/api';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Forgot password dialog
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) return;

    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      navigate(getRedirectPath(userData.rol));
    } catch (err) {
      setError(err.response?.data?.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotOpen = () => {
    setForgotEmail(email);
    setForgotMessage('');
    setForgotError('');
    setForgotOpen(true);
  };

  const handleForgotClose = () => {
    setForgotOpen(false);
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError(t('auth.emailInvalid'));
      return;
    }

    setForgotError('');
    setForgotLoading(true);
    try {
      const res = await forgotPassword(forgotEmail);
      setForgotMessage(res.data.message);
    } catch (err) {
      setForgotError(err.response?.data?.message || t('auth.sendError'));
    } finally {
      setForgotLoading(false);
    }
  };

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
            <Typography variant="h4">{t('auth.welcomeBack')}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('auth.enterCredentials')}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              helperText={passwordError}
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

            <Box textAlign="right" mt={0.5}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotOpen}
                sx={{ cursor: 'pointer' }}
              >
                {t('auth.forgotPassword')}
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.signIn')}
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
            {t('auth.noAccount')}{' '}
            <Link component={RouterLink} to="/register" fontWeight={600}>
              {t('auth.register')}
            </Link>
          </Typography>
        </Paper>
      </Container>

      {/* Forgot password dialog */}
      <Dialog open={forgotOpen} onClose={handleForgotClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('auth.recoverPassword')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('auth.recoverDescription')}
          </Typography>

          {forgotMessage && <Alert severity="success" sx={{ mb: 2 }}>{forgotMessage}</Alert>}
          {forgotError && <Alert severity="error" sx={{ mb: 2 }}>{forgotError}</Alert>}

          {!forgotMessage && (
            <TextField
              label={t('auth.email')}
              type="email"
              fullWidth
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              autoFocus
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleForgotClose}>
            {forgotMessage ? t('common.close') : t('common.cancel')}
          </Button>
          {!forgotMessage && (
            <Button
              variant="contained"
              onClick={handleForgotSubmit}
              disabled={forgotLoading}
            >
              {forgotLoading ? <CircularProgress size={20} color="inherit" /> : t('common.send')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
