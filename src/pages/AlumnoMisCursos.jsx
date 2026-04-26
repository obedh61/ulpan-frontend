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
import { ArrowForward, CalendarMonth } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';
import { getMisCursosAlumno } from '../services/api';
import resolveField from '../utils/resolveField';
import { formatDate } from '../utils/dateLocale';

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

const AlumnoMisCursos = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await getMisCursosAlumno();
        setCursos(res.data);
      } catch {
        setError(t('alumno.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
        {t('alumno.myCourses')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, md: 4 } }}>
        {t('alumno.myCoursesDesc')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <CourseCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : cursos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
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
        <Grid container spacing={{ xs: 2, md: 3 }}>
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
                        {curso.fechaInicio ? formatDate(curso.fechaInicio, language) : '\u2014'}
                        {' \u2014 '}
                        {curso.fechaFin ? formatDate(curso.fechaFin, language, { day: 'numeric', month: 'short', year: 'numeric' }) : '\u2014'}
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
    </Box>
  );
};

export default AlumnoMisCursos;
