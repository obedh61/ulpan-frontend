import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const drawerWidth = 260;

const DashboardLayout = ({ titleKey, menuItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  const userInitial = user?.nombre?.charAt(0)?.toUpperCase() || 'U';

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}
        >
          Ulpan
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            letterSpacing: 3,
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          Jerusalem
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.75rem' }}
        >
          {t(titleKey)}
        </Typography>
      </Box>

      <List sx={{ px: 1, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.textKey}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={t(item.textKey)} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 2, pb: 1 }}>
        <LanguageSelector />
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            {userInitial}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <Box
                component="img"
                src="/images/logo.png"
                alt="Ulpan Jerusalem"
                sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              />
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Ulpan Jerusalem
              </Typography>
            </Box>
            <LanguageSelector />
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {userInitial}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Avatar dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        slotProps={{ paper: { sx: { minWidth: 200, mt: -1 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {user?.nombre}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1)}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mt: 0.5 }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          {t('nav.logout')}
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          overflow: 'hidden',
          ...(isMobile && { mt: 8 }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
