import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Alert,
  Skeleton,
  Divider,
  Chip,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  LocalOffer,
  Payment,
  CheckCircle,
  Cancel,
  Lock,
  CreditCard,
  ExpandMore,
  Security,
  HelpOutline,
  CalendarMonth,
} from '@mui/icons-material';
import { getCourse, createPayment, validateCoupon } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';

const MONEDA_SYMBOLS = { ILS: '\u20AA', USD: '$', EUR: '\u20AC' };

const PaymentPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [t('payment.reviewCourse'), t('payment.discountCoupon'), t('payment.confirmPayment')];

  const faqs = [
    { q: t('payment.faq1Q'), a: t('payment.faq1A') },
    { q: t('payment.faq2Q'), a: t('payment.faq2A') },
    { q: t('payment.faq3Q'), a: t('payment.faq3A') },
    { q: t('payment.faq4Q'), a: t('payment.faq4A') },
  ];

  // Coupon state
  const [cuponCodigo, setCuponCodigo] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [cuponError, setCuponError] = useState('');
  const [cuponSuccess, setCuponSuccess] = useState(false);
  const debounceRef = useRef(null);

  // Installments state
  const [tashlumim, setTashlumim] = useState(1);

  // Payment state
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourse(id);
        setCourse(res.data);
        setPrecioFinal(res.data.precio);
      } catch {
        setError(t('payment.courseLoadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Debounced coupon validation
  const debouncedValidate = useCallback(
    (codigo) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!codigo.trim() || codigo.trim().length < 3) {
        setCuponError('');
        setCuponSuccess(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setValidatingCoupon(true);
        setCuponError('');
        setCuponSuccess(false);
        try {
          const res = await validateCoupon({ codigo, cursoId: id });
          const cupon = res.data;
          setCuponAplicado(cupon);
          setCuponSuccess(true);

          let descuento = 0;
          if (cupon.tipo === 'porcentaje') {
            descuento = Math.round((course.precio * cupon.descuento) / 100 * 100) / 100;
          } else {
            descuento = cupon.descuento;
          }
          setPrecioFinal(Math.max(0, course.precio - descuento));
        } catch (err) {
          setCuponError(err.response?.data?.message || t('payment.couponInvalid'));
          setCuponAplicado(null);
          if (course) setPrecioFinal(course.precio);
        } finally {
          setValidatingCoupon(false);
        }
      }, 1000);
    },
    [id, course]
  );

  const handleCuponChange = (e) => {
    const val = e.target.value.toUpperCase();
    setCuponCodigo(val);
    setCuponSuccess(false);
    setCuponAplicado(null);
    if (course) setPrecioFinal(course.precio);
    debouncedValidate(val);
  };

  const handleRemoveCoupon = () => {
    setCuponAplicado(null);
    setCuponCodigo('');
    setCuponError('');
    setCuponSuccess(false);
    if (course) setPrecioFinal(course.precio);
  };

  const handlePay = async () => {
    setPaying(true);
    setError('');
    try {
      const res = await createPayment({
        cursoId: id,
        cuponCodigo: cuponAplicado ? cuponCodigo : undefined,
        tashlumim: tashlumim > 1 ? tashlumim : undefined,
      });

      if (res.data.free) {
        navigate(`/alumno/pago-resultado?paymentId=${res.data.paymentId}&status=success`);
      } else if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || t('payment.processError'));
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mt: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mt: 2 }} />
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{t('courses.courseNotFound')}</Alert>
      </Container>
    );
  }

  const symbol = MONEDA_SYMBOLS[course.moneda] || course.moneda;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t('common.back')}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Course Review */}
      <Collapse in={activeStep === 0}>
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            {t('payment.courseSummary')}
          </Typography>

          <Box sx={{ bgcolor: 'rgba(21, 101, 192, 0.04)', p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {resolveField(course.titulo, language)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {resolveField(course.descripcion, language)}
            </Typography>
            {course.maestroId?.nombre && (
              <Chip label={`${t('courses.teacher')}: ${course.maestroId.nombre}`} size="small" variant="outlined" />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight={500}>{t('payment.coursePrice')}</Typography>
            <Typography variant="h5" fontWeight={700} color="primary">
              {symbol}{course.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.06)', borderRadius: 2 }}>
            <Lock sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography variant="body2" color="success.dark">
              {t('payment.classesIncluded')}
            </Typography>
          </Box>

          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => setActiveStep(1)}
            fullWidth
            size="large"
            sx={{ mt: 1 }}
          >
            {t('common.next')}
          </Button>
        </Paper>
      </Collapse>

      {/* Step 2: Coupon */}
      <Collapse in={activeStep === 1}>
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            {t('payment.couponTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('payment.couponDescription')}
          </Typography>

          {!cuponAplicado ? (
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder={t('payment.enterCode')}
                value={cuponCodigo}
                onChange={handleCuponChange}
                error={!!cuponError}
                InputProps={{
                  startAdornment: <LocalOffer sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />,
                  endAdornment: validatingCoupon ? (
                    <CircularProgress size={20} />
                  ) : cuponSuccess ? (
                    <Fade in>
                      <CheckCircle sx={{ color: 'success.main', fontSize: 24 }} />
                    </Fade>
                  ) : cuponError ? (
                    <Fade in>
                      <Cancel sx={{ color: 'error.main', fontSize: 24 }} />
                    </Fade>
                  ) : null,
                }}
              />
              {cuponError && (
                <Fade in>
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {cuponError}
                  </Typography>
                </Fade>
              )}
              {cuponSuccess && cuponAplicado && (
                <Fade in>
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {t('payment.couponApplied')}: {cuponAplicado.tipo === 'porcentaje' ? `${cuponAplicado.descuento}% ${t('payment.discountOf')}` : `${symbol}${cuponAplicado.descuento.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('payment.discountOf')}`}
                  </Alert>
                </Fade>
              )}
            </Box>
          ) : (
            <Fade in>
              <Box sx={{ mb: 3 }}>
                <Alert
                  severity="success"
                  action={
                    <Button color="inherit" size="small" onClick={handleRemoveCoupon}>
                      {t('payment.remove')}
                    </Button>
                  }
                >
                  {t('payment.couponApplied')} <strong>{cuponAplicado.codigo}</strong>
                  {' \u2014 '}
                  {cuponAplicado.tipo === 'porcentaje'
                    ? `${cuponAplicado.descuento}% ${t('payment.discountOf')}`
                    : `${symbol}${cuponAplicado.descuento.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('payment.discountOf')}`}
                </Alert>
              </Box>
            </Fade>
          )}

          {/* Price summary */}
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2">{t('payment.originalPrice')}</Typography>
              <Typography variant="body2">{symbol}{course.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            {cuponAplicado && (
              <Box display="flex" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="success.main">{t('payment.discountLabel')}</Typography>
                <Typography variant="body2" color="success.main">
                  -{symbol}{(course.precio - precioFinal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight={700}>{t('payment.total')}</Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {symbol}{precioFinal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={() => setActiveStep(0)} sx={{ flex: 1 }}>
              {t('common.previous')}
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => setActiveStep(2)}
              sx={{ flex: 2 }}
            >
              {t('payment.continueToPayment')}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* Step 3: Payment */}
      <Collapse in={activeStep === 2}>
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            {t('payment.confirmTitle')}
          </Typography>

          {/* Order summary */}
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">{t('payment.courseLabel')}</Typography>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>{resolveField(course.titulo, language)}</Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight={700}>{t('payment.totalToPay')}</Typography>
              <Typography variant="h5" fontWeight={700} color="primary">
                {symbol}{precioFinal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>

          {/* Installments selector */}
          {precioFinal > 0 && course.moneda === 'ILS' && (
            <Box sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                <CalendarMonth sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="body1" fontWeight={600}>
                  {t('payment.installments')}
                </Typography>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap">
                {[1, 2, 3, 4, 6, 8, 10, 12].map((n) => (
                  <Button
                    key={n}
                    variant={tashlumim === n ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setTashlumim(n)}
                    sx={{ minWidth: 56 }}
                  >
                    {n === 1 ? t('payment.singlePayment') : `${n} ${t('payment.payments')}`}
                  </Button>
                ))}
              </Box>
              {tashlumim > 1 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {tashlumim} {t('payment.paymentsOf')} {symbol}
                  {(precioFinal / tashlumim).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              )}
            </Box>
          )}

          {/* Security badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              mb: 3,
              bgcolor: 'rgba(76, 175, 80, 0.06)',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'success.light',
            }}
          >
            <Security sx={{ fontSize: 32, color: 'success.main' }} />
            <Box>
              <Typography variant="body2" fontWeight={600} color="success.dark">
                {t('payment.securePayment')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('payment.encryptedConnection')}
              </Typography>
            </Box>
          </Box>

          {/* Payment method icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
            <CreditCard sx={{ fontSize: 28, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {t('payment.paymentMethods')}
            </Typography>
          </Box>

          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={() => setActiveStep(1)} sx={{ flex: 1 }}>
              {t('common.previous')}
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={paying ? null : <Payment />}
              onClick={handlePay}
              disabled={paying}
              sx={{
                flex: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #0D47A1 0%, #0A3D8F 100%)' },
              }}
            >
              {paying ? (
                <CircularProgress size={24} color="inherit" />
              ) : precioFinal === 0 ? (
                t('payment.enrollFree')
              ) : (
                `${t('payment.pay')} ${symbol}${precioFinal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* FAQ Section */}
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <HelpOutline color="primary" />
          <Typography variant="h6">{t('payment.faq')}</Typography>
        </Box>
        {faqs.map((faq, idx) => (
          <Accordion key={idx} disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2" fontWeight={500}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
};

export default PaymentPage;
