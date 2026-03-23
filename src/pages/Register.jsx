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
} from '@mui/material';
import { School, Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth, getRedirectPath } from '../context/AuthContext';

const Register = () => {
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ nombre: false, email: false, password: false });
  const { register } = useAuth();
  const navigate = useNavigate();

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
      const userData = await register(nombre, email, password);
      navigate(getRedirectPath(userData.rol));
    } catch (err) {
      setError(err.response?.data?.message || t('auth.registerError'));
    } finally {
      setLoading(false);
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
              window.location.href = '/api/auth/google';
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
