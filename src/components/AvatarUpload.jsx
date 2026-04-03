import { useRef, useState } from 'react';
import { Avatar, Badge, IconButton, CircularProgress, Tooltip, Box } from '@mui/material';
import { CameraAlt, DeleteOutline } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { uploadAvatar, deleteAvatar } from '../services/api';
import { useTranslation } from 'react-i18next';

const AvatarUpload = ({ size = 120 }) => {
  const { user, updateUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const userInitial = user?.nombre?.charAt(0)?.toUpperCase() || 'U';

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showSnackbar(t('profile.invalidFormat'), 'error');
      return;
    }

    // Validar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showSnackbar(t('profile.fileTooLarge'), 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await uploadAvatar(file);
      updateUser({ avatar: res.data.avatar });
      showSnackbar(t('profile.avatarUpdated'), 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.message || t('profile.avatarError'), 'error');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAvatar();
      updateUser({ avatar: null });
      showSnackbar(t('profile.avatarRemoved'), 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.message || t('profile.avatarError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleFileSelect}
      />
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Tooltip title={t('profile.uploadAvatar')}>
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <CameraAlt fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      >
        <Avatar
          src={user?.avatar}
          sx={{
            width: size,
            height: size,
            fontSize: size * 0.4,
            bgcolor: 'primary.main',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? <CircularProgress size={size * 0.35} sx={{ color: 'white' }} /> : userInitial}
        </Avatar>
      </Badge>
      {user?.avatar && (
        <Tooltip title={t('profile.removeAvatar')}>
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={loading}
            sx={{ color: 'error.main' }}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default AvatarUpload;
