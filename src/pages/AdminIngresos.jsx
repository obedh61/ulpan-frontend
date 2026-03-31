import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { getDateLocale } from '../utils/dateLocale';
import {
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import { TrendingUp, PictureAsPdf, TableChart } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { getIngresos, getAdminPayments } from '../services/api';
import api from '../services/api';

const MONEDA_SYMBOLS = { ILS: '\u20AA', USD: '$', EUR: '\u20AC' };

const estadoColors = {
  completado: 'success',
  pendiente: 'warning',
  fallido: 'error',
  reembolsado: 'info',
};

const AdminIngresos = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [ingresos, setIngresos] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const res = await api.get('/admin/ingresos/export', {
        params: { format },
        responseType: 'blob',
      });

      const mimeType = format === 'csv' ? 'text/csv' : 'application/pdf';
      const ext = format === 'csv' ? 'csv' : 'pdf';
      const blob = new Blob([res.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      if (format === 'pdf') {
        window.open(url, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-ingresos.${ext}`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch {
      setError(t('income.exportError', { format: format.toUpperCase() }));
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingresosRes, paymentsRes] = await Promise.all([
          getIngresos(),
          getAdminPayments(),
        ]);
        setIngresos(ingresosRes.data);
        setPayments(paymentsRes.data);
      } catch {
        setError(t('income.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = ingresos?.ingresosPorMes?.map((item) => ({
    name: new Date(item._id.year, item._id.month - 1).toLocaleDateString(getDateLocale(language), { month: 'short', year: 'numeric' }),
    ingresos: item.total,
    pagos: item.count,
  })) || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="h4">{t('income.title')}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={() => handleExport('pdf')}
            disabled={exporting || loading}
            size="small"
          >
            {t('income.exportPdf')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<TableChart />}
            onClick={() => handleExport('csv')}
            disabled={exporting || loading}
            size="small"
          >
            {t('income.exportCsv')}
          </Button>
        </Stack>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('income.dashboard')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Totales por moneda */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Grid>
          ))
        ) : ingresos?.totalPorMoneda?.length > 0 ? (
          ingresos.totalPorMoneda.map((item) => {
            const symbol = MONEDA_SYMBOLS[item._id] || item._id;
            return (
              <Grid item xs={12} sm={4} key={item._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 28, color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4">
                          {symbol}{item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('income.paymentCount', { count: item.count, currency: item._id })}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('income.noIncome')}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Grafico mensual */}
      {!loading && chartData.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('income.monthlyIncome')}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="ingresos" fill="#1565C0" name={t('income.incomeLabel')} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* Tabla mensual desglosada por moneda */}
      {!loading && ingresos?.ingresosPorMesMoneda?.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('income.monthlyBreakdown')}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('income.month')}</TableCell>
                  <TableCell>{t('income.currency')}</TableCell>
                  <TableCell align="right">{t('admin.payments')}</TableCell>
                  <TableCell align="right">{t('payment.total')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingresos.ingresosPorMesMoneda.map((item) => {
                  const symbol = MONEDA_SYMBOLS[item._id.moneda] || item._id.moneda;
                  const monthName = new Date(item._id.year, item._id.month - 1).toLocaleDateString(getDateLocale(language), { month: 'long', year: 'numeric' });
                  return (
                    <TableRow key={`${item._id.year}-${item._id.month}-${item._id.moneda}`} hover>
                      <TableCell sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{monthName}</TableCell>
                      <TableCell>
                        <Chip label={item._id.moneda} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {symbol}{item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Ingresos por curso */}
      {!loading && ingresos?.ingresosPorCurso?.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('income.incomeByCourse')}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('admin.course')}</TableCell>
                  <TableCell align="right">{t('admin.payments')}</TableCell>
                  <TableCell align="right">{t('payment.total')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingresos.ingresosPorCurso.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{resolveField(item.cursoTitulo, language)}</TableCell>
                    <TableCell align="right">{item.count}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Pagos recientes */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('income.recentPayments')}
      </Typography>

      {loading ? (
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.student')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.course')}</TableCell>
                <TableCell>{t('admin.amount')}</TableCell>
                <TableCell>{t('admin.status')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('myPayments.coupon')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.date')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('income.noPayments')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payments.slice(0, 20).map((pago) => {
                  const symbol = MONEDA_SYMBOLS[pago.moneda] || pago.moneda;
                  return (
                    <TableRow key={pago._id} hover>
                      <TableCell>{pago.alumnoId?.nombre || '\u2014'}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{resolveField(pago.cursoId?.titulo, language) || '\u2014'}</TableCell>
                      <TableCell>
                        {symbol}{pago.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {pago.descuento > 0 && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {t('income.disc')}: {symbol}{pago.descuento.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                          color={estadoColors[pago.estado] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        {pago.cuponCodigo ? (
                          <Chip label={pago.cuponCodigo} size="small" variant="outlined" />
                        ) : (
                          '\u2014'
                        )}
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        {new Date(pago.createdAt).toLocaleDateString(getDateLocale(language), {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminIngresos;
