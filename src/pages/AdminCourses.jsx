import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Switch,
  FormControlLabel,
  Alert,
  Skeleton,
  Chip,
  MenuItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, ListAlt, MenuBook, Warning, CloudUpload, Close } from '@mui/icons-material';
import {
  getCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  getMaestros,
  uploadImage,
} from '../services/api';
import { useSnackbar } from '../context/SnackbarContext';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { formatDate, getDateLocale } from '../utils/dateLocale';
import TranslatableTextField from '../components/TranslatableTextField';

const emptyForm = { titulo: { es: '', en: '', he: '' }, descripcion: { es: '', en: '', he: '' }, horario: { es: '', en: '', he: '' }, maestroId: '', maxAlumnos: 30, numeroClases: 24, activo: true, inscripcionesAbiertas: true, fechaInicio: '', fechaFin: '', precio: 0, moneda: 'ILS', esGratuito: false, whatsappLink: '', imagenUrl: '' };

const AdminCourses = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchCourses = async () => {
    try {
      const res = await getCoursesAdmin();
      setCourses(res.data);
    } catch {
      showSnackbar(t('admin.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaestros = async () => {
    try {
      const res = await getMaestros();
      setMaestros(res.data);
    } catch {
      showSnackbar(t('admin.loadError'), 'error');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMaestros();
  }, []);

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (course) => {
    setForm({
      titulo: typeof course.titulo === 'string' ? { es: course.titulo, en: '', he: '' } : (course.titulo || { es: '', en: '', he: '' }),
      descripcion: typeof course.descripcion === 'string' ? { es: course.descripcion, en: '', he: '' } : (course.descripcion || { es: '', en: '', he: '' }),
      horario: typeof course.horario === 'string' ? { es: course.horario, en: '', he: '' } : (course.horario || { es: '', en: '', he: '' }),
      maestroId: course.maestroId?._id || '',
      maxAlumnos: course.maxAlumnos || 30,
      activo: course.activo,
      inscripcionesAbiertas: course.inscripcionesAbiertas !== false,
      fechaInicio: course.fechaInicio ? course.fechaInicio.substring(0, 10) : '',
      fechaFin: course.fechaFin ? course.fechaFin.substring(0, 10) : '',
      precio: course.precio || 0,
      moneda: course.moneda || 'ILS',
      esGratuito: course.esGratuito || false,
      whatsappLink: course.whatsappLink || '',
      numeroClases: course.numeroClases || 24,
      imagenUrl: course.imagenUrl || '',
    });
    setEditId(course._id);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      setForm({ ...form, imagenUrl: res.data.url });
      showSnackbar(t('admin.imageUploaded'), 'success');
    } catch {
      showSnackbar(t('admin.imageUploadError'), 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        fechaInicio: form.fechaInicio || null,
        fechaFin: form.fechaFin || null,
      };
      if (editId) {
        await updateCourse(editId, payload);
        showSnackbar(t('admin.courseUpdated'), 'success');
      } else {
        await createCourse(payload);
        showSnackbar(t('admin.courseCreated'), 'success');
      }
      setDialogOpen(false);
      fetchCourses();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || t('admin.saveError'),
        'error',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (course) => {
    setDeleteTarget(course);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteCourse(deleteTarget._id);
      showSnackbar(t('admin.courseDeleted'), 'success');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchCourses();
    } catch {
      showSnackbar(t('admin.deleteError'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const TableSkeleton = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {[t('admin.title'), t('courses.teacher'), t('admin.start'), t('admin.end'), t('admin.enrollments'), t('admin.status'), t('common.actions')].map((h) => (
              <TableCell key={h}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton variant="text" width={150} /></TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width={100} /></TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width={80} /></TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width={80} /></TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="rounded" width={60} height={24} /></TableCell>
              <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
              <TableCell><Skeleton variant="text" width={100} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="h4">{t('admin.manageCourses')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          {t('admin.newCourse')}
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('admin.managePlatformCourses')}
      </Typography>

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
          <MenuBook color="primary" />
          <Typography variant="body2" color="text.secondary">
            {t('admin.coursesCreated', { count: courses.length })}
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
                <TableCell>{t('admin.title')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('courses.teacher')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.price')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.start')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.end')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.enrollments')}</TableCell>
                <TableCell>{t('admin.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {t('admin.noCourses')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{resolveField(course.titulo, language)}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{course.maestroId?.nombre || '\u2014'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {course.esGratuito || !course.precio || course.precio <= 0 ? (
                        <Chip label={t('common.free')} color="success" size="small" />
                      ) : (
                        `${{ ILS: '\u20AA', USD: '$', EUR: '\u20AC' }[course.moneda] || course.moneda}${course.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {course.fechaInicio
                        ? formatDate(course.fechaInicio, language, { day: 'numeric', month: 'short', year: 'numeric' })
                        : '\u2014'}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {course.fechaFin
                        ? formatDate(course.fechaFin, language, { day: 'numeric', month: 'short', year: 'numeric' })
                        : '\u2014'}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Chip
                        label={course.inscripcionesAbiertas !== false ? t('admin.open') : t('admin.closed')}
                        color={course.inscripcionesAbiertas !== false ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.activo ? t('common.active') : t('common.inactive')}
                        color={course.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('admin.viewClasses')}>
                        <IconButton
                          color="info"
                          onClick={() => navigate(`/admin/cursos/${course._id}/clases`)}
                          size="small"
                        >
                          <ListAlt fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.edit')}>
                        <IconButton color="primary" onClick={() => handleOpenEdit(course)} size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton color="error" onClick={() => handleDeleteClick(course)} size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? t('admin.editCourse') : t('admin.newCourse')}</DialogTitle>
        <DialogContent>
          <TranslatableTextField
            label={t('admin.title')}
            value={form.titulo}
            onChange={(val) => setForm({ ...form, titulo: val })}
          />
          <TranslatableTextField
            label={t('admin.description')}
            value={form.descripcion}
            onChange={(val) => setForm({ ...form, descripcion: val })}
            multiline
            rows={3}
          />
          <TranslatableTextField
            label={t('admin.schedule')}
            value={form.horario}
            onChange={(val) => setForm({ ...form, horario: val })}
            placeholder={t('admin.schedulePlaceholder')}
          />
          <TextField
            label={t('courses.teacher')}
            fullWidth
            margin="normal"
            select
            value={form.maestroId}
            onChange={(e) => setForm({ ...form, maestroId: e.target.value })}
          >
            <MenuItem value="">{t('admin.selectTeacher')}</MenuItem>
            {maestros.map((m) => (
              <MenuItem key={m._id} value={m._id}>
                {m.nombre} ({m.email})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('admin.maxStudents')}
            fullWidth
            margin="normal"
            type="number"
            value={form.maxAlumnos}
            onChange={(e) => setForm({ ...form, maxAlumnos: Number(e.target.value) })}
            inputProps={{ min: 1 }}
          />
          {!editId && (
            <TextField
              label={t('admin.numberOfClasses')}
              fullWidth
              margin="normal"
              type="number"
              value={form.numeroClases}
              onChange={(e) => setForm({ ...form, numeroClases: Number(e.target.value) })}
              inputProps={{ min: 1 }}
              helperText={t('admin.numberOfClassesHelper')}
            />
          )}
          <TextField
            label={t('admin.startDate')}
            fullWidth
            margin="normal"
            type="date"
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('admin.endDate')}
            fullWidth
            margin="normal"
            type="date"
            value={form.fechaFin}
            onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.esGratuito}
                onChange={(e) => setForm({ ...form, esGratuito: e.target.checked, ...(e.target.checked ? { precio: 0 } : {}) })}
              />
            }
            label={t('admin.freeCourse')}
            sx={{ mt: 1, display: 'block' }}
          />
          <TextField
            label={t('admin.price')}
            fullWidth
            margin="normal"
            type="number"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
            inputProps={{ min: 0, step: 0.01 }}
            disabled={form.esGratuito}
          />
          <TextField
            label={t('admin.currency')}
            fullWidth
            margin="normal"
            select
            value={form.moneda}
            onChange={(e) => setForm({ ...form, moneda: e.target.value })}
            disabled={form.esGratuito}
          >
            <MenuItem value="ILS">ILS (Shekel)</MenuItem>
            <MenuItem value="USD">USD (Dolar)</MenuItem>
            <MenuItem value="EUR">EUR (Euro)</MenuItem>
          </TextField>
          <TextField
            label={t('admin.whatsappLink')}
            fullWidth
            margin="normal"
            value={form.whatsappLink}
            onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
            placeholder="https://chat.whatsapp.com/..."
          />

          {/* Course Image Upload */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('admin.courseImage')}
            </Typography>
            {form.imagenUrl ? (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box
                  component="img"
                  src={form.imagenUrl}
                  alt="Course"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => setForm({ ...form, imagenUrl: '' })}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
                <Button
                  component="label"
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  disabled={uploadingImage}
                >
                  {t('admin.changeImage')}
                  <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
                </Button>
              </Box>
            ) : (
              <Button
                component="label"
                variant="outlined"
                startIcon={uploadingImage ? <CircularProgress size={18} /> : <CloudUpload />}
                disabled={uploadingImage}
                fullWidth
                sx={{ py: 2, borderStyle: 'dashed' }}
              >
                {uploadingImage ? t('admin.uploadingImage') : t('admin.uploadImage')}
                <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
              </Button>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {t('admin.imageHint')}
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={form.inscripcionesAbiertas}
                onChange={(e) => setForm({ ...form, inscripcionesAbiertas: e.target.checked })}
              />
            }
            label={t('admin.openEnrollments')}
            sx={{ mt: 1 }}
          />
          {editId && (
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
              }
              label={t('admin.activeCourse')}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? <CircularProgress size={22} color="inherit" /> : editId ? t('common.update') : t('common.create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          {t('admin.confirmDelete')}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 1 }}>
            <span dangerouslySetInnerHTML={{ __html: t('admin.deleteCourseWarning', { title: resolveField(deleteTarget?.titulo, language) }) }} />
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={22} color="inherit" /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourses;
