import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { Person, CalendarMonth, MenuBook, School, Translate, AutoStories, HistoryEdu, Language } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { formatDate } from '../utils/dateLocale';

const gradients = [
  'linear-gradient(135deg, #5C6BC0 0%, #3949AB 100%)',
  'linear-gradient(135deg, #26A69A 0%, #00897B 100%)',
  'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
  'linear-gradient(135deg, #42A5F5 0%, #1565C0 100%)',
  'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)',
  'linear-gradient(135deg, #EC407A 0%, #C2185B 100%)',
];

const icons = [MenuBook, School, Translate, AutoStories, HistoryEdu, Language];

const CARD_HEIGHT = 420;
const HEADER_HEIGHT = 180;

const CourseCard = ({ course, onEnroll, enrolled, index = 0 }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const gradient = gradients[index % gradients.length];
  const Icon = icons[index % icons.length];

  const fechaInicioStr = formatDate(course.fechaInicio, language);
  const fechaFinStr = formatDate(course.fechaFin, language);
  const hasDate = fechaInicioStr || fechaFinStr;

  const titulo = resolveField(course.titulo, language);
  const descripcion = resolveField(course.descripcion, language);

  return (
    <Card
      sx={{
        height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
        },
      }}
      onClick={() => navigate(`/cursos/${course._id}`)}
    >
      {/* Visual header */}
      <Box
        sx={{
          height: HEADER_HEIGHT,
          minHeight: HEADER_HEIGHT,
          background: course.imagenUrl ? 'none' : gradient,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '16px 16px 0 0',
          ...(course.imagenUrl && { p: 1.5 }),
        }}
      >
        {course.imagenUrl ? (
          <Box
            component="img"
            src={course.imagenUrl}
            alt={titulo}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        ) : (
          <>
            <Icon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.15)' }} />
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.08)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -15,
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.06)',
              }}
            />
          </>
        )}

        {/* Badge inscripciones */}
        {course.inscripcionesAbiertas !== false && (
          <Chip
            label={t('courses.enrollmentsOpen')}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: '#2E7D32',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 },
              },
            }}
          />
        )}
        {course.inscripcionesAbiertas === false && (
          <Chip
            label={t('courses.enrollmentsClosed')}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pb: 0, pt: 2, overflow: 'hidden' }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            mb: 0.5,
            lineHeight: 1.3,
            height: '2.6em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {titulo}
        </Typography>

        {course.maestroId && (
          <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
              {course.maestroId.nombre}
            </Typography>
          </Box>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.82rem',
            lineHeight: 1.5,
            height: '2.46em',
          }}
        >
          {descripcion}
        </Typography>

        {hasDate && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarMonth sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {fechaInicioStr || '—'} — {fechaFinStr || '—'}
            </Typography>
          </Box>
        )}

        {/* Precio */}
        <Box sx={{ mt: 0.5 }}>
          {course.esGratuito || !course.precio || course.precio <= 0 ? (
            <Chip label={t('common.free')} color="success" size="small" />
          ) : (
            <Typography variant="body2" fontWeight={700} color="primary">
              {{ ILS: '\u20AA', USD: '$', EUR: '\u20AC' }[course.moneda] || course.moneda}
              {course.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Action area */}
      <Box sx={{ px: 2, pb: 2, mt: 'auto' }}>
        {enrolled ? (
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
              color: '#fff',
              fontWeight: 600,
              pointerEvents: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
              },
            }}
          >
            {t('courses.alreadyEnrolled')}
          </Button>
        ) : !course.esGratuito && course.precio > 0 && onEnroll ? (
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/alumno/curso/${course._id}/pagar`);
            }}
            sx={{
              background: 'linear-gradient(135deg, #FF8F00 0%, #E65100 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #FFA000 0%, #EF6C00 100%)' },
            }}
          >
            {t('courses.payAndEnroll')}
          </Button>
        ) : onEnroll ? (
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onEnroll(course._id);
            }}
          >
            {t('courses.enroll')}
          </Button>
        ) : (
          <Button variant="outlined" fullWidth>
            {t('courses.viewDetails')}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default CourseCard;
