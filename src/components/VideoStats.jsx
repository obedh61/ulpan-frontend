import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Visibility, Timer, CheckCircle, PlayCircle } from '@mui/icons-material';
import { getVideoStatsCurso, getVideoStatsAlumnos } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';

const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const StatCard = ({ icon, value, label, color = 'primary.main' }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      flex: 1,
      minWidth: { xs: 'calc(50% - 8px)', sm: 140 },
    }}
  >
    <Box sx={{ color, display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="h6" fontWeight={700}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  </Paper>
);

const VideoStats = ({ cursoId }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [alumnoStats, setAlumnoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getVideoStatsCurso(cursoId);
        setStats(res.data);
      } catch {
        setError(t('videoStats.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [cursoId]);

  const handleTabChange = async (_, newValue) => {
    setTab(newValue);
    if (newValue === 1 && !alumnoStats) {
      setLoadingAlumnos(true);
      try {
        const res = await getVideoStatsAlumnos(cursoId);
        setAlumnoStats(res.data);
      } catch {
        setError(t('videoStats.loadError'));
      } finally {
        setLoadingAlumnos(false);
      }
    }
  };

  if (loading) {
    return <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats || stats.resumen.totalVideos === 0) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        {t('videoStats.noData')}
      </Alert>
    );
  }

  const { resumen, videos } = stats;

  return (
    <Box>
      {/* Summary cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <StatCard
          icon={<PlayCircle />}
          value={resumen.totalVideos}
          label={t('videoStats.totalVideos')}
        />
        <StatCard
          icon={<Visibility />}
          value={resumen.totalVistas}
          label={t('videoStats.totalViews')}
          color="info.main"
        />
        <StatCard
          icon={<CheckCircle />}
          value={`${resumen.promedioCompletitud}%`}
          label={t('videoStats.avgCompletion')}
          color="success.main"
        />
        <StatCard
          icon={<Timer />}
          value={formatDuration(resumen.tiempoTotalVisto)}
          label={t('videoStats.totalWatchTime')}
          color="warning.main"
        />
      </Box>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={t('videoStats.byVideo')} />
        <Tab label={t('videoStats.byStudent')} />
      </Tabs>

      {/* Videos tab */}
      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('videoStats.videoTitle')}</TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('videoStats.views')}</TableCell>
                <TableCell align="center">{t('videoStats.avgCompletion')}</TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('videoStats.completed')}</TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('videoStats.watchTime')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video._id} hover>
                  <TableCell>
                    <Chip label={video.claseNumero} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {resolveField(video.claseTitulo, language) || video.titulo}
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{video.vistas}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={video.promedioCompletitud}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                        color={video.promedioCompletitud >= 70 ? 'success' : video.promedioCompletitud >= 40 ? 'warning' : 'error'}
                      />
                      <Typography variant="caption">{video.promedioCompletitud}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip
                      label={`${video.completados}/${video.completados + video.noCompletados}`}
                      size="small"
                      color={video.completados > 0 ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{formatDuration(video.tiempoTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Students tab */}
      {tab === 1 && (
        loadingAlumnos ? (
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        ) : alumnoStats && alumnoStats.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('admin.name')}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('auth.email')}</TableCell>
                  <TableCell align="center">{t('videoStats.videosWatched')}</TableCell>
                  <TableCell align="center">{t('videoStats.completed')}</TableCell>
                  <TableCell align="center">{t('videoStats.avgCompletion')}</TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('videoStats.watchTime')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnoStats.map((item) => (
                  <TableRow key={item.alumno._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{item.alumno.nombre}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{item.alumno.email}</TableCell>
                    <TableCell align="center">{item.videosVistos}/{item.totalVideos}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${item.videosCompletados}/${item.totalVideos}`}
                        size="small"
                        color={item.videosCompletados === item.totalVideos ? 'success' : item.videosCompletados > 0 ? 'warning' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.promedioCompletitud}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                          color={item.promedioCompletitud >= 70 ? 'success' : item.promedioCompletitud >= 40 ? 'warning' : 'error'}
                        />
                        <Typography variant="caption">{item.promedioCompletitud}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{formatDuration(item.tiempoTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">{t('videoStats.noStudentData')}</Alert>
        )
      )}
    </Box>
  );
};

export default VideoStats;
