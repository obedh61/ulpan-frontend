import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Alert,
  Skeleton,
  Divider,
  Stack,
} from '@mui/material';
import { Person, MenuBook, ArrowBack, Schedule, CalendarMonth, Event } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { formatDate } from '../utils/dateLocale';
import { getCourse, enrollInCourse, getMyEnrollments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExpandableText from '../components/ExpandableText';

const DetailSkeleton = () => (
  <Container sx={{ py: 4 }}>
    <Skeleton variant="text" width={100} height={40} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 3 }} />
  </Container>
);

const CourseDetail = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await getCourse(id);
        setCourse(courseRes.data);

        if (user?.rol === 'alumno') {
          const enrollRes = await getMyEnrollments();
          const isEnrolled = enrollRes.data.some((e) => e.cursoId._id === id);
          setEnrolled(isEnrolled);
        }
      } catch (error) {
        setMessage({ text: t('courses.loadError'), type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, t]);

  const requiresPayment = course && !course.esGratuito && course.precio > 0;

  const handleEnroll = async () => {
    try {
      await enrollInCourse(id);
      setEnrolled(true);
      setMessage({ text: t('courses.enrollSuccess'), type: 'success' });
    } catch (error) {
      if (error.response?.data?.requiresPayment) {
        navigate(`/alumno/curso/${id}/pagar`);
        return;
      }
      setMessage({
        text: error.response?.data?.message || t('courses.enrollError'),
        type: 'error',
      });
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!course) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('courses.courseNotFound')}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/cursos')} sx={{ mt: 2 }}>
            {t('home.viewCourses')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/cursos')}
        sx={{ mb: 3 }}
      >
        {t('courses.backToCourses')}
      </Button>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" gap={2}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h4" gutterBottom>
              {resolveField(course.titulo, language)}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={course.activo ? t('common.active') : t('common.inactive')}
                color={course.activo ? 'success' : 'default'}
                size="small"
              />
              {course.maxAlumnos && (
                <Chip
                  label={t('courses.maxStudents', { count: course.maxAlumnos })}
                  variant="outlined"
                  size="small"
                />
              )}
              {course.esGratuito || !course.precio || course.precio <= 0 ? (
                <Chip label={t('common.free')} color="success" size="small" />
              ) : (
                <Chip
                  label={`${{ ILS: '\u20AA', USD: '$', EUR: '\u20AC' }[course.moneda] || course.moneda}${course.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  color="primary"
                  size="small"
                />
              )}
            </Stack>
          </Box>

          {user?.rol === 'alumno' && (
            <Box>
              {enrolled ? (
                <Chip label={t('courses.alreadyEnrolled')} color="primary" />
              ) : requiresPayment ? (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/alumno/curso/${id}/pagar`)}
                  sx={{
                    background: 'linear-gradient(135deg, #FF8F00 0%, #E65100 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #FFA000 0%, #EF6C00 100%)' },
                  }}
                >
                  {t('courses.payAndEnroll')}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleEnroll}>
                  {t('courses.enroll')}
                </Button>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <ExpandableText
            text={resolveField(course.descripcion, language)}
            maxLines={4}
            sx={{ color: 'text.secondary' }}
          />
        </Box>

        {resolveField(course.horario, language) && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'rgba(255, 112, 67, 0.06)',
              borderColor: 'rgba(255, 112, 67, 0.3)',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 112, 67, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Schedule sx={{ color: '#FF7043' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {t('courses.schedule')}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {resolveField(course.horario, language)}
              </Typography>
            </Box>
          </Paper>
        )}

        {(course.fechaInicio || course.fechaFin) && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'rgba(21, 101, 192, 0.06)',
              borderColor: 'rgba(21, 101, 192, 0.3)',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'rgba(21, 101, 192, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CalendarMonth sx={{ color: '#1565C0' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {course.fechaInicio && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {t('admin.start')}
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="primary.main">
                    {formatDate(course.fechaInicio, language, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              )}
              {course.fechaInicio && course.fechaFin && (
                <Divider orientation="vertical" flexItem />
              )}
              {course.fechaFin && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {t('admin.end')}
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="primary.main">
                    {formatDate(course.fechaFin, language, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {course.maestroId && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'rgba(92, 107, 192, 0.04)',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'rgba(92, 107, 192, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Person sx={{ color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('courses.teacher')}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {course.maestroId.nombre}
              </Typography>
            </Box>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default CourseDetail;
