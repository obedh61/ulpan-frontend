import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Payment, Download } from '@mui/icons-material';
import { getMyPayments } from '../services/api';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { getDateLocale } from '../utils/dateLocale';

const MONEDA_SYMBOLS = { ILS: '\u20AA', USD: '$', EUR: '\u20AC' };

const estadoColors = {
  completado: 'success',
  pendiente: 'warning',
  fallido: 'error',
  reembolsado: 'info',
};

const MyPayments = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const estadoLabels = {
    completado: t('myPayments.completed'),
    pendiente: t('myPayments.pending'),
    fallido: t('myPayments.failed'),
    reembolsado: t('myPayments.refunded'),
  };

  const dateLocale = getDateLocale(language);

  const handleDownloadReceipt = async (pagoId) => {
    try {
      const res = await api.get(`/payments/${pagoId}/receipt`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch {
      setError(t('myPayments.downloadError'));
    }
  };

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await getMyPayments();
        setPagos(res.data);
      } catch {
        setError(t('myPayments.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchPagos();
  }, []);

  const tableHeaders = [
    t('myPayments.course'),
    t('myPayments.amount'),
    t('myPayments.status'),
    t('myPayments.coupon'),
    t('myPayments.date'),
    t('myPayments.receipt'),
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {t('myPayments.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('myPayments.history')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <TableCell key={j}><Skeleton variant="text" /></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : pagos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(92, 107, 192, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Payment sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('myPayments.noPayments')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('myPayments.noPaymentsDesc')}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('myPayments.course')}</TableCell>
                <TableCell>{t('myPayments.amount')}</TableCell>
                <TableCell>{t('myPayments.status')}</TableCell>
                <TableCell>{t('myPayments.coupon')}</TableCell>
                <TableCell>{t('myPayments.date')}</TableCell>
                <TableCell align="center">{t('myPayments.receipt')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagos.map((pago) => {
                const symbol = MONEDA_SYMBOLS[pago.moneda] || pago.moneda;
                return (
                  <TableRow key={pago._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {resolveField(pago.cursoId?.titulo, language) || t('myPayments.courseDeleted')}
                    </TableCell>
                    <TableCell>
                      {symbol}{pago.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {pago.descuento > 0 && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {t('myPayments.original')}: {symbol}{pago.montoOriginal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estadoLabels[pago.estado] || pago.estado}
                        color={estadoColors[pago.estado] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {pago.cuponCodigo ? (
                        <Chip label={pago.cuponCodigo} size="small" variant="outlined" />
                      ) : (
                        '\u2014'
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(pago.createdAt).toLocaleDateString(dateLocale, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="center">
                      {pago.estado === 'completado' && (
                        <Tooltip title={t('myPayments.downloadReceipt')}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownloadReceipt(pago._id)}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyPayments;
