import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  Skeleton,
  Chip,
  LinearProgress,
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
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  People,
  Edit,
  Videocam,
  PlayCircle,
  PictureAsPdf,
  UploadFile,
  Clear,
  WhatsApp,
  CloudUpload,
  Delete,
  CheckCircle,
  HourglassTop,
  ErrorOutline,
  BarChart,
  Visibility,
  Close,
  Download,
} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  getMisCursosMaestro,
  getClasesCursoMaestro,
  actualizarClaseMaestro,
  getAlumnosCurso,
  uploadPdf,
  obtenerEstadoVideo,
  eliminarVideo,
} from '../services/api';
import VideoUploader from '../components/VideoUploader';
import VideoStats from '../components/VideoStats';
import BunnyPlayer from '../components/BunnyPlayer';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { formatDate, getDateLocale } from '../utils/dateLocale';
import ExpandableText from '../components/ExpandableText';

const getVimeoEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  if (url.includes('player.vimeo.com')) return url;
  return url;
};

const DetailSkeleton = () => (
  <Box>
    <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4, mb: 3 }} />
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} width="40%" />
    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
  </Box>
);

const MaestroCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [curso, setCurso] = useState(null);
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editClase, setEditClase] = useState(null);
  const [form, setForm] = useState({ zoomLink: '', pdfUrl: '' });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [alumnos, setAlumnos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [alumnosLoaded, setAlumnosLoaded] = useState(false);

  const [videoUploadOpen, setVideoUploadOpen] = useState(false);
  const [videoUploadClase, setVideoUploadClase] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewClase, setPreviewClase] = useState(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
  };

  const fetchCurso = useCallback(async () => {
    try {
      const res = await getMisCursosMaestro();
      const found = res.data.find((c) => c._id === id);
      if (!found) {
        showMessage(t('maestro.courseNotFound'), 'error');
        return;
      }
      setCurso(found);
    } catch (err) {
      showMessage(t('maestro.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchClases = useCallback(async () => {
    try {
      const res = await getClasesCursoMaestro(id);
      setClases(res.data);
    } catch (err) {
      showMessage(t('maestro.loadError'), 'error');
    }
  }, [id]);

  useEffect(() => {
    fetchCurso();
    fetchClases();
  }, [fetchCurso, fetchClases]);

  const handleOpenEdit = (clase) => {
    setEditClase(clase);
    setForm({
      zoomLink: clase.zoomLink || '',
      pdfUrl: clase.pdfUrl || '',
    });
    setUploading(false);
    setUploadError('');
    setDialogOpen(true);
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';
    setUploading(true);
    setUploadError('');
    try {
      const res = await uploadPdf(file);
      setForm((prev) => ({ ...prev, pdfUrl: res.data.url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || t('maestro.loadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleClearPdf = () => {
    setForm((prev) => ({ ...prev, pdfUrl: '' }));
  };

  const handleSubmit = async () => {
    try {
      await actualizarClaseMaestro(editClase._id, form);
      showMessage(t('maestro.classUpdated'));
      setDialogOpen(false);
      fetchClases();
    } catch (err) {
      showMessage(err.response?.data?.message || t('admin.saveError'), 'error');
    }
  };

  const handleLoadAlumnos = async () => {
    if (alumnosLoaded) return;
    setLoadingAlumnos(true);
    try {
      const res = await getAlumnosCurso(id);
      setAlumnos(res.data);
      setAlumnosLoaded(true);
    } catch (err) {
      showMessage(t('maestro.loadError'), 'error');
    } finally {
      setLoadingAlumnos(false);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!curso) {
    return (
      <Box>
        <Alert severity="error">{t('maestro.courseNotFoundAlert')}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/maestro/dashboard')}>
          {t('maestro.backToPanel')}
        </Button>
      </Box>
    );
  }

  const handleOpenVideoUpload = (clase) => {
    setVideoUploadClase(clase);
    setVideoUploadOpen(true);
  };

  const handleVideoUploadComplete = () => {
    fetchClases();
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm(t('video.confirmDelete'))) return;
    try {
      await eliminarVideo(videoId);
      showMessage(t('video.deleted'));
      fetchClases();
    } catch (err) {
      showMessage(err.response?.data?.message || t('maestro.loadError'), 'error');
    }
  };

  const handleOpenPreview = (clase) => {
    setPreviewClase(clase);
    setPreviewOpen(true);
  };

  const hasContent = (clase) => clase.zoomLink || clase.videoUrl || clase.videoId || clase.pdfUrl;

  const getVideoStatusChip = (clase) => {
    const video = clase.videoId;
    if (!video) return null;

    const statusConfig = {
      subiendo: { label: t('video.videoUploading'), color: 'warning', icon: <HourglassTop sx={{ fontSize: 14 }} /> },
      procesando: { label: t('video.videoProcessing'), color: 'info', icon: <HourglassTop sx={{ fontSize: 14 }} /> },
      listo: { label: t('video.videoReady'), color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
      error: { label: t('video.videoError'), color: 'error', icon: <ErrorOutline sx={{ fontSize: 14 }} /> },
    };

    const config = statusConfig[video.estado] || statusConfig.procesando;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const totalContenido = clases.filter((c) => c.zoomLink || c.videoUrl || c.pdfUrl || c.videoId).length;

  return (
    <Box>
      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage({ text: '', type: 'success' })}
        >
          {message.text}
        </Alert>
      )}

      {/* Course header */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          background: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)',
          color: 'white',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ wordBreak: 'break-word' }}>
          {resolveField(curso.titulo, language)}
        </Typography>
        <ExpandableText
          text={resolveField(curso.descripcion, language)}
          maxLines={3}
          sx={{
            opacity: 0.9,
            color: 'inherit',
            '& a': { color: 'rgba(255,255,255,0.95)', textDecorationColor: 'rgba(255,255,255,0.5)' },
          }}
          buttonSx={{ color: '#fff', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}
        />
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
              '&:hover': { bgcolor: '#1DA851' },
            }}
          >
            {t('maestro.whatsappGroup')}
          </Button>
        )}
      </Paper>

      {/* Stats bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
          bgcolor: 'rgba(92, 107, 192, 0.06)',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('maestro.totalClasses', { count: clases.length })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('maestro.withContent', { count: totalContenido })}
        </Typography>
        <Chip
          label={curso.activo ? t('common.active') : t('common.inactive')}
          color={curso.activo ? 'success' : 'default'}
          size="small"
        />
      </Paper>

      {/* Classes table */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t('maestro.courseClasses')}
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
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
                    : <Typography variant="body2" color="text.secondary">{'\u2014'}</Typography>}
                </TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Tooltip title={clase.zoomLink ? t('admin.zoomConfigured') : t('admin.noZoom')}>
                    <Videocam
                      fontSize="small"
                      sx={{ color: clase.zoomLink ? '#4CAF50' : '#E0E0E0' }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  {clase.videoId ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      {getVideoStatusChip(clase)}
                      <Tooltip title={t('video.deleteVideo')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteVideo(clase.videoId._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : clase.videoUrl ? (
                    <Tooltip title={t('admin.videoConfigured')}>
                      <PlayCircle fontSize="small" sx={{ color: '#2196F3' }} />
                    </Tooltip>
                  ) : (
                    <Tooltip title={t('video.uploadVideo')}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenVideoUpload(clase)}
                      >
                        <CloudUpload fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Tooltip title={clase.pdfUrl ? t('admin.pdfConfigured') : t('admin.noPdf')}>
                    <PictureAsPdf
                      fontSize="small"
                      sx={{ color: clase.pdfUrl ? '#FF7043' : '#E0E0E0' }}
                    />
                  </Tooltip>
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
                    <Tooltip title={t('maestro.editContent')}>
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

      {/* Students accordion */}
      <Accordion onChange={(_, expanded) => expanded && handleLoadAlumnos()}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" spacing={1} alignItems="center">
            <People color="primary" />
            <Typography variant="h6">{t('maestro.enrolledStudents')}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {loadingAlumnos ? (
            <Box display="flex" justifyContent="center" py={2}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, width: '100%' }} />
            </Box>
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

      {/* Video stats accordion */}
      <Accordion sx={{ mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BarChart color="primary" />
            <Typography variant="h6">{t('videoStats.title')}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <VideoStats cursoId={id} />
        </AccordionDetails>
      </Accordion>

      {/* Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          {t('maestro.editClass', { number: editClase?.numeroClase, title: resolveField(editClase?.titulo, language) })}
        </DialogTitle>
        <DialogContent>
          {editClase?.fecha && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('maestro.dateAdminOnly', { date: formatDate(editClase.fecha, language, { day: 'numeric', month: 'short', year: 'numeric' }) })}
            </Alert>
          )}

          {/* Zoom link with clear button */}
          <TextField
            label={t('maestro.zoomLink')}
            fullWidth
            margin="normal"
            value={form.zoomLink}
            onChange={(e) => setForm({ ...form, zoomLink: e.target.value })}
            placeholder="https://zoom.us/j/..."
            slotProps={{
              input: {
                endAdornment: form.zoomLink ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setForm({ ...form, zoomLink: '' })}
                      edge="end"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Video section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t('admin.video')}
            </Typography>
            {editClase?.videoId ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getVideoStatusChip(editClase)}
                <Tooltip title={t('video.deleteVideo')}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      handleDeleteVideo(editClase.videoId._id);
                      setDialogOpen(false);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => {
                  setDialogOpen(false);
                  handleOpenVideoUpload(editClase);
                }}
              >
                {t('video.uploadVideo')}
              </Button>
            )}
          </Box>

          {/* PDF section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t('maestro.pdfMaterial')}
            </Typography>
            {form.pdfUrl ? (
              <Chip
                icon={<PictureAsPdf />}
                label={form.pdfUrl.split('/').pop() || 'PDF adjunto'}
                onDelete={handleClearPdf}
                deleteIcon={<Clear />}
                color="primary"
                variant="outlined"
                sx={{ maxWidth: '100%' }}
              />
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
                disabled={uploading}
              >
                {t('maestro.uploadPdf')}
                <input type="file" accept=".pdf" hidden onChange={handlePdfUpload} />
              </Button>
            )}
            {uploading && <LinearProgress sx={{ mt: 1 }} />}
            {uploadError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {uploadError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video upload dialog */}
      <VideoUploader
        open={videoUploadOpen}
        onClose={() => {
          setVideoUploadOpen(false);
          setVideoUploadClase(null);
        }}
        claseId={videoUploadClase?._id}
        claseNumero={videoUploadClase?.numeroClase}
        onUploadComplete={handleVideoUploadComplete}
      />

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

              {!previewClase.zoomLink && !previewClase.videoId && !previewClase.videoUrl && !previewClase.pdfUrl && (
                <Alert severity="info">{t('alumno.noContent')}</Alert>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MaestroCourseDetail;
