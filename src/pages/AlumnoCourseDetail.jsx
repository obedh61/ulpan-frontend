import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Divider,
  Alert,
  Skeleton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Videocam, Download, PlayCircle, WhatsApp, ExpandMore, PictureAsPdf, CalendarMonth, Schedule } from '@mui/icons-material';
import { getCursoDetalleAlumno } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { getDateLocale } from '../utils/dateLocale';
import BunnyPlayer from '../components/BunnyPlayer';
import ExpandableText from '../components/ExpandableText';

const DetailSkeleton = () => (
  <Box>
    <Skeleton variant="text" sx={{ fontSize: '2.5rem', mb: 1 }} width="60%" />
    <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} width="30%" />
    <Divider sx={{ my: 3 }} />
    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 3 }} />
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} width="40%" />
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: 1, mb: 1 }} />
    ))}
  </Box>
);

const getVimeoEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  if (url.includes('player.vimeo.com')) return url;
  return url;
};

const AlumnoCourseDetail = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsPayment, setNeedsPayment] = useState(false);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await getCursoDetalleAlumno(id);
        setCurso(res.data.curso);
        setClases(res.data.clases);
      } catch (err) {
        const msg = err.response?.data?.message || '';
        if (err.response?.status === 404 && msg.includes('no est')) {
          setNeedsPayment(true);
          setError(t('alumno.needsPayment'));
        } else {
          setError(msg || t('alumno.loadError'));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  const clasesConContenido = clases.filter((c) => c.fecha || c.zoomLink || c.videoUrl || c.pdfUrl || c.videoId);
  const dateLocale = getDateLocale(language);

  return (
    <Box>
      {error && (
        <Alert severity={needsPayment ? 'warning' : 'error'} sx={{ mb: 3 }}>
          {error}
          {needsPayment && (
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/alumno/curso/${id}/pagar`)}
              sx={{ ml: 2 }}
            >
              {t('alumno.goToPay')}
            </Button>
          )}
        </Alert>
      )}

      {loading ? (
        <DetailSkeleton />
      ) : curso && (
        <>
          {/* Course Header */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {resolveField(curso.titulo, language)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('courses.teacher')}: {curso.maestroId?.nombre || t('alumno.noAssigned')}
            </Typography>
            <ExpandableText
              text={resolveField(curso.descripcion, language)}
              maxLines={3}
              sx={{ color: 'text.secondary', mt: 1 }}
            />
            {resolveField(curso.horario, language) && (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  mt: 2,
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
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 112, 67, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Schedule sx={{ color: '#FF7043', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {t('courses.schedule')}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {resolveField(curso.horario, language)}
                  </Typography>
                </Box>
              </Paper>
            )}
            {curso.whatsappLink && (
              <Button
                variant="contained"
                startIcon={<WhatsApp />}
                href={curso.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mt: 2,
                  bgcolor: '#25D366',
                  color: 'white',
                  '&:hover': { bgcolor: '#1DA851' },
                }}
              >
                {t('alumno.joinWhatsapp')}
              </Button>
            )}
          </Paper>

          {/* Clases */}
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayCircle color="primary" />
            {t('courses.classes')}
          </Typography>

          {clasesConContenido.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('alumno.noContent')}
            </Alert>
          ) : (
            <Stack spacing={1} sx={{ mt: 1 }}>
              {clasesConContenido.map((clase) => (
                <Accordion key={clase._id} disableGutters>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pr: 1 }}>
                      <Chip label={clase.numeroClase} size="small" variant="outlined" sx={{ fontWeight: 600, minWidth: 32 }} />
                      <Typography variant="body1" fontWeight={500} sx={{ flexGrow: 1 }}>
                        {resolveField(clase.titulo, language)}
                      </Typography>
                      {clase.fecha && (
                        <Chip
                          icon={<CalendarMonth sx={{ fontSize: 14 }} />}
                          label={new Date(clase.fecha).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })}
                          size="small"
                          variant="outlined"
                          sx={{ display: { xs: 'none', sm: 'flex' } }}
                        />
                      )}
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {clase.zoomLink && <Videocam sx={{ fontSize: 18, color: '#4CAF50' }} />}
                        {(clase.videoId || clase.videoUrl) && <PlayCircle sx={{ fontSize: 18, color: '#2196F3' }} />}
                        {clase.pdfUrl && <PictureAsPdf sx={{ fontSize: 18, color: '#FF7043' }} />}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {!clase.zoomLink && !clase.videoUrl && !clase.videoId && !clase.pdfUrl ? (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {t('alumno.noContentYet')}
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        {/* Zoom link */}
                        {clase.zoomLink && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Videocam />}
                              href={clase.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('alumno.joinLive')}
                            </Button>
                          </Box>
                        )}

                        {/* Video embed — Bunny player or Vimeo fallback */}
                        {clase.videoId && clase.videoId.estado === 'listo' ? (
                          <BunnyPlayer
                            embedUrl={clase.videoId.embedUrl}
                            title={resolveField(clase.titulo, language)}
                            videoId={clase.videoId._id}
                          />
                        ) : clase.videoUrl && (
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              paddingTop: '56.25%',
                              bgcolor: 'black',
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              component="iframe"
                              src={getVimeoEmbedUrl(clase.videoUrl)}
                              title={resolveField(clase.titulo, language)}
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 0,
                              }}
                            />
                          </Box>
                        )}

                        {/* PDF download */}
                        {clase.pdfUrl && (
                          <Box>
                            <Button
                              variant="outlined"
                              startIcon={<Download />}
                              href={clase.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('alumno.downloadPdf')}
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default AlumnoCourseDetail;
