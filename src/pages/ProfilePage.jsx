import { Box, Paper, Typography, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import AvatarUpload from '../components/AvatarUpload';

const rolColors = {
  admin: 'error',
  maestro: 'warning',
  alumno: 'primary',
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('profile.title')}
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <AvatarUpload size={120} />
        <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
          {user?.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
        <Chip
          label={user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1)}
          color={rolColors[user?.rol] || 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </Paper>
    </Box>
  );
};

export default ProfilePage;
