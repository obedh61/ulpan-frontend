import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { School, Menu as MenuIcon, Close } from '@mui/icons-material';
import { useAuth, getRedirectPath } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useState } from 'react';

const PublicNavbar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: t('nav.method'), path: '/#method' },
    { label: t('nav.classes'), path: '/cursos' },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) return location.pathname === '/';
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    setDrawerOpen(false);
    if (path === '/#method') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById('method-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const el = document.getElementById('method-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              mr: 4,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <School sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              Ulpan Jerusalem
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, flexGrow: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={link.path.startsWith('/#') ? 'button' : RouterLink}
                to={link.path.startsWith('/#') ? undefined : link.path}
                onClick={() => handleNavClick(link.path)}
                sx={{
                  color: isActive(link.path) ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive(link.path) ? 600 : 500,
                  fontSize: '0.9rem',
                  px: 2,
                  borderRadius: '10px',
                  '&:hover': {
                    bgcolor: 'rgba(92, 107, 192, 0.06)',
                    color: 'primary.main',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Right Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <LanguageSelector />
            {user ? (
              <Button
                variant="contained"
                component={RouterLink}
                to={getRedirectPath(user.rol)}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  px: 3,
                  py: 1,
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                }}
              >
                {t('nav.myDashboard')}
              </Button>
            ) : (
              <Button
                variant="contained"
                component={RouterLink}
                to="/login"
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  px: 3,
                  py: 1,
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                }}
              >
                {t('nav.accessCourse')}
              </Button>
            )}

            {/* Mobile menu */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.path}
              component={link.path.startsWith('/#') ? 'div' : RouterLink}
              to={link.path.startsWith('/#') ? undefined : link.path}
              onClick={() => handleNavClick(link.path)}
              selected={isActive(link.path)}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ px: 2, mt: 2 }}>
          {user ? (
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to={getRedirectPath(user.rol)}
              onClick={() => setDrawerOpen(false)}
            >
              {t('nav.myDashboard')}
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/login"
              onClick={() => setDrawerOpen(false)}
            >
              {t('nav.accessCourse')}
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default PublicNavbar;
