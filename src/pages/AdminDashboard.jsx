import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { getDateLocale } from '../utils/dateLocale';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { People, MenuBook, School, Class, Payment, TrendingUp, ArrowForward, PlayCircle, Visibility, CheckCircle, Timer } from '@mui/icons-material';
import { getEstadisticas, getAdminVideoStats } from '../services/api';

const MONEDA_SYMBOLS = { ILS: '\u20AA', USD: '$', EUR: '\u20AC' };

const statCards = [
  { key: 'totalUsuarios', labelKey: 'admin.users', icon: People, gradient: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)' },
  { key: 'totalCursos', labelKey: 'admin.courses', icon: MenuBook, gradient: 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)' },
  { key: 'totalInscripciones', labelKey: 'admin.enrollments', icon: School, gradient: 'linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)' },
  { key: 'totalClases', labelKey: 'admin.classes', icon: Class, gradient: 'linear-gradient(135deg, #AB47BC 0%, #7B1FA2 100%)' },
  { key: 'totalPagos', labelKey: 'admin.payments', icon: Payment, gradient: 'linear-gradient(135deg, #42A5F5 0%, #1565C0 100%)' },
  { key: 'totalIngresos', labelKey: 'admin.income', icon: TrendingUp, gradient: 'linear-gradient(135deg, #26A69A 0%, #00897B 100%)', isCurrency: true },
];

const rolCards = [
  { key: 'admins', labelKey: 'admin.administrators', color: '#5C6BC0' },
  { key: 'maestros', labelKey: 'admin.teachers', color: '#FF7043' },
  { key: 'alumnos', labelKey: 'admin.students', color: '#66BB6A' },
];

const StatSkeleton = () => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2}>
        <Skeleton variant="circular" width={56} height={56} />
        <Box>
          <Skeleton variant="text" width={60} sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" width={80} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [videoStats, setVideoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, videoRes] = await Promise.all([
          getEstadisticas(),
          getAdminVideoStats().catch(() => ({ data: null })),
        ]);
        setStats(statsRes.data);
        setVideoStats(videoRes.data);
      } catch (err) {
        setError(t('admin.statsError'));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {t('admin.adminDashboard')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('admin.platformSummary')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading
          ? [1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <StatSkeleton />
              </Grid>
            ))
          : statCards.map(({ key, labelKey, icon: Icon, gradient, isCurrency }) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4">{isCurrency ? `$${stats[key]?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}` : stats[key]}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t(labelKey)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>
        {t('admin.usersByRole')}
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {rolCards.map(({ key, labelKey, color }) => (
            <Grid item xs={12} sm={4} key={key}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: `${color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="h5" sx={{ color, fontWeight: 700 }}>
                    {stats.usuariosPorRol[key]}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {t(labelKey)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Ventas recientes */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5">{t('admin.recentSales')}</Typography>
        <Button
          size="small"
          endIcon={<ArrowForward />}
          onClick={() => navigate('/admin/ingresos')}
        >
          {t('admin.viewAll')}
        </Button>
      </Box>

      {loading ? (
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      ) : !stats?.ventasRecientes || stats.ventasRecientes.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">{t('admin.noSales')}</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.student')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.course')}</TableCell>
                <TableCell align="right">{t('admin.amount')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.date')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.ventasRecientes.map((venta) => {
                const symbol = MONEDA_SYMBOLS[venta.moneda] || venta.moneda;
                return (
                  <TableRow key={venta._id} hover>
                    <TableCell>{venta.alumnoId?.nombre || '\u2014'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{resolveField(venta.cursoId?.titulo, language) || '\u2014'}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${symbol}${venta.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {new Date(venta.createdAt).toLocaleDateString(getDateLocale(language), {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Video stats */}
      {!loading && videoStats && videoStats.totalVideos > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            {t('videoStats.title')}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PlayCircle color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>{videoStats.totalVideos}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('videoStats.totalVideos')}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Visibility color="info" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>{videoStats.totalVistas}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('videoStats.totalViews')}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle color="success" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>{videoStats.promedioCompletitud}%</Typography>
                  <Typography variant="caption" color="text.secondary">{t('videoStats.avgCompletion')}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Timer color="warning" />
                <Box>
                  <Typography variant="h6" fontWeight={700}>{formatDuration(videoStats.tiempoTotalVisto)}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('videoStats.totalWatchTime')}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {videoStats.masVistos && videoStats.masVistos.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('videoStats.mostViewed')}
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('videoStats.videoTitle')}</TableCell>
                      <TableCell>{t('admin.course')}</TableCell>
                      <TableCell align="center">{t('videoStats.views')}</TableCell>
                      <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('videoStats.avgCompletion')}</TableCell>
                      <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('videoStats.watchTime')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {videoStats.masVistos.map((item) => (
                      <TableRow key={item._id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{item.videoTitulo}</TableCell>
                        <TableCell>{resolveField(item.cursoTitulo, language)}</TableCell>
                        <TableCell align="center">{item.totalVistas}</TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Chip
                            label={`${item.promedioCompletitud}%`}
                            size="small"
                            color={item.promedioCompletitud >= 70 ? 'success' : item.promedioCompletitud >= 40 ? 'warning' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{formatDuration(item.tiempoTotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
