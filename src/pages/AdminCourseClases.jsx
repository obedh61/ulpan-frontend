import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Skeleton,
  Chip,
  Tooltip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Edit,
  ArrowBack,
  CalendarMonth,
  Videocam,
  PlayCircle,
  PictureAsPdf,
  Visibility,
  CheckCircle,
  HourglassTop,
  ErrorOutline,
  Download,
  Close,
  People,
  ExpandMore,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getClasesCursoAdmin, actualizarClaseAdmin, getCourse, getAlumnosCursoAdmin } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { formatDate } from '../utils/dateLocale';
import TranslatableTextField from '../components/TranslatableTextField';
import BunnyPlayer from '../components/BunnyPlayer';

const getVimeoEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  if (url.includes('player.vimeo.com')) return url;
  return url;
};

const AdminCourseClases = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [clases, setClases] = useState([]);
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editClase, setEditClase] = useState(null);
  const [form, setForm] = useState({ titulo: { es: '', en: '', he: '' }, fecha: '' });
  const [message, setMessage] = useState({ text: '', type: 'success' });

  // Students
  const [alumnos, setAlumnos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [alumnosLoaded, setAlumnosLoaded] = useState(false);

  // Content preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewClase, setPreviewClase] = useState(null);

  const fetchData = async () => {
    try {
      const [clasesRes, cursoRes] = await Promise.all([
        getClasesCursoAdmin(id),
        getCourse(id),
      ]);
      setClases(clasesRes.data);
      setCurso(cursoRes.data);
    } catch (err) {
      setMessage({ text: t('admin.loadError'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenEdit = (clase) => {
    setEditClase(clase);
    setForm({
      titulo: typeof clase.titulo === 'string' ? { es: clase.titulo, en: '', he: '' } : (clase.titulo || { es: '', en: '', he: '' }),
      fecha: clase.fecha ? clase.fecha.substring(0, 10) : '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await actualizarClaseAdmin(editClase._id, {
        titulo: form.titulo,
        fecha: form.fecha || null,
      });
      setMessage({ text: t('admin.classUpdated'), type: 'success' });
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || t('admin.saveError'),
        type: 'error',
      });
    }
  };

  const handleLoadAlumnos = async () => {
    if (alumnosLoaded) return;
    setLoadingAlumnos(true);
    try {
      const res = await getAlumnosCursoAdmin(id);
      setAlumnos(res.data);
      setAlumnosLoaded(true);
    } catch (err) {
      setMessage({ text: t('admin.loadError'), type: 'error' });
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleOpenPreview = (clase) => {
    setPreviewClase(clase);
    setPreviewOpen(true);
  };

  const hasContent = (clase) => clase.zoomLink || clase.videoUrl || clase.videoId || clase.pdfUrl || clase.pdfUrl2;

  const getVideoIndicator = (clase) => {
    if (clase.videoId) {
      const isPlayable = clase.videoId.estado === 'listo';
      if (isPlayable) {
        return (
          <Tooltip title={t('admin.playVideo')}>
            <IconButton
              size="small"
              onClick={() => handleOpenPreview(clase)}
              sx={{ color: 'success.main' }}
            >
              <PlayCircle sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        );
      }
      const statusConfig = {
        subiendo: { color: 'warning', icon: <HourglassTop sx={{ fontSize: 16 }} /> },
        procesando: { color: 'info', icon: <HourglassTop sx={{ fontSize: 16 }} /> },
        error: { color: 'error', icon: <ErrorOutline sx={{ fontSize: 16 }} /> },
      };
      const config = statusConfig[clase.videoId.estado] || statusConfig.procesando;
      return (
        <Tooltip title={`Bunny — ${clase.videoId.estado}`}>
          <Box sx={{ color: `${config.color}.main`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {config.icon}
          </Box>
        </Tooltip>
      );
    }
    if (clase.videoUrl) {
      return (
        <Tooltip title={t('admin.playVideo')}>
          <IconButton size="small" onClick={() => handleOpenPreview(clase)} sx={{ color: '#2196F3' }}>
            <PlayCircle sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Tooltip title={t('admin.noVideo')}>
        <PlayCircle fontSize="small" sx={{ color: '#E0E0E0' }} />
      </Tooltip>
    );
  };

  const clasesConFecha = clases.filter((c) => c.fecha).length;

  const TableSkeleton = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {['#', t('admin.title'), t('admin.date'), t('admin.zoom'), t('admin.video'), t('admin.pdf'), t('common.actions')].map((h) => (
              <TableCell key={h} align={[t('admin.zoom'), t('admin.video'), t('admin.pdf')].includes(h) ? 'center' : 'inherit'}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton variant="text" width={30} /></TableCell>
              <TableCell><Skeleton variant="text" width={180} /></TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width={80} /></TableCell>
              <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="circular" width={20} height={20} /></TableCell>
              <TableCell align="center"><Skeleton variant="circular" width={20} height={20} /></TableCell>
              <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="circular" width={20} height={20} /></TableCell>
              <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
        onClick={() => navigate('/admin/cursos')}
      >
        {t('admin.backToCourses')}
      </Button>

      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {t('admin.classesOf', { title: resolveField(curso?.titulo, language) || t('admin.course') })}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('admin.manageTitlesDates')}
      </Typography>

      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage({ text: '', type: 'success' })}
        >
          {message.text}
        </Alert>
      )}

      {!loading && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'rgba(92, 107, 192, 0.06)',
          }}
        >
          <CalendarMonth color="primary" />
          <Typography variant="body2" color="text.secondary">
            {t('admin.classesWithDate', { count: clasesConFecha, total: clases.length })}
          </Typography>
        </Paper>
      )}

      {loading ? (
        <TableSkeleton />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}>#</TableCell>
                <TableCell>{t('admin.title')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.date')}</TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.zoom')}</TableCell>
                <TableCell align="center">{t('admin.video')}</TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.pdf')}</TableCell>
                <TableCell align="right" sx={{ width: 100 }}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clases.map((clase) => (
                <TableRow key={clase._id} hover>
                  <TableCell>
                    <Chip label={clase.numeroClase} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{resolveField(clase.titulo, language)}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {clase.fecha
                      ? formatDate(clase.fecha, language, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : <Typography variant="body2" color="text.secondary">{t('common.noDate')}</Typography>}
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Tooltip title={clase.zoomLink ? t('admin.zoomConfigured') : t('admin.noZoom')}>
                      <Videocam fontSize="small" sx={{ color: clase.zoomLink ? '#4CAF50' : '#E0E0E0' }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {getVideoIndicator(clase)}
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title={clase.pdfUrl ? t('admin.pdfConfigured') : t('admin.noPdf')}>
                        <PictureAsPdf fontSize="small" sx={{ color: clase.pdfUrl ? '#FF7043' : '#E0E0E0' }} />
                      </Tooltip>
                      {clase.pdfUrl2 && (
                        <Tooltip title={t('maestro.pdfMaterialExtra')}>
                          <PictureAsPdf fontSize="small" sx={{ color: '#FF7043' }} />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {hasContent(clase) && (
                        <Tooltip title={t('admin.viewContent')}>
                          <IconButton color="info" onClick={() => handleOpenPreview(clase)} size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('common.edit')}>
                        <IconButton color="primary" onClick={() => handleOpenEdit(clase)} size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Students accordion */}
      {!loading && (
        <Accordion sx={{ mt: 3 }} onChange={(_, expanded) => expanded && handleLoadAlumnos()}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <People color="primary" />
              <Typography variant="h6">{t('maestro.enrolledStudents')}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {loadingAlumnos ? (
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, width: '100%' }} />
            ) : alumnos.length === 0 ? (
              <Typography color="text.secondary">{t('maestro.noStudents')}</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('admin.name')}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('auth.email')}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('maestro.enrollmentDate')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alumnos.map((inscripcion) => (
                      <TableRow key={inscripcion._id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{inscripcion.alumnoId?.nombre}</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{inscripcion.alumnoId?.email}</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          {formatDate(inscripcion.fechaInscripcion, language, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {/* Edit dialog (title + date) */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('admin.editClass', { number: editClase?.numeroClase })}
        </DialogTitle>
        <DialogContent>
          <TranslatableTextField
            label={t('admin.title')}
            value={form.titulo}
            onChange={(val) => setForm({ ...form, titulo: val })}
          />
          <TextField
            label={t('admin.date')}
            fullWidth
            margin="normal"
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content preview dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {t('admin.classContent', { number: previewClase?.numeroClase, title: resolveField(previewClase?.titulo, language) })}
          </Typography>
          <IconButton onClick={() => setPreviewOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewClase && (
            <Stack spacing={3}>
              {/* Zoom */}
              {previewClase.zoomLink && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('admin.zoom')}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Videocam />}
                    href={previewClase.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('alumno.joinLive')}
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, wordBreak: 'break-all' }}>
                    {previewClase.zoomLink}
                  </Typography>
                </Box>
              )}

              {/* Video */}
              {previewClase.videoId && previewClase.videoId.estado === 'listo' ? (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('admin.video')} (Bunny)
                  </Typography>
                  <BunnyPlayer
                    embedUrl={previewClase.videoId.embedUrl}
                    title={resolveField(previewClase.titulo, language)}
                  />
                </Box>
              ) : previewClase.videoUrl ? (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('admin.video')} (Vimeo)
                  </Typography>
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
                      src={getVimeoEmbedUrl(previewClase.videoUrl)}
                      title={resolveField(previewClase.titulo, language)}
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
                </Box>
              ) : previewClase.videoId ? (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {t('admin.video')}
                  </Typography>
                  <Chip
                    icon={<HourglassTop sx={{ fontSize: 14 }} />}
                    label={previewClase.videoId.estado}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              ) : null}

              {/* PDF */}
              {previewClase.pdfUrl && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    PDF
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    href={previewClase.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('alumno.downloadPdf')}
                  </Button>
                </Box>
              )}

              {/* Extra PDF */}
              {previewClase.pdfUrl2 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('maestro.pdfMaterialExtra')}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    href={previewClase.pdfUrl2}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('alumno.downloadPdfExtra')}
                  </Button>
                </Box>
              )}

              {!previewClase.zoomLink && !previewClase.videoId && !previewClase.videoUrl && !previewClase.pdfUrl && !previewClase.pdfUrl2 && (
                <Alert severity="info">{t('alumno.noContent')}</Alert>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminCourseClases;
