import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth, getRedirectPath } from '../context/AuthContext';
import { getProfile } from '../services/api';

const GoogleCallback = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError(t('auth.noTokenReceived'));
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Guardar token temporalmente para que el interceptor lo use
        localStorage.setItem('user', JSON.stringify({ token }));

        // Obtener perfil completo del usuario
        const res = await getProfile();
        const userData = { ...res.data, token };

        // Guardar datos completos y actualizar contexto
        loginWithToken(userData);

        navigate(getRedirectPath(userData.rol));
      } catch (err) {
        localStorage.removeItem('user');
        setError(t('auth.authError'));
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processToken();
  }, [searchParams, navigate, loginWithToken, t]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <CircularProgress size={48} />
          <Typography color="text.secondary">{t('auth.processingAuth')}</Typography>
        </>
      )}
    </Box>
  );
};

export default GoogleCallback;
