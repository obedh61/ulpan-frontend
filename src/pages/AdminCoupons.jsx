import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import resolveField from '../utils/resolveField';
import { getDateLocale } from '../utils/dateLocale';
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
import { Add, Edit, Delete, Warning } from '@mui/icons-material';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  deleteCoupon,
  getCoursesAdmin,
} from '../services/api';
import { useSnackbar } from '../context/SnackbarContext';

const emptyForm = {
  codigo: '',
  tipo: 'porcentaje',
  descuento: 0,
  cursosAplicables: [],
  usoMaximo: '',
  fechaInicio: '',
  fechaExpiracion: '',
  activo: true,
};

const AdminCoupons = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [cupones, setCupones] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchCupones = async () => {
    try {
      const res = await getCoupons();
      setCupones(res.data);
    } catch {
      showSnackbar(t('admin.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getCoursesAdmin();
      setCourses(res.data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchCupones();
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cupon) => {
    setForm({
      codigo: cupon.codigo,
      tipo: cupon.tipo,
      descuento: cupon.descuento,
      cursosAplicables: cupon.cursosAplicables?.map((c) => c._id || c) || [],
      usoMaximo: cupon.usoMaximo || '',
      fechaInicio: cupon.fechaInicio ? cupon.fechaInicio.substring(0, 10) : '',
      fechaExpiracion: cupon.fechaExpiracion ? cupon.fechaExpiracion.substring(0, 10) : '',
      activo: cupon.activo,
    });
    setEditId(cupon._id);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        usoMaximo: form.usoMaximo ? Number(form.usoMaximo) : null,
        fechaInicio: form.fechaInicio || null,
        fechaExpiracion: form.fechaExpiracion || null,
      };
      if (editId) {
        await updateCoupon(editId, payload);
        showSnackbar(t('coupons.couponUpdated'), 'success');
      } else {
        await createCoupon(payload);
        showSnackbar(t('coupons.couponCreated'), 'success');
      }
      setDialogOpen(false);
      fetchCupones();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || t('admin.saveError'),
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (cupon) => {
    try {
      await toggleCoupon(cupon._id);
      fetchCupones();
    } catch {
      showSnackbar(t('coupons.stateChangeError'), 'error');
    }
  };

  const handleDeleteClick = (cupon) => {
    setDeleteTarget(cupon);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteCoupon(deleteTarget._id);
      showSnackbar(t('coupons.couponDeleted'), 'success');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchCupones();
    } catch {
      showSnackbar(t('admin.deleteError'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 0.5 }}>
        <Typography variant="h4">{t('coupons.manageCoupons')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          {t('coupons.newCoupon')}
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('coupons.manageDiscounts')}
      </Typography>

      {loading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('coupons.code')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('coupons.type')}</TableCell>
                <TableCell>{t('coupons.discount')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('coupons.uses')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('coupons.expiration')}</TableCell>
                <TableCell>{t('admin.status')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" /></TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('coupons.code')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('coupons.type')}</TableCell>
                <TableCell>{t('coupons.discount')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('coupons.uses')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('coupons.expiration')}</TableCell>
                <TableCell>{t('admin.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cupones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('coupons.noCoupons')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cupones.map((cupon) => (
                  <TableRow key={cupon._id} hover>
                    <TableCell>
                      <Chip label={cupon.codigo} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {cupon.tipo === 'porcentaje' ? t('coupons.percentageType') : t('coupons.fixedType')}
                    </TableCell>
                    <TableCell>
                      {cupon.tipo === 'porcentaje' ? `${cupon.descuento}%` : `$${cupon.descuento}`}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {cupon.usosActuales}{cupon.usoMaximo ? `/${cupon.usoMaximo}` : ''}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {cupon.fechaExpiracion
                        ? new Date(cupon.fechaExpiracion).toLocaleDateString(getDateLocale(language), {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : t('coupons.noLimit')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cupon.activo ? t('common.active') : t('common.inactive')}
                        color={cupon.activo ? 'success' : 'default'}
                        size="small"
                        onClick={() => handleToggle(cupon)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton color="primary" onClick={() => handleOpenEdit(cupon)} size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton color="error" onClick={() => handleDeleteClick(cupon)} size="small">
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
        <DialogTitle>{editId ? t('coupons.editCoupon') : t('coupons.newCoupon')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('coupons.code')}
            fullWidth
            margin="normal"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
            placeholder="Ej: DESCUENTO20"
          />
          <TextField
            label={t('coupons.type')}
            fullWidth
            margin="normal"
            select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <MenuItem value="porcentaje">{t('coupons.percentageType')} (%)</MenuItem>
            <MenuItem value="monto_fijo">{t('coupons.fixedType')}</MenuItem>
          </TextField>
          <TextField
            label={form.tipo === 'porcentaje' ? `${t('coupons.discount')} (%)` : `${t('coupons.discount')} ($)`}
            fullWidth
            margin="normal"
            type="number"
            value={form.descuento}
            onChange={(e) => setForm({ ...form, descuento: Number(e.target.value) })}
            inputProps={{ min: 0, max: form.tipo === 'porcentaje' ? 100 : undefined }}
          />
          <TextField
            label={t('coupons.applicableCourses')}
            fullWidth
            margin="normal"
            select
            SelectProps={{ multiple: true }}
            value={form.cursosAplicables}
            onChange={(e) => setForm({ ...form, cursosAplicables: e.target.value })}
            helperText={t('coupons.applicableCoursesHelper')}
          >
            {courses.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {resolveField(c.titulo, language)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('coupons.maxUses')}
            fullWidth
            margin="normal"
            type="number"
            value={form.usoMaximo}
            onChange={(e) => setForm({ ...form, usoMaximo: e.target.value })}
            helperText={t('coupons.maxUsesHelper')}
            inputProps={{ min: 1 }}
          />
          <TextField
            label={t('coupons.startDate')}
            fullWidth
            margin="normal"
            type="date"
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('coupons.expirationDate')}
            fullWidth
            margin="normal"
            type="date"
            value={form.fechaExpiracion}
            onChange={(e) => setForm({ ...form, fechaExpiracion: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              />
            }
            label={t('coupons.couponActive')}
            sx={{ mt: 1 }}
          />
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
            {t('coupons.deleteCouponWarning', { code: deleteTarget?.codigo })}
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

export default AdminCoupons;
