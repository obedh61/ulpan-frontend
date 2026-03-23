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
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { School, CalendarMonth } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getMisCursosMaestro } from '../services/api';
import resolveField from '../utils/resolveField';
import { formatDate } from '../utils/dateLocale';

const MaestroDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await getMisCursosMaestro();
        setCursos(res.data);
      } catch (err) {
        setError(t('maestro.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {t('maestro.welcome', { name: user?.nombre })}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('maestro.panel')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {cursos.length === 0 ? (
        <Alert severity="info">
          {t('maestro.noCourses')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {cursos.map((curso) => (
            <Grid item xs={12} sm={6} md={4} key={curso._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {resolveField(curso.titulo, language)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {resolveField(curso.descripcion, language)}
                  </Typography>
                  <Chip
                    label={curso.activo ? t('common.active') : t('common.inactive')}
                    color={curso.activo ? 'success' : 'default'}
                    size="small"
                  />
                  {(curso.fechaInicio || curso.fechaFin) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {curso.fechaInicio
                          ? formatDate(curso.fechaInicio, language, { day: 'numeric', month: 'short' })
                          : '\u2014'}
                        {' \u2014 '}
                        {curso.fechaFin
                          ? formatDate(curso.fechaFin, language, { day: 'numeric', month: 'short', year: 'numeric' })
                          : '\u2014'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<School />}
                    onClick={() => navigate(`/maestro/cursos/${curso._id}`)}
                    fullWidth
                  >
                    {t('maestro.viewDetails')}
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

export default MaestroDashboard;
