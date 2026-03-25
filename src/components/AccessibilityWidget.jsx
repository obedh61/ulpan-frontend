import { useState, useEffect, useCallback } from 'react';
import {
  Fab,
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Slider,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import {
  Accessibility,
  Close,
  TextIncrease,
  Contrast,
  FormatColorReset,
  LinkOff,
  SpaceBar,
  RestartAlt,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'ulpan_a11y';

const defaults = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  lineHeight: false,
};

const AccessibilityWidget = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const apply = useCallback((s) => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = s.fontSize + '%';

    // High contrast
    if (s.highContrast) {
      root.style.filter = (root.style.filter || '').replace(/contrast\([^)]*\)/g, '').trim();
      root.style.filter = (root.style.filter ? root.style.filter + ' ' : '') + 'contrast(1.5)';
    } else {
      root.style.filter = (root.style.filter || '').replace(/contrast\([^)]*\)/g, '').trim();
    }

    // Grayscale
    if (s.grayscale) {
      root.style.filter = (root.style.filter || '').replace(/grayscale\([^)]*\)/g, '').trim();
      root.style.filter = (root.style.filter ? root.style.filter + ' ' : '') + 'grayscale(1)';
    } else {
      root.style.filter = (root.style.filter || '').replace(/grayscale\([^)]*\)/g, '').trim();
    }

    // Clean up empty filter
    if (!root.style.filter.trim()) root.style.removeProperty('filter');

    // Highlight links
    const linkStyleId = 'a11y-highlight-links';
    let linkStyle = document.getElementById(linkStyleId);
    if (s.highlightLinks) {
      if (!linkStyle) {
        linkStyle = document.createElement('style');
        linkStyle.id = linkStyleId;
        document.head.appendChild(linkStyle);
      }
      linkStyle.textContent = 'a, a * { outline: 2px solid #FFD600 !important; text-decoration: underline !important; }';
    } else if (linkStyle) {
      linkStyle.remove();
    }

    // Line height
    const lineStyleId = 'a11y-line-height';
    let lineStyle = document.getElementById(lineStyleId);
    if (s.lineHeight) {
      if (!lineStyle) {
        lineStyle = document.createElement('style');
        lineStyle.id = lineStyleId;
        document.head.appendChild(lineStyle);
      }
      lineStyle.textContent = '* { line-height: 2 !important; }';
    } else if (lineStyle) {
      lineStyle.remove();
    }
  }, []);

  useEffect(() => {
    apply(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch { /* ignore */ }
  }, [settings, apply]);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setSettings(defaults);
    // Clean up all injected styles
    document.getElementById('a11y-highlight-links')?.remove();
    document.getElementById('a11y-line-height')?.remove();
    document.documentElement.style.removeProperty('filter');
    document.documentElement.style.removeProperty('font-size');
  };

  return (
    <>
      <Fab
        size="small"
        color="primary"
        aria-label={t('accessibility.openWidget')}
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          zIndex: 1300,
          width: 36,
          height: 36,
          minHeight: 'unset',
          borderRadius: '0 8px 8px 0',
          opacity: 0.7,
          '&:hover': { opacity: 1 },
        }}
      >
        <Accessibility sx={{ fontSize: 18 }} />
      </Fab>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: 300, sm: 340 }, p: 0 } }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Accessibility />
            <Typography variant="h6" fontWeight={600}>
              {t('accessibility.title')}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Font size */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextIncrease fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={600}>
                  {t('accessibility.fontSize')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {settings.fontSize}%
                </Typography>
              </Box>
              <Slider
                value={settings.fontSize}
                onChange={(_, v) => update('fontSize', v)}
                min={80}
                max={150}
                step={10}
                marks={[
                  { value: 80, label: 'A' },
                  { value: 100, label: 'A' },
                  { value: 150, label: 'A+' },
                ]}
                sx={{ '& .MuiSlider-markLabel[data-index="0"]': { fontSize: 12 }, '& .MuiSlider-markLabel[data-index="2"]': { fontSize: 18, fontWeight: 700 } }}
              />
            </Box>

            <Divider />

            {/* High contrast */}
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrast}
                  onChange={(e) => update('highContrast', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Contrast fontSize="small" color="primary" />
                  <Typography variant="body2">{t('accessibility.highContrast')}</Typography>
                </Box>
              }
            />

            {/* Grayscale */}
            <FormControlLabel
              control={
                <Switch
                  checked={settings.grayscale}
                  onChange={(e) => update('grayscale', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormatColorReset fontSize="small" color="primary" />
                  <Typography variant="body2">{t('accessibility.grayscale')}</Typography>
                </Box>
              }
            />

            {/* Highlight links */}
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highlightLinks}
                  onChange={(e) => update('highlightLinks', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkOff fontSize="small" color="primary" />
                  <Typography variant="body2">{t('accessibility.highlightLinks')}</Typography>
                </Box>
              }
            />

            {/* Line height */}
            <FormControlLabel
              control={
                <Switch
                  checked={settings.lineHeight}
                  onChange={(e) => update('lineHeight', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpaceBar fontSize="small" color="primary" />
                  <Typography variant="body2">{t('accessibility.lineHeight')}</Typography>
                </Box>
              }
            />

            <Divider />

            {/* Reset */}
            <Button
              variant="outlined"
              startIcon={<RestartAlt />}
              onClick={reset}
              fullWidth
            >
              {t('accessibility.reset')}
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default AccessibilityWidget;
