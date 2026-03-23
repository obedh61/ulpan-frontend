import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
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
  Alert,
  Skeleton,
  Chip,
  MenuItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, People, Warning } from '@mui/icons-material';
import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from '../services/api';
import { useSnackbar } from '../context/SnackbarContext';

const emptyForm = { nombre: '', email: '', password: '', rol: 'alumno' };

const rolColors = {
  admin: 'error',
  maestro: 'primary',
  alumno: 'default',
};

const AdminUsers = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch {
      showSnackbar(t('admin.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (user) => {
    setForm({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol,
    });
    setEditId(user._id);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editId) {
        const { password, ...data } = form;
        await actualizarUsuario(editId, data);
        showSnackbar(t('admin.userUpdated'), 'success');
      } else {
        await crearUsuario(form);
        showSnackbar(t('admin.userCreated'), 'success');
      }
      setDialogOpen(false);
      fetchUsuarios();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || t('admin.saveError'),
        'error',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteTarget(user);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await eliminarUsuario(deleteTarget._id);
      showSnackbar(t('admin.userDeleted'), 'success');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchUsuarios();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || t('admin.deleteError'),
        'error',
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="h4">{t('admin.manageUsers')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          {t('admin.newUser')}
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('admin.managePlatformUsers')}
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
          <People color="primary" />
          <Typography variant="body2" color="text.secondary">
            {t('admin.usersRegistered', { count: usuarios.length })}
          </Typography>
        </Paper>
      )}

      {loading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[t('admin.name'), t('auth.email'), t('admin.role'), t('admin.date'), t('common.actions')].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width={180} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={70} /></TableCell>
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
                <TableCell>{t('admin.name')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('auth.email')}</TableCell>
                <TableCell>{t('admin.role')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('admin.date')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {t('admin.noUsers')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{user.nombre}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.rol} color={rolColors[user.rol]} size="small" />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {new Date(user.createdAt).toLocaleDateString(getDateLocale(language))}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton color="primary" onClick={() => handleOpenEdit(user)} size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton color="error" onClick={() => handleDeleteClick(user)} size="small">
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
        <DialogTitle>{editId ? t('admin.editUser') : t('admin.newUser')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('admin.name')}
            fullWidth
            margin="normal"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <TextField
            label={t('auth.email')}
            fullWidth
            margin="normal"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!editId && (
            <TextField
              label={t('auth.password')}
              fullWidth
              margin="normal"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <TextField
            label={t('admin.role')}
            fullWidth
            margin="normal"
            select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="maestro">Maestro</MenuItem>
            <MenuItem value="alumno">Alumno</MenuItem>
          </TextField>
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
            {t('admin.deleteUserWarning', { name: deleteTarget?.nombre })}
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

export default AdminUsers;
