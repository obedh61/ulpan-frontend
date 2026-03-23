import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Fade,
} from '@mui/material';
import { CheckCircle, Error, HourglassTop } from '@mui/icons-material';
import { verifyPayment } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import confetti from 'canvas-confetti';

const PaymentResult = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get('paymentId');

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState('pendiente');
  const intervalRef = useRef(null);
  const confettiFired = useRef(false);

  const fireConfetti = () => {
    if (confettiFired.current) return;
    confettiFired.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1565C0', '#FF8F00', '#4CAF50'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#1565C0', '#FF8F00', '#4CAF50'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      setEstado('fallido');
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await verifyPayment(paymentId);
        setPayment(res.data);
        setEstado(res.data.estado);

        if (res.data.estado === 'completado') {
          fireConfetti();
        }

        if (res.data.estado === 'completado' || res.data.estado === 'fallido' || res.data.estado === 'reembolsado') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch {
        setEstado('fallido');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } finally {
        setLoading(false);
      }
    };

    checkPayment();

    // Polling cada 3 segundos si esta pendiente
    intervalRef.current = setInterval(checkPayment, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paymentId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>{t('payment.verifying')}</Typography>
      </Container>
    );
  }

  const configs = {
    completado: {
      icon: <CheckCircle sx={{ fontSize: 80, color: '#4CAF50' }} />,
      title: t('payment.successTitle'),
      message: t('payment.successMessage'),
      color: '#4CAF50',
    },
    pendiente: {
      icon: <HourglassTop sx={{ fontSize: 80, color: '#FF8F00' }} />,
      title: t('payment.pendingTitle'),
      message: t('payment.pendingMessage'),
      color: '#FF8F00',
    },
    fallido: {
      icon: <Error sx={{ fontSize: 80, color: '#f44336' }} />,
      title: t('payment.failedTitle'),
      message: t('payment.failedMessage'),
      color: '#f44336',
    },
    reembolsado: {
      icon: <Error sx={{ fontSize: 80, color: '#FF8F00' }} />,
      title: t('payment.refundedTitle'),
      message: t('payment.refundedMessage'),
      color: '#FF8F00',
    },
  };

  const config = configs[estado] || configs.fallido;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Fade in timeout={600}>
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Fade in timeout={800}>
            <Box>{config.icon}</Box>
          </Fade>

          <Typography variant="h4" sx={{ mt: 2, mb: 1, color: config.color }}>
            {config.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {config.message}
          </Typography>

          {payment?.cursoId && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('payment.courseLabel')}: <strong>{resolveField(payment.cursoId.titulo, language)}</strong>
            </Typography>
          )}

          {estado === 'pendiente' && (
            <Box sx={{ mb: 3 }}>
              <CircularProgress size={32} sx={{ mb: 1 }} />
              <Typography variant="caption" display="block" color="text.secondary">
                {t('payment.verifyingEvery')}
              </Typography>
            </Box>
          )}

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            {estado === 'completado' && payment?.cursoId && (
              <Button
                variant="contained"
                onClick={() => navigate(`/alumno/cursos/${payment.cursoId._id}`)}
              >
                {t('payment.goToCourse')}
              </Button>
            )}
            {estado === 'fallido' && payment?.cursoId && (
              <Button
                variant="contained"
                onClick={() => navigate(`/alumno/curso/${payment.cursoId._id}/pagar`)}
              >
                {t('payment.tryAgain')}
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => navigate('/alumno/dashboard')}
            >
              {t('payment.goToPanel')}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default PaymentResult;
