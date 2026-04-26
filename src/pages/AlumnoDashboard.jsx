import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  Skeleton,
  Chip,
  Paper,
} from '@mui/material';
import { ArrowForward, Videocam, CalendarMonth, ShoppingCart, Lock, School } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMisCursosAlumno, getCursosDisponibles } from '../services/api';
import resolveField from '../utils/resolveField';
import { formatDate } from '../utils/dateLocale';

const MONEDA_SYMBOLS = { ILS: '\u20AA', USD: '$', EUR: '\u20AC' };

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 112, 67, 0.6); }
  70% { box-shadow: 0 0 0 12px rgba(255, 112, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 112, 67, 0); }
`;

const CourseCardSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
    <CardActions>
      <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
    </CardActions>
  </Card>
);

const AlumnoDashboard = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosRes, disponiblesRes] = await Promise.all([
          getMisCursosAlumno(),
          getCursosDisponibles(),
        ]);
        setCursos(cursosRes.data);
        setDisponibles(disponiblesRes.data);
      } catch (err) {
        setError(t('alumno.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
        {t('alumno.shalom', { name: user?.nombre })}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, md: 4 } }}>
        {t('alumno.welcomePanel')}
      </Typography>

      {/* Mobile CTA - cursos disponibles */}
      <Button
        variant="contained"
        startIcon={<School />}
        onClick={() => navigate('/cursos')}
        fullWidth
        sx={{
          display: { xs: 'flex', md: 'none' },
          mb: 2,
          py: 1.5,
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #FF8A65 0%, #F4511E 100%)' },
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        {t('alumno.exploreCourses')}
      </Button>

      {/* Banner card */}
      {cursos.length > 0 && (
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 2, md: 4 },
            background: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            borderRadius: 3,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {t('alumno.keepLearning')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t('alumno.activeCourses', { count: cursos.length })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Videocam />}
            onClick={() => navigate(`/alumno/cursos/${cursos[0]._id}`)}
            size={window.innerWidth < 600 ? 'small' : 'medium'}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              background: 'rgba(255,255,255,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            {t('alumno.goToCourse')}
          </Button>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>
        {t('alumno.myCourses')}
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <CourseCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : cursos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('alumno.notEnrolled')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('alumno.exploreMessage')}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/cursos')}>
            {t('alumno.exploreCourses')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {cursos.map((curso) => (
            <Grid item xs={12} sm={6} md={4} key={curso._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                {curso.imagenUrl ? (
                  <Box
                    component="img"
                    src={curso.imagenUrl}
                    alt={resolveField(curso.titulo, language)}
                    sx={{
                      width: '100%',
                      height: 160,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 160,
                      background: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)',
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.15rem' }, wordBreak: 'break-word' }}>
                    {resolveField(curso.titulo, language)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {resolveField(curso.descripcion, language)}
                  </Typography>
                  <Chip
                    label={curso.maestroId?.nombre || t('alumno.teacher')}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  {(curso.fechaInicio || curso.fechaFin) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                      <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {curso.fechaInicio
                          ? formatDate(curso.fechaInicio, language)
                          : '\u2014'}
                        {' \u2014 '}
                        {curso.fechaFin
                          ? formatDate(curso.fechaFin, language, { day: 'numeric', month: 'short', year: 'numeric' })
                          : '\u2014'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ px: { xs: 2, sm: 2.5 }, pb: 2 }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(`/alumno/cursos/${curso._id}`)}
                    fullWidth
                  >
                    {t('courses.viewCourse')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cursos disponibles para comprar */}
      {!loading && disponibles.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {t('alumno.availableCourses')}
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {disponibles.map((curso) => {
              const symbol = MONEDA_SYMBOLS[curso.moneda] || curso.moneda;
              return (
                <Grid item xs={12} sm={6} md={4} key={curso._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '2px solid',
                      borderColor: 'warning.light',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: 6 },
                    }}
                  >
                    <Chip
                      icon={<Lock sx={{ fontSize: '14px !important' }} />}
                      label={t('alumno.notPaid')}
                      color="warning"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        zIndex: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                    {curso.imagenUrl ? (
                      <Box
                        component="img"
                        src={curso.imagenUrl}
                        alt={resolveField(curso.titulo, language)}
                        sx={{
                          width: '100%',
                          height: 160,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 160,
                          background: 'linear-gradient(135deg, #FF8F00 0%, #F57C00 100%)',
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.15rem' }, wordBreak: 'break-word' }}>
                        {resolveField(curso.titulo, language)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {resolveField(curso.descripcion, language)}
                      </Typography>
                      <Chip
                        label={curso.maestroId?.nombre || t('alumno.teacher')}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color="primary"
                        sx={{ mt: 1.5 }}
                      >
                        {symbol}{curso.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: { xs: 2, sm: 2.5 }, pb: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => navigate(`/alumno/curso/${curso._id}/pagar`)}
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #FF8F00 0%, #F57C00 100%)',
                          '&:hover': { background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)' },
                        }}
                      >
                        {t('courses.enroll')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AlumnoDashboard;
